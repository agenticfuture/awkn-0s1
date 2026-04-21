<?php

if (! defined('ABSPATH')) {
    exit(1);
}

function awkn_media_sync_log(string $message): void
{
    WP_CLI::log($message);
}

function awkn_media_feed_limit(): int
{
    $configured = getenv('AWKN_YOUTUBE_FEED_LIMIT');

    if (is_string($configured) && $configured !== '' && ctype_digit($configured)) {
        return max(1, (int) $configured);
    }

    return 6;
}

function awkn_media_channel_id(string $locale): string
{
    $envKey = sprintf('AWKN_YOUTUBE_CHANNEL_ID_%s', strtoupper($locale));
    $envValue = getenv($envKey);

    if (is_string($envValue) && trim($envValue) !== '') {
        return trim($envValue);
    }

    $optionValue = get_option(sprintf('awkn_youtube_channel_id_%s', strtolower($locale)), '');

    return is_string($optionValue) ? trim($optionValue) : '';
}

function awkn_fetch_youtube_feed(string $channelId): SimpleXMLElement
{
    $response = wp_remote_get(
        sprintf('https://www.youtube.com/feeds/videos.xml?channel_id=%s', rawurlencode($channelId)),
        [
            'headers' => [
                'Accept' => 'application/xml, text/xml;q=0.9, */*;q=0.8',
            ],
            'timeout' => 20,
            'user-agent' => 'AWKN Media Sync/1.0',
        ]
    );

    if (is_wp_error($response)) {
        throw new RuntimeException($response->get_error_message());
    }

    $status = wp_remote_retrieve_response_code($response);
    $body = wp_remote_retrieve_body($response);

    if ($status < 200 || $status >= 300 || $body === '') {
        throw new RuntimeException(sprintf('Unexpected YouTube response: HTTP %d', $status));
    }

    libxml_use_internal_errors(true);
    $xml = simplexml_load_string($body);

    if (! $xml instanceof SimpleXMLElement) {
        throw new RuntimeException('Unable to parse the YouTube feed XML.');
    }

    return $xml;
}

function awkn_upsert_media_item(array $item): int
{
    $existing = get_posts([
        'post_type' => 'awkn_media',
        'post_status' => 'publish',
        'posts_per_page' => 1,
        'meta_query' => [
            [
                'key' => '_awkn_youtube_video_id',
                'value' => $item['videoId'],
            ],
            [
                'key' => '_awkn_locale',
                'value' => $item['locale'],
            ],
        ],
    ]);

    $postArgs = [
        'post_content' => $item['description'],
        'post_excerpt' => wp_trim_words($item['description'], 32, '...'),
        'post_name' => sprintf('youtube-%s-%s', sanitize_title($item['videoId']), sanitize_title($item['locale'])),
        'post_status' => 'publish',
        'post_title' => $item['title'],
        'post_type' => 'awkn_media',
    ];

    if ($item['publishedAt'] !== '') {
        $postArgs['post_date_gmt'] = gmdate('Y-m-d H:i:s', strtotime($item['publishedAt']));
    }

    if (! empty($existing)) {
        $postArgs['ID'] = $existing[0]->ID;
        $postId = wp_update_post($postArgs, true);
    } else {
        $postId = wp_insert_post($postArgs, true);
    }

    if (is_wp_error($postId)) {
        throw new RuntimeException($postId->get_error_message());
    }

    update_post_meta($postId, '_awkn_locale', $item['locale']);
    update_post_meta($postId, '_awkn_source_label', 'YouTube');
    update_post_meta($postId, '_awkn_thumbnail_url', $item['thumbnailUrl']);
    update_post_meta($postId, '_awkn_video_url', $item['videoUrl']);
    update_post_meta($postId, '_awkn_youtube_channel_id', $item['channelId']);
    update_post_meta($postId, '_awkn_youtube_video_id', $item['videoId']);

    return (int) $postId;
}

function awkn_parse_feed_entries(SimpleXMLElement $feed, string $channelId, string $locale, int $limit): array
{
    $entries = [];
    $mediaNamespace = $feed->getNamespaces(true)['media'] ?? null;
    $ytNamespace = $feed->getNamespaces(true)['yt'] ?? null;
    $items = $feed->entry ?? [];
    $count = 0;

    foreach ($items as $entry) {
        if ($count >= $limit) {
            break;
        }

        $mediaGroup = $mediaNamespace ? $entry->children($mediaNamespace)->group : null;
        $ytChildren = $ytNamespace ? $entry->children($ytNamespace) : null;
        $videoId = $ytChildren && isset($ytChildren->videoId) ? trim((string) $ytChildren->videoId) : '';

        if ($videoId === '') {
            continue;
        }

        $description = $mediaGroup && isset($mediaGroup->description) ? trim((string) $mediaGroup->description) : '';
        $thumbnailUrl = '';

        if ($mediaGroup && isset($mediaGroup->thumbnail)) {
            $thumbnailAttributes = $mediaGroup->thumbnail->attributes();
            $thumbnailUrl = isset($thumbnailAttributes['url']) ? trim((string) $thumbnailAttributes['url']) : '';
        }

        $entries[] = [
            'channelId' => $channelId,
            'description' => $description,
            'locale' => $locale,
            'publishedAt' => trim((string) $entry->published),
            'thumbnailUrl' => $thumbnailUrl,
            'title' => trim((string) $entry->title),
            'videoId' => $videoId,
            'videoUrl' => sprintf('https://www.youtube.com/watch?v=%s', $videoId),
        ];
        $count++;
    }

    return $entries;
}

$limit = awkn_media_feed_limit();
$locales = ['en', 'fr'];
$didSync = false;

foreach ($locales as $locale) {
    $channelId = awkn_media_channel_id($locale);

    if ($channelId === '') {
        awkn_media_sync_log(sprintf('Skipping locale "%s": no YouTube channel id configured.', $locale));
        continue;
    }

    awkn_media_sync_log(sprintf('Syncing YouTube feed for locale "%s"...', $locale));

    try {
        $feed = awkn_fetch_youtube_feed($channelId);
        $entries = awkn_parse_feed_entries($feed, $channelId, $locale, $limit);

        if ($entries === []) {
            awkn_media_sync_log(sprintf('No feed entries found for locale "%s".', $locale));
            continue;
        }

        foreach ($entries as $entry) {
            $postId = awkn_upsert_media_item($entry);
            awkn_media_sync_log(sprintf('Synced media #%d for locale "%s": %s', $postId, $locale, $entry['title']));
        }

        $didSync = true;
    } catch (Throwable $exception) {
        WP_CLI::warning(sprintf('Media sync failed for locale "%s": %s', $locale, $exception->getMessage()));
    }
}

if (! $didSync) {
    awkn_media_sync_log('No YouTube media items were synced. Seeded awkn_media records remain available as fallback.');
}

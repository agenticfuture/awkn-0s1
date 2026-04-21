<?php
/**
 * Plugin Name: AWKN Headless Config
 * Description: Registers menu locations and exposes structured site settings for the headless frontend.
 */

if (! defined('ABSPATH')) {
    exit;
}

add_action('init', function () {
    register_post_type('awkn_resource', [
        'label' => __('Resources', 'awkn'),
        'labels' => [
            'name' => __('Resources', 'awkn'),
            'singular_name' => __('Resource', 'awkn'),
        ],
        'public' => true,
        'show_ui' => true,
        'show_in_menu' => true,
        'show_in_rest' => true,
        'has_archive' => false,
        'supports' => ['title', 'editor', 'excerpt', 'custom-fields'],
        'show_in_graphql' => true,
        'graphql_single_name' => 'awknResource',
        'graphql_plural_name' => 'awknResources',
    ]);

    register_post_type('awkn_event', [
        'label' => __('Events', 'awkn'),
        'labels' => [
            'name' => __('Events', 'awkn'),
            'singular_name' => __('Event', 'awkn'),
        ],
        'public' => true,
        'show_ui' => true,
        'show_in_menu' => true,
        'show_in_rest' => true,
        'has_archive' => false,
        'supports' => ['title', 'editor', 'excerpt', 'custom-fields'],
        'show_in_graphql' => true,
        'graphql_single_name' => 'awknEvent',
        'graphql_plural_name' => 'awknEvents',
    ]);

    register_post_type('awkn_media', [
        'label' => __('Media', 'awkn'),
        'labels' => [
            'name' => __('Media', 'awkn'),
            'singular_name' => __('Media Item', 'awkn'),
        ],
        'public' => true,
        'show_ui' => true,
        'show_in_menu' => true,
        'show_in_rest' => true,
        'has_archive' => false,
        'supports' => ['title', 'editor', 'excerpt', 'custom-fields'],
        'show_in_graphql' => true,
        'graphql_single_name' => 'awknMedia',
        'graphql_plural_name' => 'awknMediaItems',
    ]);

    register_post_type('awkn_gift', [
        'label' => __('Gifts', 'awkn'),
        'labels' => [
            'name' => __('Gifts', 'awkn'),
            'singular_name' => __('Gift', 'awkn'),
        ],
        'public' => false,
        'show_ui' => true,
        'show_in_menu' => true,
        'show_in_rest' => true,
        'has_archive' => false,
        'supports' => ['title', 'custom-fields'],
        'show_in_graphql' => false,
    ]);
});

add_action('after_setup_theme', function () {
    register_nav_menus([
        'primary_menu' => __('Primary Menu', 'awkn'),
        'footer_legal' => __('Footer Legal', 'awkn'),
    ]);
});

function awkn_get_settings_option_fields(): array
{
    return [
        'awkn_logo_text' => __('Logo Text', 'awkn'),
        'awkn_logo_image_url' => __('Logo Image URL', 'awkn'),
        'awkn_intro_video_url' => __('Intro Video URL', 'awkn'),
        'awkn_contact_email' => __('Contact Email', 'awkn'),
        'awkn_contact_phone' => __('Contact Phone', 'awkn'),
        'awkn_instagram_url' => __('Instagram URL', 'awkn'),
        'awkn_youtube_url' => __('YouTube URL', 'awkn'),
        'awkn_facebook_url' => __('Facebook URL', 'awkn'),
        'awkn_tiktok_url' => __('TikTok URL', 'awkn'),
        'awkn_footer_tagline' => __('Footer Tagline', 'awkn'),
        'awkn_privacy_policy_url' => __('Privacy Policy URL', 'awkn'),
        'awkn_terms_url' => __('Terms URL', 'awkn'),
    ];
}

add_action('admin_init', function () {
    foreach (awkn_get_settings_option_fields() as $optionKey => $label) {
        $isUrlField = str_contains($optionKey, '_url');
        register_setting('awkn_headless_settings', $optionKey, [
            'sanitize_callback' => $isUrlField ? 'esc_url_raw' : 'sanitize_text_field',
            'type' => 'string',
        ]);

        register_setting('awkn_headless_settings', "{$optionKey}_fr", [
            'sanitize_callback' => $isUrlField ? 'esc_url_raw' : 'sanitize_text_field',
            'type' => 'string',
        ]);
    }
});

add_action('admin_enqueue_scripts', function (string $hookSuffix) {
    if ($hookSuffix !== 'settings_page_awkn-headless-settings') {
        return;
    }

    wp_enqueue_media();
});

add_action('admin_menu', function () {
    add_options_page(
        __('AWKN Headless Settings', 'awkn'),
        __('AWKN Headless', 'awkn'),
        'manage_options',
        'awkn-headless-settings',
        function () {
            if (! current_user_can('manage_options')) {
                return;
            }

            $fields = awkn_get_settings_option_fields();
            ?>
            <div class="wrap">
                <h1><?php echo esc_html__('AWKN Headless Settings', 'awkn'); ?></h1>
                <p><?php echo esc_html__('Update the structured settings used by the React frontend. English fields are the default; French fields override locale-specific content.', 'awkn'); ?></p>
                <form action="options.php" method="post">
                    <?php settings_fields('awkn_headless_settings'); ?>
                    <table class="form-table" role="presentation">
                        <tbody>
                        <?php foreach ($fields as $optionKey => $label) : ?>
                            <tr>
                                <th scope="row">
                                    <label for="<?php echo esc_attr($optionKey); ?>">
                                        <?php echo esc_html($label); ?> (EN)
                                    </label>
                                </th>
                                <td>
                                    <input
                                        class="regular-text"
                                        id="<?php echo esc_attr($optionKey); ?>"
                                        name="<?php echo esc_attr($optionKey); ?>"
                                        type="text"
                                        value="<?php echo esc_attr((string) get_option($optionKey, '')); ?>"
                                    />
                                    <?php if ($optionKey === 'awkn_logo_image_url') : ?>
                                        <button
                                            class="button awkn-media-select"
                                            data-target="<?php echo esc_attr($optionKey); ?>"
                                            style="margin-left:8px;"
                                            type="button"
                                        >
                                            <?php echo esc_html__('Choose from Media Library', 'awkn'); ?>
                                        </button>
                                        <p class="description">
                                            <?php echo esc_html__('Upload the logo in the WordPress Media Library and select it here. Recommended: transparent PNG or SVG.', 'awkn'); ?>
                                        </p>
                                        <div style="margin-top:12px;">
                                            <?php $currentLogoUrl = (string) get_option($optionKey, ''); ?>
                                            <?php if ($currentLogoUrl !== '') : ?>
                                                <img alt="" src="<?php echo esc_url($currentLogoUrl); ?>" style="max-height:64px;width:auto;border:1px solid #dcdcde;background:#fff;padding:8px;" />
                                            <?php else : ?>
                                                <span style="color:#646970;"><?php echo esc_html__('No English/default logo saved yet.', 'awkn'); ?></span>
                                            <?php endif; ?>
                                        </div>
                                    <?php endif; ?>
                                </td>
                            </tr>
                            <tr>
                                <th scope="row">
                                    <label for="<?php echo esc_attr("{$optionKey}_fr"); ?>">
                                        <?php echo esc_html($label); ?> (FR)
                                    </label>
                                </th>
                                <td>
                                    <input
                                        class="regular-text"
                                        id="<?php echo esc_attr("{$optionKey}_fr"); ?>"
                                        name="<?php echo esc_attr("{$optionKey}_fr"); ?>"
                                        type="text"
                                        value="<?php echo esc_attr((string) get_option("{$optionKey}_fr", '')); ?>"
                                    />
                                    <?php if ($optionKey === 'awkn_logo_image_url') : ?>
                                        <button
                                            class="button awkn-media-select"
                                            data-target="<?php echo esc_attr("{$optionKey}_fr"); ?>"
                                            style="margin-left:8px;"
                                            type="button"
                                        >
                                            <?php echo esc_html__('Choose from Media Library', 'awkn'); ?>
                                        </button>
                                        <p class="description">
                                            <?php echo esc_html__('Optional French-specific logo override. Leave empty to reuse the English/default logo.', 'awkn'); ?>
                                        </p>
                                        <div style="margin-top:12px;">
                                            <?php $currentLogoUrlFr = (string) get_option("{$optionKey}_fr", ''); ?>
                                            <?php if ($currentLogoUrlFr !== '') : ?>
                                                <img alt="" src="<?php echo esc_url($currentLogoUrlFr); ?>" style="max-height:64px;width:auto;border:1px solid #dcdcde;background:#fff;padding:8px;" />
                                            <?php else : ?>
                                                <span style="color:#646970;"><?php echo esc_html__('No French-specific logo saved. The frontend will fall back to the default logo.', 'awkn'); ?></span>
                                            <?php endif; ?>
                                        </div>
                                    <?php endif; ?>
                                </td>
                            </tr>
                        <?php endforeach; ?>
                        </tbody>
                    </table>
                    <?php submit_button(__('Save Headless Settings', 'awkn')); ?>
                </form>
            </div>
            <script>
                document.addEventListener('DOMContentLoaded', function () {
                    document.querySelectorAll('.awkn-media-select').forEach(function (button) {
                        button.addEventListener('click', function () {
                            const targetId = button.getAttribute('data-target');
                            const target = targetId ? document.getElementById(targetId) : null;

                            if (!target || typeof wp === 'undefined' || !wp.media) {
                                return;
                            }

                            const frame = wp.media({
                                button: { text: '<?php echo esc_js(__('Use this logo', 'awkn')); ?>' },
                                library: { type: 'image' },
                                multiple: false,
                                title: '<?php echo esc_js(__('Select a logo image', 'awkn')); ?>',
                            });

                            frame.on('select', function () {
                                const selection = frame.state().get('selection').first();
                                if (!selection) {
                                    return;
                                }

                                const attachment = selection.toJSON();
                                target.value = attachment.url || '';
                            });

                            frame.open();
                        });
                    });
                });
            </script>
            <?php
        }
    );
});

function awkn_get_localized_option(string $key, string $locale = '', string $default = ''): string
{
    $normalizedLocale = strtolower(trim($locale));

    if ($normalizedLocale !== '') {
        $localized = get_option("{$key}_{$normalizedLocale}", '');

        if (is_string($localized) && $localized !== '') {
            return $localized;
        }
    }

    $value = get_option($key, $default);

    return is_string($value) && $value !== '' ? $value : $default;
}

function awkn_resolve_logo_image_url(string $locale = ''): string
{
    $localized = awkn_get_localized_option('awkn_logo_image_url', $locale, '');
    if ($localized !== '') {
        return $localized;
    }

    $customLogoId = (int) get_theme_mod('custom_logo');
    if ($customLogoId > 0) {
        $customLogoUrl = wp_get_attachment_image_url($customLogoId, 'full');
        if (is_string($customLogoUrl) && $customLogoUrl !== '') {
            return $customLogoUrl;
        }
    }

    return '';
}

function awkn_get_headless_posts(string $postType, string $locale = '', int $limit = 3): array
{
    $normalizedLocale = strtolower(trim($locale)) ?: 'en';

    $posts = get_posts([
        'post_type' => $postType,
        'post_status' => 'publish',
        'posts_per_page' => $limit,
        'orderby' => 'menu_order date',
        'order' => 'ASC',
        'meta_query' => [
            [
                'key' => '_awkn_locale',
                'value' => $normalizedLocale,
            ],
        ],
    ]);

    if (empty($posts) && $normalizedLocale !== 'en') {
        $posts = get_posts([
            'post_type' => $postType,
            'post_status' => 'publish',
            'posts_per_page' => $limit,
            'orderby' => 'menu_order date',
            'order' => 'ASC',
            'meta_query' => [
                [
                    'key' => '_awkn_locale',
                    'value' => 'en',
                ],
            ],
        ]);
    }

    return array_map(function (WP_Post $post) {
        return [
            'title' => get_the_title($post),
            'body' => has_excerpt($post) ? get_the_excerpt($post) : wp_strip_all_tags($post->post_content),
            'href' => get_permalink($post),
            'location' => (string) get_post_meta($post->ID, '_awkn_location', true),
            'dateLabel' => (string) get_post_meta($post->ID, '_awkn_date_label', true),
        ];
    }, $posts);
}

function awkn_parse_give_tiers(string $rawValue): array
{
    $lines = array_filter(array_map('trim', explode("\n", $rawValue)));

    return array_map(function (string $line) {
        $parts = array_map('trim', explode('|', $line));

        return [
            'amount' => isset($parts[0]) ? (int) $parts[0] : 0,
            'label' => $parts[1] ?? '',
            'description' => $parts[2] ?? '',
        ];
    }, $lines);
}

function awkn_get_sync_secret(): string
{
    $secret = getenv('AWKN_WP_SYNC_SECRET');

    return is_string($secret) && $secret !== '' ? $secret : 'awkn-local-sync-secret';
}

function awkn_get_gift_posts(string $locale = ''): array
{
    $args = [
        'post_type' => 'awkn_gift',
        'post_status' => 'publish',
        'posts_per_page' => -1,
        'orderby' => 'date',
        'order' => 'DESC',
    ];

    if ($locale !== '') {
        $args['meta_query'] = [
            [
                'key' => '_awkn_locale',
                'value' => strtolower($locale),
            ],
        ];
    }

    return get_posts($args);
}

function awkn_get_give_report(string $locale = ''): array
{
    $posts = awkn_get_gift_posts($locale);
    $totalAmountCents = 0;
    $latestGiftAmountCents = 0;
    $latestGiftDate = '';
    $latestGiftStatus = 'pending';
    $latestWooOrderId = null;

    foreach ($posts as $index => $post) {
        $amount = (int) get_post_meta($post->ID, '_awkn_amount', true);
        $totalAmountCents += $amount;

        if ($index === 0) {
            $latestGiftAmountCents = $amount;
            $latestGiftDate = get_post_time('c', true, $post);
            $latestGiftStatus = (string) get_post_meta($post->ID, '_awkn_status', true) ?: 'pending';
            $latestWooOrderId = (int) get_post_meta($post->ID, '_awkn_woo_order_id', true) ?: null;
        }
    }

    return [
        'latestGiftAmountCents' => $latestGiftAmountCents,
        'latestGiftDate' => $latestGiftDate,
        'latestGiftStatus' => $latestGiftStatus,
        'latestWooOrderId' => $latestWooOrderId,
        'locale' => $locale !== '' ? strtolower($locale) : 'en',
        'totalAmountCents' => $totalAmountCents,
        'totalGifts' => count($posts),
        'wooEnabled' => class_exists('WooCommerce'),
    ];
}

function awkn_format_cents_to_usd_label(int $amount): string
{
    return '$' . number_format($amount / 100, 2);
}

function awkn_get_gift_meta(int $postId, string $key): string
{
    return (string) get_post_meta($postId, $key, true);
}

function awkn_store_gift_admin_notice(array $payload): void
{
    update_option('awkn_latest_gift_notice', [
        'amount' => (int) ($payload['amount'] ?? 0),
        'cadence' => (string) ($payload['cadence'] ?? 'one_time'),
        'donorEmail' => (string) ($payload['donorEmail'] ?? ''),
        'donorName' => (string) ($payload['donorName'] ?? ''),
        'donorNote' => (string) ($payload['donorNote'] ?? ''),
        'giftId' => (int) ($payload['giftId'] ?? 0),
        'locale' => (string) ($payload['locale'] ?? 'en'),
        'syncedAt' => time(),
        'wooOrderId' => (int) ($payload['wooOrderId'] ?? 0),
    ], false);
}

function awkn_get_latest_gift_notice(): array
{
    $notice = get_option('awkn_latest_gift_notice', []);

    return is_array($notice) ? $notice : [];
}

add_filter('manage_awkn_gift_posts_columns', function (array $columns) {
    $date = $columns['date'] ?? null;

    return array_filter([
        'cb' => $columns['cb'] ?? null,
        'title' => __('Gift', 'awkn'),
        'awkn_amount' => __('Amount', 'awkn'),
        'awkn_cadence' => __('Cadence', 'awkn'),
        'awkn_donor' => __('Donor', 'awkn'),
        'awkn_note' => __('Note', 'awkn'),
        'awkn_woo' => __('Woo Sync', 'awkn'),
        'date' => $date,
    ]);
});

add_action('manage_awkn_gift_posts_custom_column', function (string $column, int $postId) {
    if ($column === 'awkn_amount') {
        $amount = (int) get_post_meta($postId, '_awkn_amount', true);
        $status = awkn_get_gift_meta($postId, '_awkn_status');
        echo esc_html(awkn_format_cents_to_usd_label($amount));
        if ($status !== '') {
            echo '<br><span style="color:#646970;">' . esc_html($status) . '</span>';
        }
        return;
    }

    if ($column === 'awkn_cadence') {
        $cadence = awkn_get_gift_meta($postId, '_awkn_cadence');
        echo esc_html($cadence === 'monthly' ? 'Monthly' : 'One-Time');
        return;
    }

    if ($column === 'awkn_donor') {
        $name = awkn_get_gift_meta($postId, '_awkn_donor_name');
        $email = awkn_get_gift_meta($postId, '_awkn_donor_email');
        echo esc_html($name !== '' ? $name : 'Unknown donor');
        if ($email !== '') {
            echo '<br><a href="mailto:' . esc_attr($email) . '">' . esc_html($email) . '</a>';
        }
        return;
    }

    if ($column === 'awkn_note') {
        $note = awkn_get_gift_meta($postId, '_awkn_donor_note');
        echo $note !== '' ? esc_html(wp_trim_words($note, 14, '...')) : '<span style="color:#646970;">None</span>';
        return;
    }

    if ($column === 'awkn_woo') {
        $orderId = awkn_get_gift_meta($postId, '_awkn_woo_order_id');
        $status = awkn_get_gift_meta($postId, '_awkn_woo_sync_status');
        $enabled = awkn_get_gift_meta($postId, '_awkn_woo_sync_enabled');

        if ($enabled !== 'yes') {
            echo '<span style="color:#646970;">Disabled</span>';
            return;
        }

        if ($orderId !== '') {
            echo esc_html('#' . $orderId);
        }

        if ($status !== '') {
            echo '<br><span style="color:#646970;">' . esc_html($status) . '</span>';
        }
    }
}, 10, 2);

add_filter('manage_edit-awkn_gift_sortable_columns', function (array $columns) {
    $columns['awkn_amount'] = 'awkn_amount';
    $columns['awkn_cadence'] = 'awkn_cadence';
    $columns['awkn_woo'] = 'awkn_woo';

    return $columns;
});

add_action('restrict_manage_posts', function (string $postType) {
    if ($postType !== 'awkn_gift') {
        return;
    }

    $selectedCadence = isset($_GET['awkn_cadence']) ? sanitize_text_field(wp_unslash($_GET['awkn_cadence'])) : '';
    $selectedWoo = isset($_GET['awkn_woo_sync']) ? sanitize_text_field(wp_unslash($_GET['awkn_woo_sync'])) : '';

    echo '<select name="awkn_cadence" style="margin-right:8px;">';
    echo '<option value="">' . esc_html__('All cadences', 'awkn') . '</option>';
    echo '<option value="one_time"' . selected($selectedCadence, 'one_time', false) . '>' . esc_html__('One-Time', 'awkn') . '</option>';
    echo '<option value="monthly"' . selected($selectedCadence, 'monthly', false) . '>' . esc_html__('Monthly', 'awkn') . '</option>';
    echo '</select>';

    echo '<select name="awkn_woo_sync">';
    echo '<option value="">' . esc_html__('All Woo sync states', 'awkn') . '</option>';
    echo '<option value="yes"' . selected($selectedWoo, 'yes', false) . '>' . esc_html__('Woo synced', 'awkn') . '</option>';
    echo '<option value="no"' . selected($selectedWoo, 'no', false) . '>' . esc_html__('Woo disabled', 'awkn') . '</option>';
    echo '</select>';
});

add_action('pre_get_posts', function (WP_Query $query) {
    if (! is_admin() || ! $query->is_main_query()) {
        return;
    }

    if ($query->get('post_type') !== 'awkn_gift') {
        return;
    }

    $metaQuery = $query->get('meta_query');
    if (! is_array($metaQuery)) {
        $metaQuery = [];
    }

    $cadence = isset($_GET['awkn_cadence']) ? sanitize_text_field(wp_unslash($_GET['awkn_cadence'])) : '';
    if (in_array($cadence, ['monthly', 'one_time'], true)) {
        $metaQuery[] = [
            'key' => '_awkn_cadence',
            'value' => $cadence,
        ];
    }

    $wooSync = isset($_GET['awkn_woo_sync']) ? sanitize_text_field(wp_unslash($_GET['awkn_woo_sync'])) : '';
    if (in_array($wooSync, ['yes', 'no'], true)) {
        $metaQuery[] = [
            'key' => '_awkn_woo_sync_enabled',
            'value' => $wooSync,
        ];
    }

    if ($metaQuery !== []) {
        $query->set('meta_query', $metaQuery);
    }

    $orderby = $query->get('orderby');

    if ($orderby === 'awkn_amount') {
        $query->set('meta_key', '_awkn_amount');
        $query->set('orderby', 'meta_value_num');
        return;
    }

    if ($orderby === 'awkn_cadence') {
        $query->set('meta_key', '_awkn_cadence');
        $query->set('orderby', 'meta_value');
        return;
    }

    if ($orderby === 'awkn_woo') {
        $query->set('meta_key', '_awkn_woo_sync_status');
        $query->set('orderby', 'meta_value');
    }
});

add_action('add_meta_boxes', function () {
    add_meta_box(
        'awkn_gift_details',
        __('Gift Details', 'awkn'),
        function (WP_Post $post) {
            $amount = (int) get_post_meta($post->ID, '_awkn_amount', true);
            $cadence = awkn_get_gift_meta($post->ID, '_awkn_cadence');
            $currency = strtoupper(awkn_get_gift_meta($post->ID, '_awkn_currency'));
            $customerId = awkn_get_gift_meta($post->ID, '_awkn_customer_id');
            $donorEmail = awkn_get_gift_meta($post->ID, '_awkn_donor_email');
            $donorName = awkn_get_gift_meta($post->ID, '_awkn_donor_name');
            $donorNote = awkn_get_gift_meta($post->ID, '_awkn_donor_note');
            $locale = awkn_get_gift_meta($post->ID, '_awkn_locale');
            $paymentIntentId = awkn_get_gift_meta($post->ID, '_awkn_payment_intent_id');
            $status = awkn_get_gift_meta($post->ID, '_awkn_status');
            $subscriptionId = awkn_get_gift_meta($post->ID, '_awkn_subscription_id');
            $wooOrderId = awkn_get_gift_meta($post->ID, '_awkn_woo_order_id');
            $wooSyncStatus = awkn_get_gift_meta($post->ID, '_awkn_woo_sync_status');

            $rows = [
                __('Amount', 'awkn') => trim(awkn_format_cents_to_usd_label($amount) . ' ' . $currency),
                __('Cadence', 'awkn') => $cadence === 'monthly' ? 'Monthly' : 'One-Time',
                __('Status', 'awkn') => $status,
                __('Donor', 'awkn') => $donorName,
                __('Email', 'awkn') => $donorEmail,
                __('Locale', 'awkn') => $locale,
                __('Payment Intent', 'awkn') => $paymentIntentId,
                __('Stripe Customer', 'awkn') => $customerId,
                __('Stripe Subscription', 'awkn') => $subscriptionId,
                __('Woo Order', 'awkn') => $wooOrderId !== '' ? '#' . $wooOrderId : '',
                __('Woo Sync Status', 'awkn') => $wooSyncStatus,
            ];

            echo '<div class="awkn-gift-details"><table class="widefat striped" style="border:none;">';
            foreach ($rows as $label => $value) {
                echo '<tr>';
                echo '<td style="width:180px;font-weight:600;">' . esc_html($label) . '</td>';
                echo '<td>' . ($value !== '' ? esc_html($value) : '<span style="color:#646970;">—</span>') . '</td>';
                echo '</tr>';
            }
            echo '</table>';
            echo '<div style="margin-top:16px;">';
            echo '<p style="margin:0 0 8px;font-weight:600;">' . esc_html__('Dedication / Note', 'awkn') . '</p>';
            echo '<div style="padding:12px;border:1px solid #dcdcde;background:#fff;white-space:pre-wrap;">';
            echo $donorNote !== '' ? esc_html($donorNote) : '<span style="color:#646970;">' . esc_html__('No donor note provided.', 'awkn') . '</span>';
            echo '</div></div></div>';
        },
        'awkn_gift',
        'normal',
        'high'
    );
});

add_action('admin_notices', function () {
    if (! current_user_can('edit_posts')) {
        return;
    }

    $screen = function_exists('get_current_screen') ? get_current_screen() : null;
    $allowedScreens = [
        'dashboard',
        'edit-awkn_gift',
        'awkn_gift',
        'woocommerce_page_wc-orders',
        'shop_order',
    ];

    if (! $screen || ! in_array($screen->id, $allowedScreens, true)) {
        return;
    }

    $notice = awkn_get_latest_gift_notice();
    $syncedAt = isset($notice['syncedAt']) ? (int) $notice['syncedAt'] : 0;

    if ($syncedAt <= 0 || (time() - $syncedAt) > DAY_IN_SECONDS) {
        return;
    }

    $amount = awkn_format_cents_to_usd_label((int) ($notice['amount'] ?? 0));
    $cadence = (($notice['cadence'] ?? 'one_time') === 'monthly') ? __('Monthly', 'awkn') : __('One-Time', 'awkn');
    $donorName = (string) ($notice['donorName'] ?? '');
    $donorEmail = (string) ($notice['donorEmail'] ?? '');
    $giftId = (int) ($notice['giftId'] ?? 0);
    $wooOrderId = (int) ($notice['wooOrderId'] ?? 0);
    $locale = (string) ($notice['locale'] ?? 'en');
    $note = trim((string) ($notice['donorNote'] ?? ''));

    $giftLink = $giftId > 0 ? get_edit_post_link($giftId) : '';
    $orderLink = $wooOrderId > 0 ? admin_url(sprintf('admin.php?page=wc-orders&action=edit&id=%d', $wooOrderId)) : '';

    echo '<div class="notice notice-success">';
    echo '<p><strong>' . esc_html__('New gift received.', 'awkn') . '</strong> ';
    echo esc_html(sprintf('%s %s', $amount, $cadence));
    if ($donorName !== '') {
        echo esc_html(' — ' . $donorName);
    }
    if ($donorEmail !== '') {
        echo ' <a href="mailto:' . esc_attr($donorEmail) . '">' . esc_html($donorEmail) . '</a>';
    }
    echo ' <span style="color:#646970;">(' . esc_html(strtoupper($locale)) . ')</span>';
    echo '</p>';

    if ($note !== '') {
        echo '<p style="margin-top:4px;"><strong>' . esc_html__('Note:', 'awkn') . '</strong> ' . esc_html(wp_trim_words($note, 20, '...')) . '</p>';
    }

    if ($giftLink !== '' || $orderLink !== '') {
        echo '<p style="margin-top:6px;">';
        if ($giftLink !== '') {
            echo '<a class="button button-secondary" href="' . esc_url($giftLink) . '">' . esc_html__('Open Gift Record', 'awkn') . '</a> ';
        }
        if ($orderLink !== '') {
            echo '<a class="button button-secondary" href="' . esc_url($orderLink) . '">' . esc_html__('Open Woo Order', 'awkn') . '</a>';
        }
        echo '</p>';
    }

    echo '</div>';
});

function awkn_get_existing_gift_order(string $paymentIntentId): ?WC_Order
{
    if ($paymentIntentId === '' || ! function_exists('wc_get_orders')) {
        return null;
    }

    $orders = wc_get_orders([
        'limit' => 1,
        'meta_key' => '_awkn_payment_intent_id',
        'meta_value' => $paymentIntentId,
        'return' => 'objects',
        'type' => 'shop_order',
    ]);

    if (! empty($orders) && $orders[0] instanceof WC_Order) {
        return $orders[0];
    }

    return null;
}

function awkn_get_existing_gift_fee_item(WC_Order $order): ?WC_Order_Item_Fee
{
    foreach ($order->get_items('fee') as $item) {
        if ($item instanceof WC_Order_Item_Fee && $item->get_meta('_awkn_gift_fee') === 'yes') {
            return $item;
        }
    }

    return null;
}

function awkn_map_gift_status_to_order_status(string $status): string
{
    if ($status === 'succeeded') {
        return 'completed';
    }

    if (in_array($status, ['processing', 'requires_capture'], true)) {
        return 'on-hold';
    }

    return 'pending';
}

function awkn_sync_gift_to_woocommerce(array $giftData): array
{
    if (
        ! class_exists('WooCommerce') ||
        ! function_exists('wc_create_order') ||
        ! class_exists('WC_Order_Item_Fee')
    ) {
        return [
            'enabled' => false,
            'message' => 'WooCommerce is not active.',
        ];
    }

    $paymentIntentId = $giftData['paymentIntentId'] ?? '';
    $currency = strtoupper((string) ($giftData['currency'] ?? 'USD'));
    $amount = max(0, (int) ($giftData['amount'] ?? 0));
    $cadence = (string) ($giftData['cadence'] ?? 'one_time');
    $customerId = (string) ($giftData['customerId'] ?? '');
    $donorEmail = (string) ($giftData['donorEmail'] ?? '');
    $donorName = trim((string) ($giftData['donorName'] ?? ''));
    $donorNote = trim((string) ($giftData['donorNote'] ?? ''));
    $locale = (string) ($giftData['locale'] ?? 'en');
    $status = (string) ($giftData['status'] ?? 'pending');
    $subscriptionId = (string) ($giftData['subscriptionId'] ?? '');
    $giftId = (int) ($giftData['giftId'] ?? 0);

    $order = awkn_get_existing_gift_order($paymentIntentId);

    if (! $order instanceof WC_Order) {
        $order = wc_create_order();
    }

    if (is_wp_error($order) || ! $order instanceof WC_Order) {
        return [
            'enabled' => true,
            'message' => 'WooCommerce order creation failed.',
        ];
    }

    $nameParts = preg_split('/\s+/', $donorName, 2);
    $firstName = $nameParts[0] ?? '';
    $lastName = $nameParts[1] ?? '';
    $amountDecimal = $amount / 100;
    $feeItem = awkn_get_existing_gift_fee_item($order);

    if (! $feeItem instanceof WC_Order_Item_Fee) {
        $feeItem = new WC_Order_Item_Fee();
        $feeItem->set_name(__('Gift to Awakening Network', 'awkn'));
        $feeItem->add_meta_data('_awkn_gift_fee', 'yes', true);
        $order->add_item($feeItem);
    }

    $feeItem->set_amount($amountDecimal);
    $feeItem->set_total($amountDecimal);

    $order->set_created_via('awkn_headless_give');
    $order->set_currency($currency);
    $order->set_billing_email($donorEmail);
    $order->set_billing_first_name($firstName);
    $order->set_billing_last_name($lastName);
    $order->set_payment_method('stripe');
    $order->set_payment_method_title(__('Online Giving', 'awkn'));
    $order->set_transaction_id($paymentIntentId);
    $order->update_meta_data('_awkn_payment_intent_id', $paymentIntentId);
    $order->update_meta_data('_awkn_customer_id', $customerId);
    $order->update_meta_data('_awkn_gift_cadence', $cadence);
    $order->update_meta_data('_awkn_gift_id', $giftId);
    $order->update_meta_data('_awkn_locale', $locale);
    $order->update_meta_data('_awkn_donor_note', $donorNote);
    $order->update_meta_data('_awkn_gift_status', $status);
    $order->update_meta_data('_awkn_gift_source', 'headless_frontend');
    $order->update_meta_data('_awkn_subscription_id', $subscriptionId);
    $order->set_customer_note(
        sprintf(
            'Headless %s gift synced from the public giving form. Payment intent: %s',
            $cadence === 'monthly' ? 'monthly' : 'one-time',
            $paymentIntentId
        )
    );
    $order->calculate_totals(false);
    $order->save();

    $targetStatus = awkn_map_gift_status_to_order_status($status);

    if ($order->get_status() !== $targetStatus) {
        $order->update_status($targetStatus, __('Donation sync status updated from the headless giving flow.', 'awkn'), true);
    }

    return [
        'enabled' => true,
        'orderId' => $order->get_id(),
        'status' => $order->get_status(),
    ];
}

add_action('rest_api_init', function () {
    register_rest_route('awkn/v1', '/gifts', [
        'methods' => 'POST',
        'permission_callback' => function (WP_REST_Request $request) {
            $provided = $request->get_header('x-awkn-sync-secret');
            return is_string($provided) && hash_equals(awkn_get_sync_secret(), $provided);
        },
        'callback' => function (WP_REST_Request $request) {
            $payment_intent_id = sanitize_text_field((string) $request->get_param('paymentIntentId'));

            if ($payment_intent_id === '') {
                return new WP_Error('awkn_missing_payment_intent', 'Payment intent id is required.', ['status' => 400]);
            }

            $existing = get_posts([
                'post_type' => 'awkn_gift',
                'post_status' => 'publish',
                'posts_per_page' => 1,
                'meta_query' => [
                    [
                        'key' => '_awkn_payment_intent_id',
                        'value' => $payment_intent_id,
                    ],
                ],
            ]);

            $amount = (int) $request->get_param('amount');
            $currency = sanitize_text_field((string) $request->get_param('currency'));
            $cadence = sanitize_text_field((string) $request->get_param('cadence')) ?: 'one_time';
            $customer_id = sanitize_text_field((string) $request->get_param('customerId'));
            $status = sanitize_text_field((string) $request->get_param('status'));
            $locale = sanitize_text_field((string) $request->get_param('locale'));
            $donor_email = sanitize_email((string) $request->get_param('donorEmail'));
            $donor_name = sanitize_text_field((string) $request->get_param('donorName'));
            $donor_note = sanitize_textarea_field((string) $request->get_param('donorNote'));
            $subscription_id = sanitize_text_field((string) $request->get_param('subscriptionId'));

            $title = sprintf(
                '%s Gift %s%s',
                $cadence === 'monthly' ? 'Monthly' : 'One-Time',
                $amount > 0 ? '$' . number_format($amount / 100, 2) . ' ' : '',
                $payment_intent_id
            );

            if (! empty($existing)) {
                $gift_id = $existing[0]->ID;
                wp_update_post([
                    'ID' => $gift_id,
                    'post_title' => $title,
                ]);
            } else {
                $gift_id = wp_insert_post([
                    'post_type' => 'awkn_gift',
                    'post_status' => 'publish',
                    'post_title' => $title,
                ]);
            }

            if (is_wp_error($gift_id)) {
                return $gift_id;
            }

            update_post_meta($gift_id, '_awkn_payment_intent_id', $payment_intent_id);
            update_post_meta($gift_id, '_awkn_amount', $amount);
            update_post_meta($gift_id, '_awkn_cadence', $cadence);
            update_post_meta($gift_id, '_awkn_currency', $currency);
            update_post_meta($gift_id, '_awkn_customer_id', $customer_id);
            update_post_meta($gift_id, '_awkn_status', $status);
            update_post_meta($gift_id, '_awkn_locale', $locale);
            update_post_meta($gift_id, '_awkn_donor_email', $donor_email);
            update_post_meta($gift_id, '_awkn_donor_name', $donor_name);
            update_post_meta($gift_id, '_awkn_donor_note', $donor_note);
            update_post_meta($gift_id, '_awkn_subscription_id', $subscription_id);

            $woo_sync = awkn_sync_gift_to_woocommerce([
                'amount' => $amount,
                'cadence' => $cadence,
                'currency' => $currency,
                'customerId' => $customer_id,
                'donorEmail' => $donor_email,
                'donorName' => $donor_name,
                'donorNote' => $donor_note,
                'giftId' => $gift_id,
                'locale' => $locale,
                'paymentIntentId' => $payment_intent_id,
                'subscriptionId' => $subscription_id,
                'status' => $status,
            ]);

            if (! empty($woo_sync['orderId'])) {
                update_post_meta($gift_id, '_awkn_woo_order_id', (int) $woo_sync['orderId']);
            }

            update_post_meta($gift_id, '_awkn_woo_sync_enabled', ! empty($woo_sync['enabled']) ? 'yes' : 'no');
            update_post_meta($gift_id, '_awkn_woo_sync_status', (string) ($woo_sync['status'] ?? 'disabled'));
            awkn_store_gift_admin_notice([
                'amount' => $amount,
                'cadence' => $cadence,
                'donorEmail' => $donor_email,
                'donorName' => $donor_name,
                'donorNote' => $donor_note,
                'giftId' => $gift_id,
                'locale' => $locale,
                'wooOrderId' => (int) ($woo_sync['orderId'] ?? 0),
            ]);

            return new WP_REST_Response([
                'giftId' => $gift_id,
                'paymentIntentId' => $payment_intent_id,
                'status' => $status,
                'woo' => $woo_sync,
            ], 200);
        },
    ]);
});

add_action('graphql_register_types', function () {
    if (! function_exists('register_graphql_object_type') || ! function_exists('register_graphql_field')) {
        return;
    }

    register_graphql_object_type('AwknSiteSettings', [
        'description' => __('Structured settings for the AWKN headless frontend.', 'awkn'),
        'fields' => [
            'locale' => ['type' => 'String'],
            'logoText' => ['type' => 'String'],
            'logoImageUrl' => ['type' => 'String'],
            'introVideoUrl' => ['type' => 'String'],
            'contactEmail' => ['type' => 'String'],
            'contactPhone' => ['type' => 'String'],
            'instagramUrl' => ['type' => 'String'],
            'youtubeUrl' => ['type' => 'String'],
            'facebookUrl' => ['type' => 'String'],
            'tiktokUrl' => ['type' => 'String'],
            'footerTagline' => ['type' => 'String'],
            'privacyPolicyUrl' => ['type' => 'String'],
            'termsUrl' => ['type' => 'String'],
        ],
    ]);

    register_graphql_object_type('AwknHomePage', [
        'description' => __('Structured homepage content for the AWKN headless frontend.', 'awkn'),
        'fields' => [
            'locale' => ['type' => 'String'],
            'heroEyebrow' => ['type' => 'String'],
            'heroTitle' => ['type' => 'String'],
            'heroBody' => ['type' => 'String'],
            'heroPrimaryCtaLabel' => ['type' => 'String'],
            'heroPrimaryCtaHref' => ['type' => 'String'],
            'heroSecondaryCtaLabel' => ['type' => 'String'],
            'heroSecondaryCtaHref' => ['type' => 'String'],
            'videoEyebrow' => ['type' => 'String'],
            'videoTitle' => ['type' => 'String'],
            'videoBody' => ['type' => 'String'],
            'resourcesEyebrow' => ['type' => 'String'],
            'resourcesHeading' => ['type' => 'String'],
            'resourceItems' => ['type' => ['list_of' => 'String']],
            'storyEyebrow' => ['type' => 'String'],
            'storyHeading' => ['type' => 'String'],
            'storyBody' => ['type' => 'String'],
            'storyFlowItems' => ['type' => ['list_of' => 'String']],
            'eventsHeading' => ['type' => 'String'],
            'eventLocation' => ['type' => 'String'],
            'contactEyebrow' => ['type' => 'String'],
            'contactHeading' => ['type' => 'String'],
            'contactBody' => ['type' => 'String'],
            'contactLocation' => ['type' => 'String'],
            'contactActions' => ['type' => ['list_of' => 'String']],
        ],
    ]);

    register_graphql_object_type('AwknResourceCard', [
        'description' => __('Structured AWKN resource card.', 'awkn'),
        'fields' => [
            'title' => ['type' => 'String'],
            'body' => ['type' => 'String'],
            'href' => ['type' => 'String'],
        ],
    ]);

    register_graphql_object_type('AwknEventCard', [
        'description' => __('Structured AWKN event card.', 'awkn'),
        'fields' => [
            'title' => ['type' => 'String'],
            'body' => ['type' => 'String'],
            'href' => ['type' => 'String'],
            'location' => ['type' => 'String'],
            'dateLabel' => ['type' => 'String'],
        ],
    ]);

    register_graphql_object_type('AwknMediaCard', [
        'description' => __('Structured AWKN media card.', 'awkn'),
        'fields' => [
            'title' => ['type' => 'String'],
            'body' => ['type' => 'String'],
            'href' => ['type' => 'String'],
            'sourceLabel' => ['type' => 'String'],
            'publishedAt' => ['type' => 'String'],
            'thumbnailUrl' => ['type' => 'String'],
            'videoUrl' => ['type' => 'String'],
        ],
    ]);

    register_graphql_object_type('AwknGiveTier', [
        'description' => __('Structured AWKN donation tier.', 'awkn'),
        'fields' => [
            'amount' => ['type' => 'Int'],
            'label' => ['type' => 'String'],
            'description' => ['type' => 'String'],
        ],
    ]);

    register_graphql_object_type('AwknGiveSettings', [
        'description' => __('Structured AWKN give page settings.', 'awkn'),
        'fields' => [
            'locale' => ['type' => 'String'],
            'eyebrow' => ['type' => 'String'],
            'heading' => ['type' => 'String'],
            'body' => ['type' => 'String'],
            'successMessage' => ['type' => 'String'],
            'tiers' => ['type' => ['list_of' => 'AwknGiveTier']],
        ],
    ]);

    register_graphql_object_type('AwknGiveReport', [
        'description' => __('Structured AWKN giving report summary.', 'awkn'),
        'fields' => [
            'locale' => ['type' => 'String'],
            'totalGifts' => ['type' => 'Int'],
            'totalAmountCents' => ['type' => 'Int'],
            'latestGiftAmountCents' => ['type' => 'Int'],
            'latestGiftDate' => ['type' => 'String'],
            'latestGiftStatus' => ['type' => 'String'],
            'latestWooOrderId' => ['type' => 'Int'],
            'wooEnabled' => ['type' => 'Boolean'],
        ],
    ]);

    register_graphql_field('RootQuery', 'awknSiteSettings', [
        'type' => 'AwknSiteSettings',
        'description' => __('Returns structured AWKN site settings.', 'awkn'),
        'args' => [
            'locale' => [
                'type' => 'String',
            ],
        ],
        'resolve' => function ($root, array $args) {
            $locale = isset($args['locale']) && is_string($args['locale']) ? $args['locale'] : '';

            return [
                'locale' => $locale !== '' ? $locale : 'en',
                'logoText' => awkn_get_localized_option('awkn_logo_text', $locale, get_bloginfo('name')),
                'logoImageUrl' => awkn_resolve_logo_image_url($locale),
                'introVideoUrl' => awkn_get_localized_option('awkn_intro_video_url', $locale, ''),
                'contactEmail' => awkn_get_localized_option('awkn_contact_email', $locale, get_option('admin_email', '')),
                'contactPhone' => awkn_get_localized_option('awkn_contact_phone', $locale, ''),
                'instagramUrl' => awkn_get_localized_option('awkn_instagram_url', $locale, ''),
                'youtubeUrl' => awkn_get_localized_option('awkn_youtube_url', $locale, ''),
                'facebookUrl' => awkn_get_localized_option('awkn_facebook_url', $locale, ''),
                'tiktokUrl' => awkn_get_localized_option('awkn_tiktok_url', $locale, ''),
                'footerTagline' => awkn_get_localized_option(
                    'awkn_footer_tagline',
                    $locale,
                    'Renewal, pilgrimage, belonging'
                ),
                'privacyPolicyUrl' => awkn_get_localized_option('awkn_privacy_policy_url', $locale, ''),
                'termsUrl' => awkn_get_localized_option('awkn_terms_url', $locale, ''),
            ];
        },
    ]);

    register_graphql_field('RootQuery', 'awknHomePage', [
        'type' => 'AwknHomePage',
        'description' => __('Returns structured AWKN homepage content.', 'awkn'),
        'args' => [
            'locale' => [
                'type' => 'String',
            ],
        ],
        'resolve' => function ($root, array $args) {
            $locale = isset($args['locale']) && is_string($args['locale']) ? $args['locale'] : '';

            $resourceItems = array_filter(array_map('trim', explode("\n", awkn_get_localized_option(
                'awkn_home_resource_items',
                $locale,
                "Featured teaching series\nFormation guides and devotionals\nPodcast and media highlights"
            ))));
            $storyFlowItems = array_filter(array_map('trim', explode("\n", awkn_get_localized_option(
                'awkn_home_story_flow_items',
                $locale,
                "Hero and main introduction video\nMission and story-led explanation\nFeatured resources and media\nEvents and public invitations\nContact, newsletter, and footer utility links"
            ))));
            $contactActions = array_filter(array_map('trim', explode("\n", awkn_get_localized_option(
                'awkn_home_contact_actions',
                $locale,
                "Invite us to speak\nAsk about upcoming events\nJoin the newsletter\nStart a conversation with the team"
            ))));

            return [
                'locale' => $locale !== '' ? $locale : 'en',
                'heroEyebrow' => awkn_get_localized_option('awkn_home_hero_eyebrow', $locale, 'Main Topic'),
                'heroTitle' => awkn_get_localized_option(
                    'awkn_home_hero_title',
                    $locale,
                    'Awakening Network is the main story the website should tell.'
                ),
                'heroBody' => awkn_get_localized_option(
                    'awkn_home_hero_body',
                    $locale,
                    'A public-facing home for renewal, formation, sacred gatherings, and the people carrying this movement forward.'
                ),
                'heroPrimaryCtaLabel' => awkn_get_localized_option(
                    'awkn_home_hero_primary_cta_label',
                    $locale,
                    'Watch the introduction'
                ),
                'heroPrimaryCtaHref' => awkn_get_localized_option(
                    'awkn_home_hero_primary_cta_href',
                    $locale,
                    '#video'
                ),
                'heroSecondaryCtaLabel' => awkn_get_localized_option(
                    'awkn_home_hero_secondary_cta_label',
                    $locale,
                    'See upcoming events'
                ),
                'heroSecondaryCtaHref' => awkn_get_localized_option(
                    'awkn_home_hero_secondary_cta_href',
                    $locale,
                    '#events'
                ),
                'videoEyebrow' => awkn_get_localized_option('awkn_home_video_eyebrow', $locale, 'Main Intro Video'),
                'videoTitle' => awkn_get_localized_option(
                    'awkn_home_video_title',
                    $locale,
                    'A cinematic opening that introduces the network, the people, and the call.'
                ),
                'videoBody' => awkn_get_localized_option(
                    'awkn_home_video_body',
                    $locale,
                    'This space is reserved for the main homepage video and can later be wired to WordPress-managed video fields and media.'
                ),
                'resourcesEyebrow' => awkn_get_localized_option('awkn_home_resources_eyebrow', $locale, 'Resources'),
                'resourcesHeading' => awkn_get_localized_option(
                    'awkn_home_resources_heading',
                    $locale,
                    'A natural place for featured teachings, media, and formation tools.'
                ),
                'resourceItems' => $resourceItems,
                'storyEyebrow' => awkn_get_localized_option('awkn_home_story_eyebrow', $locale, 'About'),
                'storyHeading' => awkn_get_localized_option(
                    'awkn_home_story_heading',
                    $locale,
                    'A clear editorial homepage instead of stacked product cards.'
                ),
                'storyBody' => awkn_get_localized_option(
                    'awkn_home_story_body',
                    $locale,
                    'The structure now makes space for story, formation, events, resources, contact, and future WordPress-backed content streams.'
                ),
                'storyFlowItems' => $storyFlowItems,
                'eventsHeading' => awkn_get_localized_option(
                    'awkn_home_events_heading',
                    $locale,
                    'Gatherings, retreats, and future WordPress-managed event listings.'
                ),
                'eventLocation' => awkn_get_localized_option(
                    'awkn_home_event_location',
                    $locale,
                    'Franklin, TN'
                ),
                'contactEyebrow' => awkn_get_localized_option('awkn_home_contact_eyebrow', $locale, 'Contact Us'),
                'contactHeading' => awkn_get_localized_option(
                    'awkn_home_contact_heading',
                    $locale,
                    'A clear closing section for invitations, partnerships, and next steps.'
                ),
                'contactBody' => awkn_get_localized_option(
                    'awkn_home_contact_body',
                    $locale,
                    'This bottom section is intentionally positioned for contact details, newsletter signups, partnership requests, and WordPress-managed footer settings.'
                ),
                'contactLocation' => awkn_get_localized_option(
                    'awkn_home_contact_location',
                    $locale,
                    'Nashville / Franklin region'
                ),
                'contactActions' => $contactActions,
            ];
        },
    ]);

    register_graphql_field('RootQuery', 'awknResourcesFeed', [
        'type' => ['list_of' => 'AwknResourceCard'],
        'description' => __('Returns structured AWKN resources for the landing page.', 'awkn'),
        'args' => [
            'locale' => [
                'type' => 'String',
            ],
            'limit' => [
                'type' => 'Int',
            ],
        ],
        'resolve' => function ($root, array $args) {
            $locale = isset($args['locale']) && is_string($args['locale']) ? $args['locale'] : '';
            $limit = isset($args['limit']) ? (int) $args['limit'] : 3;
            $items = awkn_get_headless_posts('awkn_resource', $locale, max(1, $limit));

            return array_map(function (array $item) {
                return [
                    'title' => $item['title'] ?? '',
                    'body' => $item['body'] ?? '',
                    'href' => $item['href'] ?? '',
                ];
            }, $items);
        },
    ]);

    register_graphql_field('RootQuery', 'awknEventsFeed', [
        'type' => ['list_of' => 'AwknEventCard'],
        'description' => __('Returns structured AWKN events for the landing page.', 'awkn'),
        'args' => [
            'locale' => [
                'type' => 'String',
            ],
            'limit' => [
                'type' => 'Int',
            ],
        ],
        'resolve' => function ($root, array $args) {
            $locale = isset($args['locale']) && is_string($args['locale']) ? $args['locale'] : '';
            $limit = isset($args['limit']) ? (int) $args['limit'] : 3;

            return awkn_get_headless_posts('awkn_event', $locale, max(1, $limit));
        },
    ]);

    register_graphql_field('RootQuery', 'awknMediaFeed', [
        'type' => ['list_of' => 'AwknMediaCard'],
        'description' => __('Returns structured AWKN media entries for the frontend feed domain.', 'awkn'),
        'args' => [
            'locale' => [
                'type' => 'String',
            ],
            'limit' => [
                'type' => 'Int',
            ],
        ],
        'resolve' => function ($root, array $args) {
            $locale = isset($args['locale']) && is_string($args['locale']) ? $args['locale'] : '';
            $limit = isset($args['limit']) ? (int) $args['limit'] : 12;
            $normalizedLocale = strtolower(trim($locale)) ?: 'en';

            $items = get_posts([
                'post_type' => 'awkn_media',
                'post_status' => 'publish',
                'posts_per_page' => max(1, $limit),
                'orderby' => 'date',
                'order' => 'DESC',
                'meta_query' => [
                    [
                        'key' => '_awkn_locale',
                        'value' => $normalizedLocale,
                    ],
                ],
            ]);

            if (empty($items) && $normalizedLocale !== 'en') {
                $items = get_posts([
                    'post_type' => 'awkn_media',
                    'post_status' => 'publish',
                    'posts_per_page' => max(1, $limit),
                    'orderby' => 'date',
                    'order' => 'DESC',
                    'meta_query' => [
                        [
                            'key' => '_awkn_locale',
                            'value' => 'en',
                        ],
                    ],
                ]);
            }

            return array_map(function (WP_Post $post) {
                return [
                    'title' => get_the_title($post),
                    'body' => has_excerpt($post) ? get_the_excerpt($post) : wp_strip_all_tags($post->post_content),
                    'href' => get_permalink($post),
                    'publishedAt' => get_post_time('c', true, $post),
                    'sourceLabel' => (string) get_post_meta($post->ID, '_awkn_source_label', true),
                    'thumbnailUrl' => (string) get_post_meta($post->ID, '_awkn_thumbnail_url', true),
                    'videoUrl' => (string) get_post_meta($post->ID, '_awkn_video_url', true),
                ];
            }, $items);
        },
    ]);

    register_graphql_field('RootQuery', 'awknGiveSettings', [
        'type' => 'AwknGiveSettings',
        'description' => __('Returns structured AWKN give settings.', 'awkn'),
        'args' => [
            'locale' => [
                'type' => 'String',
            ],
        ],
        'resolve' => function ($root, array $args) {
            $locale = isset($args['locale']) && is_string($args['locale']) ? $args['locale'] : '';
            $tiers = awkn_parse_give_tiers(awkn_get_localized_option(
                'awkn_give_tiers',
                $locale,
                "2500|Support One Family|Help fund pastoral care, formation, and local accompaniment.\n7500|Sponsor a Gathering|Support the cost of space, worship, and welcome for regional events.\n15000|Fuel the Mission|Invest in media, travel, and infrastructure for the wider work."
            ));

            return [
                'locale' => $locale !== '' ? $locale : 'en',
                'eyebrow' => awkn_get_localized_option('awkn_give_eyebrow', $locale, 'Give'),
                'heading' => awkn_get_localized_option(
                    'awkn_give_heading',
                    $locale,
                    'Support the work of renewal with a direct gift.'
                ),
                'body' => awkn_get_localized_option(
                    'awkn_give_body',
                    $locale,
                    'Your generosity helps sustain gatherings, resources, and pastoral presence across the network.'
                ),
                'successMessage' => awkn_get_localized_option(
                    'awkn_give_success_message',
                    $locale,
                    'Thank you. Your gift has been received and the team will follow up with a confirmation.'
                ),
                'tiers' => $tiers,
            ];
        },
    ]);

    register_graphql_field('RootQuery', 'awknGiveReport', [
        'type' => 'AwknGiveReport',
        'description' => __('Returns a structured giving report summary.', 'awkn'),
        'args' => [
            'locale' => [
                'type' => 'String',
            ],
        ],
        'resolve' => function ($root, array $args) {
            $locale = isset($args['locale']) && is_string($args['locale']) ? $args['locale'] : '';

            return awkn_get_give_report($locale);
        },
    ]);
});

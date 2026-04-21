#!/bin/sh
set -eu

WP_PATH="/var/www/html"
PRIMARY_MENU="Primary Menu"
FOOTER_LEGAL_MENU="Footer Legal"

page_id_by_slug() {
  wp post list \
    --post_type=page \
    --fields=ID,post_name \
    --format=csv \
    --path="$WP_PATH" \
    --allow-root | awk -F, -v slug="$1" 'NR > 1 && $2 == slug { print $1; exit }'
}

ensure_page() {
  slug="$1"
  title="$2"
  content="$3"

  existing_id="$(page_id_by_slug "$slug" || true)"

  if [ -n "$existing_id" ]; then
    printf '%s\n' "$existing_id"
    return
  fi

  wp post create \
    --post_type=page \
    --post_name="$slug" \
    --post_title="$title" \
    --post_content="$content" \
    --post_status=publish \
    --porcelain \
    --path="$WP_PATH" \
    --allow-root
}

ensure_post() {
  title="$1"
  content="$2"

  existing_id="$(wp post list \
    --post_type=post \
    --fields=ID,post_title \
    --format=csv \
    --path="$WP_PATH" \
    --allow-root | awk -F, -v title="$title" 'NR > 1 && $2 == title { print $1; exit }' || true)"

  if [ -n "$existing_id" ]; then
    printf '%s\n' "$existing_id"
    return
  fi

  wp post create \
    --post_type=post \
    --post_title="$title" \
    --post_content="$content" \
    --post_status=publish \
    --porcelain \
    --path="$WP_PATH" \
    --allow-root
}

ensure_localized_entry() {
  post_type="$1"
  slug="$2"
  title="$3"
  excerpt="$4"
  locale="$5"
  location="${6:-}"
  date_label="${7:-}"

  existing_id="$(wp post list \
    --post_type="$post_type" \
    --name="$slug" \
    --field=ID \
    --path="$WP_PATH" \
    --allow-root || true)"

  if [ -n "$existing_id" ]; then
    wp post update "$existing_id" \
      --post_title="$title" \
      --post_excerpt="$excerpt" \
      --post_status=publish \
      --path="$WP_PATH" \
      --allow-root >/dev/null
  else
    existing_id="$(wp post create \
      --post_type="$post_type" \
      --post_name="$slug" \
      --post_title="$title" \
      --post_excerpt="$excerpt" \
      --post_status=publish \
      --porcelain \
      --path="$WP_PATH" \
      --allow-root)"
  fi

  wp post meta update "$existing_id" _awkn_locale "$locale" --path="$WP_PATH" --allow-root >/dev/null

  if [ -n "$location" ]; then
    wp post meta update "$existing_id" _awkn_location "$location" --path="$WP_PATH" --allow-root >/dev/null
  fi

  if [ -n "$date_label" ]; then
    wp post meta update "$existing_id" _awkn_date_label "$date_label" --path="$WP_PATH" --allow-root >/dev/null
  fi

  printf '%s\n' "$existing_id"
}

ensure_menu() {
  if ! wp menu list --fields=name --path="$WP_PATH" --allow-root | grep -Fxq "$PRIMARY_MENU"; then
    wp menu create "$PRIMARY_MENU" --path="$WP_PATH" --allow-root >/dev/null
  fi

  if ! wp menu list --fields=name --path="$WP_PATH" --allow-root | grep -Fxq "$FOOTER_LEGAL_MENU"; then
    wp menu create "$FOOTER_LEGAL_MENU" --path="$WP_PATH" --allow-root >/dev/null
  fi
}

ensure_menu_item() {
  menu_name="$1"
  title="$2"
  object_id="$3"

  if wp menu item list "$menu_name" --fields=title --path="$WP_PATH" --allow-root | grep -Fxq "$title"; then
    return
  fi

  wp menu item add-post "$menu_name" "$object_id" \
    --title="$title" \
    --path="$WP_PATH" \
    --allow-root >/dev/null
}

HOME_ID="$(ensure_page "home" "Home" "Awakening Network front page placeholder managed from WordPress.")"
ABOUT_ID="$(ensure_page "about" "About" "About page placeholder for the network story.")"
EVENTS_ID="$(ensure_page "events" "Events" "Events page placeholder for future WordPress-managed event listings.")"
CONTACT_ID="$(ensure_page "contact" "Contact" "Contact page placeholder for partnerships, speaking, and community conversations.")"
TERMS_ID="$(ensure_page "terms-of-use" "Terms of Use" "Terms of Use placeholder page for the headless footer.")"

ensure_post \
  "Test Event: Awakening Gathering" \
  "Sample event content created from WP-CLI to validate the Home/Events workflow and menu setup."

ensure_localized_entry \
  "awkn_resource" \
  "featured-teaching-series-en" \
  "Featured Teaching Series" \
  "A guided starting point for the themes, teachings, and spiritual imagination shaping the network." \
  "en"
ensure_localized_entry \
  "awkn_resource" \
  "formation-guides-en" \
  "Formation Guides and Devotionals" \
  "Practical rhythms, readings, and reflection tools for discipleship, prayer, and community life." \
  "en"
ensure_localized_entry \
  "awkn_resource" \
  "podcast-media-highlights-en" \
  "Podcast and Media Highlights" \
  "Featured conversations, films, and recorded moments that help new visitors understand the mission." \
  "en"
ensure_localized_entry \
  "awkn_resource" \
  "series-enseignements-fr" \
  "Serie d'enseignements" \
  "Un point d'entree guide pour les themes, enseignements et l'imaginaire spirituel du reseau." \
  "fr"
ensure_localized_entry \
  "awkn_resource" \
  "guides-formation-fr" \
  "Guides de formation et devotionnels" \
  "Des rythmes pratiques, lectures et outils de reflexion pour la vie de discipleship et de communaute." \
  "fr"
ensure_localized_entry \
  "awkn_resource" \
  "medias-podcast-fr" \
  "Temps forts podcast et medias" \
  "Des conversations, films et moments enregistres pour comprendre la mission plus rapidement." \
  "fr"
ensure_localized_entry \
  "awkn_event" \
  "awakening-gathering-en" \
  "Awakening Gathering" \
  "A regional gathering for renewal, worship, and embodied community around the central vision of Awakening Network." \
  "en" \
  "Franklin, TN" \
  "May 22-24, 2026"
ensure_localized_entry \
  "awkn_event" \
  "pilgrimage-weekend-en" \
  "Pilgrimage Weekend" \
  "A slower retreat-format experience designed for listening, prayer, and guided formation in place." \
  "en" \
  "Nashville, TN" \
  "June 13, 2026"
ensure_localized_entry \
  "awkn_event" \
  "rassemblement-eveil-fr" \
  "Rassemblement Eveil" \
  "Un rassemblement regional pour le renouveau, l'adoration et une communaute incarnee autour de la vision du reseau." \
  "fr" \
  "Montreal, QC" \
  "24-26 mai 2026"
ensure_localized_entry \
  "awkn_event" \
  "weekend-pelerinage-fr" \
  "Weekend Pelerinage" \
  "Une retraite plus lente pour l'ecoute, la priere et une formation guidee dans un lieu donne." \
  "fr" \
  "Quebec, QC" \
  "14 juin 2026"
ensure_localized_entry \
  "awkn_media" \
  "awakening-film-en" \
  "Awakening Film Release" \
  "A featured film release introducing the story, people, and spiritual heartbeat of the movement." \
  "en"
ensure_localized_entry \
  "awkn_media" \
  "pilgrimage-conversation-en" \
  "Pilgrimage Conversation" \
  "A recorded conversation exploring place, discipleship, and the slow work of renewal." \
  "en"
ensure_localized_entry \
  "awkn_media" \
  "film-eveil-fr" \
  "Sortie du film Eveil" \
  "Une sortie video mise en avant pour presenter l'histoire, les personnes et le coeur du mouvement." \
  "fr"
ensure_localized_entry \
  "awkn_media" \
  "conversation-pelerinage-fr" \
  "Conversation Pelerinage" \
  "Une conversation enregistree sur le lieu, la formation et le travail lent du renouveau." \
  "fr"

wp post meta update "$(wp post list --post_type=awkn_media --name=awakening-film-en --field=ID --path="$WP_PATH" --allow-root)" _awkn_source_label "YouTube" --path="$WP_PATH" --allow-root >/dev/null
wp post meta update "$(wp post list --post_type=awkn_media --name=awakening-film-en --field=ID --path="$WP_PATH" --allow-root)" _awkn_thumbnail_url "https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg" --path="$WP_PATH" --allow-root >/dev/null
wp post meta update "$(wp post list --post_type=awkn_media --name=awakening-film-en --field=ID --path="$WP_PATH" --allow-root)" _awkn_video_url "https://www.youtube.com/watch?v=dQw4w9WgXcQ" --path="$WP_PATH" --allow-root >/dev/null
wp post meta update "$(wp post list --post_type=awkn_media --name=pilgrimage-conversation-en --field=ID --path="$WP_PATH" --allow-root)" _awkn_source_label "YouTube" --path="$WP_PATH" --allow-root >/dev/null
wp post meta update "$(wp post list --post_type=awkn_media --name=pilgrimage-conversation-en --field=ID --path="$WP_PATH" --allow-root)" _awkn_thumbnail_url "https://i.ytimg.com/vi/aqz-KE-bpKQ/hqdefault.jpg" --path="$WP_PATH" --allow-root >/dev/null
wp post meta update "$(wp post list --post_type=awkn_media --name=pilgrimage-conversation-en --field=ID --path="$WP_PATH" --allow-root)" _awkn_video_url "https://www.youtube.com/watch?v=aqz-KE-bpKQ" --path="$WP_PATH" --allow-root >/dev/null
wp post meta update "$(wp post list --post_type=awkn_media --name=film-eveil-fr --field=ID --path="$WP_PATH" --allow-root)" _awkn_source_label "YouTube" --path="$WP_PATH" --allow-root >/dev/null
wp post meta update "$(wp post list --post_type=awkn_media --name=film-eveil-fr --field=ID --path="$WP_PATH" --allow-root)" _awkn_thumbnail_url "https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg" --path="$WP_PATH" --allow-root >/dev/null
wp post meta update "$(wp post list --post_type=awkn_media --name=film-eveil-fr --field=ID --path="$WP_PATH" --allow-root)" _awkn_video_url "https://www.youtube.com/watch?v=dQw4w9WgXcQ" --path="$WP_PATH" --allow-root >/dev/null
wp post meta update "$(wp post list --post_type=awkn_media --name=conversation-pelerinage-fr --field=ID --path="$WP_PATH" --allow-root)" _awkn_source_label "YouTube" --path="$WP_PATH" --allow-root >/dev/null
wp post meta update "$(wp post list --post_type=awkn_media --name=conversation-pelerinage-fr --field=ID --path="$WP_PATH" --allow-root)" _awkn_thumbnail_url "https://i.ytimg.com/vi/aqz-KE-bpKQ/hqdefault.jpg" --path="$WP_PATH" --allow-root >/dev/null
wp post meta update "$(wp post list --post_type=awkn_media --name=conversation-pelerinage-fr --field=ID --path="$WP_PATH" --allow-root)" _awkn_video_url "https://www.youtube.com/watch?v=aqz-KE-bpKQ" --path="$WP_PATH" --allow-root >/dev/null

wp option update show_on_front page --path="$WP_PATH" --allow-root >/dev/null
wp option update page_on_front "$HOME_ID" --path="$WP_PATH" --allow-root >/dev/null
wp option update awkn_logo_text "Awakening Network" --path="$WP_PATH" --allow-root >/dev/null
wp option update awkn_intro_video_url "https://www.youtube.com/watch?v=dQw4w9WgXcQ" --path="$WP_PATH" --allow-root >/dev/null
wp option update awkn_contact_email "hello@awakeningnetwork.org" --path="$WP_PATH" --allow-root >/dev/null
wp option update awkn_contact_phone "+1 (555) 010-2026" --path="$WP_PATH" --allow-root >/dev/null
wp option update awkn_instagram_url "https://instagram.com/awakeningnetwork" --path="$WP_PATH" --allow-root >/dev/null
wp option update awkn_youtube_url "https://youtube.com/@awakeningnetwork" --path="$WP_PATH" --allow-root >/dev/null
wp option update awkn_footer_tagline "Renewal, pilgrimage, belonging" --path="$WP_PATH" --allow-root >/dev/null
wp option update awkn_privacy_policy_url "http://localhost:8080/?page_id=3" --path="$WP_PATH" --allow-root >/dev/null
wp option update awkn_terms_url "http://localhost:8080/?page_id=$TERMS_ID" --path="$WP_PATH" --allow-root >/dev/null
wp option update awkn_home_hero_eyebrow "Main Topic" --path="$WP_PATH" --allow-root >/dev/null
wp option update awkn_home_hero_title "Awakening Network is the main story the website should tell." --path="$WP_PATH" --allow-root >/dev/null
wp option update awkn_home_hero_body "A public-facing home for renewal, formation, sacred gatherings, and the people carrying this movement forward. The website should feel like an invitation into a living mission, not a directory of internal apps." --path="$WP_PATH" --allow-root >/dev/null
wp option update awkn_home_hero_primary_cta_label "Watch the introduction" --path="$WP_PATH" --allow-root >/dev/null
wp option update awkn_home_hero_primary_cta_href "#video" --path="$WP_PATH" --allow-root >/dev/null
wp option update awkn_home_hero_secondary_cta_label "See upcoming events" --path="$WP_PATH" --allow-root >/dev/null
wp option update awkn_home_hero_secondary_cta_href "#events" --path="$WP_PATH" --allow-root >/dev/null
wp option update awkn_home_video_eyebrow "Main Intro Video" --path="$WP_PATH" --allow-root >/dev/null
wp option update awkn_home_video_title "A cinematic opening that introduces the network, the people, and the call." --path="$WP_PATH" --allow-root >/dev/null
wp option update awkn_home_video_body "This opening film area is managed through the headless contract so the frontend can stay custom while WordPress owns the content source." --path="$WP_PATH" --allow-root >/dev/null
wp option update awkn_home_story_eyebrow "About" --path="$WP_PATH" --allow-root >/dev/null
wp option update awkn_home_story_heading "A clear editorial homepage instead of stacked product cards." --path="$WP_PATH" --allow-root >/dev/null
wp option update awkn_home_story_body "The structure now makes space for story, formation, events, resources, contact, and future WordPress-backed content streams. This keeps the frontend beautiful and custom while the backend manages durable content structure." --path="$WP_PATH" --allow-root >/dev/null
wp option update awkn_home_story_flow_items "Hero and main introduction video
Mission and story-led explanation
Featured resources and media
Events and public invitations
Contact, newsletter, and footer utility links" --path="$WP_PATH" --allow-root >/dev/null
wp option update awkn_home_resources_eyebrow "Resources" --path="$WP_PATH" --allow-root >/dev/null
wp option update awkn_home_resources_heading "A natural place for featured teachings, media, and formation tools." --path="$WP_PATH" --allow-root >/dev/null
wp option update awkn_home_events_heading "Gatherings, retreats, and future WordPress-managed event listings." --path="$WP_PATH" --allow-root >/dev/null
wp option update awkn_home_event_location "Franklin, TN" --path="$WP_PATH" --allow-root >/dev/null
wp option update awkn_home_contact_eyebrow "Contact Us" --path="$WP_PATH" --allow-root >/dev/null
wp option update awkn_home_contact_heading "A clear closing section for invitations, partnerships, and next steps." --path="$WP_PATH" --allow-root >/dev/null
wp option update awkn_home_contact_body "This bottom section is intentionally positioned for contact details, newsletter signups, partnership requests, and WordPress-managed footer settings." --path="$WP_PATH" --allow-root >/dev/null
wp option update awkn_home_contact_location "Nashville / Franklin region" --path="$WP_PATH" --allow-root >/dev/null
wp option update awkn_home_contact_actions "Invite us to speak
Ask about upcoming events
Join the newsletter
Start a conversation with the team" --path="$WP_PATH" --allow-root >/dev/null
wp option update awkn_give_eyebrow "Give" --path="$WP_PATH" --allow-root >/dev/null
wp option update awkn_give_heading "Support the work of renewal with a direct gift." --path="$WP_PATH" --allow-root >/dev/null
wp option update awkn_give_body "Your generosity helps sustain gatherings, resources, and pastoral presence across the network." --path="$WP_PATH" --allow-root >/dev/null
wp option update awkn_give_success_message "Thank you. Your gift has been received and the team will follow up with a confirmation." --path="$WP_PATH" --allow-root >/dev/null
wp option update awkn_give_tiers "2500|Support One Family|Help fund pastoral care, formation, and local accompaniment.
7500|Sponsor a Gathering|Support the cost of space, worship, and welcome for regional events.
15000|Fuel the Mission|Invest in media, travel, and infrastructure for the wider work." --path="$WP_PATH" --allow-root >/dev/null
wp option update awkn_logo_text_fr "Reseau Eveil" --path="$WP_PATH" --allow-root >/dev/null
wp option update awkn_footer_tagline_fr "Renouveau, pelerinage, appartenance" --path="$WP_PATH" --allow-root >/dev/null
wp option update awkn_home_hero_eyebrow_fr "Sujet principal" --path="$WP_PATH" --allow-root >/dev/null
wp option update awkn_home_hero_title_fr "Awakening Network est l'histoire principale que le site doit raconter." --path="$WP_PATH" --allow-root >/dev/null
wp option update awkn_home_hero_body_fr "Une presence publique pour le renouveau, la formation, les rassemblements sacres et les personnes qui portent ce mouvement." --path="$WP_PATH" --allow-root >/dev/null
wp option update awkn_home_hero_primary_cta_label_fr "Voir l'introduction" --path="$WP_PATH" --allow-root >/dev/null
wp option update awkn_home_hero_secondary_cta_label_fr "Voir les evenements" --path="$WP_PATH" --allow-root >/dev/null
wp option update awkn_home_video_eyebrow_fr "Video d'introduction" --path="$WP_PATH" --allow-root >/dev/null
wp option update awkn_home_video_title_fr "Une ouverture cinematographique qui introduit le reseau, les personnes et l'appel." --path="$WP_PATH" --allow-root >/dev/null
wp option update awkn_home_story_eyebrow_fr "A propos" --path="$WP_PATH" --allow-root >/dev/null
wp option update awkn_home_story_heading_fr "Une page d'accueil editoriale plutot qu'une pile de cartes produit." --path="$WP_PATH" --allow-root >/dev/null
wp option update awkn_home_resources_eyebrow_fr "Ressources" --path="$WP_PATH" --allow-root >/dev/null
wp option update awkn_home_resources_heading_fr "Un lieu naturel pour les enseignements, medias et outils de formation." --path="$WP_PATH" --allow-root >/dev/null
wp option update awkn_home_events_heading_fr "Rassemblements, retraites et futurs evenements geres par WordPress." --path="$WP_PATH" --allow-root >/dev/null
wp option update awkn_home_contact_eyebrow_fr "Contact" --path="$WP_PATH" --allow-root >/dev/null
wp option update awkn_home_contact_heading_fr "Une section finale claire pour les invitations, partenariats et prochaines etapes." --path="$WP_PATH" --allow-root >/dev/null
wp option update awkn_give_eyebrow_fr "Donner" --path="$WP_PATH" --allow-root >/dev/null
wp option update awkn_give_heading_fr "Soutenez l'oeuvre de renouveau par un don direct." --path="$WP_PATH" --allow-root >/dev/null
wp option update awkn_give_body_fr "Votre generosite soutient les rassemblements, les ressources et la presence pastorale du reseau." --path="$WP_PATH" --allow-root >/dev/null
wp option update awkn_give_success_message_fr "Merci. Votre don a ete recu et l'equipe vous enverra une confirmation." --path="$WP_PATH" --allow-root >/dev/null
wp option update awkn_give_tiers_fr "2500|Soutenir une famille|Aidez a financer l'accompagnement pastoral, la formation et la presence locale.
7500|Soutenir un rassemblement|Contribuez aux espaces, a l'accueil et a l'adoration pour les rencontres regionales.
15000|Porter la mission|Investissez dans les medias, les deplacements et l'infrastructure de l'oeuvre." --path="$WP_PATH" --allow-root >/dev/null

ensure_menu
ensure_menu_item "$PRIMARY_MENU" "Home" "$HOME_ID"
ensure_menu_item "$PRIMARY_MENU" "About" "$ABOUT_ID"
ensure_menu_item "$PRIMARY_MENU" "Events" "$EVENTS_ID"
MEDIA_PAGE_ID="$(ensure_page "media" "Media" "Media page placeholder for future synced releases and videos.")"
ensure_menu_item "$PRIMARY_MENU" "Media" "$MEDIA_PAGE_ID"
ensure_menu_item "$PRIMARY_MENU" "Contact" "$CONTACT_ID"
ensure_menu_item "$FOOTER_LEGAL_MENU" "Privacy Policy" "3"
ensure_menu_item "$FOOTER_LEGAL_MENU" "Terms of Use" "$TERMS_ID"

wp menu location assign "$PRIMARY_MENU" primary_menu --path="$WP_PATH" --allow-root >/dev/null
wp menu location assign "$FOOTER_LEGAL_MENU" footer_legal --path="$WP_PATH" --allow-root >/dev/null

printf 'Seeded Home=%s About=%s Events=%s Contact=%s\n' "$HOME_ID" "$ABOUT_ID" "$EVENTS_ID" "$CONTACT_ID"

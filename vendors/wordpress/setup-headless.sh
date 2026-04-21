#!/bin/bash

# Wait for WordPress to be ready
echo "Waiting for WordPress to initialize..."
sleep 15

# Install and activate the headless plugin stack
# Note: wp-graphql-acf and wp-graphql-yoast connect your data to the API
wp plugin install \
    wp-graphql \
    advanced-custom-fields \
    headless-mode \
    wp-graphql-acf \
    wp-graphql-smart-cache \
    wordpress-seo \
    wp-graphql-yoast-seo \
    --activate --allow-root

echo "Headless setup complete!"

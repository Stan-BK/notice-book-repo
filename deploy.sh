#!/bin/bash

set -e  # Exit on any error

echo "Updating git submodules..."
git submodule update --init --recursive

echo "Deploying notice-book to Cloudflare Pages..."
(
    cd ./notice-book
    pnpm install
    pnpm run build
    pnpx wrangler pages deploy
)

echo "Installing dependencies and deploying notice worker..."
(
    cd ./notice
    pnpm install
    pnpx wrangler deploy
)

echo "Deployment completed successfully!"
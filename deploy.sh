#!/bin/bash

git submodule update --init --recursive

(
    cd ./notice-book
    pnpx wrangler pages deploy ./dist/ --branch=main
) &

(
    cd ./notice
    pnpm install
    pnpx wrangler deploy
) &

wait
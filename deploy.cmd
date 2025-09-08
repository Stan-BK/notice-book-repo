git submodule update --init --recursive

start "Deploy Frontend" cmd /c "cd ./notice-book && pnpm install && pnpx wrangler pages deploy ./dist/ --branch=main"

start "Deploy Backend" cmd /k "cd ./notice && pnpm install && pnpx wrangler deploy"
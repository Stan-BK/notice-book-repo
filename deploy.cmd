git submodule update --init --recursive

start "Deploy Frontend" cmd /c "cd ./notice-book && pnpm install && pnpm build && pnpx wrangler pages deploy"

start "Deploy Backend" cmd /k "cd ./notice && pnpm install && pnpx wrangler deploy"
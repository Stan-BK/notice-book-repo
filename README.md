<p align="center">
    <img width="192" height="192" alt="notice-192x192" src="https://github.com/user-attachments/assets/16afaba2-c6c4-4d1d-a93a-8f5c5b4f6397" />
</p>

# notice-book-repo
`Notice-Book` is a reminding application focus on nearly three day and perform as PWA. 
Base on [`Push` API](https://developer.mozilla.org/en-US/docs/Web/API/Push_API) and a couple of Cloudflare services like `Worker`, `Pages`(optional),`KV`. Feel free to deploy this app by following guidances.

> This repo is composition of `Notice-Book` application. 

<img width="1024" alt="image" src="https://github.com/user-attachments/assets/4ead95ed-ffd7-4889-abde-dd832ff446bf" />

### deployment
U can deploy automatically or manually

## Auto Deploy with .env Configuration

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` file and fill in your configuration:
   ```bash
   # Your domain (e.g., https://www.example.com)
   YOUR_DOMAIN=https://www.example.com
   
   # Your Cloudflare KV namespace ID
   # You need to create kv namespace in Cloudflare and keep its name as `Notice-Book`
   YOUR_KV_NAMESPACE_ID=your_kv_namespace_id_here
   ```

3. Run the deployment script:
   ```bash
   pnpm run deploy
   ```

The script will automatically read your configuration from `.env` file and deploy both frontend and backend.

If you haven't configured the `.env` file, the script will prompt you to enter the configuration interactively.

## Manually
### notice
Application's server that base on `Cloudflare Worker` service. 

1. Login `Cloudflare` dashboard to Deploy this repo as `Cloudflare Worker`.

2. Self host route is needed and remained like '{your hostname}/worker/*':
<img width="512" alt="WechatIMG6" src="https://github.com/user-attachments/assets/6af971b4-9904-4cf5-9b2b-0a7dad01f515" />

3. Create a KV namespace and setted as `Notice-Book`:
<img width="512" alt="image" src="https://github.com/user-attachments/assets/c0f3db7f-fcf9-4733-a2d8-5c4ae17c3a56" />

5. Bindging KV namespace to worker:
<img width="512" alt="image" src="https://github.com/user-attachments/assets/d3d9846c-98c5-4708-a67a-618bd3cb9577" />

It‘s done😆. Now U can move to easily deploy frontend of `Notice-Book` app, cron trigger is automatically enabled for handling notices updating and pushing.

### notice-book
Application's frontend that deploys on `Cloudflare Pages`.
> Make sure this repo is deploying on the same site of `notice` service.

1. Deploy as static site with build command and dedicate deployment directory:
```
Build command:
  pnpm run build
Build output:
  dist
```

2. Binding env variable like:
```
SUBSCRIPTION_PATH=‘[your service's domain]/worker’
```
`Cloudflare Pages` has a user-friendly settings window:

<img width="512" height="170" alt="image" src="https://github.com/user-attachments/assets/7d1bfe74-d174-4ee8-8f31-6d2c1b9b1355" />

All is done👏. Making ur nearly day plan and enable notification!

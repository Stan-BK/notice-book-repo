<p align="center">
    <img width="192" height="192" alt="notice-192x192" src="https://github.com/user-attachments/assets/16afaba2-c6c4-4d1d-a93a-8f5c5b4f6397" />
</p>

# notice-book-repo
`Notice-Book` is a reminding application focus on nearly three day and perform as PWA. 
Base on [`Push` API](https://developer.mozilla.org/en-US/docs/Web/API/Push_API) and a couple of Cloudflare services like `Worker`, `Pages`(optional),`KV`. Feel free to deploy this app by following guidances.

> This repo is composition of `Notice-Book` application. 

<img width="1024" alt="Snipaste_2025-08-01_11-43-26" src="https://github.com/user-attachments/assets/56da9f49-a3b7-4fad-b8bf-1d22238cd48b" />

## notice
Application's server that base on `Cloudflare Worker` service. 
### configuration
1. Login `Cloudflare` dashboard to Deploy this repo as `Cloudflare Worker`.

2. Self host route is needed and remained like '{your hostname}/worker/*':
<img width="512" alt="WechatIMG6" src="https://github.com/user-attachments/assets/6af971b4-9904-4cf5-9b2b-0a7dad01f515" />

3. Create a KV namespace and setted as `Notice-Book`:
<img width="512" alt="image" src="https://github.com/user-attachments/assets/2a7cf12e-5c0a-4600-9566-9d6dbadd5085" />

4. Bindging KV namespace to worker:
<img width="512" alt="image" src="https://github.com/user-attachments/assets/d3d9846c-98c5-4708-a67a-618bd3cb9577" />


It‘s done😆. Now U can move to easily deploy frontend of `Notice-Book` app, cron trigger is automatically enabled for handling notices updating and pushing.

## notice-book
Application's frontend that deploys on any static-site-host service providers.
> Make sure this repo is deploying on the same site of `notice` service.

### configuration
Thats a example of `Cloudflare Pages`:

1. Deploy as static site with build command and dedicate deployment directory:
```
Build command:
  pnpm run build
Build output:
  dist
```

2. Binding env variable like:
```
VITE_SUBSCRIPTION_PATH=‘{your notice service's hostname}/worker’
```
`Cloudflare Pages` has a user-friendly settings window:

<img width="512" alt="image" src="https://github.com/user-attachments/assets/c9fd6b25-3a3a-41e0-a48b-2bb9d07bc198" />

All is done👏。Making ur nearly day plan and enable notification!

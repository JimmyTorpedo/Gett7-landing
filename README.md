# Gett7 — Go somewhere, do something

**Gett7** is a map-first event discovery platform. Find events, create moments, and connect with your city — and the world. 🌍

## Features

- 🗺️ **Discover on the Map** — Find events near you visually.
- ➕ **Create Any Event** — Spontaneous meetups or massive festivals.
- 🌍 **Scaling Globally** — Starting in Madeira, expanding everywhere.

## Development & Deployment

This project is built with pure HTML, CSS, and Vanilla JavaScript. No build steps required.

### 1. Local Development
Just open `index.html` in your browser.

### 2. Form Setup (Lead Collection)
The forms are configured to work with **Formspree**.
1. Create a form at [formspree.io](https://formspree.io/).
2. Copy your **Form ID**.
3. Open `script.js` and replace `YOUR_FORM_ID` with your actual ID on line 66:
   ```javascript
   const FORMSPREE_ENDPOINT = 'https://formspree.io/f/YOUR_FORM_ID';
   ```

### 3. Deploy to Vercel
1. Install Vercel CLI: `npm i -g vercel` (optional) or use the Vercel dashboard.
2. Link your GitHub repository to Vercel.
3. Vercel will automatically detect the `vercel.json` and deploy.

### 4. Custom Domain
1. In the Vercel dashboard, go to **Settings > Domains**.
2. Add `gett7.world`.
3. Follow the DNS instructions provided by Vercel.

## License
MIT License

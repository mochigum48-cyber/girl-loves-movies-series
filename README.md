# Girl Loves Movies & Series — Telegram Mini App Starter

## What is included
- Responsive pink Telegram Mini App interface: Home, Explore, Series Detail, Episodes, Favorites, Profile.
- Demo series so the interface can be previewed before connecting the database.
- Node.js + Express + MongoDB backend.
- Admin login and Series add/edit/delete.
- Poster and banner image URL fields.
- Gallery image upload endpoint using Cloudinary.

## Setup
1. Install Node.js 20+ on a computer or use a supported cloud IDE.
2. Copy `.env.example` to `.env`.
3. Add MongoDB Atlas connection string, a long random JWT secret, admin username and password.
4. For Gallery uploads, add Cloudinary credentials. URL entry does not require Cloudinary.
5. Run `npm install` then `npm start`.
6. Deploy to a host with a public HTTPS URL, then connect that URL to your Telegram bot's Mini App settings in BotFather.

## Security
Never commit `.env`. Keep Telegram bot token, MongoDB URI and admin password in hosting environment variables. Do not send them in chat.

## Next development steps
- Configure Telegram bot launch button and validate Telegram initData on the server.
- Add episode create/edit/delete screen.
- Add secure private-channel membership verification (bot must be an administrator in the channel).
- Connect real episode post links.
- Test on Telegram Android before planning APK packaging.

## Notes
Free hosting may sleep when inactive. Cloudinary credentials are needed for actual Gallery uploads. The project is a starter, not production-ready yet. Private channel membership verification is not implemented in this starter.

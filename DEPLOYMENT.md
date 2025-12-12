# Deployment Guide - CarPool Frontend

## Netlify Deployment (Static React build)

1. Go to https://app.netlify.com/start
2. Connect GitHub and select `omdubey31/carpool`
3. Configure build:
   - Base directory: `client`
   - Build command: `npm run build`
   - Publish directory: `client/build`
4. (If backend is remote) Add env var: `REACT_APP_API_URL` = your backend URL
5. Deploy

## Backend API Configuration

The frontend needs an API. Options:

- Deploy the backend (`server/`) to Render, Railway, Heroku, or any Node host.
- Set `REACT_APP_API_URL` in your hosting platform to the deployed backend URL.

## Local Development

- Backend: `cd server && npm run dev` (defaults to http://localhost:5000)
- Frontend: `cd client && npm start` (defaults to http://localhost:3000)

## Troubleshooting

- API calls failing: ensure `REACT_APP_API_URL` points to your backend.
- Build errors: confirm dependencies are installed and build command is `npm run build`.


# Thank You Note Generator

A web application that helps you create personalized thank you cards with AI-generated messages, custom designs, and printable labels.

## Features
- AI-generated personalized thank you messages
- Custom card designs with multiple patterns and fonts
- Printable address labels (Avery 5160 format)
- Custom envelope seals
- CSV import for guest lists

## Deployment

This site is deployed on Netlify with secure serverless functions.

### Environment Variables Required:
- `ANTHROPIC_API_KEY` - Your Claude API key
- `GOOGLE_PLACES_API_KEY` - Your Google Places API key (coming soon)

## Local Development

1. Install Netlify CLI: `npm install -g netlify-cli`
2. Run locally: `netlify dev`
3. Open `http://localhost:8888`

## Live Site
https://thank-you-note-generator.netlify.app (or your custom domain)

# Tailor AI Agent 🤖

AI-powered WhatsApp chatbot for tailor shops.

## Features

- 24/7 WhatsApp availability
- Instant price quotes
- Order status tracking
- Appointment booking
- Measurement guide
- Customer database
- Google Sheets integration

## Quick Start

### Installation
```bash
npm install
```

### Setup

1. Copy `.env.example` to `.env`
2. Add your API keys
3. Start server:
```bash
npm start
```

### Usage

Test the API:
```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"phone": "919876543210", "message": "Price kitne hain?"}'
```

## Deployment

### Heroku
```bash
heroku create your-app-name
git push heroku main
```

### Railway.app
1. Push to GitHub
2. Go to railway.app
3. New Project → Deploy from GitHub
4. Add environment variables
5. Deploy!

## API Endpoints

- `POST /api/chat` - Send message
- `GET /api/customer/:phone` - Get customer info
- `GET /health` - Health check

## Pricing

- **Basic:** ₹4,999 (one-time) + ₹999/month
- **Pro:** ₹9,999 + ₹999/month
- **Premium:** ₹19,999 + ₹999/month

## Support

Contact: your-email@example.com

## License

MIT

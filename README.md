# FruitAI - Freshness Analyzer

An AI-powered web application that analyzes the freshness of fruits and vegetables from photos, providing smart recommendations for grocery shopping.

## Features

- 🤖 **AI-Powered Analysis**: Advanced image analysis to detect freshness indicators
- 📊 **Freshness Scoring**: Comprehensive rating system (0-100%)
- 🎯 **Smart Recommendations**: Get "buy", "check", or "avoid" recommendations
- 🔍 **Detailed Analysis**: Color, texture, blemishes, and ripeness assessment
- 🔐 **Secure Authentication**: Powered by Clerk for user management
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile devices
- ⚡ **Fast Performance**: Optimized for quick analysis and smooth user experience

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: Clerk
- **Icons**: Lucide React
- **Deployment**: Railway
- **AI Analysis**: OpenAI Vision API for accurate fruit detection

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Clerk account for authentication

### Installation

1. Clone the repository:
   ```bash
   git clone <your-repo-url>
   cd fruitai-freshness
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env.local
   ```
   
   Fill in your Clerk credentials and OpenAI API key:
   ```
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   CLERK_SECRET_KEY=your_clerk_secret_key
   CLERK_WEBHOOK_SECRET=your_webhook_secret
   OPENAI_API_KEY=your_openai_api_key
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build:prod
npm start
```

## Deployment

This application is configured for deployment on Railway:

1. Connect your GitHub repository to Railway
2. Add environment variables in Railway dashboard
3. Deploy automatically on push to main branch

### Environment Variables for Production

Set these in your Railway environment:

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_Y2xlcmsuZnJ1aXRhaS5vcmck
CLERK_SECRET_KEY=sk_live_vaE2p7BZsAd3GmplhsG3ajUXyJBLmYtfHQ4zg3aUiX
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/
CLERK_WEBHOOK_SECRET=whsec_3JdYlttIcnLRcm1fejLVOQiUyHZnqU+Y
OPENAI_API_KEY=your_openai_api_key_here
```

## Usage

1. **Sign Up/Sign In**: Create an account or sign in with Clerk authentication
2. **Upload Image**: Take or upload a clear photo of fruits or vegetables
3. **Get Analysis**: Click "Analyze Freshness" to get AI-powered results
4. **Review Results**: See freshness score, recommendation, and detailed analysis
5. **Make Smart Decisions**: Use the insights for informed grocery shopping

## API Endpoints

- `POST /api/analyze` - Analyze uploaded fruit/vegetable images

## Future Enhancements

- Support for multiple items in one image
- Historical analysis tracking
- Shopping list recommendations
- Mobile app development
- Offline analysis capabilities

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email support@fruitai.com or open an issue on GitHub.
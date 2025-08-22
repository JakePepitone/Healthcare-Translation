# Healthcare Translation App Setup

## Prerequisites
- Node.js (version 18 or higher)
- OpenAI API key

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure OpenAI API Key
1. Get your OpenAI API key from [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys)
2. Create a `.env.local` file in the root directory:
   ```bash
   cp env.example .env.local
   ```
3. Edit `.env.local` and replace `your_openai_api_key_here` with your actual OpenAI API key:
   ```
   OPENAI_API_KEY=sk-your-actual-api-key-here
   ```

### 3. Run the Development Server
```bash
npm run dev
```

### 4. Test the Application
1. Open [http://localhost:3000](http://localhost:3000) in your browser
2. Select input and output languages
3. Enter text to translate
4. Click "Translate"

## Troubleshooting

### Common Issues:

1. **"OpenAI API key is not configured"**
   - Make sure you have created `.env.local` file
   - Verify your API key is correct
   - Restart the development server after adding the environment variable

2. **"Translation failed"**
   - Check your OpenAI API key is valid
   - Ensure you have sufficient credits in your OpenAI account
   - Check the browser console and server logs for detailed error messages

3. **API Route Not Found**
   - Make sure the development server is running
   - Verify the API route path matches `/api/Translate`

## Features
- Translate between multiple languages
- Healthcare-focused translation
- Real-time translation using OpenAI GPT-3.5-turbo
- Error handling and user feedback 
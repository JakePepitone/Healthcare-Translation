# Healthcare Translation Assistant

A real-time, multilingual translation application designed specifically for healthcare communication between patients and healthcare providers. This application converts spoken input into text, provides live transcription, and offers translated versions with audio playback.

## 🚀 Features

### Core Functionalities
- **Voice-to-Text with AI Enhancement**: Real-time speech recognition with enhanced accuracy for medical terminology
- **Real-Time Translation**: Instant translation using OpenAI's GPT-3.5-turbo with healthcare-specific optimization
- **Audio Playback**: Text-to-speech functionality for translated content
- **Mobile-First Design**: Responsive design optimized for both mobile and desktop use

### User Interface
- **Dual Transcript Display**: Side-by-side view of original and translated transcripts
- **Speak Button**: Easy audio playback of translated text
- **Language Selection**: Comprehensive language options for input and output
- **Translation History**: Persistent record of all translations with timestamps

### Technical Features
- **Speech Recognition**: Web Speech API integration for real-time voice input
- **AI Translation**: OpenAI GPT-3.5-turbo for accurate medical translations
- **Speech Synthesis**: Built-in text-to-speech for audio output
- **Rate Limiting**: Built-in protection against API rate limits
- **Error Handling**: Comprehensive error management and user feedback

## 🛠️ Technology Stack

- **Frontend**: Next.js 15.5.0 with React 19
- **Styling**: Tailwind CSS 4
- **Speech Recognition**: Web Speech API
- **Translation**: OpenAI GPT-3.5-turbo
- **Speech Synthesis**: Web Speech Synthesis API
- **Deployment**: Vercel-ready

## 📋 Prerequisites

- Node.js (version 18 or higher)
- OpenAI API key with available credits
- Modern browser with Web Speech API support (Chrome, Safari, Edge)

## 🚀 Quick Start

### 1. Clone and Install
```bash
git clone <repository-url>
cd healthcare-translation
npm install
```

### 2. Configure OpenAI API
1. Get your OpenAI API key from [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys)
2. Create a `.env.local` file:
   ```bash
   cp env.example .env.local
   ```
3. Add your API key to `.env.local`:
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   ```

### 3. Run Development Server
```bash
npm run dev
```

### 4. Access the Application
Open [http://localhost:3000](http://localhost:3000) in your browser

## 🎯 How to Use

1. **Select Languages**: Choose your input (voice) and output (translation) languages
2. **Start Recording**: Click the "Start Recording" button and speak clearly
3. **View Transcript**: See your speech transcribed in real-time
4. **Translate**: Click "Translate" to get the AI-powered translation
5. **Listen**: Use the "Speak" button to hear the translated text
6. **Review History**: All translations are saved with timestamps

## 🌐 Supported Languages

### Input Languages (Voice Recognition)
- English (US)
- Spanish
- French
- German
- Italian
- Portuguese (Brazil)
- Russian
- Chinese (Simplified)
- Japanese
- Korean
- Arabic
- Hindi

### Output Languages (Translation)
- English
- Spanish
- French
- German
- Italian
- Portuguese
- Russian
- Chinese
- Japanese
- Korean
- Arabic
- Hindi

## 🔧 Configuration

### Environment Variables
- `OPENAI_API_KEY`: Your OpenAI API key (required)

### Rate Limiting
- Default: 10 requests per minute per IP
- Configurable in `app/api/Translate/route.ts`

## 🚀 Deployment

### Vercel Deployment
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add your `OPENAI_API_KEY` to Vercel environment variables
4. Deploy

### Other Platforms
The app is compatible with any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 🔒 Security & Privacy

### Data Privacy
- No audio data is stored on servers
- Transcripts are only stored locally in the browser
- OpenAI API calls are made directly from the client
- No patient data is logged or persisted

### HIPAA Considerations
- This is a prototype and should be enhanced for clinical use
- Consider implementing additional security measures for production
- Ensure compliance with local healthcare data regulations

## 🐛 Troubleshooting

### Common Issues

1. **"Speech recognition not supported"**
   - Use a modern browser (Chrome, Safari, Edge)
   - Ensure microphone permissions are granted

2. **"OpenAI quota exceeded"**
   - Add credits to your OpenAI account
   - Check usage at [https://platform.openai.com/usage](https://platform.openai.com/usage)

3. **Translation fails**
   - Verify your OpenAI API key is correct
   - Check your internet connection
   - Ensure you have available API credits

4. **Audio playback issues**
   - Check browser audio permissions
   - Try refreshing the page
   - Use a different browser

### Browser Compatibility
- **Chrome**: Full support
- **Safari**: Full support
- **Firefox**: Limited speech recognition support
- **Edge**: Full support

## 📱 Mobile Optimization

The application is fully responsive and optimized for mobile devices:
- Touch-friendly interface
- Optimized button sizes
- Responsive layout
- Mobile-optimized speech recognition

## 🔮 Future Enhancements

- [ ] Offline translation capabilities
- [ ] Custom medical terminology dictionaries
- [ ] Multi-user session support
- [ ] Integration with EHR systems
- [ ] Advanced audio processing
- [ ] Real-time conversation mode
- [ ] Export functionality for medical records

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

For support or questions:
- Create an issue in the repository
- Check the troubleshooting section
- Review the documentation

---

**Note**: This application is designed as a prototype for healthcare translation. For clinical use, additional security, compliance, and reliability measures should be implemented.

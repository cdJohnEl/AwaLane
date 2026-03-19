# AwaLane 🇳🇬

**AwaLane** is an AI-powered niche discovery dashboard designed specifically for Nigerian content creators. It helps you stop copying what everyone else is doing and find "open lanes"—underserved content niches with high growth potential on TikTok, YouTube, and Instagram.

---

## ✨ Features

- **🔍 AI-Powered Discovery**: Enter any content idea, and AwaLane uses Groq's high-performance AI (Llama 3.3) to analyze 6-8 specific, high-potential niches.
- **📊 Real-Time Data Integration**:
  - **YouTube Data API**: Live trending videos in Nigeria, search competition analysis
  - **Google Trends API**: Daily and real-time search trends for Nigerian audience
  - All niche suggestions are grounded in actual market data
- **📈 Live Trending Ideas**: Automatic, real-time analysis of current Nigerian social media trends displayed right on the landing page.
- **🌍 Cultural Relevance**: Insights are tailored to Nigerian culture, including Pidgin English angles, local trends, and underserved local audiences.
- **📱 Platform-Specific Analysis**: Filter insights by TikTok, YouTube, or Instagram to find the best fit for your content style.
- **💎 Content Twists**: Every niche suggestion comes with 4 actionable "twists" or content ideas to help you start creating immediately.

---

## 🚀 Tech Stack

- **Framework**: [Next.js 15+](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **AI Engine**: [Groq Cloud](https://groq.com/) (Llama 3.3 70B Versatile)
- **Real-Time Data**:
  - [YouTube Data API v3](https://developers.google.com/youtube/v3) - Free tier (10,000 units/day)
  - [Google Trends API](https://github.com/pat310/google-trends-api) - Community library
- **Icons**: [Lucide React](https://lucide.dev/)

---

## 🛠️ Setup & Installation

### 1. Prerequisites
- Node.js 20+ installed.
- A Groq API Key (get one at [console.groq.com](https://console.groq.com/)).
- A YouTube Data API Key (get one at [console.cloud.google.com](https://console.cloud.google.com/)).

### 2. Clone and Install
```bash
git clone <repository-url>
cd niche-discovery-dashboard
npm install
```

### 3. Environment Variables
Create a `.env.local` file in the root directory and add your API keys:
```env
GROQ_API_KEY=your_gsk_api_key_here
YOUTUBE_DATA_API_KEY=your_youtube_api_key_here
```

**API Keys Guide:**
- **Groq API Key**: Sign up at [console.groq.com](https://console.groq.com/) - Free tier available
- **YouTube Data API Key**:
  1. Go to [Google Cloud Console](https://console.cloud.google.com/)
  2. Create a new project
  3. Enable YouTube Data API v3
  4. Create credentials (API Key)
  5. Free tier: 10,000 units/day (plenty for this app!)

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to see AwaLane in action.

---

## 🛡️ Verification & Reliability

AwaLane is built with robust error handling and performance optimizations:
- **Hydration Fixed**: Consistent SSR and client-side rendering for a smooth first-load experience.
- **AI Fallbacks**: In case of API limits or outages, the system gracefully handles errors with detailed logging.
- **Mock Data**: Pre-integrated sample data for testing without live API calls.

---

## 📄 License

Made with ❤️ for Nigerian creators.
Designed to help you find your unique voice.

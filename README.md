# AwaLane 🇳🇬

**AwaLane** is an AI-powered niche discovery dashboard designed specifically for Nigerian content creators. It helps you stop copying what everyone else is doing and find "open lanes"—underserved content niches with high growth potential on TikTok, YouTube, and Instagram.

---

## ✨ Features

- **🔍 AI-Powered Discovery**: Enter any content idea, and AwaLane uses Groq's high-performance AI (Llama 3.3) to analyze 6-8 specific, high-potential niches.
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
- **Icons**: [Lucide React](https://lucide.dev/)

---

## 🛠️ Setup & Installation

### 1. Prerequisites
- Node.js 20+ installed.
- A Groq API Key (get one at [console.groq.com](https://console.groq.com/)).

### 2. Clone and Install
```bash
git clone <repository-url>
cd niche-discovery-dashboard
npm install
```

### 3. Environment Variables
Create a `.env.local` file in the root directory and add your Groq API key:
```env
GROQ_API_KEY=your_gsk_api_key_here
```

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

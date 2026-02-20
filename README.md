# 🌾 KrishiIntel

Link - https://krishiintel.netlify.app/

## AI-Powered Government Scheme Discovery Platform

KrishiIntel is a Human + Machine decision-support system that helps farmers discover government schemes they are eligible for. It analyzes farmer profiles using structured eligibility rules and provides explainable recommendations with confidence scores.

---

## 🚀 Features

- Farmer profile registration  
- Structured scheme database  
- Rule-based eligibility engine  
- Top 3 ranked recommendations  
- Explainable reasoning output  
- Confidence score (0–100%)  
- Multilingual support (English, Hindi, Marathi)  
- Text-to-speech support  
- Offline local storage backup  
- Mobile-friendly rural UI  

---

## 🧠 How It Works

Farmer Profile → Eligibility Matching → Scoring → Ranked Schemes → Explanation → Dashboard  

The system assists farmers in decision-making without automating approvals.

---

## 🏗️ Tech Stack

- **Frontend:** React + TypeScript + Vite  
- **UI Components:** shadcn/ui + Tailwind CSS  
- **Routing:** React Router v6  
- **State / Data Fetching:** TanStack React Query  
- **Forms:** React Hook Form + Zod  
- **Testing:** Vitest + React Testing Library  

---

## 📋 Prerequisites

Make sure the following are installed on your machine before you begin:

| Tool | Minimum Version | Download |
|------|----------------|---------|
| Node.js | 18.x or higher | https://nodejs.org |
| npm | 9.x or higher | bundled with Node.js |
| Git | any recent version | https://git-scm.com |

---

## ⚡ Getting Started — Step by Step

### Step 1 — Clone the repository

```bash
git clone https://github.com/Sujal-04/krishiintel.git
cd krishiintel
```

### Step 2 — Install dependencies

```bash
npm install
```

### Step 3 — Start the development server

```bash
npm run dev
```

The app will be available at **http://localhost:8080** in your browser.

### Step 4 — Explore the app

Open your browser and try the following pages:

| URL | Description |
|-----|-------------|
| `/` | Home / landing page |
| `/profile` | Fill in your farmer profile |
| `/recommendations` | View matched government schemes |
| `/schemes` | Browse all available schemes |
| `/documents` | Upload supporting documents |
| `/admin` | Admin dashboard |

---

## 🧪 Running Tests

```bash
npm run test
```

To run tests in watch mode (re-runs on file save):

```bash
npm run test:watch
```

---

## 🔍 Linting

Check the codebase for style and correctness issues:

```bash
npm run lint
```

---

## 🏗️ Build for Production

```bash
npm run build
```

The compiled output is placed in the `dist/` folder.  
To preview the production build locally:

```bash
npm run preview
```

---

## 📁 Project Structure

```
krishiintel/
├── public/               # Static assets
├── src/
│   ├── assets/           # Images and media
│   ├── components/       # Reusable UI components
│   │   └── ui/           # shadcn/ui primitives
│   ├── contexts/         # React context providers (e.g. language)
│   ├── data/             # Static data (schemes, translations)
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utility functions
│   ├── pages/            # Route-level page components
│   ├── services/         # Business logic (eligibility, OCR, profile)
│   ├── test/             # Test files
│   ├── types/            # TypeScript type definitions
│   ├── App.tsx           # Root component & router setup
│   └── main.tsx          # Application entry point
├── index.html            # HTML entry point
├── package.json          # Dependencies and scripts
├── tailwind.config.ts    # Tailwind CSS configuration
├── vite.config.ts        # Vite build configuration
└── vitest.config.ts      # Vitest test configuration
```

---

## 🤝 Contributing

1. Fork the repository  
2. Create a feature branch: `git checkout -b feature/your-feature-name`  
3. Make your changes and commit: `git commit -m "feat: describe your change"`  
4. Push the branch: `git push origin feature/your-feature-name`  
5. Open a Pull Request on GitHub  

---

## 📌 Purpose

KrishiIntel simplifies complex government scheme eligibility rules into a transparent, intelligent, and accessible rural decision platform.

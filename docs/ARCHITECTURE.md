# System Architecture Document

## 1. Tech Stack
- **Framework**: React 19 + Vite 8
- **Styling**: Tailwind CSS v4 + Custom Glassmorphism Utilities
- **Icons**: Lucide React
- **Data Format**: Local JSON (`prompts.json`)
- **Backend / Database**: Supabase (PostgreSQL + RLS + Client SDK `@supabase/supabase-js`)
- **State Management**: React Hooks (`useState`, `useEffect`) + Supabase / `localStorage` Fallback

## 2. Struktur Komponen (Component Hierarchy)
```
index.html
└── src/main.jsx
    └── src/App.jsx (Root State & Layout)
        ├── Header (Search, Title, Credit Balance, Top Up Action)
        ├── Hero Stats (Total Prompts, Premium Count, Categories Count)
        ├── Category Filter Pills
        ├── Pinterest Grid Container
        │   └── PromptCard.jsx (Item Preview, Badges, Hover Effects)
        ├── PromptModal.jsx (Variable Form, Compiled View, Copy & Deduct Action)
        ├── PremiumModal.jsx (Top-Up Package Selection & Sandbox Checkout)
        └── AuthModal.jsx (Supabase Email & Password Login / Register Modal)
```

## 3. Data Flow Diagram (DFD)
```
[ User Interaction ]
       │
       ├── Search / Filter  ──> Updates App State (filteredPrompts) ──> Re-renders Grid
       │
       ├── Click Card       ──> Sets activePrompt State             ──> Opens PromptModal
       │
       ├── Edit Variables   ──> Triggers Regex Compiler             ──> Live Update Compiled Prompt
       │
       ├── Copy Action      ──> Checks userCredits >= 100
       │                        ├── YES: Deducts 100 Credits & Copies to Clipboard
       │                        └── NO:  Triggers Error Alert & Open PremiumModal
       │
       └── Top Up Action    ──> Selects Plan (Rp 5.000) ──> Sandbox Delay ──> Adds +1500 Credits ──> Saves LocalStorage
```

# CareerGrowth AI

AI-powered career preparation platform for resume analysis, job matching, mock interviews, coding assessments, and personalized learning roadmaps.

---

## 🛠️ Technologies Used

* **Language:** TypeScript
* **Framework:** Next.js
* **Frontend:** React + Tailwind CSS
* **Backend:** Next.js API Routes + Node.js
* **Database:** PostgreSQL / Neon
* **ORM:** Prisma
* **Authentication:** Clerk
* **AI:** Groq API
* **Code Editor:** Monaco Editor

> **Python is NOT required. This project uses Node.js and TypeScript.**

---

# 📦 1. Software You Need to Install

Before running the project, install the following:

### 1. Node.js

Download and install Node.js:

https://nodejs.org/

After installation, check:

```bash
node -v
npm -v
```

You should see the installed versions.

---

### 2. Git

Git is required if you are downloading the project from GitHub.

Download:

https://git-scm.com/

Check installation:

```bash
git --version
```

> If you downloaded the project as a ZIP file, Git is optional.

---

# 📥 2. Download the Project

### Option A — GitHub

Open your terminal:

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
```

Then:

```bash
cd career_growth_ai
```

### Option B — ZIP File

1. Download the ZIP file.
2. Extract the ZIP.
3. Open the extracted `career_growth_ai` folder.
4. Open PowerShell / Command Prompt in this folder.

---

# 📂 3. Project Folder Structure

The main project structure is:

```text
career_growth_ai/
│
├── app/
│   ├── (auth)/
│   │   ├── sign-in/
│   │   └── sign-up/
│   │
│   ├── (dashboard)/
│   │   ├── dashboard/
│   │   ├── resume-analyzer/
│   │   ├── job-match/
│   │   ├── mock-interview/
│   │   ├── roadmap/
│   │   └── profile/
│   │
│   └── api/
│       ├── analytics/
│       ├── resume/
│       ├── job-match/
│       ├── interview/
│       └── roadmap/
│
├── components/
│   ├── interview/
│   ├── resume/
│   ├── roadmap/
│   └── dashboard/
│
├── lib/
│   ├── ai/
│   ├── data/
│   ├── db/
│   └── parsers/
│
├── prisma/
│   └── schema.prisma
│
├── public/
│
├── .env.example
├── .gitignore
├── package.json
├── tsconfig.json
├── next.config.ts
├── tailwind.config.ts
└── README.md
```

---

# 📦 4. Install Project Packages

Open the terminal inside the project folder.

Run:

```bash
npm install
```

This installs all packages listed in `package.json`.

You **do not** need:

```bash
pip install
python
venv
requirements.txt
```

---

# 🔑 5. Create Environment File

In the project root, create:

```text
.env.local
```

You can copy the example file:

### Windows PowerShell

```powershell
Copy-Item .env.example .env.local
```

### macOS / Linux

```bash
cp .env.example .env.local
```

---

# 🔐 6. Add API Keys

Open `.env.local`.

Add your credentials:

```env
DATABASE_URL="your_neon_database_url"

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="your_clerk_publishable_key"
CLERK_SECRET_KEY="your_clerk_secret_key"

AI_PROVIDER="groq"
GROQ_API_KEY="your_groq_api_key"
GROQ_MODEL="your_groq_model"

NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

You need accounts/keys from:

* **Neon** → PostgreSQL database
* **Clerk** → Authentication
* **Groq** → AI API

> Never upload `.env.local` to GitHub.

---

# 🗄️ 7. Setup the Database

After adding your Neon `DATABASE_URL`, run:

```bash
npx prisma db push
```

This creates/synchronizes the database tables using your Prisma schema.

Your database schema is located at:

```text
prisma/schema.prisma
```

---

# ▶️ 8. Run the Project

Start the development server:

```bash
npm run dev
```

You should see something similar to:

```text
Local: http://localhost:3000
```

Open your browser:

```text
http://localhost:3000
```

---

# 🧪 9. Test the Application

After opening the application:

1. Create an account / Sign in.
2. Open the Dashboard.
3. Test Resume Analyzer.
4. Test Job Match.
5. Test Mock Interview.
6. Test Coding Assessment.
7. Generate the Learning Roadmap.
8. Check the Dashboard analytics.

---

# 🗃️ 10. Prisma Database Viewer

To view your database tables:

```bash
npx prisma studio
```

Prisma Studio will open in your browser.

---

# 🏗️ 11. Build the Project

To check whether the project builds correctly:

```bash
npm run build
```

If the build completes successfully, the application is ready for deployment.

---

# 🚀 12. Production Start

After building:

```bash
npm start
```

---

# 📋 Complete Setup — Copy & Run

For a new computer, the basic process is:

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>

cd career_growth_ai

npm install

npx prisma db push

npm run dev
```

Before `npm run dev`, make sure `.env.local` contains your:

```text
DATABASE_URL
CLERK keys
GROQ_API_KEY
```

---

# ⚠️ Troubleshooting

### Port 3000 is already in use

Run:

```bash
npm run dev -- -p 3001
```

Then open:

```text
http://localhost:3001
```

### Database connection error

Check:

```env
DATABASE_URL="..."
```

Make sure your Neon database is active and the connection string is correct.

### Groq AI not working

Check:

```env
GROQ_API_KEY="..."
```

Make sure the API key is valid.

### Clerk authentication not working

Check:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="..."
CLERK_SECRET_KEY="..."
```

---

# 📌 Important

This project requires:

```text
Node.js
npm
Neon PostgreSQL
Clerk
Groq API
```

This project does **NOT** require:

```text
Python
pip
Virtual Environment
requirements.txt
```

---



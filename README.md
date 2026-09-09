# 🚀 GitHub Developer Analyzer

A modern GitHub developer analytics platform built with **Laravel, React, TypeScript, Tailwind CSS, and the GitHub API**.

GitHub Developer Analyzer allows users to search for any GitHub developer and explore profile statistics, repository insights, programming language distribution, and a custom Developer Score through a clean analytics dashboard.

---

## ✨ Features

- 🔍 Search GitHub users by username
- 👤 Developer profile overview
- 📦 Public repository analysis
- ⭐ Total stars analysis
- 🍴 Repository fork statistics
- 💻 Top programming language detection
- 🏆 Top repository identification
- 📊 Programming language distribution chart
- 🎯 Custom Developer Score (0–100)
- 📱 Responsive dashboard design
- 🌙 Modern dark UI
- ⚔️ Developer comparison — Coming Soon

---

## 🛠️ Tech Stack

### Frontend

- React
- TypeScript
- Tailwind CSS
- Recharts
- Inertia.js
- Vite

### Backend

- Laravel
- PHP
- Laravel HTTP Client

### External API

- GitHub REST API

---

## 📊 Developer Score

The application calculates a custom **Developer Score out of 100** using several GitHub profile metrics.

| Metric | Maximum Points |
|---|---:|
| Repositories | 20 |
| Stars | 20 |
| Followers | 20 |
| Language Diversity | 20 |
| Profile Completeness | 20 |
| **Total** | **100** |

The score is classified as:

| Score | Rating |
|---|---|
| 0–39 | Beginner |
| 40–59 | Growing |
| 60–79 | Strong |
| 80–100 | Excellent |

> The Developer Score is a custom project metric and is not an official GitHub rating.

---

## 🔄 How It Works

```text
User
  ↓
React Frontend
  ↓
Laravel API
  ↓
GitHub REST API
  ↓
Laravel processes the data
  ↓
React Analytics Dashboard
```

Laravel acts as the API layer between the React frontend and GitHub.

---

## 🔗 API Endpoints

```text
GET /api/github/user/{username}

GET /api/github/user/{username}/repos

GET /api/github/user/{username}/stats
```

### User API

Returns developer information including:

- Username
- Name
- Avatar
- Bio
- Location
- Followers
- Following
- Public repositories

### Repository API

Returns repository information including:

- Repository name
- Description
- Language
- Stars
- Forks
- Watchers
- Repository URL

### Statistics API

Calculates:

- Total stars
- Total forks
- Top language
- Language distribution
- Top repository
- Developer Score

---

## 💻 Installation

Clone the repository:

```bash
git clone YOUR_REPOSITORY_URL
cd github-developer-analyzer
```

Install PHP dependencies:

```bash
composer install
```

Install frontend dependencies:

```bash
npm install
```

Create the environment file:

```bash
cp .env.example .env
```

Generate the Laravel application key:

```bash
php artisan key:generate
```

Run Laravel:

```bash
php artisan serve
```

Run Vite in another terminal:

```bash
npm run dev
```

Then open:

```text
http://127.0.0.1:8000
```

---

## 🗺️ Roadmap

- [x] GitHub profile analyzer
- [x] Repository analytics
- [x] Language visualization
- [x] Developer Score
- [ ] Developer vs Developer comparison
- [ ] Advanced comparison scoring
- [ ] Search history
- [ ] Favorite developers
- [ ] Improved GitHub API authentication
- [ ] Production deployment

---

## 🔐 Security

Environment variables and sensitive credentials are excluded from Git using `.gitignore`.

Never commit your `.env` file or private API tokens.

---

## 📸 Screenshots

Dashboard screenshots will be added as the UI is finalized.

---

## 👨‍💻 Author

Developed as a full-stack portfolio project using Laravel, React, TypeScript, and the GitHub REST API.

---

## ⭐ Support

If you find this project useful, consider giving the repository a star.

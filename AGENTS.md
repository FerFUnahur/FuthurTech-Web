# AGENTS.md — FuthurTech Web

## Project structure — three components

| Component | Tech | Entry point | Type |
|---|---|---|---|
| `Pagina web/` | HTML+CSS+JS (legacy) | `index.html` (open directly) | Static prototype |
| `BackEnd/` | Node.js + Express 5 + Sequelize 6 + SQLite | `server.js` | CommonJS (`"type": "commonjs"`) |
| `FrontEnd/` | React 19 + Vite 8 + Bootstrap 5 + React Router 7 | `src/main.jsx` | ESM (`"type": "module"`) |

The existing `README.md` documents **only** the legacy static site (`Pagina web/`). Treat it as accurate for that component only.

## Exact commands

**BackEnd** (run first):
```bash
cd BackEnd
npm install                    # already installed
npm run seed                   # populate DB with demo data (forces re-sync)
npm run dev                    # `node --watch server.js` on http://localhost:3001
npm run reset                  # `node --force --seed` — drop & reseed
```
- Seed creates: 3 users, 6 products, 3 courses with modules/lessons, 1 enrollment, 1 certificate.
- SQLite database auto-creates at `BackEnd/database.sqlite` (gitignored).
- `.env` must contain `PORT=3001` and `JWT_SECRET=futhurtech_secret_key_2026`.

**FrontEnd** (run after BackEnd):
```bash
cd FrontEnd
npm install
npm run dev                    # Vite dev server on http://localhost:5173
npm run build                  # production build to FrontEnd/dist/
npm run preview                # preview the production build
npm run lint                   # ESLint
```
- Vite proxies `/api/*` → `http://localhost:3001` (configured in `vite.config.js`).
- Backend must be running for API calls.

## Demo credentials

| Role | Email | Password |
|---|---|---|
| admin | `admin@futhurtech.com` | `123456` |
| instructor | `instructor@futhurtech.com` | `123456` |
| student | `student@futhurtech.com` | `123456` |

Legacy static site uses: `admin@futhurtech.com` / `admin123` (stored in localStorage via `Pagina web/js/main.js`).

## Architecture notes

- **Auth**: JWT + bcrypt. Middleware at `BackEnd/src/middleware/auth.js` — expects `Authorization: Bearer <token>`. Roles: `admin`, `instructor`, `student`. Admin routes require `authorize('admin')`.
- **API base**: `http://localhost:3001/api/`. Health check at `GET /api/health`.
- **DB**: Sequelize with SQLite (`sync({ force })` on seed — no migration files). Models in `BackEnd/src/models/`.
- **Route mounting** in `server.js` — some prefixes are non-obvious: lesson & enrollment routes mount on `/api` (not `/api/lessons`), courses mount modules under `/api/courses`.
- **Certificates**: generated via PDFKit, served under `/api/certificates`.
- **Frontend routing** in `src/App.jsx`. Protected routes use `<ProtectedRoute>` wrapper; admin routes use `<AdminRoute>`. Both check JWT stored in `localStorage('token')`.
- **Legacy site** (`Pagina web/`) uses `localStorage` keys `ft_users` and `ft_session`. It is a completely independent prototype — no connection to BackEnd/FrontEnd.

## Style & conventions

- **No TypeScript** — all JS/JSX throughout.
- BackEnd uses `require`/`module.exports` (CommonJS). FrontEnd uses `import`/`export` (ESM).
- Frontend: Bootstrap 5 classes, `react-bootstrap` components, Bootstrap Icons via `bi-*` classes.
- Axios instance at `FrontEnd/src/services/api.js` with `baseURL: '/api'`.
- Auth state managed via React Context (`AuthContext`, `CartContext`).
- ESLint config at `FrontEnd/eslint.config.js` (flat config, React hooks + refresh plugins).

## Legacy static site notes (`Pagina web/`)

- No build step, no dependencies. Open any `.html` file directly in browser.
- All interactivity in `Pagina web/js/main.js`.
- Footer is duplicated across all HTML pages — changes must be applied to every page.
- UTF-8 encoding required for Spanish characters (accents, ñ).

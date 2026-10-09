# DIY Auto Crafter (Unit 4: DIY Delight)

**DIY Auto Crafter** is a custom vehicle personalizer web application built with React, Node.js, Express, and PostgreSQL. It empowers users to build, personalize, view, edit, and delete custom vehicle configurations in real-time. Features include dynamic 3D vector SVG visual rendering, real-time itemized price calculations, and early validation that prevents impossible feature combinations.

---

## 📸 Demo Walkthrough

![DIY Auto Crafter Demo](public/demo.gif)

---

## 📋 Required Features Checklist

- [x] **The web app uses React to display data from an API**
- [x] **Data is supplied to the app using a Render PostgreSQL database**
  - [x] The web app connects securely via `pg.Pool` inside `server/config/database.js` using environment variables (`PGHOST`, `PGUSER`, `PGPASSWORD`, `PGPORT`, `PGDATABASE`).
  - [x] Includes `server/config/reset.js` to initialize schema and seed initial data.
  - [x] Includes in-memory fallback for offline test suites.
- [x] **The web app has a well-structured user interface**
  - [x] Provides multiple customizable vehicle feature categories (exterior paint color, wheels & tires, roof style, interior trim, powertrain engine, exterior accessories).
  - [x] Each customizable feature provides multiple options to choose from.
  - [x] Total price updates dynamically in real-time as options are selected, alongside a full itemized price breakdown.
  - [x] The visual interface dynamically re-renders a 3D SVG car preview in response to feature choices (paint fill, wheel style swap, roof type, accessory overlays, interior accents).
- [x] **The web app allows the user to save a new CustomItem**
  - [x] Users can submit their choices to save a `CustomCar` to the list of created items (`POST /api/cars`).
  - [x] Users can view a list gallery of all submitted custom builds (`GET /api/cars`).
  - [x] Invalid submissions or impossible feature combinations return appropriate server-side 400 Bad Request error messages.
- [x] **Saved CustomItems can be updated and deleted**
  - [x] Users can view item details (`GET /api/cars/:id`).
  - [x] Users can edit a submitted custom build from the details or list view (`PATCH /api/cars/:id`).
  - [x] Users can delete a submitted custom build (`DELETE /api/cars/:id`).

---

## 🚀 Stretch Features Checklist

- [x] **User is alerted to impossible combos early**
  - [x] Selecting incompatible options dynamically alerts the user and disables conflicting options in real time before form submission (e.g. *Convertible Soft Top* prevents *Roof Cargo Rack*; *Eco Electric Powertrain* prevents *Dual Chrome Exhaust*).
  - [x] Enforced both on the client via early UI validation badges and on the Express backend via HTTP 400 validation.

---

## 🛠 Tech Stack & Core Architecture

- **Frontend:** React, React Router DOM, Vite, Lucide React Icons
- **Backend:** Node.js, Express, PostgreSQL (`pg.Pool`), CORS, Dotenv
- **Architecture Documentation:**
  - `CONTEXT.md` — Project Ubiquitous Language glossary and domain definitions.
  - `ARCHITECTURE.md` — Granular 6-tier execution call stack diagrams (Project, Folder, File, Class/Module, Method, Variable State Shift) mapping all GET, POST, PATCH, and DELETE flows.

---

## 🔌 API Routes

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/options` | Retrieves all customizable feature categories, prices, and impossible combination rules |
| `GET` | `/api/cars` | Retrieves all saved custom vehicle builds |
| `GET` | `/api/cars/:id` | Retrieves a single custom car build by ID |
| `POST` | `/api/cars` | Creates a new custom car build (calculates price, validates combos) |
| `PATCH` | `/api/cars/:id` | Updates an existing custom car build |
| `DELETE` | `/api/cars/:id` | Deletes a custom car build by ID |

---

## 🚀 Getting Started

### 1. Installation
Clone the repository and install dependencies:
```bash
npm install
cd client && npm install && cd ..
```

### 2. Environment Setup
Create a `.env` file in the root directory:
```env
PORT=3000
PGHOST=your-render-postgres-hostname.render.com
PGUSER=your_user
PGPASSWORD=your_password
PGDATABASE=your_database
PGPORT=5432
```

### 3. Initialize / Seed Database
Run the database reset script to set up tables:
```bash
npm run reset
```

### 4. Run Development Server
```bash
npm run dev
```
Open `http://localhost:5173` to access the personalizer web app.

### 5. Run Automated Tests
```bash
npm test
```

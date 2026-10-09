# CIVIX — Modern Civic Issue Reporting & Management Platform

CIVIX is a modern, high-engagement civic issue reporting and resolution platform engineered to empower citizens and streamline municipal governance. It enables community members to document civic grievances (such as potholes, water leaks, or broken streetlights) and provides municipal staff and administrators with a structured, transparent, real-time workflow to triage, assign, and resolve issues.

[![Frontend Tests](https://img.shields.io/badge/tests-16%20passed-brightgreen.svg)](#testing--quality-assurance)
[![React](https://img.shields.io/badge/React-19.1.0-blue.svg)](https://react.dev/)
[![Node](https://img.shields.io/badge/Node-Express%20%2B%20Socket.IO-green.svg)](https://nodejs.org/)

---

## 🌟 Interactive UI & UX Capabilities

Civix features a responsive, micro-animated user interface designed for maximum civic engagement:

- 🔍 **Real-Time Interactive Search & Clear Action:**
  - Instant client-side fuzzy filtering across titles, descriptions, and district codes.
  - Dedicated one-click clear button (`FaTimes`) to quickly reset searches.
- 🏷️ **Dynamic Status Filter Tabs:**
  - Category chips for `All`, `Reported`, `Under Review`, `In Progress`, and `Resolved`.
  - Real-time issue counts rendered on each tab pill for immediate visual feedback.
- 🔄 **Multi-Dimensional Sort Selector:**
  - Sort civic issues seamlessly by **Newest First**, **Oldest First**, **Most Upvoted**, or **Most Discussed**.
- 🔲 **Grid vs. Compact List View Toggle:**
  - Responsive toggle between high-density cards and compact horizontal lists.
  - User preference is automatically persisted to `localStorage` (`civix_view_mode`).
- 👍 **Optimistic One-Click Upvoting:**
  - Micro-animated thumbs-up toggle with instant optimistic count updates and authentication checks.
- 🔗 **Quick Social Sharing & Clipboard Feedback:**
  - Integrated copy-to-clipboard action with visual `"Copied!"` badge and web share modal support.
- 📊 **Interactive Civic Impact Statistics:**
  - Real-time community metrics: **Total Reported**, **Resolved Issues**, **In Progress**, and dynamic **Resolution Rate %**.
  - Clicking metric cards automatically filters the issue feed by that status.
- 🖼️ **Full-Screen Image Lightbox with Keyboard Navigation:**
  - High-resolution modal viewer supporting keyboard navigation (`Escape`, Arrow keys) and zoom backdrop.
- 🪜 **Interactive Civic Resolution Stepper (`ProgressStepper`):**
  - 4-stage resolution tracking stepper (`Reported` → `Under Review` → `In Progress` → `Resolved`) with status indicators and micro-animations.
- 💬 **Observation Reaction Tags & Comment Character Counter:**
  - One-click observation chips (`"Confirmed On-Site"`, `"Urgent Danger"`, `"Traffic Delayed"`, `"Partially Cleared"`).
  - Live character countdown (500 chars limit) with warning state when nearing maximum length.
- 🚨 **Interactive Urgency Selector & Dropzone in Reporting:**
  - Selectable urgency tiers (`Low`, `Medium`, `High`, `Critical`) with live visual styling.
  - Interactive file dropzone with drag-over effects and preview cards.
- 🌗 **Persistent Dark / Light Theme Mode:**
  - System-wide CSS theme variables (`--bg-primary`, `--card-bg`, `--text-primary`, `--border-color`).
  - Smooth transitions and persistent storage (`civix_theme`).
- 📭 **Empty State Component (`EmptyState`):**
  - Informative animated empty states with custom action triggers (`Reset Search & Filters`, `Report First Issue`).
- ❓ **Interactive FAQ Accordion:**
  - Expandable/collapsible FAQ sections on landing page with smooth CSS transitions.

---

## 🧪 Testing & Quality Assurance

Civix includes a comprehensive frontend test suite built with **Jest** and **React Testing Library** to guarantee reliability, UI regression resilience, and accessibility.

### Running Tests

To run the complete test suite:

```bash
cd frontend
npm test -- --watchAll=false
```

To run tests in interactive watch mode during development:

```bash
npm test
```

To run test coverage reports:

```bash
npm test -- --coverage --watchAll=false
```

### Test Suite Structure

The test suites cover both critical business logic utilities and interactive UI components:

| Test Suite | File Location | What It Tests |
| :--- | :--- | :--- |
| **Data Formatters** | `src/utils/formatters.test.js` | Status normalization, human-readable labels, urgency badge classes, and relative timestamp calculations |
| **Status Badge** | `src/components/common/StatusBadge.test.jsx` | Dynamic badge rendering, icon assignment, size variations (`sm`, `md`, `lg`), and pulse animations |
| **Card Skeleton Loader** | `src/components/common/IssueCardSkeleton.test.jsx` | Loading state placeholder shimmer, count propagation, and DOM integrity |
| **Progress Stepper** | `src/components/common/ProgressStepper.test.jsx` | 4-stage resolution timeline, active step highlighting, and completion state logic |
| **Empty State** | `src/components/common/EmptyState.test.jsx` | Default fallback rendering, custom messages, icon styles, and action button callbacks |

---

## 👥 Role-Based Access Control (RBAC)

- **Citizens (Users):** Report civic problems, attach photos & GPS coordinates, upvote, track live progress, and participate in discussion threads.
- **Field Workers:** Receive assigned tasks based on department/jurisdiction, post real-time resolution updates, and communicate with reporting citizens.
- **Municipal Admins:** View district-wide heatmaps, monitor worker resolution SLAs, review unresolved backlog, and assign contractors.
- **Superadmins:** Manage administrative credentials, onboard departments, and oversee cross-district analytics.

---

## 💻 Tech Stack

### Frontend:
- **React 19**
- **React Router DOM v7**
- **React-Leaflet** (GIS mapping & heatmaps)
- **React-Toastify** (Real-time feedback)
- **React-Icons** (Feather & FontAwesome icon sets)
- **Vanilla CSS3** with Custom Theme Variables & Animations
- **Jest & React Testing Library**

### Backend:
- **Node.js & Express.js**
- **MongoDB & Mongoose**
- **Socket.IO** (Real-time citizen-authority chat and status events)
- **JWT & Bcryptjs** (Authentication & security)
- **Nodemailer** (Password resets and email notifications)
- **Multer & AWS S3** (Evidence photo uploads)

---

## 📁 Project Structure

```text
CIVIX/
├── backend/
│   ├── controllers/       # Route controllers (auth, admin, issue, worker, etc.)
│   ├── models/            # Mongoose schemas (User, Issue, Message, Notification)
│   ├── routes/            # Express route endpoints
│   ├── utils/             # Helpers (token generation, mailers)
│   ├── server.js          # Express app and Socket.IO initialization
│   └── .env               # Server environment variables
└── frontend/
    ├── public/            # Static assets and index.html
    ├── src/
    │   ├── components/    # Feature modules:
    │   │   ├── common/    # Reusable UI (StatusBadge, ProgressStepper, EmptyState, Skeleton)
    │   │   ├── Homepage/  # Dashboard, filters, sort, view toggles, issue cards
    │   │   ├── IssueDetails/ # Lightbox, stepper, social share, reactions
    │   │   ├── Navbar/    # Nav links, dark mode toggle, profile menu
    │   │   ├── Report/    # Urgency picker, character count, image dropzone
    │   │   └── Home1/     # Landing page, FAQ accordion, civic counters
    │   ├── services/      # Axios API client (api.js)
    │   ├── utils/         # Data formatters, state/district catalogs
    │   └── setupTests.js  # Jest DOM test setup
    └── .env               # Client environment variables
```

---

## ⚙️ Environment Variables

### Backend (`backend/.env`)
```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/civix
JWT_SECRET=your_jwt_secret_key
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password
FRONTEND_URL=http://localhost:3000
```

### Frontend (`frontend/.env`)
```env
REACT_APP_BACKEND_URL=http://localhost:5000
```

---

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/lokeshkankarwal/Civix.git
cd Civix
```

### 2. Set Up & Run Backend
```bash
cd backend
npm install
npm run dev # or: node server.js
```

### 3. Set Up & Run Frontend
```bash
cd frontend
npm install
npm start
```

### 4. Run Frontend Unit Tests
```bash
cd frontend
npm test -- --watchAll=false
```

---

## 🔐 Authentication Notes
- Citizens can sign up freely through the application.
- Worker and Admin accounts are provisioned exclusively through authorized Superadmins.
- Official institutional emails (`@gov.in` or `@nic.in`) are required for government staff accounts.

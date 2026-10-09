# Civix Frontend

This is the React frontend application for CIVIX, a civic engagement and municipality issue management platform.

## Available Scripts

In the frontend directory, you can run:

### `npm test`
Launches the test runner with Jest and React Testing Library:
```bash
npm test -- --watchAll=false
```

To run tests with coverage reporting:
```bash
npm test -- --coverage --watchAll=false
```

### `npm start`
Runs the app in development mode at [http://localhost:3000](http://localhost:3000).

### `npm run build`
Builds the app for production to the `build` folder.

## Test Suites & Coverage

Frontend components and utilities are tested using Jest and React Testing Library:
- **`src/utils/formatters.test.js`**: Status normalization, date relative formatting, urgency styling logic.
- **`src/components/common/StatusBadge.test.jsx`**: Civic status badge colors, icons, sizes, and pulse animations.
- **`src/components/common/IssueCardSkeleton.test.jsx`**: Loading skeleton animations and accessibility attributes.
- **`src/components/common/ProgressStepper.test.jsx`**: Dynamic 4-step issue resolution progress indicator.
- **`src/components/common/EmptyState.test.jsx`**: Empty state feedback, customized messaging, and action button triggers.

## Key Interactive UI Modules
- **Interactive Search & Clear**: Real-time filtering across reports.
- **Dynamic Status Chips**: Instant category switching with live counts.
- **View Mode Switch**: Grid and compact list layout toggle (persisted).
- **Lightbox Viewer**: Modal image viewer with keyboard navigation on issue details.
- **Dark Mode**: System-wide theme toggle with persistent storage.

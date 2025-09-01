# Todo App

A modern, full-stack todo application built with Next.js, featuring both server-side rendering and client-side functionality with local storage support.

## Features

- ✅ Create, read, update, and delete todos
- 📱 Responsive design with mobile and desktop layouts
- 🔄 Real-time synchronization between API and localStorage
- 📊 Filter todos by status (All, Completed, Incomplete)
- 🎨 Modern UI with Tailwind CSS
- 🚀 Server-side rendering (SSR) for fast initial load
- 💾 Hybrid storage: API backend + localStorage for offline capability

## Tech Stack

- **Framework**: Next.js (Pages Router)
- **Styling**: Tailwind CSS
- **State Management**: React useState/useEffect
- **Storage**: API endpoints + localStorage
- **UI Components**: Custom React components

## Project Structure

```
├── pages/
│   ├── api/
│   │   └── todos/
│   │       ├── index.js          # GET /api/todos, POST /api/todos
│   │       └── [id].js           # GET/PUT/DELETE /api/todos/[id]
│   ├── todos/
│   │   ├── [id].jsx              # Individual todo page
│   │   └── new.jsx               # Create new todo page
│   ├── components/
│   │   ├── TodoItem.jsx          # Todo list item component
│   │   └── TodoForm.jsx          # Todo creation/editing form
│   ├── utils/
│   │   └── helper.js             # API utility functions
│   └── index.jsx                 # Home page with todo list
├── lib/
│   └── data/
│       └── todos.js              # Todo data store
└── styles/
    └── globals.css               # Global styles + Tailwind
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <your-repo-url>
cd todo-app
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Set up environment variables (optional)
```bash
# .env.local
API_BASE_URL=http://localhost:3000           # for server-side requests
NEXT_PUBLIC_BASE_URL=http://localhost:3000   # for client-side requests
```

4. Start the development server
```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/todos` | Fetch all todos |
| POST | `/api/todos` | Create a new todo |
| GET | `/api/todos/[id]` | Fetch a specific todo |
| PUT | `/api/todos/[id]` | Update a specific todo |
| DELETE | `/api/todos/[id]` | Delete a specific todo |

## Component Overview

### TodoItem
- Displays individual todo items
- Handles inline editing mode
- Provides delete and edit actions
- Shows creation date

### TodoForm
- Reusable form for creating and editing todos
- Handles form validation
- Supports both create and update modes

### Home (Main Page)
- Lists all todos with filtering
- Responsive sidebar/mobile tabs
- Real-time sync between API and localStorage
- Server-side rendering for initial load

## Data Flow

1. **Initial Load**: Server-side rendering fetches todos from API
2. **Client Hydration**: Merges server data with localStorage data
3. **Real-time Updates**: Storage events sync data across tabs
4. **Hybrid Storage**: 
   - API todos are persisted on the server
   - Local todos are stored in localStorage
   - Both are merged in the UI

## Storage Strategy

The app uses a hybrid storage approach:

- **Server Storage**: Todos from API endpoints (persistent across devices)
- **Local Storage**: Client-created todos (device-specific)
- **Merging**: Both sources are combined and deduplicated by ID

## Known Issues

- ID type mismatches between string and number types
- Potential infinite loops in useEffect dependencies
- API error handling needs improvement
- Missing error boundaries for better UX

## Development

### Adding New Features

1. **New API endpoints**: Add to `pages/api/`
2. **New pages**: Add to `pages/`
3. **New components**: Add to `pages/components/`
4. **Styling**
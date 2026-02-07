# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**dbee** is a PostgreSQL database client desktop application built with Tauri 2, React 19, and TypeScript. It features a Monaco-based SQL editor with autocomplete, schema browser, and query results display.

## Commands

```bash
# Development (runs Tauri + Vite dev server)
pnpm tauri dev

# Build for production
pnpm build           # Build frontend only
pnpm tauri build     # Build full desktop app

# Code quality
pnpm lint            # TypeScript check + ESLint + Prettier check
pnpm lint:fix        # Auto-fix ESLint + Prettier
pnpm typecheck       # TypeScript only
pnpm format          # Prettier only

# Rust backend
cd src-tauri && cargo check   # Check Rust code
cd src-tauri && cargo build   # Build Rust backend
```

## Architecture

### Frontend (React + TypeScript)

```
src/
├── app/              # App entry, layout, providers
├── components/       # Reusable UI components
│   ├── atoms/        # Button, inputs
│   ├── molecules/    # Tabs, SplitPane
│   └── organisms/    # TitleBar, StatusBar
├── configs/          # Theme (Vanilla Extract CSS)
├── features/         # Feature modules
│   ├── connections/  # Connection management (list, form, card)
│   ├── editor/       # SQL editor (Monaco, query execution)
│   ├── results/      # Query results table
│   └── schema/       # Database schema sidebar
├── hooks/            # Shared hooks (useTauriInvoke)
└── types/            # Zod schemas and TypeScript types
```

### Backend (Rust + Tauri)

```
src-tauri/src/
├── lib.rs            # Tauri app setup, command registration
├── main.rs           # Entry point
└── commands/         # Tauri IPC commands
    ├── connection.rs # connect, disconnect, AppState
    ├── connections.rs # save, list, delete saved connections
    ├── query.rs      # execute_query
    └── schema.rs     # get_schema
```

### Key Patterns

**State Management**: React Context providers in each feature's `stores/` directory
- `SchemaProvider` - Current connection and schema state
- `EditorProvider` - Tab management
- `ResultsProvider` - Query results and execution state
- `ConnectionsProvider` - Saved connections list

**Frontend-Backend Communication**:
- Tauri commands via `@tauri-apps/api/core` `invoke()`
- Custom `useTauriInvoke` hook for command execution with loading states
- API functions in `features/*/api/` that call Tauri commands

**Styling**: Vanilla Extract CSS-in-TS with a theme contract (`vars`) for consistent design tokens

**Data Validation**: Zod schemas in `src/types/database.ts` for runtime type checking

### Tauri Commands (IPC Interface)

| Command | Description |
|---------|-------------|
| `connect` | Connect to PostgreSQL database |
| `disconnect` | Close current connection |
| `get_connection_info` | Get current connection details |
| `execute_query` | Run SQL query and return results |
| `get_schema` | Fetch database tables and columns |
| `list_saved_connections` | List stored connection configs |
| `save_connection` | Store new connection config |
| `delete_connection` | Remove stored connection |
| `test_connection` | Test connection without persisting |

### Dependencies

- **sqlx**: Async PostgreSQL driver (Rust)
- **Monaco Editor**: SQL editor with syntax highlighting
- **TanStack Query**: Data fetching and caching
- **Radix UI**: Accessible UI primitives (Dialog, Tabs, Tooltip)
- **Zod**: Schema validation

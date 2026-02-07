# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**dbee** is a PostgreSQL database client desktop application built with Tauri 2, React 19, and TypeScript. It features a Monaco-based SQL editor with schema-aware autocomplete, a schema browser with tables and views, spreadsheet-like results with multi-cell selection, and persistent connection management.

## Commands

```bash
# Development (runs Tauri + Vite dev server)
pnpm tauri dev

# Build
pnpm build           # Frontend only (tsc + vite)
pnpm tauri build     # Full desktop app with installers

# Code quality
pnpm lint            # TypeScript check + ESLint + Prettier check
pnpm lint:fix        # Auto-fix ESLint + Prettier
pnpm typecheck       # TypeScript only
pnpm format          # Prettier only

# Rust backend
cd src-tauri && cargo check   # Type check Rust code
cd src-tauri && cargo build   # Build Rust backend
```

## Architecture

### View Switching

There is no URL router. The entire app switches views based on connection state in `src/app/App.tsx`:
- `useSchemaStore().connection` is `null` → renders `<ConnectionList />` (connection screen)
- `useSchemaStore().connection` exists → renders `<AppLayout />` (editor + results + schema sidebar)

Connecting to a database is the only "navigation" — it's a state transition, not a route change. Disconnecting resets the store and returns to the connection screen.

### Feature Module Pattern

Each feature in `src/features/` follows the same structure:
```
feature/
├── api/          # Tauri invoke() wrappers
├── components/   # React components + *.css.ts (Vanilla Extract)
├── hooks/        # Business logic hooks (orchestrate store + API)
└── stores/       # React Context provider + useStore hook
```

Hooks compose stores and API calls. For example, `useConnections` uses both `useConnectionsStore` and `useSchemaStore` to orchestrate the connect flow (save connection → connect → fetch schema).

### State Management

Simple React Context + useState. Each store:
- Creates a context with `createContext<Value | null>(null)`
- Provides a `useXxxStore()` hook that throws if used outside the provider
- Exposes state values and imperative setters (no selectors or computed state)
- Has a `reset()` function for cleanup on disconnect

Providers are nested in `App.tsx`: Schema → Connections → Editor → Results.

### Frontend-Backend Communication

Tauri IPC via `@tauri-apps/api/core` `invoke()`. Each feature has an `api/` directory wrapping invoke calls. This keeps Tauri coupling isolated from business logic.

**Adding a new command requires two steps:**
1. Define the `#[tauri::command]` function in `src-tauri/src/commands/`
2. Add it to `generate_handler![]` in `src-tauri/src/lib.rs`

### Styling

Vanilla Extract CSS-in-TS. Theme tokens defined in `src/configs/theme.css.ts`:
- `vars.color.*` — three background layers (`background`, `backgroundSecondary`, `backgroundTertiary`), two foreground layers, semantic colors (`primary`, `error`, `success`, `warning`)
- `vars.space.*` — xs(4) sm(8) md(16) lg(24) xl(32)
- `vars.fontSize.*` — xs(11) sm(12) md(13) lg(14) xl(16)
- `vars.fontFamily.base` for UI text, `vars.fontFamily.mono` for code/data
- `vars.radius.*` — sm(6) md(10) lg(16)

### Data Persistence

Saved connections are stored as JSON in `~/.dbee/connections.json` (full read-modify-write pattern). UUIDs are generated server-side in Rust. Passwords are stored in plaintext.

### Data Validation

Zod schemas in `src/types/database.ts` define the shape of all data crossing the IPC boundary: `DatabaseSchema` (tables + views), `QueryResult`, `SavedConnection`, etc. TypeScript types are inferred from Zod schemas.

### Tauri Commands (IPC Interface)

| Command | Description |
|---------|-------------|
| `connect` | Connect to PostgreSQL database |
| `disconnect` | Close current connection |
| `get_connection_info` | Get current connection details |
| `execute_query` | Run SQL query and return results |
| `get_schema` | Fetch database tables, views, and columns |
| `list_saved_connections` | List stored connection configs |
| `save_connection` | Store new connection config (upsert) |
| `delete_connection` | Remove stored connection |
| `test_connection` | Test connection without persisting |

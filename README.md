# DBee

A fast, lightweight PostgreSQL database client built as a native desktop app. Powered by Tauri 2, React 19, and a Monaco-based SQL editor with schema-aware autocomplete.

![Version](https://img.shields.io/badge/version-0.1.0-blue)
![Platform](https://img.shields.io/badge/platform-macOS%20%7C%20Linux%20%7C%20Windows-lightgrey)
![License](https://img.shields.io/badge/license-MIT-green)

## Features

### SQL Editor
- **Monaco Editor** with SQL syntax highlighting, dark theme, and font ligatures
- **Schema-aware autocomplete** - suggests table names and column names from the connected database
- **Multi-tab editing** - open multiple query tabs, each with independent content
- **Execute queries** with `Cmd+Enter` / `Ctrl+Enter`
- Supports `SELECT`, `INSERT`, `UPDATE`, `DELETE`, `CREATE`, `DROP`, `ALTER`, `WITH`, `SHOW`, `EXPLAIN`

### Results Table
- **Spreadsheet-like cell selection** - click, Shift+click, or drag to select rectangular ranges
- **Copy to clipboard** - `Cmd+C` copies selected cells as tab-separated text (paste directly into Excel or Google Sheets)
- **Inline cell editing** - double-click or press `Enter` to edit cell values
- **Keyboard navigation** - arrow keys to move between cells, `Tab` / `Shift+Tab` in edit mode
- **WHERE clause builder** - press `Cmd+;` on a cell to append a WHERE condition to your query
- **Smart type display** - proper formatting for NULL, JSON/JSONB, UUID, timestamps, booleans, and binary data

### Schema Browser
- **Collapsible Tables and Views sections** with item counts
- **Expand tables** to inspect columns, data types, and primary keys
- **Double-click a table** to instantly run `SELECT * FROM table_name`
- Primary keys highlighted with a key icon

### Connection Management
- **Save, edit, and delete** connection configurations
- **Test connections** before saving
- **One-click connect** from saved connections
- Connections stored locally in `~/.dbee/connections.json`

### Cross-Platform
- Native desktop app for **macOS** (Apple Silicon & Intel), **Linux**, and **Windows**
- Minimal resource usage - no Electron, no embedded Chromium bundled separately
- Tauri 2 uses the OS webview for a small binary size and low memory footprint

## Keyboard Shortcuts

### SQL Editor

| Action | macOS | Linux / Windows |
|---|---|---|
| Execute query | `Cmd+Enter` | `Ctrl+Enter` |

### Results Table

| Action | macOS | Linux / Windows |
|---|---|---|
| Copy selected cells | `Cmd+C` | `Ctrl+C` |
| Select all cells | `Cmd+A` | `Ctrl+A` |
| Navigate cells | `Arrow keys` | `Arrow keys` |
| Extend selection | `Shift+Arrow keys` | `Shift+Arrow keys` |
| Edit cell | `Enter` or `F2` | `Enter` or `F2` |
| Commit edit | `Enter` or `Tab` | `Enter` or `Tab` |
| Cancel edit | `Escape` | `Escape` |
| Move to next/prev column | `Tab` / `Shift+Tab` | `Tab` / `Shift+Tab` |
| Add WHERE clause | `Cmd+;` | `Ctrl+;` |
| Clear selection | `Escape` | `Escape` |

### Schema Browser

| Action | Interaction |
|---|---|
| Toggle columns | Single click on table |
| Run SELECT * | Double click on table |
| Expand / collapse | `Space` on focused table |
| Run SELECT * | `Enter` on focused table |

### Mouse

| Action | Interaction |
|---|---|
| Select cell | Click |
| Range select | Click + drag |
| Extend selection | Shift + click |
| Edit cell | Double click |

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v22+
- [pnpm](https://pnpm.io/) v10+
- [Rust](https://rustup.rs/) stable toolchain
- Platform-specific dependencies (see below)

#### macOS

```bash
xcode-select --install
```

#### Linux (Ubuntu/Debian)

```bash
sudo apt-get install -y \
  libwebkit2gtk-4.1-dev \
  libappindicator3-dev \
  librsvg2-dev \
  patchelf \
  libssl-dev \
  libgtk-3-dev \
  libsoup-3.0-dev \
  libjavascriptcoregtk-4.1-dev
```

#### Windows

No additional system dependencies required. Visual Studio Build Tools with C++ workload is recommended.

### Development

```bash
# Install frontend dependencies
pnpm install

# Start the development server (Vite + Tauri)
pnpm tauri dev
```

This opens the app in development mode with hot reload. The Vite dev server runs on `http://localhost:1420`, and the Tauri backend compiles and launches the native window.

### Build

```bash
# Build the production desktop app
pnpm tauri build
```

Build artifacts are placed in `src-tauri/target/release/bundle/`:

| Platform | Output |
|---|---|
| macOS | `.app` bundle and `.dmg` installer |
| Linux | `.deb` package and `.AppImage` |
| Windows | `.msi` and `.exe` (NSIS) installers |

### Code Quality

```bash
pnpm lint          # TypeScript check + ESLint + Prettier
pnpm lint:fix      # Auto-fix ESLint + Prettier
pnpm typecheck     # TypeScript only
pnpm format        # Prettier only
```

## Architecture

```
dbee/
├── src/                          # Frontend (React + TypeScript)
│   ├── app/                      # App entry, layout, providers
│   ├── components/               # Reusable UI components
│   │   ├── atoms/                # Button, inputs
│   │   ├── molecules/            # Tabs, SplitPane
│   │   └── organisms/            # TitleBar, StatusBar
│   ├── configs/                  # Theme (Vanilla Extract CSS)
│   ├── features/                 # Feature modules
│   │   ├── connections/          # Connection management
│   │   ├── editor/               # SQL editor + tab management
│   │   ├── results/              # Query results table
│   │   └── schema/               # Schema browser sidebar
│   ├── hooks/                    # Shared hooks
│   └── types/                    # Zod schemas + TypeScript types
├── src-tauri/                    # Backend (Rust + Tauri 2)
│   └── src/
│       ├── lib.rs                # App setup, command registration
│       └── commands/             # IPC command handlers
│           ├── connection.rs     # Connect / disconnect / state
│           ├── connections.rs    # Saved connections (CRUD)
│           ├── query.rs          # SQL query execution
│           └── schema.rs         # Schema introspection
└── .github/workflows/build.yml  # CI: cross-platform builds
```

### Tech Stack

| Layer | Technology |
|---|---|
| Desktop runtime | [Tauri 2](https://tauri.app/) |
| Frontend | [React 19](https://react.dev/) + TypeScript 5.9 |
| SQL editor | [Monaco Editor](https://microsoft.github.io/monaco-editor/) |
| Styling | [Vanilla Extract](https://vanilla-extract.style/) (CSS-in-TS) |
| Data fetching | [TanStack Query](https://tanstack.com/query) |
| UI primitives | [Radix UI](https://www.radix-ui.com/) |
| Validation | [Zod](https://zod.dev/) |
| Database driver | [sqlx](https://github.com/launchbadge/sqlx) (async, compile-time checked) |
| Build tooling | [Vite](https://vite.dev/) + pnpm |
| Icons | [Lucide](https://lucide.dev/) |

### Frontend-Backend Communication

The frontend communicates with the Rust backend through Tauri's IPC (Inter-Process Communication) via `invoke()`:

| Command | Description |
|---|---|
| `connect` | Establish a PostgreSQL connection |
| `disconnect` | Close the current connection |
| `get_connection_info` | Get active connection details |
| `execute_query` | Run a SQL query and return results |
| `get_schema` | Fetch tables, views, and their columns |
| `list_saved_connections` | List stored connection configs |
| `save_connection` | Persist a new connection config |
| `delete_connection` | Remove a stored connection |
| `test_connection` | Validate connection without persisting |

### State Management

Each feature manages its own state via React Context:

- **SchemaProvider** - current connection and database schema
- **EditorProvider** - tabs and active editor content
- **ResultsProvider** - query results and execution state
- **ConnectionsProvider** - saved connections list

### Supported PostgreSQL Types

The query executor handles these PostgreSQL types with proper display formatting:

| Category | Types |
|---|---|
| Integer | `INT2`, `INT4`, `INT8`, `SERIAL`, `BIGSERIAL` |
| Float | `FLOAT4`, `FLOAT8`, `NUMERIC` |
| Boolean | `BOOL` |
| Text | `TEXT`, `VARCHAR`, `CHAR`, `BPCHAR`, `NAME` |
| Binary | `BYTEA` (shows size) |
| JSON | `JSON`, `JSONB` |
| UUID | `UUID` |
| Date/Time | `TIMESTAMP`, `TIMESTAMPTZ`, `DATE`, `TIME`, `TIMETZ` |

## CI/CD

GitHub Actions automatically builds the app for all platforms on every push to `main` and on pull requests. Build artifacts are uploaded and downloadable from the Actions tab.

| Target | Runner | Artifacts |
|---|---|---|
| macOS (Apple Silicon) | `macos-latest` | `.dmg` |
| macOS (Intel) | `macos-13` | `.dmg` |
| Linux (x86_64) | `ubuntu-22.04` | `.deb`, `.AppImage` |
| Windows (x86_64) | `windows-latest` | `.msi`, `.exe` |

Builds use Rust caching for faster CI times and concurrency groups to cancel redundant builds.

## License

MIT

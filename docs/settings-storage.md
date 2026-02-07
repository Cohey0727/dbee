# Settings Storage

## Overview

dbee uses a custom file-based persistence mechanism. Only saved database connections are persisted to disk; all other state (editor tabs, query results, schema) is kept in memory and resets when the app closes.

## Storage Location

```
~/.dbee/connections.json
```

The `~/.dbee/` directory is automatically created on first use if it doesn't exist.

## File Format

Pretty-printed JSON:

```json
{
  "connections": [
    {
      "id": "uuid-v4-string",
      "name": "My Database",
      "host": "localhost",
      "port": 5432,
      "user": "postgres",
      "password": "password",
      "database": "mydb"
    }
  ]
}
```

## What Is Persisted

| Data | Persisted | Storage |
|------|-----------|---------|
| Saved connections | Yes | `~/.dbee/connections.json` |
| Editor tabs / SQL content | No | React Context (in-memory) |
| Query results | No | React Context (in-memory) |
| Database schema | No | Fetched from PostgreSQL on connect |
| UI preferences / theme | No | Not configurable yet |

## Implementation

### Backend (Rust)

The persistence logic lives in `src-tauri/src/commands/connections.rs`:

- Uses `dirs` crate to resolve `~` (home directory)
- Uses `std::fs` for file read/write
- Serialization via `serde_json` (pretty-printed)
- UUID v4 generated for each new connection

### Frontend (React)

- `features/connections/api/connectionsApi.ts` - Tauri IPC calls
- `features/connections/stores/connectionsStore.tsx` - React Context provider
- `features/connections/hooks/useConnections.ts` - CRUD hook

### Tauri Commands

| Command | Description |
|---------|-------------|
| `list_saved_connections` | Read and parse `connections.json` |
| `save_connection` | Create or update a connection entry |
| `delete_connection` | Remove a connection by ID |
| `test_connection` | Validate connection without saving |

## Security Note

Passwords are stored in **plaintext** in `connections.json`. Future improvement: integrate with OS keychain (e.g., macOS Keychain, Windows Credential Manager) via a Tauri plugin.

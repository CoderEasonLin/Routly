# API Contracts: Frontend to Local Backend

The Vue 3 frontend communicates with the Express 5 backend via a REST API to perform Git operations and read/write files to the local Workspace.

## 1. Workspace API

### `GET /api/workspace/status`
Returns the current Git status of the opened workspace.
**Response**:
```json
{
  "branch": "master",
  "hasChanges": true,
  "staged": ["collectionA/req1.req.json"],
  "unstaged": ["collectionB/req2.req.json"],
  "untracked": ["new_env.env.json"]
}
```

### `GET /api/workspace/tree`
Returns the directory structure of the workspace to render the file explorer.
**Response**:
```json
{
  "name": "my-api-project",
  "type": "directory",
  "children": [
    {
      "name": "Auth",
      "type": "directory",
      "children": [
        { "name": "Login.req.json", "type": "file", "entity_type": "request" }
      ]
    }
  ]
}
```

## 2. File I/O API (Requests & Environments)

### `GET /api/file/read`
Reads a serialized entity from disk.
**Query Params**: `path` (relative to workspace root)
**Response**: The raw JSON/YAML object of the entity (Request or Environment).

### `POST /api/file/write`
Writes a serialized entity to disk.
**Request Body**:
```json
{
  "path": "Auth/Login.req.json",
  "content": { /* Request Entity JSON */ }
}
```

## 3. Git Operations API

### `POST /api/git/commit`
Creates a new commit with the currently staged files.
**Request Body**:
```json
{
  "message": "Update login endpoint URL"
}
```
**Response**:
```json
{
  "success": true,
  "hash": "a1b2c3d4e5"
}
```

### `POST /api/git/push`
Pushes local commits to the configured remote.
**Response**:
```json
{
  "success": true,
  "output": "To https://github.com/user/repo.git\n   a1b2c3d..f6g7h8i  master -> master"
}
```

### `GET /api/git/log`
Retrieves the commit history of the workspace.
**Response**:
```json
[
  {
    "hash": "a1b2c3d4e5",
    "message": "Update login endpoint URL",
    "author": "dev@example.com",
    "date": "2026-03-12T10:00:00Z"
  }
]
```

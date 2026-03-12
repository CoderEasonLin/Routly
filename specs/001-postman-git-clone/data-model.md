# Data Model: API Client with Git Version Control

## Core Entities

### 1. Workspace
A Workspace represents a local Git repository that contains API collections and environments.
- `id` (string, UUID)
- `name` (string): The human-readable name of the workspace.
- `path` (string): The absolute path on the local file system.
- `activeEnvironmentId` (string, optional): The ID of the currently selected environment.

### 2. Request
Represents a single HTTP request configuration to be saved to disk.
- `id` (string, UUID)
- `name` (string): User-friendly name.
- `method` (string): GET, POST, PUT, DELETE, etc.
- `url` (string): The target endpoint, which can include variable placeholders e.g., `{{base_url}}/api/users`.
- `headers` (Array<{key: string, value: string, active: boolean}>)
- `body` (object):
  - `type` (string): none, raw, json, form-data, urlencoded
  - `content` (string | Array): The body payload.
- `auth` (object):
  - `type` (string): none, bearer, basic, etc.
  - `config` (object): Auth details, e.g., `{ token: "{{bearer_token}}" }`.

### 3. Environment
A set of key-value pairs used for variable substitution across requests. Environment variable files should demarcate "local-only" values that must not be committed.
- `id` (string, UUID)
- `name` (string)
- `variables` (Array<EnvironmentVariable>)

### 4. EnvironmentVariable
- `key` (string)
- `value` (string): Default/shared value.
- `localValue` (string, optional): A value that overrides `value` locally and is masked/ignored during git commits.
- `isSecret` (boolean): Flag to indicate if the value contains sensitive credentials.

### 5. GitCommit (Domain Object)
Represents a commit in the local repository.
- `hash` (string)
- `message` (string)
- `author` (string)
- `timestamp` (Date)
- `filesChanged` (Array<string>)

## Serialization Format
Requests and Environments should be serialized as human-readable JSON files (e.g., `[request_name].req.json`) to ensure clean Git diffs. The `Environment` files should use a `.gitignore` pattern or a custom serializer in the Express backend to strip `localValue` properties before a git commit is executed.

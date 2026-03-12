import axios from 'axios';

const api = axios.create({ baseURL: 'http://localhost:3001/api' });

// === Workspace ===
export const getWorkspaceTree = (path) => api.get('/workspace/tree', { params: { path } });
export const getWorkspaceStatus = (path) => api.get('/workspace/status', { params: { path } });

// === File IO ===
export const readFile = (path) => api.get('/file/read', { params: { path } });
export const writeFile = (path, content) => api.post('/file/write', { path, content });

// === Git ===
export const gitLog = (path, limit = 20) => api.get('/git/log', { params: { path, limit } });
export const gitCommit = (path, message) => api.post('/git/commit', { path, message });
export const gitPush = (path) => api.post('/git/push', { path });
export const gitPull = (path) => api.post('/git/pull', { path });
export const gitBranches = (path) => api.get('/git/branches', { params: { path } });

// === HTTP Execution ===
export const executeRequest = (payload) => api.post('/http/execute', payload);

// === Dialog ===
export const openFolderDialog = () => api.post('/dialog/open-folder');

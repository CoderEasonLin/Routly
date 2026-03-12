import { ref } from 'vue';

/**
 * Reactive state for the currently open workspace.
 */
export const workspacePath = ref(null);
export const workspaceTree = ref(null);
export const activeFile = ref(null);

/**
 * Reactive state for current request being edited.
 */
export const currentRequest = ref({
  name: 'New Request',
  method: 'GET',
  url: '',
  headers: [],
  body: { type: 'none', content: '' },
  auth: { type: 'none', config: {} },
});

/**
 * Reactive state for the HTTP response.
 */
export const currentResponse = ref(null);
export const isLoading = ref(false);

/**
 * Reactive state for git.
 */
export const gitStatus = ref(null);
export const gitHistory = ref([]);

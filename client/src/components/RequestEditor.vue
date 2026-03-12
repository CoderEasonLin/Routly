<template>
  <div class="request-editor">
    <!-- Request name / save bar -->
    <div class="name-bar">
      <input v-model="request.name" placeholder="Request name…" class="name-input" />
      <button @click="onSave" :disabled="!workspacePath || saving" class="save-btn">
        {{ saving ? 'Saving…' : savedFlash ? 'Saved ✓' : '💾 Save' }}
      </button>
    </div>

    <!-- URL Bar -->
    <div class="url-bar">
      <select v-model="request.method" class="method-select">
        <option v-for="m in methods" :key="m">{{ m }}</option>
      </select>
      <input
        v-model="request.url"
        type="text"
        placeholder="Enter request URL..."
        class="url-input"
        @keyup.enter="onSend"
      />
      <button @click="onSend" :disabled="!request.url || isLoading" class="send-btn">
        {{ isLoading ? 'Sending…' : 'Send' }}
      </button>
    </div>

    <!-- Tabs -->
    <div class="editor-tabs">
      <button
        v-for="tab in tabs"
        :key="tab"
        :class="['tab-btn', { active: activeTab === tab }]"
        @click="activeTab = tab"
      >{{ tab }}</button>
    </div>

    <!-- Headers -->
    <div v-if="activeTab === 'Headers'" class="tab-content">
      <div v-for="(hdr, idx) in request.headers" :key="idx" class="header-row">
        <input v-model="hdr.key" placeholder="Header name" />
        <input v-model="hdr.value" placeholder="Value" />
        <button @click="removeHeader(idx)">✕</button>
      </div>
      <button class="add-btn" @click="addHeader">+ Add Header</button>
    </div>

    <!-- Body -->
    <div v-if="activeTab === 'Body'" class="tab-content">
      <select v-model="request.body.type">
        <option value="none">None</option>
        <option value="json">JSON</option>
        <option value="raw">Raw text</option>
      </select>
      <textarea
        v-if="request.body.type !== 'none'"
        v-model="request.body.content"
        placeholder="Request body…"
        rows="10"
        class="body-textarea"
      />
    </div>

    <!-- Auth -->
    <div v-if="activeTab === 'Auth'" class="tab-content">
      <select v-model="request.auth.type">
        <option value="none">No Auth</option>
        <option value="bearer">Bearer Token</option>
        <option value="basic">Basic</option>
      </select>
      <input v-if="request.auth.type === 'bearer'" v-model="request.auth.config.token" placeholder="Token" />
      <template v-if="request.auth.type === 'basic'">
        <input v-model="request.auth.config.username" placeholder="Username" />
        <input v-model="request.auth.config.password" type="password" placeholder="Password" />
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import path from 'path-browserify';
import { currentRequest, currentResponse, isLoading, workspacePath, workspaceTree, activeFile } from '../store/state.js';
import { executeRequest, writeFile, getWorkspaceTree } from '../services/api.js';
import { resolveRequest } from '../utils/env-parser.js';

const request = currentRequest;
const activeTab = ref('Headers');
const tabs = ['Headers', 'Body', 'Auth'];
const methods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD'];
const saving = ref(false);
const savedFlash = ref(false);

function addHeader() { request.value.headers.push({ key: '', value: '', active: true }); }
function removeHeader(idx) { request.value.headers.splice(idx, 1); }

/**
 * Save the current request to disk as <name>.req.json inside the workspace.
 * If a file is currently open (activeFile), overwrite it.
 * Otherwise, create it at the workspace root.
 */
async function onSave() {
  if (!workspacePath.value) return;
  saving.value = true;
  try {
    const safeName = (request.value.name || 'unnamed').replace(/[/\\?%*:|"<>]/g, '-');
    const filePath = activeFile.value
      ? activeFile.value  // overwrite existing file
      : path.join(workspacePath.value, `${safeName}.req.json`);

    await writeFile(filePath, request.value);
    activeFile.value = filePath;

    // Refresh the sidebar tree
    const { data } = await getWorkspaceTree(workspacePath.value);
    workspaceTree.value = data.children;

    // Brief success flash
    savedFlash.value = true;
    setTimeout(() => { savedFlash.value = false; }, 1500);
  } finally {
    saving.value = false;
  }
}

async function onSend() {
  isLoading.value = true;
  currentResponse.value = null;
  try {
    const resolved = resolveRequest(request.value, []);
    const { data } = await executeRequest({
      method: resolved.method,
      url: resolved.url,
      headers: resolved.headers,
      body: resolved.body,
    });
    currentResponse.value = data;
  } catch (err) {
    currentResponse.value = {
      status: 0,
      statusText: 'Error',
      headers: {},
      body: err?.response?.data || err.message,
      elapsedMs: 0,
    };
  } finally {
    isLoading.value = false;
  }
}
</script>

<style scoped>
.request-editor { display: flex; flex-direction: column; gap: 0; }
.name-bar { display: flex; gap: 8px; padding: 8px 12px; background: #11111b; border-bottom: 1px solid #313244; align-items: center; }
.name-input { flex: 1; padding: 6px 10px; background: #1e1e2e; color: #cdd6f4; border: 1px solid #45475a; border-radius: 6px; font-size: 13px; }
.name-input::placeholder { color: #6c7086; }
.save-btn { padding: 6px 14px; background: #313244; color: #a6e3a1; border: 1px solid #45475a; border-radius: 6px; font-size: 13px; cursor: pointer; white-space: nowrap; }
.save-btn:hover:not(:disabled) { background: #45475a; }
.save-btn:disabled { opacity: 0.5; cursor: not-allowed; }
.url-bar { display: flex; gap: 8px; padding: 12px; background: #1e1e2e; border-bottom: 1px solid #313244; }
.method-select { padding: 8px 12px; background: #313244; color: #cdd6f4; border: 1px solid #45475a; border-radius: 6px; font-weight: 600; }
.url-input { flex: 1; padding: 8px 12px; background: #181825; color: #cdd6f4; border: 1px solid #45475a; border-radius: 6px; font-size: 14px; }
.url-input::placeholder { color: #6c7086; }
.send-btn { padding: 8px 20px; background: #89b4fa; color: #1e1e2e; border: none; border-radius: 6px; font-weight: 700; cursor: pointer; }
.send-btn:hover:not(:disabled) { background: #b4befe; }
.send-btn:disabled { opacity: 0.5; cursor: not-allowed; }
.editor-tabs { display: flex; gap: 2px; padding: 0 12px; background: #181825; border-bottom: 1px solid #313244; }
.tab-btn { padding: 8px 16px; background: none; border: none; border-bottom: 2px solid transparent; color: #6c7086; cursor: pointer; font-size: 13px; }
.tab-btn.active { border-bottom-color: #89b4fa; color: #cdd6f4; }
.tab-content { padding: 16px; display: flex; flex-direction: column; gap: 8px; }
.header-row { display: flex; gap: 8px; }
.header-row input { flex: 1; padding: 6px 10px; background: #313244; color: #cdd6f4; border: 1px solid #45475a; border-radius: 4px; }
.header-row button { padding: 6px 10px; background: #f38ba8; color: #1e1e2e; border: none; border-radius: 4px; cursor: pointer; }
.add-btn { align-self: flex-start; padding: 6px 14px; background: #313244; color: #89b4fa; border: 1px solid #45475a; border-radius: 4px; cursor: pointer; }
.body-textarea { padding: 8px; background: #181825; color: #cdd6f4; border: 1px solid #45475a; border-radius: 6px; font-family: 'JetBrains Mono', monospace; resize: vertical; }
select { padding: 6px 10px; background: #313244; color: #cdd6f4; border: 1px solid #45475a; border-radius: 4px; }
input { padding: 6px 10px; background: #313244; color: #cdd6f4; border: 1px solid #45475a; border-radius: 4px; }
</style>

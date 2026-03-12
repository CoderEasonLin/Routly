<template>
  <div class="git-panel">
    <div class="panel-header">
      <span class="panel-title">Source Control</span>
      <span v-if="status" class="branch-name">⎇ {{ status.branch }}</span>
    </div>

    <!-- Commit section -->
    <div class="commit-section">
      <textarea v-model="commitMessage" placeholder="Commit message…" rows="3" class="commit-input" />
      <button @click="onCommit" :disabled="!commitMessage || committing" class="commit-btn">
        {{ committing ? 'Committing…' : '✓ Commit All' }}
      </button>
    </div>

    <!-- Push / Pull -->
    <div class="sync-section">
      <button @click="onPull" :disabled="syncing" class="sync-btn pull">↓ Pull</button>
      <button @click="onPush" :disabled="syncing" class="sync-btn push">↑ Push</button>
    </div>

    <!-- Changed files -->
    <div v-if="status" class="changes-section">
      <div class="changes-group" v-if="status.staged.length">
        <span class="changes-label">Staged ({{ status.staged.length }})</span>
        <div v-for="f in status.staged" :key="'s'+f" class="change-file staged">{{ f }}</div>
      </div>
      <div class="changes-group" v-if="status.unstaged.length">
        <span class="changes-label">Unstaged ({{ status.unstaged.length }})</span>
        <div v-for="f in status.unstaged" :key="'u'+f" class="change-file unstaged">{{ f }}</div>
      </div>
      <div class="changes-group" v-if="status.untracked.length">
        <span class="changes-label">Untracked ({{ status.untracked.length }})</span>
        <div v-for="f in status.untracked" :key="'t'+f" class="change-file untracked">{{ f }}</div>
      </div>
      <div v-if="!status.hasChanges" class="no-changes">No changes to commit.</div>
    </div>

    <!-- History -->
    <div class="history-section">
      <div class="section-title">History</div>
      <div v-for="entry in gitHistory" :key="entry.hash" class="history-entry">
        <span class="commit-hash">{{ entry.hash.slice(0, 7) }}</span>
        <span class="commit-message">{{ entry.message }}</span>
        <span class="commit-date">{{ formatDate(entry.date) }}</span>
      </div>
      <div v-if="!gitHistory.length" class="no-changes">No commits yet.</div>
    </div>

    <!-- Sync output -->
    <div v-if="syncOutput" class="sync-output">
      <pre>{{ syncOutput }}</pre>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { workspacePath, gitStatus, gitHistory } from '../store/state.js';
import * as api from '../services/api.js';

const commitMessage = ref('');
const committing = ref(false);
const syncing = ref(false);
const syncOutput = ref('');
const status = gitStatus;

async function refreshStatus() {
  if (!workspacePath.value) return;
  const { data } = await api.getWorkspaceStatus(workspacePath.value);
  gitStatus.value = data;
  const logRes = await api.gitLog(workspacePath.value);
  gitHistory.value = logRes.data;
}

async function onCommit() {
  if (!commitMessage.value || !workspacePath.value) return;
  committing.value = true;
  try {
    await api.gitCommit(workspacePath.value, commitMessage.value);
    commitMessage.value = '';
    await refreshStatus();
  } finally {
    committing.value = false;
  }
}

async function onPush() {
  syncing.value = true;
  syncOutput.value = '';
  try {
    const { data } = await api.gitPush(workspacePath.value);
    syncOutput.value = data.output;
    await refreshStatus();
  } catch (e) {
    syncOutput.value = e?.response?.data?.error || e.message;
  } finally {
    syncing.value = false;
  }
}

async function onPull() {
  syncing.value = true;
  syncOutput.value = '';
  try {
    const { data } = await api.gitPull(workspacePath.value);
    syncOutput.value = data.output;
    await refreshStatus();
  } catch (e) {
    syncOutput.value = e?.response?.data?.error || e.message;
  } finally {
    syncing.value = false;
  }
}

function formatDate(iso) {
  return iso ? new Date(iso).toLocaleDateString() : '';
}

onMounted(refreshStatus);
</script>

<style scoped>
.git-panel { display: flex; flex-direction: column; height: 100%; background: #1e1e2e; overflow-y: auto; }
.panel-header { display: flex; align-items: center; justify-content: space-between; padding: 12px 16px; border-bottom: 1px solid #313244; }
.panel-title { color: #cdd6f4; font-weight: 600; font-size: 13px; }
.branch-name { color: #89b4fa; font-size: 12px; background: #313244; padding: 2px 8px; border-radius: 10px; }
.commit-section { padding: 12px 16px; border-bottom: 1px solid #313244; display: flex; flex-direction: column; gap: 8px; }
.commit-input { background: #181825; color: #cdd6f4; border: 1px solid #45475a; border-radius: 6px; padding: 8px; font-family: inherit; resize: none; }
.commit-btn { padding: 8px 16px; background: #a6e3a1; color: #1e1e2e; border: none; border-radius: 6px; font-weight: 700; cursor: pointer; }
.commit-btn:disabled { opacity: 0.5; cursor: not-allowed; }
.sync-section { display: flex; gap: 8px; padding: 8px 16px; border-bottom: 1px solid #313244; }
.sync-btn { flex: 1; padding: 7px; border: 1px solid #45475a; border-radius: 6px; cursor: pointer; font-weight: 600; background: #313244; }
.sync-btn.pull { color: #89dceb; }
.sync-btn.push { color: #f5c2e7; }
.sync-btn:disabled { opacity: 0.5; cursor: not-allowed; }
.changes-section { padding: 12px 16px; border-bottom: 1px solid #313244; }
.changes-group { margin-bottom: 8px; }
.changes-label { font-size: 11px; color: #6c7086; text-transform: uppercase; letter-spacing: 0.05em; }
.change-file { font-size: 12px; padding: 2px 8px; border-radius: 3px; margin-top: 2px; }
.change-file.staged { color: #a6e3a1; }
.change-file.unstaged { color: #fab387; }
.change-file.untracked { color: #6c7086; }
.no-changes { color: #6c7086; font-size: 12px; padding: 4px 0; }
.history-section { padding: 12px 16px; flex: 1; }
.section-title { font-size: 11px; color: #6c7086; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 8px; }
.history-entry { display: flex; gap: 8px; align-items: baseline; padding: 6px 0; border-bottom: 1px solid #313244; }
.commit-hash { color: #89b4fa; font-family: monospace; font-size: 12px; min-width: 48px; }
.commit-message { flex: 1; color: #cdd6f4; font-size: 12px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.commit-date { color: #6c7086; font-size: 11px; white-space: nowrap; }
.sync-output { padding: 8px 16px; border-top: 1px solid #313244; }
.sync-output pre { margin: 0; font-size: 11px; color: #a6e3a1; white-space: pre-wrap; background: #181825; padding: 8px; border-radius: 4px; }
</style>

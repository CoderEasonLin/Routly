<template>
  <div class="response-viewer">
    <div v-if="!response && !isLoading" class="empty-state">
      <p>Send a request to see the response here.</p>
    </div>

    <div v-if="isLoading" class="loading">
      <div class="spinner" />
      <p>Waiting for response…</p>
    </div>

    <template v-if="response && !isLoading">
      <!-- Status bar -->
      <div class="status-bar">
        <span :class="['status-code', statusClass]">{{ response.status }} {{ response.statusText }}</span>
        <span class="elapsed">{{ response.elapsedMs }}ms</span>
      </div>

      <!-- Response tabs -->
      <div class="response-tabs">
        <button v-for="tab in tabs" :key="tab" :class="['tab-btn', { active: activeTab === tab }]" @click="activeTab = tab">{{ tab }}</button>
      </div>

      <!-- Body -->
      <div v-if="activeTab === 'Body'" class="tab-content">
        <pre class="response-body">{{ formattedBody }}</pre>
      </div>

      <!-- Headers -->
      <div v-if="activeTab === 'Headers'" class="tab-content">
        <div v-for="(val, key) in response.headers" :key="key" class="header-row">
          <span class="header-key">{{ key }}</span>
          <span class="header-val">{{ val }}</span>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { currentResponse, isLoading } from '../store/state.js';

const response = currentResponse;
const activeTab = ref('Body');
const tabs = ['Body', 'Headers'];

const statusClass = computed(() => {
  if (!response.value) return '';
  const s = response.value.status;
  if (s >= 200 && s < 300) return 'ok';
  if (s >= 400 && s < 500) return 'client-err';
  if (s >= 500) return 'server-err';
  return 'neutral';
});

const formattedBody = computed(() => {
  if (!response.value) return '';
  const body = response.value.body;
  if (typeof body === 'object') return JSON.stringify(body, null, 2);
  try { return JSON.stringify(JSON.parse(body), null, 2); } catch { return body; }
});
</script>

<style scoped>
.response-viewer { height: 100%; display: flex; flex-direction: column; background: #181825; }
.empty-state, .loading { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; color: #6c7086; gap: 12px; }
.spinner { width: 32px; height: 32px; border: 3px solid #313244; border-top-color: #89b4fa; border-radius: 50%; animation: spin 0.8s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
.status-bar { display: flex; align-items: center; gap: 16px; padding: 10px 16px; background: #1e1e2e; border-bottom: 1px solid #313244; }
.status-code { font-weight: 700; font-size: 14px; }
.status-code.ok { color: #a6e3a1; }
.status-code.client-err { color: #fab387; }
.status-code.server-err { color: #f38ba8; }
.status-code.neutral { color: #cdd6f4; }
.elapsed { color: #6c7086; font-size: 12px; margin-left: auto; }
.response-tabs { display: flex; padding: 0 12px; background: #181825; border-bottom: 1px solid #313244; }
.tab-btn { padding: 8px 16px; background: none; border: none; border-bottom: 2px solid transparent; color: #6c7086; cursor: pointer; font-size: 13px; }
.tab-btn.active { border-bottom-color: #89b4fa; color: #cdd6f4; }
.tab-content { flex: 1; overflow: auto; padding: 12px 16px; }
.response-body { margin: 0; font-family: 'JetBrains Mono', monospace; font-size: 13px; color: #cdd6f4; white-space: pre-wrap; word-break: break-word; }
.header-row { display: flex; gap: 16px; padding: 4px 0; border-bottom: 1px solid #313244; font-size: 13px; }
.header-key { color: #89dceb; min-width: 200px; font-weight: 600; }
.header-val { color: #cdd6f4; word-break: break-all; }
</style>

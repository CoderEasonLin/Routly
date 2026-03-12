<template>
  <div class="app">
    <!-- Top navigation bar -->
    <header class="topbar">
      <div class="topbar-logo">
        <span class="logo-icon">⬡</span>
        <span class="logo-text">Routly</span>
      </div>
      <div class="topbar-tabs">
        <button
          v-for="view in views"
          :key="view"
          :class="['view-tab', { active: activeView === view }]"
          @click="activeView = view"
        >{{ view }}</button>
      </div>
    </header>

    <!-- Main layout -->
    <div class="main-layout">
      <!-- Sidebar -->
      <aside class="sidebar-pane">
        <Sidebar />
      </aside>

      <!-- Center: request/response editor -->
      <main class="center-pane">
        <RequestEditor />
        <div class="divider" />
        <ResponseViewer />
      </main>

      <!-- Right: Git or Env panel -->
      <aside class="right-pane">
        <div v-if="activeView === 'Git'">
          <GitPanel />
        </div>
        <div v-else>
          <EnvManager />
        </div>
      </aside>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import Sidebar from './components/Sidebar.vue';
import RequestEditor from './components/RequestEditor.vue';
import ResponseViewer from './components/ResponseViewer.vue';
import GitPanel from './components/GitPanel.vue';
import EnvManager from './components/EnvManager.vue';

const views = ['Git', 'Environments'];
const activeView = ref('Git');
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

body {
  background: #11111b;
  color: #cdd6f4;
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 14px;
  height: 100vh;
  overflow: hidden;
}

#app { height: 100vh; display: flex; flex-direction: column; }
</style>

<style scoped>
.app { height: 100vh; display: flex; flex-direction: column; }
.topbar { display: flex; align-items: center; gap: 16px; padding: 0 16px; background: #11111b; border-bottom: 1px solid #313244; height: 48px; flex-shrink: 0; }
.topbar-logo { display: flex; align-items: center; gap: 8px; }
.logo-icon { color: #89b4fa; font-size: 20px; }
.logo-text { color: #cdd6f4; font-weight: 700; font-size: 16px; letter-spacing: -0.3px; }
.topbar-tabs { display: flex; gap: 2px; margin-left: auto; }
.view-tab { padding: 6px 14px; background: none; border: 1px solid transparent; border-radius: 6px; color: #6c7086; cursor: pointer; font-size: 13px; }
.view-tab.active { border-color: #45475a; background: #313244; color: #cdd6f4; }
.main-layout { flex: 1; display: grid; grid-template-columns: 220px 1fr 280px; overflow: hidden; }
.sidebar-pane { overflow-y: auto; }
.center-pane { display: flex; flex-direction: column; overflow: hidden; }
.divider { height: 4px; background: #313244; }
.right-pane { overflow-y: auto; border-left: 1px solid #313244; }
</style>

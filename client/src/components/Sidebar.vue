<template>
  <div class="sidebar">
    <!-- Open workspace button if no workspace open -->
    <div v-if="!workspacePath" class="open-workspace">
      <button @click="onOpenFolder" :disabled="opening" class="open-btn">
        {{ opening ? 'Selecting…' : '📂 Open Workspace' }}
      </button>
      <p class="hint">Select a local Git repository to use as your workspace.</p>
    </div>

    <template v-else>
      <div class="workspace-header">
        <span class="ws-name">{{ workspaceName }}</span>
        <button @click="onOpenFolder" class="change-btn" title="Open different folder">⇄</button>
      </div>

      <!-- File tree -->
      <div class="file-tree">
        <TreeNode
          v-for="node in tree"
          :key="node.path"
          :node="node"
          @open="onOpenFile"
        />
        <div v-if="!tree?.length" class="empty-tree">No requests found.<br/>Create a .req.json file in your workspace.</div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import path from 'path-browserify';
import { workspacePath, workspaceTree, activeFile, currentRequest } from '../store/state.js';
import { openFolderDialog, getWorkspaceTree, readFile } from '../services/api.js';
import TreeNode from './TreeNode.vue';

const opening = ref(false);
const tree = workspaceTree;
const workspaceName = computed(() => workspacePath.value ? workspacePath.value.split(/[\\/]/).pop() : '');

async function onOpenFolder() {
  opening.value = true;
  try {
    const { data } = await openFolderDialog();
    if (data.cancelled || !data.path) return;
    workspacePath.value = data.path;
    const { data: treeData } = await getWorkspaceTree(data.path);
    workspaceTree.value = treeData.children;
  } finally {
    opening.value = false;
  }
}

async function onOpenFile(filePath) {
  activeFile.value = filePath;
  const { data } = await readFile(filePath);

  // Derive name from filename as fallback if JSON doesn't have one
  const fileBasename = filePath.split(/[/\\]/).pop();
  const derivedName = fileBasename.replace(/\.req\.json$/, '');

  currentRequest.value = {
    ...currentRequest.value,
    ...data,
    name: data.name || derivedName,
  };
}
</script>

<style scoped>
.sidebar { display: flex; flex-direction: column; height: 100%; background: #181825; overflow-y: auto; border-right: 1px solid #313244; }
.open-workspace { padding: 24px 16px; display: flex; flex-direction: column; gap: 12px; align-items: center; text-align: center; }
.open-btn { padding: 10px 20px; background: #89b4fa; color: #1e1e2e; border: none; border-radius: 8px; font-weight: 700; cursor: pointer; font-size: 14px; }
.hint { color: #6c7086; font-size: 12px; }
.workspace-header { display: flex; align-items: center; justify-content: space-between; padding: 12px 16px; border-bottom: 1px solid #313244; }
.ws-name { color: #cdd6f4; font-weight: 600; font-size: 13px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.change-btn { background: none; border: none; color: #6c7086; cursor: pointer; font-size: 16px; }
.file-tree { flex: 1; padding: 8px 0; }
.empty-tree { color: #6c7086; font-size: 12px; padding: 16px; text-align: center; }
</style>

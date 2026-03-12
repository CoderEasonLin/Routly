<template>
  <div class="tree-node">
    <div class="node-row" @click="toggle">
      <span class="node-icon">{{ node.type === 'directory' ? (open ? '▾' : '▸') : (node.entity_type === 'request' ? '⬡' : '⚙') }}</span>
      <span class="node-name" @click.stop="onClickFile">{{ displayName }}</span>
    </div>
    <div v-if="node.type === 'directory' && open" class="node-children">
      <TreeNode v-for="child in node.children" :key="child.path" :node="child" @open="$emit('open', $event)" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({ node: Object });
const emit = defineEmits(['open']);
const open = ref(true);

const displayName = computed(() => {
  return props.node.name.replace('.req.json', '').replace('.env.json', '');
});

function toggle() { if (props.node.type === 'directory') open.value = !open.value; }
function onClickFile() { if (props.node.type === 'file') emit('open', props.node.path); }
</script>

<style scoped>
.tree-node { user-select: none; }
.node-row { display: flex; align-items: center; gap: 6px; padding: 3px 12px; cursor: pointer; border-radius: 4px; }
.node-row:hover { background: #313244; }
.node-icon { color: #6c7086; font-size: 11px; width: 12px; }
.node-name { font-size: 13px; color: #cdd6f4; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.node-children { padding-left: 16px; }
</style>

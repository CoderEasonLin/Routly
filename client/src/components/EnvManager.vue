<template>
  <div class="env-manager">
    <div class="env-header">
      <select v-model="activeEnvIdx" class="env-select">
        <option :value="-1">-- No Environment --</option>
        <option v-for="(env, i) in environments" :key="i" :value="i">{{ env.name }}</option>
      </select>
      <button @click="addEnv" class="icon-btn" title="New environment">+</button>
    </div>

    <div v-if="activeEnv" class="env-body">
      <div v-for="(v, idx) in activeEnv.variables" :key="idx" class="var-row">
        <input v-model="v.key" placeholder="Variable name" />
        <input v-model="v.value" placeholder="Shared value (committed)" />
        <input v-model="v.localValue" placeholder="Local value (not committed)" />
        <label><input type="checkbox" v-model="v.isSecret" /> Secret</label>
        <button @click="removeVar(idx)">✕</button>
      </div>
      <button class="add-var-btn" @click="addVar">+ Add Variable</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const environments = ref([
  { name: 'Local', variables: [] },
]);
const activeEnvIdx = ref(-1);
const activeEnv = computed(() => activeEnvIdx.value >= 0 ? environments.value[activeEnvIdx.value] : null);

function addEnv() {
  environments.value.push({ name: 'New Environment', variables: [] });
  activeEnvIdx.value = environments.value.length - 1;
}
function addVar() { if (activeEnv.value) activeEnv.value.variables.push({ key: '', value: '', localValue: '', isSecret: false }); }
function removeVar(idx) { if (activeEnv.value) activeEnv.value.variables.splice(idx, 1); }

// Expose the active environment for use in request execution
defineExpose({ activeEnv });
</script>

<style scoped>
.env-manager { background: #1e1e2e; border-top: 1px solid #313244; }
.env-header { display: flex; gap: 8px; align-items: center; padding: 10px 16px; }
.env-select { flex: 1; padding: 6px 10px; background: #313244; color: #cdd6f4; border: 1px solid #45475a; border-radius: 4px; }
.icon-btn { padding: 6px 12px; background: #313244; color: #89b4fa; border: 1px solid #45475a; border-radius: 4px; cursor: pointer; font-size: 16px; }
.env-body { padding: 0 16px 12px; display: flex; flex-direction: column; gap: 6px; }
.var-row { display: flex; gap: 6px; align-items: center; }
.var-row input[type="text"], .var-row input:not([type="checkbox"]) { flex: 1; padding: 5px 8px; background: #181825; color: #cdd6f4; border: 1px solid #45475a; border-radius: 4px; font-size: 12px; }
.var-row label { display: flex; align-items: center; gap: 4px; color: #6c7086; font-size: 12px; white-space: nowrap; }
.var-row button { padding: 5px 8px; background: #f38ba8; color: #1e1e2e; border: none; border-radius: 4px; cursor: pointer; }
.add-var-btn { align-self: flex-start; padding: 5px 12px; background: #313244; color: #89b4fa; border: 1px solid #45475a; border-radius: 4px; cursor: pointer; font-size: 12px; }
</style>

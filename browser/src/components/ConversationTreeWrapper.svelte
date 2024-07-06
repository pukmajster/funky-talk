<script lang="ts">
  import { sidebarSelectedResponse } from "../state";
  import ConversationTree from "./ConversationTree.svelte";
</script>

<div class="w-full max-h-screen bg-neutral-800 overflow-auto grid grid-rows-[64px_1fr]">
  {#if $sidebarSelectedResponse}
    <div class="p-4 bg-neutral-900">
      <h1 class="text-lg">Conversation tree for: <strong>{$sidebarSelectedResponse[0]}, {$sidebarSelectedResponse[1]}</strong></h1>
    </div>
  
    <ConversationTree />
  {/if}
</div>
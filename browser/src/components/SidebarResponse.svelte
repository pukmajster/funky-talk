<script lang="ts">
  import { sidebarSelectedResponse, sidebarSelectedCharacter } from "../state";
  import type { Response } from "../types/talker";

  export let response: Response;

  $: isActiveResponse = $sidebarSelectedResponse && $sidebarSelectedResponse[1] === response.name;

  const { name, scenes } = response;
</script>

<button 
  on:click={() => $sidebarSelectedResponse = [$sidebarSelectedCharacter, name]}
  class="text-left hover:bg-white/10 p-4"
  class:bg-neutral-700={isActiveResponse}
>
  <h2 class="font-bold text-lg">{name}</h2>

  <div class="overflow-y-scroll">
    {#each scenes as scene}
      {#if scene?.subtitle}
        <p class="opacity-60 text-sm overflow-hidden text-ellipsis whitespace-nowrap text-nowrap">- {scene.subtitle}</p>
      {/if}
    {/each}
  </div>
</button>


<script lang="ts">
  import talkers from "../lib/talkers";
  import { sidebarSelectedCharacter } from "../state";
  import SidebarResponse from "./SidebarResponse.svelte";

  let searchQuery = "";
</script>

<div class="w-[400px] max-h-screen grid grid-rows-[auto_1fr] bg-neutral-900 gap-2 ">
  <div class="p-4 space-y-4 backdrop-blur-xl">
    <select class="w-full p-4" bind:value={$sidebarSelectedCharacter}>
      {#each Object.keys(talkers) as talker}
        <option value={talker}>{talker}</option>
      {/each}
    </select>

    <input
      type="text"
      bind:value={searchQuery}
      placeholder="Search"
      class="p-4 w-full"
    />
  </div>

  <div class="flex flex-col gap-0 overflow-y-scroll">
    {#if true}
      {@const talker = talkers[$sidebarSelectedCharacter]}
      {@const responses = Object.entries(talker.responses).filter(([key, value]) => {
        const queryPresentInResponseName = key.toLowerCase().includes(searchQuery.toLowerCase());

        let matchesInSubtitles = 0;
        
        for( const scene in talker?.responses[key]?.scenes){
          const sceneSubtitle = talker.responses[key]?.scenes[scene]?.subtitle;

          if(!sceneSubtitle) continue;

          const doesMatch = sceneSubtitle.toLowerCase().includes(searchQuery.toLowerCase());
          if(doesMatch){
            matchesInSubtitles++;
          }
        }

        return queryPresentInResponseName || matchesInSubtitles > 0;
      } )}


      {#each responses as [responseName, response], i (responseName)}
        <SidebarResponse response={response} />
      {/each}

    {/if}
  </div>
</div>


<style>

</style>

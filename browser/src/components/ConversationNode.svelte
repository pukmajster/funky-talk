<script lang="ts">
  import type { ConversationResponse } from "../lib/conversations";
  import talkers, { type TalkerCharacter } from "../lib/talkers";
  import talker2 from "../lib/talkers2";
  import type { Response } from "../types/talker";

  export let node: ConversationResponse;
  export let level: number = 0;

  $: character = node.character
  $: responseName = node.responseName
  $: response = talker2.responses[responseName] as Response

  const gap = 12;
</script>

<div class="Root" class:RootHasChildren={node.children.length > 0} style={`padding-left: ${gap}px`} >
  <div class=" relative p-2 rounded-lg bg-neutral-900 inline-block mt-2 text-sm max-w-[700px]" >

    {#if level > 0}
      <div class="absolute left-0 h-[1px] mt-[-1px] bg-white/20 top-1/2 translate-y-1/2" style={`width: ${gap}px; left: -${gap}px`} />
      <!-- <div class="absolute left-0 w-[1px] h-1/2 bg-white/20 top-[0px]" style={`left: -${gap}px`} />   -->
    {/if}

    <div class="flex justify-between gap-8 items-center">
      <span class="text-lg" >{character}</span>


      <span class="opacity-50">{response.name}</span>
    </div>
  
    {#if response.scenes?.length > 0}
      {#each Object.entries(response?.scenes) as [sceneName, scene]}
        <div class="" class:hidden={!scene?.subtitle}>
          <p>- {scene?.subtitle}</p>
        </div>
      {/each}
    {/if}
  </div>

  <div>
    <div class="w-full ">
      {#each node.children as child}
        <svelte:self node={child} level={level +1} />
      {/each}
    </div>
  </div>
</div>

<style>

 
</style>
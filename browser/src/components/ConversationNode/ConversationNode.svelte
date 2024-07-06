<script lang="ts">
  import type { ConversationResponse } from "../../lib/conversations";
  import type { Response } from "../../types/talker"
  import talker2, { type TalkerCharacter } from "../../lib/talkers2";

  export let node: ConversationResponse;
  export let level: number = 0;

  $: character = node.character
  $: responseName = node.responseName
  $: response = talker2.responses[responseName] as Response

  const gap = 24;

  const rainbowColouredIndent = (level: number) => {
    const hue = level * 20;
    return `hsl(${hue}, 40%, 20%)`;
  }
</script>

<div class="Root " class:RootHasChildren={node.children.length > 0} style={`padding-left: ${gap}px;`} >

  <div class=" relative p-2 rounded-lg bg-neutral-900 inline-block mt-2 text-sm max-w-[700px]" 
  
    class:bg-orange-700={character === "Coach"}
    class:bg-neutral-900={character === "Biker"}
    class:bg-purple-800={character === "Producer"}
    class:bg-red-700={character === "TeenGirl"}
    class:bg-green-700={character === "NamVet"}
    class:bg-yellow-600={character === "Mechanic"}
    class:bg-blue-800={character === "Gambler"}
    class:bg-neutral-500={character === "Manager"}
    >

    {#if level > 0 && false}
      <div class="absolute left-0 h-[1px] mt-[-1px] bg-white/20 top-1/2 translate-y-1/2" style={`width: ${gap}px; left: -${gap}px`} />
      <!-- <div class="absolute left-0 w-[1px] h-1/2 bg-white/20 top-[0px]" style={`left: -${gap}px`} />   -->
    {/if}



    <div class="flex justify-between gap-8 items-center">
      <span class="text-lg" >{character}</span>
      <span class="opacity-50">{response.name}</span>
    </div>

    <div class="mt-1 mb-2 flex gap-2 flex-wrap">
      {#if node?.ruleCriteria}
        {#each node.ruleCriteria as criteria}
          <span class="bg-neutral-800/20 rounded-xl text-[10px] px-2 ">{criteria}</span>
        {/each}
      {/if}
    </div>
  
  
    {#if response.scenes?.length > 0}
    
    {#each Object.entries(response?.scenes) as [sceneName, scene]}
        <div class="" class:hidden={!scene?.subtitle}>
          
          {#if scene?.then}
            <div class="flex justify-between gap-2 ">
              <span>- {scene?.subtitle}</span>
              <span class="opacity-60 text-nowrap">then {scene.then.target}:<span>{scene.then.concept}</span></span>
            </div>
          {:else}
            <p>- {scene?.subtitle}</p>
          {/if}
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
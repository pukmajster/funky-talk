<script lang="ts">
  import { makeConversationTree } from "../lib/conversations";
  import { sidebarSelectedResponse } from "../state";
  import ConversationNode from "./ConversationNode.svelte";

  $: [character, responseName] = $sidebarSelectedResponse!;
  $: tree = makeConversationTree(character, responseName);

</script>

<div class="p-5 overflow-auto ">
  <ConversationNode node={tree} level={0} />
</div>
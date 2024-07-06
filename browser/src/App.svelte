<script lang="ts">
  import ConversationTreeWrapper from "./components/ConversationTreeWrapper.svelte";
import SidebarBrowser from "./components/SidebarBrowser.svelte";

</script>

<div class="min-h-screen max-h-screen overflow-hidden grid grid-cols-[400px_1fr]">
 <SidebarBrowser />
 <ConversationTreeWrapper/>
</div>

<style>

</style>

import { writable } from "svelte/store";
import type { TalkerCharacter } from "./lib/talkers";

export const sidebarSelectedCharacter = writable<TalkerCharacter>("Gambler");

export type SidebarSelectedResponse = [TalkerCharacter, string];
export const sidebarSelectedResponse = writable<SidebarSelectedResponse | null>(
  null
);

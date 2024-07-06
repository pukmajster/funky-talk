import { writable } from "svelte/store";

export type SidebarCharacter = "Gambler" | "Mechanic" | "Coach" | "Producer";
export const sidebarSelectedCharacter = writable<SidebarCharacter>("Gambler");

export type SidebarSelectedResponse = [SidebarCharacter, string];
export const sidebarSelectedResponse = writable<SidebarSelectedResponse | null>(
  null
);

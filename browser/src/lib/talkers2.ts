import type { TalkerScript } from "../types/talker";

export type TalkerCharacter =
  | "Gambler"
  | "Coach"
  | "Mechanic"
  | "Producer"
  | "Biker"
  | "NamVet"
  | "Manager"
  | "TeenGirl";

async function getTalker2() {
  async function loadCharacters() {
    const talker2 = await fetch("/talker2.json").then((res) => res.json());
    const fetchedTalker = talker2 as TalkerScript;

    return fetchedTalker;
  }

  return await loadCharacters();
}

const talker2 = await getTalker2();
export default talker2;

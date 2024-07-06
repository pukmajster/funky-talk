import type { TalkerScript } from "../types/types";

async function getTalkers() {
  async function loadCharacters() {
    const gambler = await fetch("/talker/gambler.json")
      .then((res) => res.json())
      .catch((err) => console.error(err));
    const coach = await fetch("/talker/coach.json").then((res) => res.json());
    const mechanic = await fetch("/talker/mechanic.json").then((res) =>
      res.json()
    );

    const fetchedTalker = {
      Gambler: gambler,
      Coach: coach,
      Mechanic: mechanic,
    } as Record<string, TalkerScript>;

    return fetchedTalker;
  }

  return await loadCharacters();
}

const talkers = await getTalkers();
export default talkers;

import type { TalkerScript } from "../types/talker";

export type TalkerCharacter = "Gambler" | "Coach" | "Mechanic" | "Producer";

async function getTalkers() {
  async function loadCharacters() {
    const gambler = await fetch("/talker/gambler.json")
      .then((res) => res.json())
      .catch((err) => console.error(err));
    const coach = await fetch("/talker/coach.json").then((res) => res.json());
    const mechanic = await fetch("/talker/mechanic.json").then((res) =>
      res.json()
    );
    const producer = await fetch("/talker/producer.json").then((res) =>
      res.json()
    );

    const fetchedTalker = {
      Gambler: gambler,
      Coach: coach,
      Mechanic: mechanic,
      Producer: producer,
    } as Record<TalkerCharacter, TalkerScript>;

    return fetchedTalker;
  }

  return await loadCharacters();
}

const talkers = await getTalkers();
export default talkers;

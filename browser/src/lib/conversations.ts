import type { Response } from "../types/talker";
import talkers, { type TalkerCharacter } from "./talkers";

export type ConversationResponse = {
  character: TalkerCharacter;
  responseName: string;

  // If true, implies that the response is a parent node in the conversation tree
  // and is only displaying a small portion of all possible child responses
  isParentNode?: boolean;

  children: ConversationResponse[];
};

// To find all the parents of a response, we need to loop through every talker's/character's responses
// and check if they trigger the current response. If they do, we add them to the list of parents and repeat the
// process for each parent until we reach the root of the conversation tree.
function findConversationResponseParents(
  thisTalker: TalkerCharacter,
  thisResponseName: string
) {
  const response: Response = talkers[thisTalker].responses[thisResponseName];
  const thisResponseNameClean = thisResponseName.replace(thisTalker, "");

  talkers[thisTalker];

  const parents: ConversationResponse[] = [];

  let character: TalkerCharacter;
  for (character in talkers) {
    for (const responseName in talkers[character].responses) {
      const response = talkers[character].responses[responseName];

      for (const scene of response.scenes) {
        if (scene.then) {
          const { target, concept } = scene.then;

          // Make sure the followup response matches
          if (
            concept !== thisResponseNameClean ||
            concept !== thisResponseName
          ) {
            continue;
          }

          // Make sure the followup target matches our current talker or is "any"
          if (target.toLocaleLowerCase() != "any" || target !== thisTalker) {
            continue;
          }

          // If we've found a match, add it to the list of parents
          const parentConversationResponse: ConversationResponse = {
            character: target,
            responseName: concept,

            isParentNode: true,

            children: [],
          };
        }
      }
    }
  }
}

function capitalizeFirstLetter(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// To find all children of a response, we loop through every scene in the response and check for any followup responses.
// For every followup response we find, we add it to the list of children and repeat the process for each child until we run
// out of responses to check.
function findConversationResponseChildren(node: ConversationResponse) {
  const thisTalker = node.character;
  const thisResponseName = node.responseName;

  const response: Response = talkers[thisTalker].responses[thisResponseName];

  for (const scene of response.scenes) {
    if (scene.then) {
      const { target, concept } = scene.then;

      console.log(
        `[CONVERSATION TREE] Found child scene with followup response: Target: ${target}, Response: ${concept}`
      );

      // Make a list of possible targets
      // If the target is "any", we just check every talker
      const possibleTargets: TalkerCharacter[] = [];
      if (target.toLocaleLowerCase() === "any") {
        possibleTargets.push(...(Object.keys(talkers) as TalkerCharacter[]));
      } else {
        possibleTargets.push(capitalizeFirstLetter(target) as TalkerCharacter);
      }

      console.log(
        `[CONVERSATION TREE] Listed possible targets: ${possibleTargets}`
      );

      const lookingForResponse = concept;

      for (const target of possibleTargets) {
        // Combine the target and response name to get the full response name stored
        // in talker scripts
        //
        // Example:
        // Response name: "PlayerWorldIntroC31"
        // Target: "Couch"
        //
        // Full response name (Response name + Target) : "PlayerWorldIntroC31Couch"
        //                                                ^ responseName     ^ target
        const lookingForResponseNameWithTarget = lookingForResponse + target;

        console.log(
          `[CONVERSATION TREE] Testing target(${target}) for response ${lookingForResponseNameWithTarget}`
        );

        if (!(target in talkers)) {
          console.error(
            `[CONVERSATION TREE] Target ${target} not found in talkers`
          );
          continue;
        }

        if (lookingForResponseNameWithTarget in talkers[target].responses) {
          const childConversationResponse: ConversationResponse = {
            character: target,
            responseName: lookingForResponseNameWithTarget,
            isParentNode: false,
            children: [],
          };

          node.children.push(childConversationResponse);

          // Recursively find all children of the child response
          findConversationResponseChildren(childConversationResponse);
        }
      }
    }
  }
}

export function makeConversationTree(
  thisTalker: TalkerCharacter,
  thisResponseName: string
) {
  // This is the base node of the conversation tree
  // We then proceed to find all of its parents and children
  const baseNode: ConversationResponse = {
    character: thisTalker,
    responseName: thisResponseName,
    isParentNode: false,
    children: [],
  };

  // Find all children
  findConversationResponseChildren(baseNode);

  // TODO: Find all parents

  return baseNode;
}

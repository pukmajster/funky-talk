import type { Response } from "../types/talker";
import talker2, { type TalkerCharacter } from "./talkers2";

export type ConversationResponse = {
  character: TalkerCharacter;
  responseName: keyof typeof talker2.responses;

  // If true, implies that the response is a parent node in the conversation tree
  // and is only displaying a small portion of all possible child responses
  isParentNode?: boolean;

  ruleCriteria?: string[];

  children: ConversationResponse[];
};

function responseNameToCharacter(responseName: string) {
  if (responseName.endsWith("Gambler")) return "Gambler";
  if (responseName.endsWith("Coach")) return "Coach";
  if (responseName.endsWith("Mechanic")) return "Mechanic";
  if (responseName.endsWith("Producer")) return "Producer";
  if (responseName.endsWith("Biker")) return "Biker";
  if (responseName.endsWith("NamVet")) return "NamVet";
  if (responseName.endsWith("Manager")) return "Manager";
  if (responseName.endsWith("TeenGirl")) return "TeenGirl";
  return null;
}

export const allCharacters: TalkerCharacter[] = [
  "Gambler",
  "Coach",
  "Mechanic",
  "Producer",
  "Biker",
  "NamVet",
  "Manager",
  "TeenGirl",
];

function responseBelongsToCharacter(
  responseName: string,
  character: TalkerCharacter
) {
  return responseName.endsWith(character);
}

function capitalizeFirstLetter(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// To find all children of a response, we loop through every scene in the response and check for any followup responses.
// For every followup response we find, we add it to the list of children and repeat the process for each child until we run
// out of responses to check.
function findConversationResponseChildren(
  node: ConversationResponse,
  depth = 0
) {
  // If we've reached a depth of 5, we stop looking for children
  if (depth >= 6) {
    return;
  }

  const thisResponseName = node.responseName;

  const response: Response = talker2.responses[thisResponseName];

  // Prevent duplicate subtitles
  const evaluatedSubtitles: string[] = [];

  // Take the scene list and remove any duplicate followup scenes that share the same target and concept
  const uniqueScenes = response.scenes.filter(
    (scene, index, self) =>
      index ===
      self.findIndex(
        (s) =>
          s.then?.target === scene.then?.target &&
          s.then?.concept === scene.then?.concept
      )
  );

  for (const scene of uniqueScenes) {
    if (scene?.then) {
      const { target, concept } = scene.then;

      console.log(
        `[CONVERSATION TREE] Found child scene with followup response: Target: ${target}, Response: ${concept}`
      );

      // Make a list of possible targets
      // If the target is "any", we just check every talker
      const possibleTargets: TalkerCharacter[] = [];
      if (target.toLocaleLowerCase() === "any") {
        possibleTargets.push(...allCharacters);
      } else if (target.toLocaleLowerCase() === "self") {
        possibleTargets.push(node.character as TalkerCharacter);
        continue;
      } else {
        possibleTargets.push(capitalizeFirstLetter(target) as TalkerCharacter);
      }

      console.log(
        `[CONVERSATION TREE] Listed possible targets: ${possibleTargets}`
      );

      // -------------------------------------------------
      // Take the concept and retrieve a matching concept criterion
      // -------------------------------------------------

      const criterionLookup = Object.entries(talker2.criterions).find(
        ([criterionName, criterion]) => {
          return (
            criterion.matchKey === "Concept" && criterion.matchValue === concept
          );
        }
      );

      if (!criterionLookup) {
        console.log(
          `[CONVERSATION TREE] No matching concept criterion found for ${concept}`
        );
        continue;
      }

      const [criterionName, criterion] = criterionLookup;

      console.log(
        `[CONVERSATION TREE] Found matching concept criterion: ${criterionName}`
      );

      // -------------------------------------------------
      // Find rules with the matching concept criterion
      // -------------------------------------------------

      const rulesWithMatchingConcept = Object.entries(talker2.rules)
        .filter(([ruleName, rule]) => {
          const includesSubjectSelection = rule.criteria
            .join(" ")
            .includes("SubjectIs");

          const conceptMatch = rule.criteria.includes(criterionName);

          if (includesSubjectSelection) {
            // Check if the subject is not allowed in the rule
            if (rule.criteria.includes("SubjectIsNot" + target)) {
              console.log(
                `[CONVERSATION TREE] Subject ${target} is not allowed in rule ${rule.name}`
              );

              return false;
            }

            // Check if subject is allowed
            const isAllowed = rule.criteria.includes("SubjectIs" + target);
            return conceptMatch && isAllowed;
          }

          return conceptMatch;
        })
        .map(([ruleName, rule]) => rule);

      console.log(
        `[CONVERSATION TREE] Found rules with matching concept: ${rulesWithMatchingConcept.length}`
      );

      for (const rule of rulesWithMatchingConcept) {
        console.log(
          `[CONVERSATION TREE] Found rule with matching concept: ${rule.name}`
        );

        if (!(rule.response in talker2.responses)) {
          console.log(
            `[CONVERSATION TREE] Response ${rule.response} not found in talker2.responses`
          );
          continue;
        }

        const response = talker2.responses[rule.response];

        const character = responseNameToCharacter(response.name);

        if (!character) {
          console.log(
            `[CONVERSATION TREE] Skipping response ${response.name} because the target character is not recognized`
          );
          continue;
        }

        if (!possibleTargets.includes(character)) {
          console.log(
            `[CONVERSATION TREE] Skipping response ${response.name} because the target character is not recognized`
          );
          continue;
        }

        if (character)
          if (!responseBelongsToCharacter(response.name, character)) {
            console.log(
              `[CONVERSATION TREE] Skipping response ${response.name} because the target character doesn't match`
            );
            continue;
          }

        console.log(
          `[CONVERSATION TREE] Found response with matching concept: ${response.name}`
        );

        const childConversationResponse: ConversationResponse = {
          character: character as TalkerCharacter,
          responseName: response.name,
          isParentNode: false,
          ruleCriteria: rule.criteria,
          children: [],
        };

        node.children.push(childConversationResponse);

        // Recursively find all children of the child response
        findConversationResponseChildren(childConversationResponse, depth + 1);
      }
    }
  }
}

export function makeConversationTree(
  thisTalker: TalkerCharacter,
  thisResponseName: string
) {
  const response = talker2.responses[thisResponseName];

  // This is the base node of the conversation tree
  // We then proceed to find all of its parents and children
  const baseNode: ConversationResponse = {
    character: thisTalker,
    responseName: thisResponseName,
    isParentNode: false,
    children: [],
  };

  console.log(
    "---------- MAKING CONVERSATION ----------------------------------"
  );

  // Find all children
  findConversationResponseChildren(baseNode, 0);

  // TODO: Find all parents

  return baseNode;
}

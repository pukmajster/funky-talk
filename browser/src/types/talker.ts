import type { TalkerCharacter } from "../lib/talkers";

export interface Criterion {
  name: string;
  matchKey: string;
  matchValue: string;
  weight?: number;
  required?: boolean;
}

export interface Response {
  name: string;
  scenes: Scene[];
}

type ResponseTarget = TalkerCharacter | "any";

export interface SceneThenFollowUp {
  target: ResponseTarget;
  concept: string;
  responseContext: string;
  delay: number;
}

export interface Scene {
  scene: string;
  then?: SceneThenFollowUp;
  subtitle: string;
}

export interface Rule {
  name: string;
  criteria: string[];
  applyContext?: string;
  applyContextToWorld?: boolean;
  response: string;
}

export interface TalkerScript {
  rules: Record<string, Rule>;
  responses: Record<string, Response>;
  criterions: Record<string, Criterion>;
}

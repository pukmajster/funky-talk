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

export interface SceneThenFollowUp {
  target: string;
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
  criteria: Criterion[];
  applyContext?: string;
  applyContextToWorld?: boolean;
  response: string;
}

export interface TalkerScript {
  rules: Record<string, Rule>;
  responses: Record<string, Response>;
  criterions: Record<string, Criterion>;
}

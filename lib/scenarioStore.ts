import { Scenario } from './scenarioGenerator';

const SCENARIO_STORE: Map<string, Scenario> = new Map();

export function storeScenario(scenario: Scenario): void {
  SCENARIO_STORE.set(scenario.scenario_id, scenario);
}

export function getScenario(scenarioId: string): Scenario | undefined {
  return SCENARIO_STORE.get(scenarioId);
}

export function deleteScenario(scenarioId: string): void {
  SCENARIO_STORE.delete(scenarioId);
}

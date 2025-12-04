export enum ScenarioType {
  NEW_HIRE = 'NEW_HIRE',
  ROLE_CHANGE = 'ROLE_CHANGE',
  TERMINATION = 'TERMINATION',
}

export enum NodeStatus {
  IDLE = 'idle',
  ACTIVE = 'active',
  COMPLETED = 'completed',
  SKIPPED = 'skipped',
}

export interface SimulationState {
  isActive: boolean;
  currentStepId: string | null;
  completedStepIds: string[];
  activeScenario: ScenarioType | null;
  logs: string[];
}

export interface IAMNodeData {
  label: string;
  subLabel?: string;
  iconName?: string;
  status: NodeStatus;
  type?: 'trigger' | 'process' | 'decision' | 'action' | 'parallel' | 'end' | 'gate';
  gateType?: 'AND' | 'OR' | 'XOR';
}

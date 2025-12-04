
import { Edge, Node } from 'reactflow';
import { IAMNodeData, NodeStatus } from '../types';

// Helper to create nodes easily
const createNode = (
  id: string, 
  position: { x: number, y: number }, 
  data: Partial<IAMNodeData>
): Node<IAMNodeData> => ({
  id,
  position,
  type: 'custom',
  data: {
    label: data.label || 'Node',
    subLabel: data.subLabel || '',
    iconName: data.iconName,
    status: NodeStatus.IDLE,
    type: data.type || 'process',
    gateType: data.gateType
  },
});

// Layout Config
// Y Center = 300
// Top Y = 50
// Bottom Y = 550
// Vertical Gap = 250
// Horizontal Flow ~ 200-300px steps

export const initialNodes: Node<IAMNodeData>[] = [
  // 1. Triggers (Parallel Inputs)
  createNode('trigger-hire', { x: 0, y: 50 }, { label: 'New Hire', iconName: 'UserPlus', type: 'trigger', subLabel: 'Event' }),
  createNode('trigger-change', { x: 0, y: 300 }, { label: 'Role Change', iconName: 'RefreshCcw', type: 'trigger', subLabel: 'Event' }),
  createNode('trigger-term', { x: 0, y: 550 }, { label: 'Termination', iconName: 'UserX', type: 'trigger', subLabel: 'Event' }),

  // Gate: OR Merge (Any event leads to Normalization)
  createNode('gate-triggers', { x: 300, y: 300 }, { label: 'Merge', type: 'gate', gateType: 'OR' }),

  // 2. Normalization
  createNode('normalization', { x: 450, y: 300 }, { label: 'IAM Normalization', iconName: 'Server', type: 'process', subLabel: 'Classify & Risk' }),

  // Gate: AND Split (Start Parallel Approvals)
  createNode('gate-approval-split', { x: 700, y: 300 }, { label: 'Split', type: 'gate', gateType: 'AND' }),

  // 3. Approvals (Parallel)
  createNode('approval-mgr', { x: 850, y: 50 }, { label: 'Manager Approval', iconName: 'Users', type: 'process', subLabel: 'Policy Check' }),
  createNode('approval-owner', { x: 850, y: 300 }, { label: 'System Owner', iconName: 'Database', type: 'process', subLabel: 'Policy Check' }),
  createNode('approval-sec', { x: 850, y: 550 }, { label: 'Security Review', iconName: 'ShieldCheck', type: 'process', subLabel: 'High Risk' }),

  // Gate: AND Join (Wait for all approvals)
  createNode('gate-approval-join', { x: 1100, y: 300 }, { label: 'Join', type: 'gate', gateType: 'AND' }),

  // Intermediate Node: Approval Confirmed
  createNode('node-approval-verified', { x: 1250, y: 300 }, { label: 'Approvals Verified', iconName: 'CheckCircle', type: 'process', subLabel: 'Status Update' }),

  // Gate: XOR Split (Choose Action based on Type)
  createNode('gate-action-choice', { x: 1500, y: 300 }, { label: 'Choice', type: 'gate', gateType: 'XOR' }),

  // 4. Actions
  createNode('action-grant', { x: 1650, y: 50 }, { label: 'Grant Access', iconName: 'UserPlus', type: 'action', subLabel: 'Create/Assign' }),
  createNode('action-change', { x: 1650, y: 300 }, { label: 'Update Role', iconName: 'RefreshCcw', type: 'action', subLabel: 'Modify Perms' }),
  createNode('action-revoke', { x: 1650, y: 550 }, { label: 'Revoke Access', iconName: 'UserX', type: 'action', subLabel: 'Disable/Delete' }),

  // Gate: XOR Merge (Merge the 3 mutually exclusive paths)
  createNode('gate-action-merge', { x: 1900, y: 300 }, { label: 'Merge', type: 'gate', gateType: 'XOR' }),

  // Intermediate Node: Action Verified
  createNode('node-action-verified', { x: 2050, y: 300 }, { label: 'Action Verified', iconName: 'ShieldCheck', type: 'process', subLabel: 'Tech Complete' }),

  // Gate: AND Split (Trigger Parallel Tasks)
  createNode('gate-tasks-split', { x: 2300, y: 300 }, { label: 'Split', type: 'gate', gateType: 'AND' }),

  // 5. Parallel Tasks
  createNode('task-log', { x: 2450, y: 50 }, { label: 'Central Logging', iconName: 'FileText', type: 'parallel', subLabel: 'Audit Trail' }),
  createNode('task-notify', { x: 2450, y: 300 }, { label: 'Notifications', iconName: 'Mail', type: 'parallel', subLabel: 'Email/Slack' }),
  createNode('task-review', { x: 2450, y: 550 }, { label: 'Setup Review', iconName: 'CheckCircle', type: 'parallel', subLabel: 'Recertification' }),

  // Gate: AND Join (Wait for all tasks)
  createNode('gate-tasks-join', { x: 2700, y: 300 }, { label: 'Join', type: 'gate', gateType: 'AND' }),

  // 6. End
  createNode('end', { x: 2850, y: 300 }, { label: 'Process Complete', iconName: 'CheckCircle', type: 'end', subLabel: 'End State' }),
];

export const initialEdges: Edge[] = [
  // Triggers -> OR Gate
  { id: 'e1', source: 'trigger-hire', target: 'gate-triggers', type: 'smoothstep' },
  { id: 'e2', source: 'trigger-change', target: 'gate-triggers', type: 'smoothstep' },
  { id: 'e3', source: 'trigger-term', target: 'gate-triggers', type: 'smoothstep' },

  // OR Gate -> Normalization
  { id: 'e4', source: 'gate-triggers', target: 'normalization' },

  // Normalization -> AND Split
  { id: 'e5', source: 'normalization', target: 'gate-approval-split' },

  // AND Split -> Approvals
  { id: 'e6', source: 'gate-approval-split', target: 'approval-mgr', type: 'smoothstep' },
  { id: 'e7', source: 'gate-approval-split', target: 'approval-owner', type: 'smoothstep' },
  { id: 'e8', source: 'gate-approval-split', target: 'approval-sec', type: 'smoothstep' },

  // Approvals -> AND Join
  { id: 'e9', source: 'approval-mgr', target: 'gate-approval-join', type: 'smoothstep' },
  { id: 'e10', source: 'approval-owner', target: 'gate-approval-join', type: 'smoothstep' },
  { id: 'e11', source: 'approval-sec', target: 'gate-approval-join', type: 'smoothstep' },

  // AND Join -> Approval Verified (Intermediate)
  { id: 'e12', source: 'gate-approval-join', target: 'node-approval-verified' },

  // Approval Verified -> XOR Choice
  { id: 'e12b', source: 'node-approval-verified', target: 'gate-action-choice' },

  // XOR Choice -> Actions
  { id: 'e13', source: 'gate-action-choice', target: 'action-grant', type: 'smoothstep' },
  { id: 'e14', source: 'gate-action-choice', target: 'action-change', type: 'smoothstep' },
  { id: 'e15', source: 'gate-action-choice', target: 'action-revoke', type: 'smoothstep' },

  // Actions -> XOR Merge
  { id: 'e16', source: 'action-grant', target: 'gate-action-merge', type: 'smoothstep' },
  { id: 'e17', source: 'action-change', target: 'gate-action-merge', type: 'smoothstep' },
  { id: 'e18', source: 'action-revoke', target: 'gate-action-merge', type: 'smoothstep' },

  // XOR Merge -> Action Verified
  { id: 'e19a', source: 'gate-action-merge', target: 'node-action-verified' },

  // Action Verified -> AND Split
  { id: 'e19b', source: 'node-action-verified', target: 'gate-tasks-split' },

  // AND Split -> Tasks
  { id: 'e19', source: 'gate-tasks-split', target: 'task-log', type: 'smoothstep' },
  { id: 'e20', source: 'gate-tasks-split', target: 'task-notify', type: 'smoothstep' },
  { id: 'e21', source: 'gate-tasks-split', target: 'task-review', type: 'smoothstep' },

  // Tasks -> AND Join
  { id: 'e22', source: 'task-log', target: 'gate-tasks-join', type: 'smoothstep' },
  { id: 'e23', source: 'task-notify', target: 'gate-tasks-join', type: 'smoothstep' },
  { id: 'e24', source: 'task-review', target: 'gate-tasks-join', type: 'smoothstep' },

  // AND Join -> End
  { id: 'e25', source: 'gate-tasks-join', target: 'end' },
];


import React, { useCallback, useEffect, useState } from 'react';
import ReactFlow, { 
  Controls, 
  Background, 
  useNodesState, 
  useEdgesState, 
  Node,
  Edge,
  MarkerType
} from 'reactflow';
import { initialNodes, initialEdges } from '../utils/graphData';
import CustomNode from './CustomNode';
import { NodeStatus, ScenarioType, SimulationState } from '../types';

const nodeTypes = {
  custom: CustomNode,
};

interface FlowDiagramProps {
  simulationState: SimulationState;
  setSimulationState: React.Dispatch<React.SetStateAction<SimulationState>>;
}

const STEP_DELAY = 800; // ms per step

const FlowDiagram: React.FC<FlowDiagramProps> = ({ simulationState, setSimulationState }) => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Helper to update node status
  const updateNodeStatus = (nodeIds: string[], status: NodeStatus) => {
    setNodes((nds) => 
      nds.map((node) => {
        if (nodeIds.includes(node.id)) {
          return {
            ...node,
            data: { ...node.data, status },
          };
        }
        return node;
      })
    );
  };

  // Helper to reset graph
  const resetGraph = () => {
    setNodes((nds) => nds.map((n) => ({ ...n, data: { ...n.data, status: NodeStatus.IDLE } })));
    setEdges((eds) => eds.map((e) => ({ 
      ...e, 
      animated: false, 
      style: { ...e.style, stroke: '#b1b1b7', strokeWidth: 1 } 
    })));
  };

  // Helper to activate edge
  const activateEdge = (sourceId: string, targetId: string) => {
    setEdges((eds) => 
      eds.map((e) => {
        if (e.source === sourceId && e.target === targetId) {
          return { 
            ...e, 
            animated: true, 
            style: { ...e.style, stroke: '#3b82f6', strokeWidth: 2 } 
          };
        }
        return e;
      })
    );
  };

  const addLog = (message: string) => {
    setSimulationState(prev => ({
      ...prev,
      logs: [...prev.logs, `[${new Date().toLocaleTimeString()}] ${message}`]
    }));
  };

  // The Simulation Effect
  useEffect(() => {
    if (!simulationState.isActive || !simulationState.activeScenario) {
        if (!simulationState.isActive && simulationState.completedStepIds.length === 0) {
            resetGraph();
        }
        return;
    }

    let timeoutId: ReturnType<typeof setTimeout> | undefined;
    const scenario = simulationState.activeScenario;

    const runSimulation = async () => {
      const delay = (ms: number) => new Promise(resolve => {
        timeoutId = setTimeout(resolve, ms);
      });

      resetGraph();

      // 1. Trigger
      const triggerId = 
        scenario === ScenarioType.NEW_HIRE ? 'trigger-hire' :
        scenario === ScenarioType.ROLE_CHANGE ? 'trigger-change' : 'trigger-term';
      
      updateNodeStatus([triggerId], NodeStatus.ACTIVE);
      addLog(`Event Triggered: ${scenario}`);
      await delay(STEP_DELAY);
      updateNodeStatus([triggerId], NodeStatus.COMPLETED);

      // Trigger -> OR Gate
      activateEdge(triggerId, 'gate-triggers');
      updateNodeStatus(['gate-triggers'], NodeStatus.ACTIVE);
      addLog("OR GATE: Merging request stream...");
      await delay(STEP_DELAY / 2);
      updateNodeStatus(['gate-triggers'], NodeStatus.COMPLETED);

      // OR Gate -> Normalization
      activateEdge('gate-triggers', 'normalization');
      updateNodeStatus(['normalization'], NodeStatus.ACTIVE);
      addLog("IAM Normalization: Standardizing request...");
      await delay(STEP_DELAY);
      updateNodeStatus(['normalization'], NodeStatus.COMPLETED);

      // Normalization -> AND Split
      activateEdge('normalization', 'gate-approval-split');
      updateNodeStatus(['gate-approval-split'], NodeStatus.ACTIVE);
      addLog("AND GATE: Initiating parallel approval workflows...");
      await delay(STEP_DELAY / 2);
      updateNodeStatus(['gate-approval-split'], NodeStatus.COMPLETED);

      // AND Split -> Approvers
      activateEdge('gate-approval-split', 'approval-mgr');
      activateEdge('gate-approval-split', 'approval-owner');
      activateEdge('gate-approval-split', 'approval-sec');
      updateNodeStatus(['approval-mgr', 'approval-owner', 'approval-sec'], NodeStatus.ACTIVE);
      addLog("Waiting for Managers, Owners, and Security...");
      await delay(STEP_DELAY * 1.5);
      updateNodeStatus(['approval-mgr', 'approval-owner', 'approval-sec'], NodeStatus.COMPLETED);

      // Approvers -> AND Join
      activateEdge('approval-mgr', 'gate-approval-join');
      activateEdge('approval-owner', 'gate-approval-join');
      activateEdge('approval-sec', 'gate-approval-join');
      updateNodeStatus(['gate-approval-join'], NodeStatus.ACTIVE);
      addLog("AND GATE: All approvals collected.");
      await delay(STEP_DELAY / 2);
      updateNodeStatus(['gate-approval-join'], NodeStatus.COMPLETED);

      // AND Join -> Approval Verified
      activateEdge('gate-approval-join', 'node-approval-verified');
      updateNodeStatus(['node-approval-verified'], NodeStatus.ACTIVE);
      addLog("Request fully approved. Proceeding to fulfillment.");
      await delay(STEP_DELAY);
      updateNodeStatus(['node-approval-verified'], NodeStatus.COMPLETED);

      // Approval Verified -> XOR Choice
      activateEdge('node-approval-verified', 'gate-action-choice');
      updateNodeStatus(['gate-action-choice'], NodeStatus.ACTIVE);
      addLog("XOR GATE: Determining provisioning action...");
      await delay(STEP_DELAY / 2);
      updateNodeStatus(['gate-action-choice'], NodeStatus.COMPLETED);

      // XOR Choice -> Action
      const actionId = 
        scenario === ScenarioType.NEW_HIRE ? 'action-grant' :
        scenario === ScenarioType.ROLE_CHANGE ? 'action-change' : 'action-revoke';

      activateEdge('gate-action-choice', actionId);
      updateNodeStatus([actionId], NodeStatus.ACTIVE);
      addLog(`Executing Technical Action: ${actionId.replace('action-', '').toUpperCase()}`);
      await delay(STEP_DELAY);
      updateNodeStatus([actionId], NodeStatus.COMPLETED);

      // Action -> XOR Merge
      activateEdge(actionId, 'gate-action-merge');
      updateNodeStatus(['gate-action-merge'], NodeStatus.ACTIVE);
      addLog("XOR GATE: Action completed.");
      await delay(STEP_DELAY / 2);
      updateNodeStatus(['gate-action-merge'], NodeStatus.COMPLETED);

      // XOR Merge -> Action Verified
      activateEdge('gate-action-merge', 'node-action-verified');
      updateNodeStatus(['node-action-verified'], NodeStatus.ACTIVE);
      addLog("Technical implementation verified.");
      await delay(STEP_DELAY);
      updateNodeStatus(['node-action-verified'], NodeStatus.COMPLETED);

      // Action Verified -> AND Split (Tasks)
      activateEdge('node-action-verified', 'gate-tasks-split');
      updateNodeStatus(['gate-tasks-split'], NodeStatus.ACTIVE);
      addLog("AND GATE: Triggering post-process tasks...");
      await delay(STEP_DELAY / 2);
      updateNodeStatus(['gate-tasks-split'], NodeStatus.COMPLETED);

      // AND Split -> Tasks
      activateEdge('gate-tasks-split', 'task-log');
      activateEdge('gate-tasks-split', 'task-notify');
      activateEdge('gate-tasks-split', 'task-review');
      updateNodeStatus(['task-log', 'task-notify', 'task-review'], NodeStatus.ACTIVE);
      addLog("Running: Logging, Notifications, Review Setup...");
      await delay(STEP_DELAY);
      updateNodeStatus(['task-log', 'task-notify', 'task-review'], NodeStatus.COMPLETED);

      // Tasks -> AND Join
      activateEdge('task-log', 'gate-tasks-join');
      activateEdge('task-notify', 'gate-tasks-join');
      activateEdge('task-review', 'gate-tasks-join');
      updateNodeStatus(['gate-tasks-join'], NodeStatus.ACTIVE);
      addLog("AND GATE: All parallel tasks finished.");
      await delay(STEP_DELAY / 2);
      updateNodeStatus(['gate-tasks-join'], NodeStatus.COMPLETED);

      // AND Join -> End
      activateEdge('gate-tasks-join', 'end');
      updateNodeStatus(['end'], NodeStatus.COMPLETED);
      addLog("Workflow Complete.");

      setSimulationState(prev => ({ ...prev, isActive: false }));
    };

    runSimulation();

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [simulationState.activeScenario, simulationState.isActive]);

  return (
    <div className="h-full w-full bg-gray-50">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
        attributionPosition="bottom-right"
        defaultEdgeOptions={{
            type: 'smoothstep',
            markerEnd: { type: MarkerType.ArrowClosed, color: '#b1b1b7' },
            style: { stroke: '#b1b1b7', strokeWidth: 1 }
        }}
      >
        <Background gap={16} color="#e5e7eb" />
        <Controls />
      </ReactFlow>
    </div>
  );
};

export default FlowDiagram;

import React, { useState } from 'react';
import FlowDiagram from './components/FlowDiagram';
import Sidebar from './components/Sidebar';
import { SimulationState } from './types';

const App: React.FC = () => {
  const [simulationState, setSimulationState] = useState<SimulationState>({
    isActive: false,
    currentStepId: null,
    completedStepIds: [],
    activeScenario: null,
    logs: []
  });

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-white">
      <div className="flex-1 relative">
        <div className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur-sm p-3 rounded-lg shadow-sm border border-gray-200">
            <h1 className="text-lg font-bold text-slate-800">IAM Process Visualizer</h1>
            <p className="text-xs text-slate-500">Identity Lifecycle & Access Request Flow</p>
        </div>
        <FlowDiagram 
          simulationState={simulationState} 
          setSimulationState={setSimulationState} 
        />
      </div>
      <Sidebar 
        simulationState={simulationState} 
        setSimulationState={setSimulationState} 
      />
    </div>
  );
};

export default App;

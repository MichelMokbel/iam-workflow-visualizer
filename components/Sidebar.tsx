import React from 'react';
import { Play, Settings2, Terminal, CheckCircle2, UserPlus, RefreshCcw, UserX } from 'lucide-react';
import { ScenarioType, SimulationState } from '../types';
import clsx from 'clsx';

interface SidebarProps {
  simulationState: SimulationState;
  setSimulationState: React.Dispatch<React.SetStateAction<SimulationState>>;
}

const Sidebar: React.FC<SidebarProps> = ({ simulationState, setSimulationState }) => {
  
  const handleStart = (scenario: ScenarioType) => {
    if (simulationState.isActive) return;
    setSimulationState({
      ...simulationState,
      activeScenario: scenario,
      isActive: true,
      logs: [],
      completedStepIds: []
    });
  };

  return (
    <div className="w-96 bg-white border-l border-gray-200 h-full flex flex-col shadow-xl z-10">
      
      {/* Header */}
      <div className="p-6 border-b border-gray-100 bg-slate-50">
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <Settings2 className="w-5 h-5 text-blue-600" />
          Control Panel
        </h2>
        <p className="text-sm text-slate-500 mt-1">Simulate IAM lifecycle events</p>
      </div>

      {/* Scenarios */}
      <div className="p-6 flex-1 overflow-y-auto">
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">Run Simulation</h3>
        
        <div className="space-y-3">
          <button
            onClick={() => handleStart(ScenarioType.NEW_HIRE)}
            disabled={simulationState.isActive}
            className={clsx(
                "w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left",
                simulationState.isActive ? "opacity-50 cursor-not-allowed border-gray-100" : "hover:border-blue-500 hover:shadow-md border-gray-100 bg-white"
            )}
          >
            <div className="p-3 bg-green-50 text-green-600 rounded-lg">
                <UserPlus size={20} />
            </div>
            <div>
                <div className="font-bold text-slate-800">New Hire</div>
                <div className="text-xs text-slate-500">Triggers 'Grant Access' workflow</div>
            </div>
            {!simulationState.isActive && <Play size={16} className="ml-auto text-slate-300" />}
          </button>

          <button
            onClick={() => handleStart(ScenarioType.ROLE_CHANGE)}
            disabled={simulationState.isActive}
            className={clsx(
                "w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left",
                simulationState.isActive ? "opacity-50 cursor-not-allowed border-gray-100" : "hover:border-blue-500 hover:shadow-md border-gray-100 bg-white"
            )}
          >
            <div className="p-3 bg-orange-50 text-orange-600 rounded-lg">
                <RefreshCcw size={20} />
            </div>
            <div>
                <div className="font-bold text-slate-800">Role Change</div>
                <div className="text-xs text-slate-500">Triggers 'Update Role' workflow</div>
            </div>
            {!simulationState.isActive && <Play size={16} className="ml-auto text-slate-300" />}
          </button>

          <button
            onClick={() => handleStart(ScenarioType.TERMINATION)}
            disabled={simulationState.isActive}
            className={clsx(
                "w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left",
                simulationState.isActive ? "opacity-50 cursor-not-allowed border-gray-100" : "hover:border-blue-500 hover:shadow-md border-gray-100 bg-white"
            )}
          >
            <div className="p-3 bg-red-50 text-red-600 rounded-lg">
                <UserX size={20} />
            </div>
            <div>
                <div className="font-bold text-slate-800">Termination</div>
                <div className="text-xs text-slate-500">Triggers 'Revoke Access' workflow</div>
            </div>
            {!simulationState.isActive && <Play size={16} className="ml-auto text-slate-300" />}
          </button>
        </div>
      </div>

      {/* Logs */}
      <div className="bg-slate-900 text-slate-200 p-4 h-64 overflow-y-auto font-mono text-xs border-t border-slate-700">
        <div className="flex items-center gap-2 mb-3 text-slate-400 uppercase tracking-wider font-bold">
            <Terminal size={14} />
            System Logs
        </div>
        <div className="space-y-1.5">
            {simulationState.logs.length === 0 && <span className="text-slate-600 italic">Waiting for event trigger...</span>}
            {simulationState.logs.map((log, i) => (
                <div key={i} className="flex gap-2">
                    <span className="text-blue-400 opacity-50">{'>'}</span>
                    <span className="break-words">{log}</span>
                </div>
            ))}
            {/* Scroll anchor */}
            <div ref={(el) => el?.scrollIntoView({ behavior: 'smooth' })} />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;

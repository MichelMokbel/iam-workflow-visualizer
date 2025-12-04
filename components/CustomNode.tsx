import React, { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { 
  UserPlus, 
  RefreshCcw, 
  UserX, 
  ShieldCheck, 
  Settings, 
  CheckCircle, 
  AlertCircle,
  FileText,
  Mail,
  Database,
  Users,
  Server,
  Play,
  X,
  Plus,
  Circle
} from 'lucide-react';
import { IAMNodeData, NodeStatus } from '../types';
import clsx from 'clsx';

const iconMap: Record<string, React.FC<any>> = {
  UserPlus,
  RefreshCcw,
  UserX,
  ShieldCheck,
  Settings,
  CheckCircle,
  AlertCircle,
  FileText,
  Mail,
  Database,
  Users,
  Server,
  Play
};

const CustomNode = ({ data }: NodeProps<IAMNodeData>) => {
  const Icon = data.iconName ? iconMap[data.iconName] : Settings;

  const isDecision = data.type === 'decision';
  const isGate = data.type === 'gate';

  const baseClasses = "min-w-[180px] p-3 rounded-lg shadow-md border-2 transition-all duration-500 bg-white";
  
  let statusClasses = "border-gray-200 text-gray-500";
  if (data.status === NodeStatus.ACTIVE) {
    statusClasses = "border-blue-500 shadow-blue-200 shadow-lg scale-105 ring-2 ring-blue-100";
  } else if (data.status === NodeStatus.COMPLETED) {
    statusClasses = "border-green-500 text-gray-800 bg-green-50";
  } else if (data.status === NodeStatus.SKIPPED) {
    statusClasses = "border-gray-200 opacity-50 grayscale";
  }

  // Gateway (Logic Gate)
  if (isGate) {
    let GateIcon = Plus;
    let gateLabel = 'AND';
    let gateColorClass = 'text-blue-600';

    if (data.gateType === 'XOR') {
      GateIcon = X;
      gateLabel = 'XOR';
      gateColorClass = 'text-orange-600';
    } else if (data.gateType === 'OR') {
      GateIcon = Circle;
      gateLabel = 'OR';
      gateColorClass = 'text-purple-600';
    }

    return (
      <div className="relative group">
        <Handle type="target" position={Position.Left} className="!bg-gray-400 !w-3 !h-3" />
        
        <div className={clsx(
          "w-14 h-14 transform rotate-45 border-2 flex items-center justify-center bg-white shadow-sm transition-all duration-500",
          statusClasses
        )}>
          <div className="transform -rotate-45 flex items-center justify-center">
             <GateIcon className={clsx("w-8 h-8 font-bold", gateColorClass)} strokeWidth={3} />
          </div>
        </div>
        
        {/* Label below the diamond */}
        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-white/80 px-1 rounded">
          {gateLabel}
        </div>

        <Handle type="source" position={Position.Right} className="!bg-gray-400 !w-3 !h-3" />
      </div>
    );
  }

  // Diamond shape for decision (Legacy/Other)
  if (isDecision) {
    return (
      <div className="relative group">
        <Handle type="target" position={Position.Left} className="!bg-gray-400 !w-3 !h-3" />
        <div className={clsx(
          "w-24 h-24 transform rotate-45 border-2 flex items-center justify-center bg-white shadow-sm transition-all duration-500",
          statusClasses
        )}>
          <div className="transform -rotate-45 flex flex-col items-center justify-center text-center">
            <Icon className="w-6 h-6 mb-1" />
            <span className="text-[10px] font-bold leading-tight">{data.label}</span>
          </div>
        </div>
        <Handle type="source" position={Position.Right} id="yes" className="!bg-blue-400 !w-3 !h-3 -right-2" />
        <Handle type="source" position={Position.Bottom} id="no" className="!bg-orange-400 !w-3 !h-3 -bottom-2" />
      </div>
    );
  }

  return (
    <div className={clsx(baseClasses, statusClasses)}>
      <Handle type="target" position={Position.Left} className="!bg-gray-400 !w-3 !h-3" />
      
      <div className="flex items-start gap-3">
        <div className={clsx("p-2 rounded-full", 
          data.status === NodeStatus.ACTIVE ? "bg-blue-100 text-blue-600" : 
          data.status === NodeStatus.COMPLETED ? "bg-green-100 text-green-600" : "bg-gray-100"
        )}>
          <Icon size={20} />
        </div>
        <div className="flex-1">
          <div className="text-xs font-bold uppercase tracking-wider opacity-70 mb-0.5">
            {data.subLabel || data.type}
          </div>
          <div className="text-sm font-semibold leading-tight">
            {data.label}
          </div>
        </div>
      </div>
      
      {/* Visual indicator for active processing */}
      {data.status === NodeStatus.ACTIVE && (
        <div className="mt-2 h-1 w-full bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full bg-blue-500 animate-progress w-full origin-left" />
        </div>
      )}

      <Handle type="source" position={Position.Right} className="!bg-gray-400 !w-3 !h-3" />
    </div>
  );
};

export default memo(CustomNode);
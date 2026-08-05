import React, { useState } from "react";
import { ChevronRight } from "lucide-react";
import type { Task } from "../../Interfaces/ITasks";
import TaskCard from "./TaskCard";
import { useUpdateTask } from "../../Hooks/useTask";

interface TaskBoardProps {
  tasks: Task[];
  onTaskClick: (task: Task) => void;
  projectId: string;
  token: string;
}

/* ── single collapsible & droppable column ────────────────────── */
interface ColumnDef {
  id: string;
  title: string;
  indicator: string;
  bgColor: string;
  borderColor: string;
}

function CollapsibleColumn({
  col,
  tasks,
  onTaskClick,
  onDropTask,
}: {
  col: ColumnDef;
  tasks: Task[];
  onTaskClick: (task: Task) => void;
  onDropTask: (taskId: string, targetStatus: "To Do" | "In Progress" | "Done") => void;
}) {
  const [isOpen, setIsOpen] = useState(true);
  const [isDragOver, setIsDragOver] = useState(false);

  // HTML5 Drag handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault(); // Required to allow dropping
    if (isOpen) {
      setIsDragOver(true);
    }
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const taskId = e.dataTransfer.getData("text/plain");
    if (taskId) {
      onDropTask(taskId, col.id as "To Do" | "In Progress" | "Done");
    }
  };

  const handleDragStartTask = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData("text/plain", taskId);
    e.dataTransfer.effectAllowed = "move";
  };

  if (!isOpen) {
    return (
      <div
        className={`flex flex-col items-center py-4 w-12 rounded-xl border border-gray-200 border-t-4 ${col.borderColor} ${col.bgColor} shadow-sm cursor-pointer transition-all duration-300 h-[600px]`}
        onClick={() => setIsOpen(true)}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <button
          className="p-1 hover:bg-gray-200/50 rounded transition-colors mb-4"
          title={`Expand ${col.title}`}
        >
          <ChevronRight className="w-4 h-4 text-gray-500 rotate-0 transition-transform" />
        </button>
        <div className="flex flex-col items-center gap-3 [writing-mode:vertical-lr] text-gray-500 font-semibold tracking-wide select-none">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${col.indicator} rotate-90`} />
            <span className="text-gray-900 whitespace-nowrap">{col.title}</span>
            <span className="text-xs bg-gray-200/80 text-gray-600 px-1.5 py-0.5 rounded-full rotate-90">{tasks.length}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`flex flex-col gap-4 flex-1 min-w-[280px] ${col.bgColor} p-4 rounded-xl border border-gray-200 border-t-4 ${col.borderColor} shadow-sm transition-all duration-300 ${isDragOver ? "ring-2 ring-[#1a6b5a] ring-dashed bg-[#1a6b5a]/5" : ""
        }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Column Header */}
      <div className="flex items-center justify-between pb-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 hover:bg-gray-200/50 rounded transition-colors"
            title={`Collapse ${col.title}`}
          >
            <ChevronRight className="w-4 h-4 text-gray-500 rotate-180 transition-transform" />
          </button>
          <div className={`w-2 h-2 rounded-full ${col.indicator}`} />
          <h3 className="font-semibold text-gray-900">{col.title}</h3>
          <span className="text-sm text-gray-500 ml-1">{tasks.length}</span>
        </div>
      </div>

      {/* Tasks List */}
      <div className="flex flex-col gap-3 max-h-[480px] min-h-[350px] flex-1 overflow-y-auto pr-1.5 rounded-lg custom-scrollbar transition-colors">
        {tasks.length === 0 ? (
          <div className="h-24 border-2 border-dashed border-gray-200 rounded-lg flex items-center justify-center text-sm text-gray-400 select-none">
            Drop tasks here
          </div>
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              onClick={onTaskClick}
              onDragStart={(e) => handleDragStartTask(e, task._id)}
            />
          ))
        )}
      </div>
    </div>
  );
}

/* ── board ────────────────────────────────────────────────────── */
const TaskBoard: React.FC<TaskBoardProps> = ({
  tasks,
  onTaskClick,
  projectId,
  token,
}) => {
  const updateTaskMutation = useUpdateTask();

  const handleDropTask = (taskId: string, targetStatus: "To Do" | "In Progress" | "Done") => {
    // Find the task to verify if status changed
    const task = tasks.find((t) => t._id === taskId);
    if (task && task.status !== targetStatus) {
      updateTaskMutation.mutate({
        projectId,
        taskId,
        token,
        data: { status: targetStatus },
      });
    }
  };

  const columns: ColumnDef[] = [
    {
      id: "To Do",
      title: "To Do",
      indicator: "bg-slate-400",
      bgColor: "bg-slate-50/70",
      borderColor: "border-t-slate-400",
    },
    {
      id: "In Progress",
      title: "In Progress",
      indicator: "bg-amber-400",
      bgColor: "bg-amber-50/50",
      borderColor: "border-t-amber-400",
    },
    {
      id: "Done",
      title: "Done",
      indicator: "bg-emerald-500",
      bgColor: "bg-emerald-50/40",
      borderColor: "border-t-emerald-500",
    },
  ];

  return (
    <div className="flex gap-6 items-start w-full h-full pb-8 overflow-x-auto">
      {columns.map((col) => (
        <CollapsibleColumn
          key={col.id}
          col={col}
          tasks={tasks.filter((t) => t.status === col.id)}
          onTaskClick={onTaskClick}
          onDropTask={handleDropTask}
        />
      ))}
    </div>
  );
};

export default TaskBoard;

import React from "react";
import type { Task } from "../../Interfaces/ITasks";
import TaskCard from "./TaskCard";

interface TaskBoardProps {
  tasks: Task[];
  onTaskClick: (task: Task) => void;
}

const TaskBoard: React.FC<TaskBoardProps> = ({ tasks, onTaskClick }) => {
  const columns = [
    {
      id: "To Do",
      title: "To Do",
      indicator: "bg-slate-400",
      bgColor: "bg-slate-50/70",
      borderColor: "border-t-slate-400"
    },
    {
      id: "In Progress",
      title: "In Progress",
      indicator: "bg-amber-400",
      bgColor: "bg-amber-50/50",
      borderColor: "border-t-amber-400"
    },
    {
      id: "Done",
      title: "Done",
      indicator: "bg-emerald-500",
      bgColor: "bg-emerald-50/40",
      borderColor: "border-t-emerald-500"
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start h-full pb-8">
      {columns.map((col) => {
        const colTasks = tasks.filter((t) => t.status === col.id);

        return (
          <div key={col.id} className={`flex flex-col gap-4 ${col.bgColor} p-4 rounded-xl border border-gray-200 border-t-4 ${col.borderColor} shadow-sm`}>
            {/* Column Header */}
            <div className="flex items-center justify-between pb-2">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${col.indicator}`} />
                <h3 className="font-semibold text-gray-900">{col.title}</h3>
                <span className="text-sm text-gray-500 ml-1">{colTasks.length}</span>
              </div>
            </div>

            {/* Tasks List */}
            <div className="flex flex-col gap-3 max-h-[480px] overflow-y-auto pr-1.5 rounded-lg custom-scrollbar">
              {colTasks.length === 0 ? (
                <div className="h-24 border-2 border-dashed border-gray-200 rounded-lg flex items-center justify-center text-sm text-gray-400">
                  No tasks
                </div>
              ) : (
                colTasks.map((task) => (
                  <TaskCard key={task._id} task={task} onClick={onTaskClick} />
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TaskBoard;

import React from "react";
import type { Task } from "../../Interfaces/ITasks";
import Badge from "../UI/Badge";
import Avatar from "../UI/Avatar";

interface TaskCardProps {
  task: Task;
  onClick: (task: Task) => void;
  onDragStart?: (e: React.DragEvent) => void;
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

const TaskCard: React.FC<TaskCardProps> = ({ task, onClick, onDragStart }) => {
  const priorityVariant = task.priority.toLowerCase() as "high" | "medium" | "low";

  return (
    <div
      onClick={() => onClick(task)}
      draggable={!!onDragStart}
      onDragStart={onDragStart}
      className="bg-white p-4 rounded-lg border border-gray-200 shadow-md hover:shadow-lg hover:-translate-y-1 hover:border-[#1a6b5a]/40 transition-all duration-200 cursor-pointer flex flex-col gap-3 active:cursor-grabbing active:opacity-60"
    >
      <div className="flex items-center justify-between">
        <Badge variant={priorityVariant}>{task.priority}</Badge>
        <span className="text-[11px] font-medium text-gray-500">
          {formatDate(task.dueDate)}
        </span>
      </div>

      <h4 className="text-sm font-semibold text-gray-900 leading-snug">
        {task.title}
      </h4>

      <div className="flex items-center justify-between mt-1">
        {task.assignee ? (
          <Avatar name={task.assignee.userName} size="sm" />
        ) : (
          <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-[10px] text-gray-400 font-medium">
            ?
          </div>
        )}
        <span className="text-[10px] font-medium text-gray-400 uppercase">
          #{task._id.slice(-4)}
        </span>
      </div>
    </div>
  );
};

export default TaskCard;

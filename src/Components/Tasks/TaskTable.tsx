import React from "react";
import type { Task } from "../../Interfaces/ITasks";
import Badge from "../UI/Badge";
import Avatar from "../UI/Avatar";

interface TaskTableProps {
  tasks: Task[];
  onTaskClick: (task: Task) => void;
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "To Do":
      return "bg-slate-400";
    case "In Progress":
      return "bg-amber-400";
    case "Done":
      return "bg-emerald-500";
    default:
      return "bg-gray-400";
  }
};

const TaskTable: React.FC<TaskTableProps> = ({ tasks, onTaskClick }) => {
  if (tasks.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/50">
        <p className="text-gray-400 text-sm font-medium">No tasks found.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex-1">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/50">
              <th className="py-3 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">
                Title
              </th>
              <th className="py-3 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="py-3 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">
                Priority
              </th>
              <th className="py-3 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">
                Assignee
              </th>
              <th className="py-3 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">
                Due
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {tasks.map((task) => {
              const priorityVariant = task.priority.toLowerCase() as "high" | "medium" | "low";

              return (
                <tr
                  key={task._id}
                  onClick={() => onTaskClick(task)}
                  className="hover:bg-gray-50 cursor-pointer transition-colors group"
                >
                  <td className="py-4 px-6">
                    <span className="font-medium text-gray-900 group-hover:text-[#1a6b5a] transition-colors">
                      {task.title}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <div className={`w-1.5 h-1.5 rounded-full ${getStatusColor(task.status)}`} />
                      <span className="text-sm text-gray-600">{task.status}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <Badge variant={priorityVariant}>{task.priority}</Badge>
                  </td>
                  <td className="py-4 px-6">
                    {task.assignee ? (
                      <div className="flex items-center gap-2">
                        <Avatar name={task.assignee.userName} size="sm" />
                        <span className="text-sm text-gray-700 max-w-[100px] truncate">
                          {task.assignee.userName}
                        </span>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400 italic">Unassigned</span>
                    )}
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-500 whitespace-nowrap">
                    {formatDate(task.dueDate)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TaskTable;

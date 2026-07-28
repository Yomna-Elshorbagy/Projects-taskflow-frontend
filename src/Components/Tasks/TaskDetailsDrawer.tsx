import { useEffect } from "react";
import type { FC } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Drawer from "../UI/Drawer";
import Avatar from "../UI/Avatar";
import { useUpdateTask, useDeleteTask } from "../../Hooks/useTask";
import type { Task } from "../../Interfaces/ITasks";
import { updateTaskSchema, type UpdateTaskSchemaType } from "../../Utils/Schema/taskSchema";
import { useAppSelector } from "../../Store/store";
import Swal from "sweetalert2";
import { Trash2 } from "lucide-react";

interface TaskDetailsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
  projectId: string;
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", { year: "numeric", month: "2-digit", day: "2-digit" });
};

const TaskDetailsDrawer: FC<TaskDetailsDrawerProps> = ({
  isOpen,
  onClose,
  task,
  projectId,
}) => {
  const { token } = useAppSelector((state) => state.auth);
  const { mutate: updateTask, isPending: isUpdating } = useUpdateTask();
  const { mutate: deleteTask, isPending: isDeleting } = useDeleteTask();

  const { register, handleSubmit, reset, formState: { errors } } = useForm<UpdateTaskSchemaType>({
    resolver: zodResolver(updateTaskSchema),
  });

  useEffect(() => {
    if (task) {
      reset({
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        dueDate: new Date(task.dueDate).toISOString().slice(0, 10) as unknown as Date,
        assignee: task.assignee?._id,
      });
    }
  }, [task, reset]);

  if (!task) return null;

  const onSubmit = (data: UpdateTaskSchemaType) => {
    if (!token) return;
    updateTask(
      { projectId, taskId: task._id, data, token },
      {
        onSuccess: () => {
          Swal.fire({
            icon: "success",
            title: "Task Updated",
            showConfirmButton: false,
            timer: 1500,
          });
          onClose();
        },
        onError: (error: unknown) => {
          const err = error as { response?: { data?: { message?: string } } };
          Swal.fire({
            icon: "error",
            title: "Error",
            text: err.response?.data?.message || "Failed to update task",
          });
        },
      }
    );
  };

  const handleDelete = () => {
    if (!token) return;
    Swal.fire({
      title: "Delete this task?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#9ca3af",
      confirmButtonText: "Yes, delete it!"
    }).then((result) => {
      if (result.isConfirmed) {
        deleteTask(
          { projectId, taskId: task._id, token },
          {
            onSuccess: () => {
              Swal.fire({ icon: "success", title: "Deleted!", showConfirmButton: false, timer: 1500 });
              onClose();
            }
          }
        );
      }
    });
  };

  return (
    <Drawer isOpen={isOpen} onClose={onClose}>
      <div className="p-6 h-full flex flex-col">
        {/* Header Information */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-gray-400 tracking-wider uppercase">
              Task · #{task._id.slice(-4)}
            </span>
          </div>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
            title="Delete Task"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6 flex-1">
          {/* Title Edit */}
          <div>
            <textarea
              className="w-full text-2xl font-bold text-gray-900 bg-transparent border-0 border-b-2 border-transparent hover:border-gray-200 focus:border-[#1a6b5a] focus:ring-0 resize-none px-0 outline-none transition-colors"
              rows={2}
              {...register("title")}
            />
            {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title.message}</p>}
          </div>

          <div className="grid grid-cols-[100px_1fr] gap-y-4 items-center text-sm">
            {/* Status */}
            <div className="text-gray-500">Status</div>
            <div>
              <select
                className="w-full max-w-[200px] rounded-md border-gray-300 shadow-sm focus:border-[#1a6b5a] focus:ring-[#1a6b5a] sm:text-sm py-1.5"
                {...register("status")}
              >
                <option value="To Do">To Do</option>
                <option value="In Progress">In Progress</option>
                <option value="Done">Done</option>
              </select>
            </div>

            {/* Priority */}
            <div className="text-gray-500">Priority</div>
            <div>
              <select
                className="w-full max-w-[200px] rounded-md border-gray-300 shadow-sm focus:border-[#1a6b5a] focus:ring-[#1a6b5a] sm:text-sm py-1.5"
                {...register("priority")}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>

            {/* Due Date */}
            <div className="text-gray-500">Due date</div>
            <div>
              <input
                type="date"
                className="w-full max-w-[200px] rounded-md border-gray-300 shadow-sm focus:border-[#1a6b5a] focus:ring-[#1a6b5a] sm:text-sm py-1.5"
                {...register("dueDate")}
              />
            </div>

            {/* Assignee - Read Only for simplicity unless we fetch all users, falling back to show current */}
            <div className="text-gray-500">Assignee</div>
            <div className="flex items-center gap-2 bg-gray-50 rounded-md px-3 py-1.5 w-max">
              {task.assignee ? (
                <>
                  <Avatar name={task.assignee.userName} size="sm" />
                  <span className="font-medium">{task.assignee.userName}</span>
                </>
              ) : (
                <span className="text-gray-400">Unassigned</span>
              )}
            </div>

            <div className="text-gray-500">Creator</div>
            <div className="flex items-center gap-2">
              <Avatar name={task.creator.userName} size="sm" />
              <span className="font-medium text-gray-700">{task.creator.userName}</span>
              <span className="text-gray-400 text-xs">· {formatDate(task.createdAt)}</span>
            </div>
          </div>

          <div className="mt-4 flex-1">
            <h4 className="text-xs font-semibold text-gray-400 tracking-wider uppercase mb-3">
              Description
            </h4>
            <textarea
              className="w-full h-full min-h-[150px] p-3 text-sm text-gray-700 bg-gray-50 border border-gray-200 rounded-md focus:bg-white focus:border-[#1a6b5a] focus:ring-1 focus:ring-[#1a6b5a] outline-none resize-none transition-colors"
              {...register("description")}
            />
            {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description.message}</p>}
          </div>

          <div className="flex justify-end pt-4 border-t border-gray-100 gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isUpdating}
              className="px-4 py-2 text-sm font-medium text-white bg-[#1a6b5a] rounded-md hover:bg-[#135244] transition-colors disabled:opacity-70 flex items-center justify-center min-w-[100px]"
            >
              {isUpdating ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </Drawer>
  );
};

export default TaskDetailsDrawer;

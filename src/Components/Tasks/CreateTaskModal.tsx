import type { FC } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Modal from "../UI/Modal";
import FormInput from "../FormInput";
import SubmitButton from "../SubmitButton";
import { createTaskSchema, type CreateTaskSchemaType } from "../../Utils/Schema/taskSchema";
import { useCreateTask } from "../../Hooks/useTask";
import { useAppSelector } from "../../Store/store";
import type { ProjectMember } from "../../Types/ProjectType";
import Swal from "sweetalert2";

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  members: ProjectMember[];
}

const CreateTaskModal: FC<CreateTaskModalProps> = ({ isOpen, onClose, projectId, members }) => {
  const { token } = useAppSelector((state) => state.auth);
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateTaskSchemaType>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      status: "To Do",
      priority: "Medium",
    }
  });

  const { mutate, isPending } = useCreateTask();

  const onSubmit = (data: CreateTaskSchemaType) => {
    if (!token) return;
    
    mutate(
      { projectId, data, token },
      {
        onSuccess: () => {
          Swal.fire({
            icon: "success",
            title: "Task Created!",
            showConfirmButton: false,
            timer: 1500,
          });
          reset();
          onClose();
        },
        onError: (error: unknown) => {
          const err = error as { response?: { data?: { message?: string } } };
          Swal.fire({
            icon: "error",
            title: "Error",
            text: err.response?.data?.message || "Failed to create task",
          });
        },
      }
    );
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Create task">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <FormInput
          id="task-title"
          label="Title"
          placeholder="Something to get done..."
          error={errors.title}
          {...register("title")}
        />

        <div className="flex flex-col gap-1">
          <label htmlFor="task-description" className="text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            id="task-description"
            placeholder="Add context, links, or acceptance criteria..."
            rows={3}
            className={`w-full rounded-md border px-3 py-2 text-sm outline-none transition-all resize-none
              placeholder:text-gray-400
              ${
                errors.description
                  ? "border-red-500 bg-red-50 focus:ring-2 focus:ring-red-300"
                  : "border-gray-300 bg-white focus:border-[#1a6b5a] focus:ring-2 focus:ring-[#1a6b5a]/30"
              }`}
            {...register("description")}
          />
          {errors.description && (
            <p className="text-xs text-red-600 font-medium">{errors.description.message}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Status</label>
            <select
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-[#1a6b5a] focus:ring-[#1a6b5a] sm:text-sm py-2"
              {...register("status")}
            >
              <option value="To Do">To Do</option>
              <option value="In Progress">In Progress</option>
              <option value="Done">Done</option>
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Priority</label>
            <select
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-[#1a6b5a] focus:ring-[#1a6b5a] sm:text-sm py-2"
              {...register("priority")}
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Assignee</label>
            <select
              className={`w-full rounded-md shadow-sm focus:ring-[#1a6b5a] sm:text-sm py-2 ${
                errors.assignee ? "border-red-500 focus:border-red-500" : "border-gray-300 focus:border-[#1a6b5a]"
              }`}
              {...register("assignee")}
            >
              <option value="">Select Assignee</option>
              {members.map(member => (
                <option key={member._id} value={member._id}>
                  {member.userName}
                </option>
              ))}
            </select>
            {errors.assignee && <p className="text-xs text-red-600">{errors.assignee.message}</p>}
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Due date</label>
            <input
              type="date"
              className={`w-full rounded-md shadow-sm focus:ring-[#1a6b5a] sm:text-sm py-2 ${
                errors.dueDate ? "border-red-500 focus:border-red-500" : "border-gray-300 focus:border-[#1a6b5a]"
              }`}
              {...register("dueDate", { valueAsDate: true })}
            />
            {errors.dueDate && <p className="text-xs text-red-600">{errors.dueDate.message}</p>}
          </div>
        </div>

        <div className="pt-4 flex justify-end gap-3 mt-2">
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none"
            disabled={isPending}
          >
            Cancel
          </button>
          <div className="w-32">
            <SubmitButton
              id="create-task-btn"
              label="Create task"
              loadingLabel="Creating..."
              isLoading={isPending}
            />
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default CreateTaskModal;

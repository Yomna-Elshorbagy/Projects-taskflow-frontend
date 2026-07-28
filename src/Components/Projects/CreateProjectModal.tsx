import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Modal from "../UI/Modal";
import FormInput from "../FormInput";
import SubmitButton from "../SubmitButton";
import { createProjectSchema, type CreateProjectSchemaType } from "../../Utils/Schema/projectSchema";
import { useCreateProject } from "../../Hooks/useProject";
import { useAppSelector } from "../../Store/store";
import Swal from "sweetalert2";

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateProjectModal: React.FC<CreateProjectModalProps> = ({ isOpen, onClose }) => {
  const { token } = useAppSelector((state) => state.auth);
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateProjectSchemaType>({
    resolver: zodResolver(createProjectSchema),
  });

  const { mutate, isPending } = useCreateProject();

  const onSubmit = (data: CreateProjectSchemaType) => {
    if (!token) return;
    
    mutate(
      { data, token },
      {
        onSuccess: () => {
          Swal.fire({
            icon: "success",
            title: "Project Created!",
            text: "Your new project is ready to go.",
            confirmButtonColor: "#1a6b5a",
            timer: 1500,
            showConfirmButton: false,
          });
          reset();
          onClose();
        },
        onError: (error: unknown) => {
          const err = error as { response?: { data?: { message?: string } } };
          const message = err.response?.data?.message || "Failed to create project.";
          Swal.fire({
            icon: "error",
            title: "Error",
            text: message,
            confirmButtonColor: "#1a6b5a",
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
    <Modal isOpen={isOpen} onClose={handleClose} title="New Project">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <FormInput
          id="project-name"
          label="Project Name"
          placeholder="e.g. Design System"
          error={errors.name}
          {...register("name")}
        />

        <div className="flex flex-col gap-1">
          <label htmlFor="project-description" className="text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            id="project-description"
            placeholder="What is this project about? (min 20 characters)"
            rows={4}
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
            <p className="text-xs text-red-600 font-medium">
              {errors.description.message}
            </p>
          )}
        </div>

        <div className="pt-2 flex justify-end gap-3">
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1a6b5a]"
            disabled={isPending}
          >
            Cancel
          </button>
          <div className="w-32">
            <SubmitButton
              id="create-project-btn"
              label="Create"
              loadingLabel="Creating..."
              isLoading={isPending}
            />
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default CreateProjectModal;

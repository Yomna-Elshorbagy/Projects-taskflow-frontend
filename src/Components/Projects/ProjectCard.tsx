import React from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Trash2 } from "lucide-react";
import type { Project } from "../../Interfaces/Iproject";
import ProgressBar from "../UI/ProgressBar";
import AvatarGroup from "../UI/AvatarGroup";
import { useAppSelector } from "../../Store/store";
import { useDeleteProject } from "../../Hooks/useProject";
import Swal from "sweetalert2";

interface ProjectCardProps {
  project: Project;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const { user, token } = useAppSelector((state) => state.auth);
  const { mutate: deleteProjectMutate } = useDeleteProject();

  const isAdmin = user?.role === "admin";

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    Swal.fire({
      title: "Are you sure?",
      text: `You are about to permanently delete the project "${project.name}" and all of its tasks.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it",
      cancelButtonText: "Cancel",
      background: "#ffffff",
      customClass: {
        confirmButton: "px-4 py-2 rounded-xl text-white font-medium bg-red-500 hover:bg-red-600 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2",
        cancelButton: "px-4 py-2 rounded-xl text-gray-700 font-medium bg-gray-100 hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2",
      }
    }).then((result) => {
      if (result.isConfirmed) {
        deleteProjectMutate(
          { id: project._id, token: token || "" },
          {
            onSuccess: () => {
              Swal.fire({
                title: "Deleted!",
                text: "The project has been deleted successfully.",
                icon: "success",
                confirmButtonColor: "#1a6b5a"
              });
            },
            onError: (err: any) => {
              Swal.fire({
                title: "Error!",
                text: err?.response?.data?.message || "Failed to delete project.",
                icon: "error",
                confirmButtonColor: "#1a6b5a"
              });
            },
          }
        );
      }
    });
  };

  return (
    <Link
      to={`/projects/${project._id}/tasks`}
      className="block group bg-white rounded-xl border border-gray-200 p-6 shadow-md hover:shadow-lg hover:-translate-y-1 hover:border-[#1a6b5a]/40 transition-all duration-300"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-[#1a6b5a]" />
          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-[#1a6b5a] transition-colors">
            {project.name}
          </h3>
        </div>
        <div className="flex items-center gap-2">
          {isAdmin && (
            <button
              onClick={handleDelete}
              className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all duration-200"
              title="Delete Project"
            >
              <Trash2 className="w-4.5 h-4.5" />
            </button>
          )}
          <ArrowUpRight className="w-5 h-5 text-gray-400 group-hover:text-[#1a6b5a] transition-colors" />
        </div>
      </div>

      <p className="text-sm text-gray-500 mb-8 line-clamp-2 min-h-[40px]">
        {project.description || "No description provided."}
      </p>

      <ProgressBar
        completed={project.completedTasks || 0}
        total={project.totalTasks || 0}
      />

      <div className="mt-6 flex items-center justify-between">
        <AvatarGroup
          users={[
            project.creator,
            ...(project.members || []).filter(
              (m) => m._id !== project.creator._id
            ),
          ]}
          max={4}
        />
        <span className="text-xs font-medium text-gray-500">
          {1 + (project.members || []).filter((m) => m._id !== project.creator._id).length} member
          {1 + (project.members || []).filter((m) => m._id !== project.creator._id).length !== 1 && "s"}
        </span>
      </div>
    </Link>
  );
};

export default ProjectCard;

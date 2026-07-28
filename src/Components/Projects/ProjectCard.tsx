import React from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "../../Interfaces/Iproject";
import ProgressBar from "../UI/ProgressBar";
import AvatarGroup from "../UI/AvatarGroup";

interface ProjectCardProps {
  project: Project;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
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
        <ArrowUpRight className="w-5 h-5 text-gray-400 group-hover:text-[#1a6b5a] transition-colors" />
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

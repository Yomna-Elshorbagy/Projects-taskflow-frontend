import { useState } from "react";
import { Plus } from "lucide-react";
import { useGetProjects } from "../Hooks/useProject";
import { useAppSelector } from "../Store/store";
import ProjectCard from "../Components/Projects/ProjectCard";
import CreateProjectModal from "../Components/Projects/CreateProjectModal";
import SEO from "../Shared/SEO/SEO";

const ProjectsPage = () => {
    const { token } = useAppSelector((state) => state.auth);
    const { data, isLoading, isError } = useGetProjects(token || "");
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const projects = data?.data || [];

    return (
        <>
            <SEO title="Projects | TaskFlow" description="Manage all your projects in TaskFlow." />
            <div className="p-8 max-w-7xl mx-auto h-full flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
                        <p className="text-sm text-gray-500 mt-1">
                            All the projects you're a member of.
                        </p>
                    </div>
                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-[#1a6b5a] text-white text-sm font-medium rounded-md hover:bg-[#135244] transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1a6b5a]"
                    >
                        <Plus className="w-4 h-4" />
                        New project
                    </button>
                </div>

                {/* Content */}
                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-48 bg-gray-100 rounded-xl animate-pulse" />
                        ))}
                    </div>
                ) : isError ? (
                    <div className="flex-1 flex items-center justify-center">
                        <p className="text-red-500">Failed to load projects. Please try again.</p>
                    </div>
                ) : projects.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-center max-w-sm mx-auto">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                            <Plus className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No projects yet</h3>
                        <p className="text-sm text-gray-500 mb-6">
                            Create your first project to start organizing your tasks and team members.
                        </p>
                        <button
                            onClick={() => setIsCreateModalOpen(true)}
                            className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-md hover:bg-gray-800 transition-colors"
                        >
                            Create project
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {projects.map((project) => (
                            <ProjectCard key={project._id} project={project} />
                        ))}
                    </div>
                )}
            </div>

            <CreateProjectModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
            />
        </>
    );
};

export default ProjectsPage;
import { useState, useEffect } from "react";
import { Plus, Search } from "lucide-react";
import { useGetProjects } from "../Hooks/useProject";
import { useAppSelector } from "../Store/store";
import ProjectCard from "../Components/Projects/ProjectCard";
import CreateProjectModal from "../Components/Projects/CreateProjectModal";
import SEO from "../Shared/SEO/SEO";
import Pagination from "../Components/UI/Pagination";

const ProjectsPage = () => {
    const { token } = useAppSelector((state) => state.auth);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(6); // 6 projects looks great on a 3-column layout

    // Reset to page 1 when search query changes
    useEffect(() => {
        setPage(1);
    }, [search]);

    const { data, isLoading, isError } = useGetProjects(token || "", {
        page,
        limit,
        search: search || undefined,
    });

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const projects = data?.data || [];
    const pagination = data?.pagination || { page: 1, limit: 6, totalItems: 0, totalPages: 1 };

    return (
        <>
            <SEO title="Projects | TaskFlow" description="Manage all your projects in TaskFlow." />
            <div className="p-8 max-w-7xl mx-auto h-full flex flex-col">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
                        <p className="text-sm text-gray-500 mt-1">
                            All the projects you're a member of.
                        </p>
                    </div>
                    <div className="flex items-center gap-3 self-end sm:self-auto">
                        <div className="relative w-64">
                            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search projects..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#1a6b5a]/20 focus:border-[#1a6b5a] transition-all"
                            />
                        </div>
                        <button
                            onClick={() => setIsCreateModalOpen(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-[#1a6b5a] text-white text-sm font-medium rounded-xl hover:bg-[#135244] transition-all hover:shadow-md hover:shadow-[#1a6b5a]/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1a6b5a] active:scale-95 transform"
                        >
                            <Plus className="w-4 h-4" />
                            New project
                        </button>
                    </div>
                </div>

                {/* Content */}
                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 flex-1">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="h-48 bg-gray-50 border border-gray-100 rounded-2xl animate-pulse" />
                        ))}
                    </div>
                ) : isError ? (
                    <div className="flex-1 flex items-center justify-center">
                        <p className="text-red-500 font-medium bg-red-50 px-4 py-2 rounded-xl">Failed to load projects. Please try again.</p>
                    </div>
                ) : projects.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-center max-w-sm mx-auto my-12">
                        <div className="w-16 h-16 bg-[#1a6b5a]/5 rounded-full flex items-center justify-center mb-4">
                            <Plus className="w-8 h-8 text-[#1a6b5a]" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No projects found</h3>
                        <p className="text-sm text-gray-500 mb-6">
                            Create your first project or adjust your search to start organizing your tasks and team members.
                        </p>
                        <button
                            onClick={() => setIsCreateModalOpen(true)}
                            className="px-5 py-2.5 bg-gray-900 text-white text-sm font-semibold rounded-xl hover:bg-gray-800 transition-all shadow-sm hover:shadow active:scale-95 transform"
                        >
                            Create project
                        </button>
                    </div>
                ) : (
                    <div className="flex-1 flex flex-col justify-between">
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {projects.map((project) => (
                                <ProjectCard key={project._id} project={project} />
                            ))}
                        </div>

                        {/* Pagination Component */}
                        <Pagination
                            currentPage={pagination.page}
                            totalPages={pagination.totalPages}
                            totalItems={pagination.totalItems}
                            limit={pagination.limit}
                            onPageChange={(p) => setPage(p)}
                            onLimitChange={(l) => setLimit(l)}
                        />
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
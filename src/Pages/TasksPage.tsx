import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useGetTasks, useAiSearchTasks } from "../Hooks/useTask";
import { useGetProjectById } from "../Hooks/useProject";
import { useAppSelector } from "../Store/store";
import { Plus, Search, LayoutGrid, List, Users } from "lucide-react";
import SEO from "../Shared/SEO/SEO";
import AvatarGroup from "../Components/UI/AvatarGroup";
import TaskBoard from "../Components/Tasks/TaskBoard";
import TaskTable from "../Components/Tasks/TaskTable";
import CreateTaskModal from "../Components/Tasks/CreateTaskModal";
import AiTaskBreakdownModal from "../Components/Tasks/AiTaskBreakdownModal";
import TaskDetailsDrawer from "../Components/Tasks/TaskDetailsDrawer";
import ManageMembersModal from "../Components/Projects/ManageMembersModal";
import Pagination from "../Components/UI/Pagination";
import { Sparkles } from "lucide-react";
import Swal from "sweetalert2";
import type { Task } from "../Interfaces/ITasks";

const TasksPage = () => {
    const { projectId } = useParams<{ projectId: string }>();
    const { token } = useAppSelector((state) => state.auth);

    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("All statuses");
    const [priorityFilter, setPriorityFilter] = useState("All priorities");
    const [viewMode, setViewMode] = useState<"board" | "table">("board");
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isAiModalOpen, setIsAiModalOpen] = useState(false);
    const [isMembersModalOpen, setIsMembersModalOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(5);

    const [aiSearchQuery, setAiSearchQuery] = useState("");
    const [aiFilteredTasks, setAiFilteredTasks] = useState<Task[] | null>(null);
    const [isAiSearching, setIsAiSearching] = useState(false);
    const aiSearchMutation = useAiSearchTasks();

    const { user } = useAppSelector((state) => state.auth);

    // Reset page to 1 when filters or search change
    useEffect(() => {
        setPage(1);
    }, [search, statusFilter, priorityFilter]);

    const handleAiSearch = async (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && aiSearchQuery.trim() && project) {
            setIsAiSearching(true);
            try {
                const result = await aiSearchMutation.mutateAsync({
                    projectId: project._id,
                    data: { query: aiSearchQuery },
                    token: token || "",
                });
                setAiFilteredTasks(result.data);
            } catch (error: unknown) {
                console.error("AI Search Failed", error);
                const err = error as { response?: { data?: { message?: string } } };
                Swal.fire({
                    icon: "error",
                    title: "Smart Search Error",
                    text: err.response?.data?.message || "Failed to analyze your search query. Please try again.",
                });
            } finally {
                setIsAiSearching(false);
            }
        }
    };

    const clearAiSearch = () => {
        setAiSearchQuery("");
        setAiFilteredTasks(null);
    };

    // Fetch data
    const { data: projectData, isLoading: projectLoading } = useGetProjectById(projectId || "", token || "");
    const { data: tasksData, isLoading: tasksLoading } = useGetTasks(projectId || "", token || "", {
        page: viewMode === "table" ? page : undefined,
        limit: viewMode === "table" ? limit : undefined,
        search: search || undefined,
        status: statusFilter === "All statuses" ? undefined : statusFilter,
        priority: priorityFilter === "All priorities" ? undefined : priorityFilter,
    });

    const project = projectData?.data;
    const filteredTasks = tasksData?.data || [];
    const displayTasks = aiFilteredTasks !== null ? aiFilteredTasks : filteredTasks;
    const pagination = tasksData?.pagination || { page: 1, limit: 10, totalItems: 0, totalPages: 1 };

    if (projectLoading) {
        return <div className="p-8">Loading project...</div>;
    }

    if (!project) {
        return (
            <div className="p-8 text-center flex flex-col items-center justify-center h-full">
                <h2 className="text-xl font-bold text-gray-900 mb-2">Project not found</h2>
                <Link to="/projects" className="text-[#1a6b5a] hover:underline">Return to Projects</Link>
            </div>
        );
    }

    return (
        <>
            <SEO title={`${project.name} | TaskFlow`} />
            <div className="p-8 h-full flex flex-col overflow-hidden">
                {/* Header */}
                <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-[#1a6b5a]" />
                        <h1 className="text-2xl font-bold text-gray-900">{project.name}</h1>
                    </div>
                    <div className="flex items-center gap-4">
                        <AvatarGroup
                            users={[
                                project.creator,
                                ...(project.members || []).filter((m) => m._id !== project.creator._id),
                            ]}
                            max={3}
                        />
                        <div className="flex bg-gray-100 p-1 rounded-md">
                            <button
                                onClick={() => setViewMode("board")}
                                className={`p-1.5 rounded transition-all ${viewMode === "board" ? "bg-white shadow-sm text-gray-900" : "text-gray-500 hover:text-gray-900"
                                    }`}
                                title="Kanban Board View"
                            >
                                <LayoutGrid className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => setViewMode("table")}
                                className={`p-1.5 rounded transition-all ${viewMode === "table" ? "bg-white shadow-sm text-gray-900" : "text-gray-500 hover:text-gray-900"
                                    }`}
                                title="List Table View"
                            >
                                <List className="w-4 h-4" />
                            </button>
                        </div>
                        {user?.role === "admin" && (
                            <button
                                onClick={() => setIsMembersModalOpen(true)}
                                className="flex items-center gap-2 px-3 py-1.5 text-gray-700 border border-gray-300 text-sm font-medium rounded-md hover:bg-gray-50 transition-colors"
                            >
                                <Users className="w-4 h-4" />
                                Members
                            </button>
                        )}
                        <button
                            onClick={() => setIsAiModalOpen(true)}
                            className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-purple-500 to-indigo-600 text-white text-sm font-medium rounded-md hover:from-purple-600 hover:to-indigo-700 transition-colors"
                        >
                            <Sparkles className="w-4 h-4" />
                            AI Breakdown
                        </button>
                        <button
                            onClick={() => setIsCreateModalOpen(true)}
                            className="flex items-center gap-2 px-3 py-1.5 bg-[#1a6b5a] text-white text-sm font-medium rounded-md hover:bg-[#135244] transition-colors"
                        >
                            <Plus className="w-4 h-4" />
                            New task
                        </button>
                    </div>
                </div>
                <p className="text-sm text-gray-500 mb-8 max-w-2xl">{project.description}</p>

                {/* Toolbar */}
                <div className="flex flex-wrap items-center justify-between gap-4 mb-8 border-b border-gray-100 pb-4">
                    <div className="flex items-center gap-4">
                        <div className="relative w-64">
                            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search tasks..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-9 pr-4 py-1.5 bg-gray-50 border-none rounded-md text-sm outline-none focus:ring-1 focus:ring-[#1a6b5a]"
                            />
                        </div>

                        <div className="relative w-72">
                            <Sparkles className={`w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 ${isAiSearching ? 'text-purple-300 animate-pulse' : 'text-purple-500'}`} />
                            <input
                                type="text"
                                placeholder={isAiSearching ? "AI is thinking..." : "Ask AI to filter tasks..."}
                                value={aiSearchQuery}
                                onChange={(e) => setAiSearchQuery(e.target.value)}
                                onKeyDown={handleAiSearch}
                                disabled={isAiSearching}
                                className="w-full pl-9 pr-14 py-1.5 bg-purple-50 border border-purple-100 rounded-md text-sm outline-none focus:ring-1 focus:ring-purple-400 text-purple-900 placeholder-purple-400"
                            />
                            {aiFilteredTasks !== null && !isAiSearching && (
                                <button onClick={clearAiSearch} className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-purple-600 hover:text-purple-800">Clear</button>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-6 text-sm">
                        <div className="flex items-center gap-2">
                            <span className="text-gray-500">Status:</span>
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="bg-transparent font-medium text-gray-900 outline-none cursor-pointer"
                            >
                                <option>All statuses</option>
                                <option value="To Do">To Do</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Done">Done</option>
                                <option value="Ready for test">Ready for test</option>
                                <option value="Approved">Approved</option>
                            </select>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-gray-500">Priority:</span>
                            <select
                                value={priorityFilter}
                                onChange={(e) => setPriorityFilter(e.target.value)}
                                className="bg-transparent font-medium text-gray-900 outline-none cursor-pointer"
                            >
                                <option>All priorities</option>
                                <option value="High">High</option>
                                <option value="Medium">Medium</option>
                                <option value="Low">Low</option>
                            </select>
                        </div>
                        <div className="text-gray-400 text-xs font-medium ml-4">
                            Showing {displayTasks.length} {aiFilteredTasks !== null ? "(AI Filtered)" : `of ${pagination.totalItems}`} tasks
                        </div>
                    </div>
                </div>

                {/* Content Area */}
                {tasksLoading ? (
                    <div className="flex-1 flex items-center justify-center text-gray-500">Loading tasks...</div>
                ) : (
                    <div className="flex-1 min-h-0 flex flex-col justify-between">
                        {viewMode === "board" ? (
                            <TaskBoard
                                tasks={displayTasks}
                                onTaskClick={(task) => setSelectedTask(task)}
                                projectId={projectId || ""}
                                token={token || ""}
                            />
                        ) : (
                            <TaskTable tasks={displayTasks} onTaskClick={(task) => setSelectedTask(task)} />
                        )}

                        {viewMode === "table" && (
                            <Pagination
                                currentPage={pagination.page}
                                totalPages={pagination.totalPages}
                                totalItems={pagination.totalItems}
                                limit={pagination.limit}
                                onPageChange={(p) => setPage(p)}
                                onLimitChange={(l) => setLimit(l)}
                            />
                        )}
                    </div>
                )}
            </div>

            <CreateTaskModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                projectId={project._id}
                members={[
                    project.creator,
                    ...(project.members || []).filter(
                        (m) => m._id !== project.creator._id
                    ),
                ]}
            />

            <AiTaskBreakdownModal
                isOpen={isAiModalOpen}
                onClose={() => setIsAiModalOpen(false)}
                projectId={project._id}
                members={[
                    project.creator,
                    ...(project.members || []).filter(
                        (m) => m._id !== project.creator._id
                    ),
                ]}
            />

            <TaskDetailsDrawer
                isOpen={!!selectedTask}
                onClose={() => setSelectedTask(null)}
                task={selectedTask}
                projectId={project._id}
            />

            <ManageMembersModal
                isOpen={isMembersModalOpen}
                onClose={() => setIsMembersModalOpen(false)}
                project={project}
            />
        </>
    );
};

export default TasksPage;
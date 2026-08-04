import { Link, NavLink, useLocation } from "react-router-dom";
import {
  LayoutGrid,
  Settings,
  LogOut,
  FolderDot,
  UserCircle,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "../Store/store";
import { useGetProjects } from "../Hooks/useProject";
import { clearUserData } from "../Store/Slices/AuthSlice";

const Sidebar = () => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const { user, token } = useAppSelector((state) => state.auth);

  const { data: projectsData, isLoading } = useGetProjects(token || "");
  const projects = projectsData?.data || [];

  const handleLogout = () => {
    dispatch(clearUserData());
  };

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive
      ? "bg-[#1a6b5a]/10 text-[#1a6b5a]"
      : "text-gray-600 hover:bg-[#1a6b5a]/5 hover:text-[#1a6b5a]"
    }`;


  return (
    <aside className="w-64 h-screen bg-white border-r border-gray-200 shadow-[4px_0_8px_rgba(0,0,0,0.05)] flex flex-col fixed left-0 top-0 z-20">
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-gray-100">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[#1a6b5a] text-white font-bold text-sm">
            T
          </div>
          <span className="text-lg font-semibold text-gray-900">TaskFlow</span>
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto py-6 px-4 flex flex-col gap-8">
        {/* Projects Section */}
        <div>
          <h3 className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
            Projects
          </h3>
          <div className="flex flex-col gap-1">
            {isLoading ? (
              <div className="px-3 py-2 text-sm text-gray-400">Loading...</div>
            ) : projects.length === 0 ? (
              <div className="px-3 py-2 text-sm text-gray-400">No projects</div>
            ) : (
              projects.map((project) => (
                <NavLink
                  key={project._id}
                  to={`/projects/${project._id}/tasks`}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive
                      ? "bg-gray-100 text-[#1a6b5a]"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`
                  }
                >
                  <FolderDot
                    className={`w-4 h-4 ${location.pathname.includes(project._id)
                      ? "text-[#1a6b5a]"
                      : "text-gray-400"
                      }`}
                  />
                  <span className="truncate">{project.name}</span>
                </NavLink>
              ))
            )}
          </div>
        </div>

        {/* Workspace Section */}
        <div>
          <h3 className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
            Workspace
          </h3>
          <div className="flex flex-col gap-1">
            <NavLink to="/projects" className={navLinkClass} end>
              <LayoutGrid className="w-4 h-4 text-gray-400" />
              All projects
            </NavLink>
            <NavLink to="/profile" className={navLinkClass}>
              <UserCircle className="w-4 h-4 text-gray-400" />
              My Profile
            </NavLink>
            {user?.role === "admin" && (
              <NavLink to="/projects" className={navLinkClass}>
                <Settings className="w-4 h-4 text-gray-400" />
                Admin panel
              </NavLink>
            )}
          </div>
        </div>
      </div>

      {/* User Profile & Logout */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex min-w-0 flex-col">
            <span className="text-sm font-semibold text-gray-900 truncate">
              {user?.userName || "User"}
            </span>
            <span className="text-xs text-gray-400 capitalize">
              {user?.role}
            </span>
          </div>
          <button
            onClick={handleLogout}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;

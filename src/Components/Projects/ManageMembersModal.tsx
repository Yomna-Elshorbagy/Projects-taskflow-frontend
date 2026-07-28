import { useState, type FC } from "react";
import { Trash2, UserPlus, Loader2, Search } from "lucide-react";
import Modal from "../UI/Modal";
import Avatar from "../UI/Avatar";
import { useAddMember, useRemoveMember } from "../../Hooks/useProject";
import { useGetAllUsers } from "../../Hooks/useUsers";
import { useAppSelector } from "../../Store/store";
import type { Project } from "../../Interfaces/Iproject";
import type { ProjectMember } from "../../Types/ProjectType";
import Swal from "sweetalert2";

interface ManageMembersModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project;
}

const ManageMembersModal: FC<ManageMembersModalProps> = ({
  isOpen,
  onClose,
  project,
}) => {
  const { token, user } = useAppSelector((s) => s.auth);
  const [search, setSearch] = useState("");
  const [selectedUserId, setSelectedUserId] = useState("");

  const { mutate: addMember, isPending: isAdding } = useAddMember();
  const { mutate: removeMember, isPending: isRemoving } = useRemoveMember();
  const { data: usersData, isLoading: usersLoading } = useGetAllUsers(token || "");

  const isAdmin = user?.role === "admin";

  // All members including creator (deduplicated)
  const allMembers: ProjectMember[] = [
    project.creator,
    ...(project.members || []).filter((m) => m._id !== project.creator._id),
  ];

  const currentMemberIds = new Set(allMembers.map((m) => m._id));

  // Users available to add (not already members, filtered by search)
  const availableUsers = (usersData?.data || []).filter(
    (u) =>
      !currentMemberIds.has(u._id) &&
      (u.userName.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase()))
  );

  const handleAdd = () => {
    if (!selectedUserId || !token) return;

    addMember(
      { projectId: project._id, userId: selectedUserId, token },
      {
        onSuccess: () => {
          setSelectedUserId("");
          setSearch("");
          Swal.fire({
            icon: "success",
            title: "Member added!",
            showConfirmButton: false,
            timer: 1200,
          });
        },
        onError: (err: unknown) => {
          const e = err as { response?: { data?: { message?: string } } };
          Swal.fire({
            icon: "error",
            title: "Error",
            text: e.response?.data?.message || "Failed to add member",
          });
        },
      }
    );
  };

  const handleRemove = (memberId: string, memberName: string) => {
    if (!token) return;

    Swal.fire({
      title: `Remove ${memberName}?`,
      text: "They will lose access to this project.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#9ca3af",
      confirmButtonText: "Remove",
    }).then((result) => {
      if (!result.isConfirmed) return;

      removeMember(
        { projectId: project._id, userId: memberId, token },
        {
          onSuccess: () =>
            Swal.fire({
              icon: "success",
              title: "Removed",
              showConfirmButton: false,
              timer: 1200,
            }),
          onError: (err: unknown) => {
            const e = err as { response?: { data?: { message?: string } } };
            Swal.fire({
              icon: "error",
              title: "Error",
              text: e.response?.data?.message || "Failed to remove member",
            });
          },
        }
      );
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Manage members">
      <div className="flex flex-col gap-6">

        {/* ── Current Members ── */}
        <div>
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
            Current members ({allMembers.length})
          </h3>
          <div className="flex flex-col divide-y divide-gray-100 rounded-lg border border-gray-100 overflow-hidden">
            {allMembers.map((member) => {
              const isCreator = member._id === project.creator._id;
              return (
                <div
                  key={member._id}
                  className="flex items-center justify-between px-3 py-2.5"
                >
                  <div className="flex items-center gap-3">
                    <Avatar name={member.userName} size="sm" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {member.userName}
                      </p>
                      <p className="text-[11px] text-gray-400 capitalize">
                        {isCreator ? "Creator · Admin" : "Member"}
                      </p>
                    </div>
                  </div>

                  {isAdmin && !isCreator && (
                    <button
                      onClick={() => handleRemove(member._id, member.userName)}
                      disabled={isRemoving}
                      className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors disabled:opacity-50"
                      title="Remove member"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Add Member (Admin Only) ── */}
        {isAdmin && (
          <div>
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
              Add member
            </h3>

            {/* Search input */}
            <div className="relative mb-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setSelectedUserId(""); // clear selection when searching
                }}
                placeholder="Search users by name or email..."
                className="w-full pl-9 pr-4 py-2 rounded-md border border-gray-300 text-sm outline-none focus:border-[#1a6b5a] focus:ring-1 focus:ring-[#1a6b5a]"
              />
            </div>

            {/* User list */}
            {usersLoading ? (
              <div className="flex items-center justify-center py-4 text-gray-400 text-sm">
                <Loader2 className="w-4 h-4 animate-spin mr-2" /> Loading users...
              </div>
            ) : availableUsers.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-3">
                {search ? "No users match your search." : "All users are already members."}
              </p>
            ) : (
              <div className="flex flex-col max-h-44 overflow-y-auto rounded-lg border border-gray-100 divide-y divide-gray-100 mb-3">
                {availableUsers.map((u) => (
                  <label
                    key={u._id}
                    className={`flex items-center gap-3 px-3 py-2.5 cursor-pointer transition-colors ${
                      selectedUserId === u._id
                        ? "bg-[#1a6b5a]/5 border-l-2 border-[#1a6b5a]"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    <input
                      type="radio"
                      name="selectedUser"
                      value={u._id}
                      checked={selectedUserId === u._id}
                      onChange={() => setSelectedUserId(u._id)}
                      className="accent-[#1a6b5a]"
                    />
                    <Avatar name={u.userName} size="sm" />
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-900">
                        {u.userName}
                      </span>
                      <span className="text-[11px] text-gray-400">{u.email}</span>
                    </div>
                    <span className="ml-auto text-[10px] font-semibold text-gray-400 uppercase">
                      {u.role}
                    </span>
                  </label>
                ))}
              </div>
            )}

            <button
              onClick={handleAdd}
              disabled={!selectedUserId || isAdding}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-[#1a6b5a] text-white text-sm font-medium rounded-md hover:bg-[#135244] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isAdding ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <UserPlus className="w-4 h-4" />
              )}
              {isAdding ? "Adding..." : "Add selected member"}
            </button>
          </div>
        )}

        <div className="flex justify-end pt-1">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ManageMembersModal;

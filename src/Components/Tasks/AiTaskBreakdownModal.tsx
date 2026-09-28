import { useState } from "react";
import type { FC } from "react";
import Modal from "../UI/Modal";
import SubmitButton from "../SubmitButton";
import { useCreateAiTaskBreakdown, useCreateTask } from "../../Hooks/useTask";
import { useAppSelector } from "../../Store/store";
import Swal from "sweetalert2";
import type { ProjectMember } from "../../Types/ProjectType";

interface AiTaskBreakdownModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  members: ProjectMember[];
}

const AiTaskBreakdownModal: FC<AiTaskBreakdownModalProps> = ({ isOpen, onClose, projectId, members }) => {
  const { token } = useAppSelector((state) => state.auth);
  const [description, setDescription] = useState("");
  const [drafts, setDrafts] = useState<any[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  const { mutate: generateAiTasks, isPending: isGenerating } = useCreateAiTaskBreakdown();
  const { mutateAsync: createSingleTask } = useCreateTask();

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !description.trim()) return;

    generateAiTasks(
      { projectId, data: { description }, token },
      {
        onSuccess: (res: any) => {
          setDrafts(res.data || []);
        },
        onError: (error: unknown) => {
          const err = error as { response?: { data?: { message?: string } } };
          Swal.fire({
            icon: "error",
            title: "Error",
            text: err.response?.data?.message || "Failed to generate tasks",
          });
        },
      }
    );
  };

  const handleSaveToBoard = async () => {
    if (!token) return;
    setIsSaving(true);
    try {
      // Loop through all drafts and hit the regular create task endpoint
      await Promise.all(
        drafts.map((task) =>
          createSingleTask({
            projectId,
            token,
            data: {
              title: task.title,
              description: task.description,
              status: "To Do",
              priority: task.priority,
              dueDate: task.dueDate ? new Date(task.dueDate) : new Date(),
              assignee: task.assignee || undefined,
            },
          })
        )
      );

      Swal.fire({
        icon: "success",
        title: "All Tasks Added!",
        showConfirmButton: false,
        timer: 1500,
      });
      handleClose();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to save some tasks. Please try again.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleAssigneeChange = (index: number, newAssignee: string) => {
    const updatedDrafts = [...drafts];
    updatedDrafts[index].assignee = newAssignee;
    setDrafts(updatedDrafts);
  };

  const handleClose = () => {
    setDescription("");
    setDrafts([]);
    setIsSaving(false);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={drafts.length > 0 ? "Review & Assign Tasks" : "AI Task Breakdown"}>
      {drafts.length === 0 ? (
        <form onSubmit={handleGenerate} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label htmlFor="ai-description" className="text-sm font-medium text-gray-700">
              High-level Task Description
            </label>
            <textarea
              id="ai-description"
              placeholder="Describe a big feature (e.g. 'Build a user authentication system'). The AI will break it down into actionable subtasks..."
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none transition-all resize-none bg-white focus:border-[#1a6b5a] focus:ring-2 focus:ring-[#1a6b5a]/30"
            />
          </div>

          <div className="pt-4 flex justify-end gap-3 mt-2">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none"
              disabled={isGenerating}
            >
              Cancel
            </button>
            <div className="w-48">
              <SubmitButton
                id="generate-ai-tasks-btn"
                label="Generate Drafts"
                loadingLabel="Generating..."
                isLoading={isGenerating}
              />
            </div>
          </div>
        </form>
      ) : (
        <div className="flex flex-col gap-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
          {drafts.map((task, idx) => (
            <div key={idx} className="border border-gray-200 rounded-lg p-4 flex flex-col gap-2 bg-gray-50/50">
              <h4 className="font-semibold text-gray-900 text-sm">{task.title}</h4>
              <p className="text-xs text-gray-600 line-clamp-2">{task.description}</p>
              
              <div className="flex items-center justify-between mt-2">
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${task.priority === 'High' ? 'bg-red-100 text-red-700' : task.priority === 'Medium' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                  {task.priority}
                </span>
                
                <div className="flex items-center gap-2">
                  <label className="text-xs font-medium text-gray-500">Assign to:</label>
                  <select
                    value={task.assignee || ""}
                    onChange={(e) => handleAssigneeChange(idx, e.target.value)}
                    className="text-xs border border-gray-300 rounded-md focus:ring-[#1a6b5a] focus:border-[#1a6b5a] py-1 px-2"
                  >
                    <option value="">Unassigned</option>
                    {members.map(m => (
                      <option key={m._id} value={m._id}>{m.userName}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          ))}

          <div className="pt-4 flex justify-end gap-3 sticky bottom-0 bg-white border-t mt-2 py-2">
            <button
              type="button"
              onClick={() => setDrafts([])} // allow them to discard and try again
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none"
              disabled={isSaving}
            >
              Discard
            </button>
            <button
              onClick={handleSaveToBoard}
              disabled={isSaving}
              className="px-4 py-2 text-sm font-medium text-white bg-[#1a6b5a] rounded-md hover:bg-[#135244] focus:outline-none disabled:opacity-50"
            >
              {isSaving ? "Saving..." : "Save to Board"}
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default AiTaskBreakdownModal;

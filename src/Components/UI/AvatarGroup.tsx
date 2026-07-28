import React from "react";
import Avatar from "./Avatar";

interface AvatarGroupProps {
  users: { _id: string; userName: string }[];
  max?: number;
  size?: "sm" | "md" | "lg";
}

const AvatarGroup: React.FC<AvatarGroupProps> = ({
  users,
  max = 3,
  size = "sm",
}) => {
  const visibleUsers = users.slice(0, max);
  const hiddenCount = users.length - max;

  return (
    <div className="flex items-center -space-x-2">
      {visibleUsers.map((user) => (
        <Avatar
          key={user._id}
          name={user.userName}
          size={size}
          className="border-2 border-white ring-1 ring-gray-100"
        />
      ))}
      {hiddenCount > 0 && (
        <div
          className={`flex items-center justify-center rounded-full bg-gray-100 text-gray-600 font-medium border-2 border-white ring-1 ring-gray-100 z-10
            ${size === "sm" ? "w-6 h-6 text-[10px]" : ""}
            ${size === "md" ? "w-8 h-8 text-xs" : ""}
            ${size === "lg" ? "w-10 h-10 text-sm" : ""}
          `}
        >
          +{hiddenCount}
        </div>
      )}
    </div>
  );
};

export default AvatarGroup;

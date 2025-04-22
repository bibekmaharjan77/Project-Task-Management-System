import React from "react";

interface PriorityBadgeProps {
    priority: "Low" | "Medium" | "High";
}

const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority }) => {
    let className = "px-2 py-1 rounded-full text-xs font-medium";
    let label = priority;

    switch (priority) {
        case "Low":
            className += " bg-green-100 text-green-700";
            break;
        case "Medium":
            className += " bg-yellow-100 text-yellow-800";
            break;
        case "High":
            className += " bg-red-100 text-red-700";
            break;
        default:
            className += " bg-gray-100 text-gray-700";
    }

    return <span className={className}>{label}</span>;
};

export default PriorityBadge;


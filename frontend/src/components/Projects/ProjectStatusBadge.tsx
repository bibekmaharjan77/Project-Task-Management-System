import React from "react";

interface StatusBadgeProps {
    status: "Planning" | "In Progress" | "On Hold" | "Completed" | "Cancelled";
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
    let className = "px-2 py-1 rounded-full text-xs font-medium";
    let label = status;

    switch (status) {
        case "Planning":
            className += " bg-blue-100 text-blue-700";
            break;
        case "In Progress":
            className += " bg-yellow-100 text-yellow-800";
            break;
        case "On Hold":
            className += " bg-orange-100 text-orange-700";
            break;
        case "Completed":
            className += " bg-green-100 text-green-700";
            break;
        case "Cancelled":
            className += " bg-red-100 text-red-700";
            break;
        default:
            className += " bg-gray-100 text-gray-700";
    }

    return <span className={className}>{label}</span>;
};

export default StatusBadge;

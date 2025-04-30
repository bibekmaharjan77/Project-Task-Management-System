export type ProjectFormValues = {
    projectName: string;
    projectDescription: string;
    startDate: string;
    endDate: string;
    priority: string;
    status: string;
};

export type ProjectDataType = {
    _id?: string;
    name: string;
    description: string;
    start_date: string;
    end_date: string;
    priority: "Low" | "Medium" | "High";
    status: "Planning" | "In Progress" | "On Hold" | "Completed" | "Cancelled";
    subtasks?: Subtask[];
    created_at?: string;
    updated_at?: string;
};

export type Subtask = {
    title: string;
    description: string;
    assign_to: string;
    status: string
};
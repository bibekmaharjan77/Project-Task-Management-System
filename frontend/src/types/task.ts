export type TaskFormValues = {
    taskName: string;
    taskDescription: string;
    taskAssignedTo: string;
};

export type TaskDataType = {
    _id?: string;
    title: string;
    description: string;
    assigned_to: string;
    status?: "Completed" | "Incomplete";
    created_at?: string;
    updated_at?: string;
};

export type CreateProjectSubTaskFormData = {
    project_id: string | undefined;
    subtasks: TaskDataType[];
};
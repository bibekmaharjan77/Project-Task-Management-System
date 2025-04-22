import { CreateProjectSubTaskFormData } from "@/types/task";
import AXIOS_INSTANCE from "../axios_instance";

// Create a new task
export const createProjectSubTask = (values: CreateProjectSubTaskFormData) => {
    try {
        return AXIOS_INSTANCE.post("/tasks", values)
            .then((response) => response.data)
            .catch((error) => {
                throw error;
            });
    } catch (error) {
        console.log(error, "Error while creating task");
    }
};

// Get all tasks
export const getAllTasks = ({
    page,
    perPage,
    searchText,
    status,
}: {
    page?: number;
    perPage?: number;
    searchText?: string;
    status?: string | undefined
}) => {
    try {
        const params: Record<string, string> = {};

        if (page !== undefined) params['page'] = page.toString();
        if (perPage !== undefined) params['per_page'] = perPage.toString();
        if (searchText) params['search'] = searchText;
        if (status) params['status'] = status;

        return AXIOS_INSTANCE.get("/tasks", { params })
            .then((response) => response.data)
            .catch((error) => {
                throw error;
            });
    } catch (error) {
        console.log(error, "Error while fetching all tasks");
    }
};

// Get a task by ID
export const getTaskById = (id: string) => {
    try {
        return AXIOS_INSTANCE.get(`/tasks/${id}`)
            .then((response) => response.data)
            .catch((error) => {
                throw error;
            });
    } catch (error) {
        console.log(error, `Error while fetching task with ID ${id}`);
    }
};

// Delete a task by ID
export const deleteTaskById = (id: string) => {
    try {
        return AXIOS_INSTANCE.delete(`/tasks/${id}`)
            .then((response) => response.data)
            .catch((error) => {
                throw error;
            });
    } catch (error) {
        console.log(error, `Error while deleting task with ID ${id}`);
    }
};

// Update a task by ID
export const updateTaskById = (id: string, values: CreateProjectSubTaskFormData) => {
    try {
        return AXIOS_INSTANCE.put(`/tasks/${id}`, values)
            .then((response) => response.data)
            .catch((error) => {
                throw error;
            });
    } catch (error) {
        console.log(error, `Error while updating task with ID ${id}`);
    }
};

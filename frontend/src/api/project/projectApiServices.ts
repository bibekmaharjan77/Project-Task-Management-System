import { ProjectDataType } from "@/types/project";
import AXIOS_INSTANCE from "../axios_instance";

// Create a new project
export const createProject = (values: ProjectDataType) => {
    try {
        return AXIOS_INSTANCE.post("/projects", values)
            .then((response) => response.data)
            .catch((error) => {
                throw error;
            });
    } catch (error) {
        console.log(error, "Error while creating project");
    }
};

// Get all projects
export const getAllProjects = ({
    page,
    perPage,
    searchText,
    startDate,
    endDate,
    status,
}: {
    page?: number;
    perPage?: number;
    searchText?: string;
    startDate?: string;
    endDate?: string;
    status?: string | undefined
}) => {
    try {
        const params: Record<string, string> = {};

        if (page !== undefined) params['page'] = page.toString();
        if (perPage !== undefined) params['per_page'] = perPage.toString();
        if (searchText) params['search'] = searchText;
        if (startDate) params['start_date'] = startDate;
        if (endDate) params['end_date'] = endDate;
        if (status) params['status'] = status;

        return AXIOS_INSTANCE.get("/projects", { params })
            .then((response) => response.data)
            .catch((error) => {
                throw error;
            });
    } catch (error) {
        console.log(error, "Error while fetching all projects");
    }
};

// Get a project by ID
export const getProjectById = (id: string) => {
    try {
        return AXIOS_INSTANCE.get(`/projects/${id}`)
            .then((response) => response.data)
            .catch((error) => {
                throw error;
            });
    } catch (error) {
        console.log(error, `Error while fetching project with ID ${id}`);
    }
};

// Delete a project by ID
export const deleteProjectById = (id: string) => {
    try {
        return AXIOS_INSTANCE.delete(`/projects/${id}`)
            .then((response) => response.data)
            .catch((error) => {
                throw error;
            });
    } catch (error) {
        console.log(error, `Error while deleting project with ID ${id}`);
    }
};

// Update a project by ID
export const updateProjectById = (id: string, values: ProjectDataType) => {
    try {
        return AXIOS_INSTANCE.put(`/projects/${id}`, values)
            .then((response) => response.data)
            .catch((error) => {
                throw error;
            });
    } catch (error) {
        console.log(error, `Error while updating project with ID ${id}`);
    }
};

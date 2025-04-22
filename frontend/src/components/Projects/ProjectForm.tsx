"use client";

import { useFormik } from "formik";
import * as Yup from "yup";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { DialogFooter } from "../ui/dialog";
import { DialogClose } from "@radix-ui/react-dialog";
import { ProjectDataType } from "@/types/project";
import { createProject, getProjectById, updateProjectById } from "@/api/project/projectApiServices";
import { toast } from "react-toastify";
import { useEffect, useRef } from "react";


const ProjectForm = ({ fetchProjects, editId }: { fetchProjects: any, editId: string | undefined }) => {
    const closeRef = useRef<HTMLButtonElement>(null);
    useEffect(() => {
        if (editId) {
            getProjectById(editId)?.then((projectData => {
                if (projectData) {
                    formik.setValues({
                        name: projectData.name || "",
                        description: projectData.description || "",
                        start_date: projectData.start_date?.split("T")[0] || "",
                        end_date: projectData.end_date?.split("T")[0] || "",
                        priority: projectData.priority || "Medium",
                        status: projectData.status || "Planning",
                    });
                }
            })).catch((err) => {
                console.error("Failed to fetch project:", err);
            });
        }
    }, [editId])
    const formik = useFormik<ProjectDataType>({
        initialValues: {
            name: "",
            description: "",
            start_date: "",
            end_date: "",
            priority: "Medium",
            status: "Planning",
        },
        validationSchema: Yup.object({
            name: Yup.string().required("Project name is required"),
            description: Yup.string().required("Project description is required"),
            start_date: Yup.string().required("Start date is required"),
            end_date: Yup.string().required("End date is required"),
            priority: Yup.string().required("Priority is required"),
            status: Yup.string().required("Status is required"),
        }),
        onSubmit: async (values, { setErrors, resetForm }) => {
            try {
                if (editId) {
                    const data = await updateProjectById(editId, values);
                    if (data.stausCode === 200) {
                        toast.success(data?.message ?? "")
                    }
                } else {
                    const data = await createProject(values);
                    if (data.stausCode === 201) {
                        toast.success(data?.message ?? "")

                    }
                }
                closeRef.current?.click();
                fetchProjects();
                resetForm();
            } catch (err: any) {
                console.log(err, "errerrerr")
                if (err.response?.data?.errors) {
                    const validationErrors: { [key: string]: string } = {};
                    err.response.data.errors.forEach((error: any) => {
                        const field = error.loc[0];
                        validationErrors[field] = error.msg;
                    });
                    console.log(validationErrors, "errors")
                    setErrors(validationErrors);
                }
            }
        },
    });
    return (
        <form onSubmit={formik.handleSubmit} className="flex flex-col gap-4 w-full mx-auto">
            <div className="flex flex-col">
                <Label htmlFor="name" className="pb-2">Project Name</Label>
                <Input
                    id="name"
                    type="text"
                    name="name"
                    placeholder="Project Name"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                />
                {formik.touched.name && formik.errors.name && (
                    <span className="text-sm text-red-500">{formik.errors.name}</span>
                )}
            </div>

            {/* Project Description */}
            <div className="flex flex-col ">
                <Label htmlFor="description" className="pb-2">Project Description</Label>
                <textarea
                    id="description"
                    name="description"
                    placeholder="Describe the project..."
                    value={formik.values.description}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    rows={4}
                    className="border border-input bg-background rounded-md p-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring"
                />
                {formik.touched.description && formik.errors.description && (
                    <span className="text-sm text-red-500">{formik.errors.description}</span>
                )}
            </div>

            {/* Start Date */}
            <div className="flex flex-row justify-between gap-4">
                <div className="flex flex-col w-full">
                    <Label htmlFor="start_date" className="pb-2">Start Date</Label>
                    <Input
                        id="start_date"
                        type="date"
                        name="start_date"
                        value={formik.values.start_date}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    {formik.touched.start_date && formik.errors.start_date && (
                        <span className="text-sm text-red-500">{formik.errors.start_date}</span>
                    )}
                </div>

                {/* End Date */}
                <div className="flex flex-col w-full">
                    <Label htmlFor="end_date" className="pb-2">End Date</Label>
                    <Input
                        id="end_date"
                        type="date"
                        name="end_date"
                        value={formik.values.end_date}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    {formik.touched.end_date && formik.errors.end_date && (
                        <span className="text-sm text-red-500">{formik.errors.end_date}</span>
                    )}
                </div>

            </div>

            <div className="flex flex-row justify-between gap-4">
                {/* Priority */}
                <div className="flex flex-col w-full">
                    <Label htmlFor="priority" className="pb-2">Priority</Label>
                    <select
                        id="priority"
                        name="priority"
                        value={formik.values.priority}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className="border border-input bg-background rounded-md p-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring"
                    >
                        <option value="">Select Priority</option>
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                    </select>
                    {formik.touched.priority && formik.errors.priority && (
                        <span className="text-sm text-red-500">{formik.errors.priority}</span>
                    )}
                </div>

                {/* Status */}
                <div className="flex flex-col w-full">
                    <Label htmlFor="status" className="pb-2">Status</Label>
                    <select
                        id="status"
                        name="status"
                        value={formik.values.status}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className="border border-input bg-background rounded-md p-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring"
                    >
                        <option value="">Select Status</option>
                        <option value="Planning">Planning</option>
                        <option value="In Progress">In Progress</option>
                        <option value="On Hold">On Hold</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                    </select>
                    {formik.touched.status && formik.errors.status && (
                        <span className="text-sm text-red-500">{formik.errors.status}</span>
                    )}
                </div>
            </div>

            <DialogFooter className="justify-between pt-2">
                <div className="flex w-full justify-between">
                    <DialogClose asChild>
                        <Button type="button" variant="destructive" className="cursor-pointer">
                            Close
                        </Button>
                    </DialogClose>
                    <DialogClose>
                        <button type="button" ref={closeRef} className="hidden" />
                    </DialogClose>
                    <Button type="submit" variant="default" className="bg-green-700 font-semibold hover:bg-green-900 cursor-pointer">
                        {editId ? "Update" : "Submit"}
                    </Button>
                </div>
            </DialogFooter>

        </form>
    );
};

export default ProjectForm;

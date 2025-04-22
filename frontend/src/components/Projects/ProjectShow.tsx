import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { getProjectById } from "@/api/project/projectApiServices";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ProjectDataType } from "@/types/project";
import PriorityBadge from "./PriorityBadge";
import StatusBadge from "./ProjectStatusBadge";
import { ArrowLeft, Plus, Trash } from "lucide-react";
import { useFormik, FieldArray, FormikProvider, FormikErrors } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import { createProjectSubTask } from "@/api/task/taskApiServices";
import {toast} from "react-toastify";
import { TaskDataType } from "@/types/task";

export default function ProjectShow() {
    const { id } = useParams();
    const [project, setProject] = useState<ProjectDataType | null>(null);

    useEffect(() => {
        if (id) {
            getProjectById(id)?.then((res) => setProject(res));
        }
    }, [id]);

    const formik = useFormik({
        initialValues: {
            project_id: id,
            subtasks: [
                { title: "", description: "", assigned_to: "" },
            ] as TaskDataType[],
        },
        validationSchema: Yup.object({
            subtasks: Yup.array()
                .of(
                    Yup.object().shape({
                        title: Yup.string().required("Title is required"),
                        description: Yup.string().required("Description is required"),
                        assigned_to: Yup.string().required("Assigned To is required"),
                    })
                )
                .min(1, "At least one subtask is required"),
        }),
        onSubmit: async (values) => {
            console.log("Submitted subtasks:", values);
            // You can call your API to save subtasks here
            const data = await createProjectSubTask(values);
                                if (data.stausCode === 201) {
                                    toast.success(data?.message ?? "")
            
                                }
        },
    });

    const { values, errors, touched, handleChange, handleBlur, handleSubmit } = formik;

    if (!project) return <div className="p-4">Loading...</div>;

    return (
        <div className="p-6 space-y-6 w-full mx-auto">
            <div className="text-3xl font-bold flex gap-2 items-center ">
                <Link to={"/projects"}>
                    <ArrowLeft className="border-2 h-8 w-10 rounded-md hover:scale-120 cursor-pointer" />
                </Link>
                Project
            </div>

            {/* Project Details */}
            <div className="flex flex-col gap-6">
                <h1 className="text-xl font-semibold uppercase">{project.name}</h1>
                <div className="flex gap-4 justify-between">
                    <div className="flex gap-2"><strong>Description:</strong> {project.description}</div>
                    <div className="flex gap-2"><strong>Priority:</strong> <PriorityBadge priority={project.priority} /></div>
                    <div className="flex gap-2"><strong>Status:</strong> <StatusBadge status={project.status} /></div>
                </div>
                <div className="flex gap-4 justify-between">
                    <div className="flex gap-2"><strong>Start Date:</strong> {project.start_date}</div>
                    <div className="flex gap-2"><strong>End Date:</strong> {project.end_date}</div>
                </div>
            </div>

            {/* Subtask Form */}
            <FormikProvider value={formik}>
                <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <h2 className="text-xl font-bold">Subtasks</h2>
                        <FieldArray name="subtasks">
                            {({ remove, push }) => (
                                <>
                                    {values.subtasks.map((task, index) => (
                                        <div key={index} className="space-y-2 border p-4 rounded-md flex gap-4 flex-wrap">
                                            <div className="flex flex-col gap-1 w-full md:w-[30%]">
                                                <Input
                                                    name={`subtasks[${index}].title`}
                                                    value={task.title}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    placeholder="Title"
                                                />
                                                {Array.isArray(errors.subtasks) &&
                                                    touched.subtasks?.[index]?.title &&
                                                    (errors.subtasks as FormikErrors<TaskDataType[]>)[index]?.title && (
                                                        <div className="text-red-500 text-sm">
                                                            {(errors.subtasks as FormikErrors<TaskDataType[]>)[index]?.title}
                                                        </div>
                                                    )}
                                            </div>
                                            <div className="flex flex-col gap-1 w-full md:w-[30%]">
                                                <Input
                                                    name={`subtasks[${index}].description`}
                                                    value={task.description}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    placeholder="Description"
                                                />
                                                {Array.isArray(errors.subtasks) &&
                                                    touched.subtasks?.[index]?.description &&
                                                    (errors.subtasks as FormikErrors<TaskDataType[]>)[index]?.description && (
                                                        <div className="text-red-500 text-sm">
                                                            {(errors.subtasks as FormikErrors<TaskDataType[]>)[index]?.description}
                                                        </div>
                                                    )}
                                            </div>
                                            <div className="flex flex-col gap-1 w-full md:w-[30%]">
                                                <Input
                                                    name={`subtasks[${index}].assigned_to`}
                                                    value={task.assigned_to}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    placeholder="Assigned To"
                                                />
                                                {Array.isArray(errors.subtasks) &&
                                                    touched.subtasks?.[index]?.assigned_to &&
                                                    (errors.subtasks as FormikErrors<TaskDataType[]>)[index]?.assigned_to && (
                                                        <div className="text-red-500 text-sm">
                                                            {(errors.subtasks as FormikErrors<TaskDataType[]>)[index]?.assigned_to}
                                                        </div>
                                                    )}
                                            </div>
                                            <div className="flex ">
                                                <Button
                                                    variant="destructive"
                                                    type="button"
                                                    onClick={() => {
                                                        if (values.subtasks.length > 1) remove(index);
                                                    }}
                                                    className="cursor-pointer"
                                                >
                                                    <Trash />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                    <div className="w-full flex justify-between">
                                        <Button type="button" onClick={() => push({ title: "", description: "", assignedTo: "" })} className="mt-2 cursor-pointer">
                                            <Plus /> Add More
                                        </Button>
                                        <Button type="submit" className="mt-2 bg-green-600 hover:scale-110 hover:bg-green-900 cursor-pointer">
                                            Submit
                                        </Button>
                                    </div>
                                </>
                            )}
                        </FieldArray>
                    </div>
                </form>
            </FormikProvider>
        </div>
    );
}

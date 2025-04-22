import { useState, useEffect } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Eye, LoaderCircleIcon, Pencil, Plus, Trash } from "lucide-react";
import PaginationCommon from "../Common/Pagination";
import { Link, useSearchParams } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader } from "../ui/dialog";
import ProjectForm from "./ProjectForm";
import { deleteProjectById, getAllProjects } from "@/api/project/projectApiServices";
import { ProjectDataType } from "@/types/project";
import StatusBadge from "./ProjectStatusBadge";
import PriorityBadge from "./PriorityBadge";

const pageSize = 5;

const ProjectTable = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(true);

    const [searchTerm, setSearchTerm] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [editId, setEditId] = useState<string | undefined>();

    const [projects, setProjects] = useState<ProjectDataType[]>([]);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const currentPageFromUrl = Number(searchParams.get("current")) || 1;
        setPage(currentPageFromUrl);
    }, [searchParams]);

    useEffect(() => {
        fetchProjects();
    }, [page]);

    const fetchProjects = async (statusFilter?: string) => {
        setLoading(true);
        try {
            const response = await getAllProjects({
                page,
                perPage: pageSize,
                searchText: searchTerm,
                startDate,
                endDate,
                ...(statusFilter && { status: statusFilter })
            });

            const formatted = response?.projects?.map((project: ProjectDataType) => ({
                _id: project._id,
                name: project.name,
                start_date: project.start_date,
                end_date: project.end_date,
                priority: project.priority,
                status: project.status || "pending",
                created_at: project?.created_at
                    ? new Date(project.created_at).toISOString().split("T")[0]
                    : "",
            })) ?? [];

            setProjects(formatted);
            setTotalPages(response?.pagination?.total_pages ?? 0);
        } catch (error) {
            console.error("Error fetching projects:", error);
        } finally {
            setLoading(false);
        }
    };

    const applyFilters = async () => {
        setPage(1);
        setSearchParams({ current: "1" });
        fetchProjects(statusFilter);
    };

    return (
        <div className="space-y-6 p-4">
            <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">Project List</h2>
                <Button className="gap-2 cursor-pointer" onClick={() => setOpen(true)}>
                    <Plus size={16} /> Add Project
                </Button>

                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogContent className="sm:max-w-md lg:max-w-3xl">
                        <DialogHeader>
                            <div className="text-lg font-semibold">Create Project Form</div>
                        </DialogHeader>
                        <ProjectForm fetchProjects={fetchProjects} editId={editId} />
                    </DialogContent>
                </Dialog>
            </div>

            <div className="flex flex-col gap-4 justify-end items-end">
                <div className="flex flex-col lg:flex-row lg:justify-between w-full gap-6">
                    <div className="flex gap-6">
                        <Input
                            placeholder="Search by name"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-64"
                        />
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-[160px]">
                                <SelectValue placeholder="Filter by status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="Planning">Planning</SelectItem>
                                <SelectItem value="In Progress">In Progress</SelectItem>
                                <SelectItem value="On Hold">On Hold</SelectItem>
                                <SelectItem value="completed">Completed</SelectItem>
                                <SelectItem value="Cancelled">Cancelled</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex gap-2">
                        <Input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                        />
                        <Input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                        />
                        <Button onClick={applyFilters} className="w-32 cursor-pointer">
                            Filter
                        </Button>
                    </div>
                </div>
            </div>

            <Card>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Project Name</TableHead>
                            <TableHead>Start Date</TableHead>
                            <TableHead>End Date</TableHead>
                            <TableHead>Priority</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Created At</TableHead>
                            <TableHead className="text-center">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center">
                                    <div className="flex justify-center items-center py-6">
                                        <LoaderCircleIcon className="w-8 h-8 animate-spin" />
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            projects.map((project) => (
                                <TableRow key={project._id}>
                                    <TableCell>{project.name}</TableCell>
                                    <TableCell>{project.start_date}</TableCell>
                                    <TableCell>{project.end_date}</TableCell>
                                    <TableCell><PriorityBadge priority={project.priority} /></TableCell>
                                    <TableCell className="capitalize"><StatusBadge status={project.status} /></TableCell>
                                    <TableCell>{project.created_at}</TableCell>
                                    <TableCell className="text-center space-x-2">
                                        <Link to={`/projects/${project._id}`}>
                                            <Button size="icon" variant="ghost" className="cursor-pointer">
                                                <Eye size={16} />
                                            </Button>
                                        </Link>
                                        <Button size="icon" variant="ghost" className="cursor-pointer" onClick={() => {
                                            setEditId(project._id)
                                            setOpen(true)
                                        }}>
                                            <Pencil size={16} />
                                        </Button>
                                        <Button size="icon" variant="ghost" className="cursor-pointer"
                                            onClick={async () => {
                                                const confirmed = window.confirm("Are you sure you want to delete this project?");
                                                if (confirmed) {
                                                    try {
                                                        await deleteProjectById(project?._id ?? "");
                                                        fetchProjects(); // refresh the list
                                                    } catch (error) {
                                                        console.error("Failed to delete project:", error);
                                                    }
                                                }
                                            }}
                                        >
                                            <Trash size={16} className="text-red-500 cursor-pointer" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </Card>

            <PaginationCommon totalPages={totalPages} />
        </div>
    );
};

export default ProjectTable;

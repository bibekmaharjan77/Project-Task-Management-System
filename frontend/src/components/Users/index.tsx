import { useEffect, useState } from "react";
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
import { Card } from "@/components/ui/card";
import PaginationCommon from "../Common/Pagination";
import { useSearchParams } from "react-router-dom";
import { get_users } from "@/api/users/userApiServices";
import { LoaderCircleIcon } from "lucide-react";

const UserTable = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0)
    const [filteredData, setFilteredData] = useState<any>([]);

    useEffect(() => {
        const currentPageFromUrl = Number(searchParams.get("current")) || 1;
        setPage(currentPageFromUrl ?? 1)
    }, [searchParams, setSearchParams]);

    useEffect(() => {
        get_users({ page, perPage: 10 }).then((users) => {
            console.log(users, "data when page changed")
            setFilteredData(users?.users ?? [])
            setTotalPages(users?.pagination?.total_pages ?? 0)
            setLoading(false)
        }).catch((error) => {
            console.log(error, "error")
            setLoading(false)
        })
    }, [page])

    const applyFilters = async () => {
        setLoading(true)
        get_users({ page, perPage: 10, searchText: searchTerm, startDate, endDate }).then((users) => {
            console.log(users, "data when page changed")
            setFilteredData(users?.users ?? [])
            setPage(1);
            setTotalPages(users?.pagination?.total_pages ?? 0)
            setLoading(false)
        }).catch((error) => {
            console.log(error, "error")
            setLoading(false)
        })
    };

    return (
        <div className="space-y-6 p-4">
            <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">Users List</h2>
            </div>
            <div className="flex flex-col  gap-4 justify-end items-end">
                <div className="flex gap-4 justify-between items-end w-full">
                    <div className="flex flex-col lg:flex-row lg:justify-between w-full gap-6">
                        <div className="flex gap-6">
                            <Input
                                placeholder="Search by name or email"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-64"
                            />
                            <div className="flex gap-2">
                                <div>
                                    <Input
                                        type="date"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <Input
                                        type="date"
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="w-full justify-end flex">
                            <Button onClick={applyFilters} className="w-32 cursor-pointer">Filter</Button>
                        </div>
                    </div>
                </div>
            </div>

            <Card>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Phone No</TableHead>
                            <TableHead>Date Created</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {
                            loading ?
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center">
                                        <div className="flex justify-center items-center py-6">
                                            <LoaderCircleIcon className="w-8 h-8 animate-spin" />
                                        </div>
                                    </TableCell>
                                </TableRow>
                                : <>
                                    {filteredData.map((user: any) => (
                                        <TableRow key={user.id}>
                                            <TableCell>{user?.firstname + " " + user?.lastname}</TableCell>
                                            <TableCell>{user.email}</TableCell>
                                            <TableCell className="capitalize">{user.phone_number}</TableCell>
                                            <TableCell>{user.created_at}</TableCell>
                                        </TableRow>
                                    ))}
                                </>
                        }
                    </TableBody>
                </Table>
            </Card>

            <PaginationCommon totalPages={totalPages} />
        </div>
    );
};

export default UserTable;

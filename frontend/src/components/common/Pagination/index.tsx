import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";

export default function PaginationCommon({ totalPages }: { totalPages: number }) {
    const [searchParams, setSearchParams] = useSearchParams();
    const currentPageFromUrl = Number(searchParams.get("current")) || 1;
    const [page, setPage] = useState(currentPageFromUrl);

    useEffect(() => {
        setSearchParams({ current: page.toString() });
    }, [page, setSearchParams]);

    return (
        <Pagination>
            <PaginationContent>
                <PaginationItem>
                    <PaginationPrevious
                        onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                        className={page === 1 ? "pointer-events-none opacity-50" : ""}
                    />
                </PaginationItem>
                <PaginationItem>
                    <span className="text-sm text-muted-foreground">
                        Page {page} of {totalPages}
                    </span>
                </PaginationItem>
                <PaginationItem>
                    <PaginationNext
                        onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
                        className={page === totalPages ? "pointer-events-none opacity-50" : ""}
                    />
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    );
}
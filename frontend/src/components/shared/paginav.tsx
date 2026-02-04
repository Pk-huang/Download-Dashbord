import {
  Pagination,
  PaginationContent,
  PaginationLink,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from '@/components/ui/pagination';


export function PageNav() {
    return (
        < Pagination className = "mt-6 justify-end" >
            <PaginationContent>
                <PaginationPrevious>
                    <PaginationLink size="icon" aria-label="Previous">
                        &lt;
                    </PaginationLink>
                </PaginationPrevious>

                <PaginationItem>
                    <PaginationLink size="icon" isActive href="#">
                        1
                    </PaginationLink>
                </PaginationItem>

                <PaginationItem>
                    <PaginationLink size="icon" href="#">
                        2
                    </PaginationLink>
                </PaginationItem>

                <PaginationItem>
                    <PaginationEllipsis />
                </PaginationItem>

                <PaginationItem>
                    <PaginationLink size="icon" href="#">
                        5
                    </PaginationLink>
                </PaginationItem>

                <PaginationNext>
                    <PaginationLink size="icon" aria-label="Next">
                        &gt;
                    </PaginationLink>
                </PaginationNext>
            </PaginationContent>
      </Pagination >

    )
}
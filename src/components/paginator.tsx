import type { PaginatedResponse } from "@/lib/http"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationLink,
  PaginationEllipsis,
  PaginationNext,
} from "./ui/pagination"
import { useSearchParams } from "react-router"

type PaginatorProps = {
  metadata: PaginatedResponse<any>
}

const Paginator = (props: PaginatorProps) => {
  const [searchParams, setSearchParams] = useSearchParams()

  const page = searchParams.get("page") || "1"
  function setPage(page: string) {
    setSearchParams({
      ...Object.fromEntries(searchParams.entries()),
      page,
    })
  }
  const activePage = +page

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            disabled={!props.metadata.hasPrevPage}
            onClick={() => setPage((activePage - 1).toString())}
          />
        </PaginationItem>

        {activePage >= 3 && (
          <PaginationItem onClick={() => setPage("1")}>
            <PaginationLink>1</PaginationLink>
          </PaginationItem>
        )}

        {activePage >= 4 && props.metadata.totalPages > 4 && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}

        {activePage === props.metadata.totalPages &&
          props.metadata.totalPages >= 4 && (
            <PaginationItem
              onClick={() => setPage((activePage - 2).toString())}
            >
              <PaginationLink>{activePage - 2}</PaginationLink>
            </PaginationItem>
          )}

        {activePage > 1 && (
          <PaginationItem onClick={() => setPage((activePage - 1).toString())}>
            <PaginationLink>{activePage - 1}</PaginationLink>
          </PaginationItem>
        )}

        <PaginationItem>
          <PaginationLink isActive>{activePage}</PaginationLink>
        </PaginationItem>

        {activePage < props.metadata.totalPages && (
          <PaginationItem onClick={() => setPage((activePage + 1).toString())}>
            <PaginationLink>{activePage + 1}</PaginationLink>
          </PaginationItem>
        )}

        {activePage === 1 && props.metadata.totalPages >= 3 && (
          <PaginationItem onClick={() => setPage((activePage + 2).toString())}>
            <PaginationLink>{activePage + 2}</PaginationLink>
          </PaginationItem>
        )}

        {props.metadata.totalPages > 4 &&
          activePage < props.metadata.totalPages - 2 && (
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          )}

        {props.metadata.totalPages >= 4 &&
          activePage < props.metadata.totalPages - 1 && (
            <PaginationItem
              onClick={() => setPage(props.metadata.totalPages.toString())}
            >
              <PaginationLink>{props.metadata.totalPages}</PaginationLink>
            </PaginationItem>
          )}

        <PaginationItem>
          <PaginationNext
            onClick={() => setPage((activePage + 1).toString())}
            disabled={!props.metadata.hasNextPage}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}

export default Paginator

import PaginationArrowButton from "@client/src/pages/scoreboard/component/PaginationArrowButton.tsx";

interface PaginationProps {
    currentPage: number
    totalPages: number
    loading: boolean
    onPageChange: (page: number) => void
}

type PaginationItem = number | '...'

function getPaginationItems(currentPage: number, totalPages: number): PaginationItem[] {
    if (totalPages <= 7) {
        return Array.from({ length: totalPages }, (_, index) => index + 1)
    }

    if (currentPage <= 3) {
        return [1, 2, 3, 4, '...', totalPages]
    }

    if (currentPage >= totalPages - 2) {
        return [1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages]
    }

    return [
        1,
        '...',
        currentPage - 1,
        currentPage,
        currentPage + 1,
        '...',
        totalPages
    ]
}

export default function Pagination({
                                       currentPage,
                                       totalPages,
                                       loading,
                                       onPageChange
                                   }: PaginationProps) {
    return (
        <div className="flex w-full items-center justify-center gap-2 font-mono text-(--text)">
            <PaginationArrowButton
                direction="left"
                disabled={currentPage <= 1 || loading}
                onClick={() => onPageChange(currentPage - 1)}
            />

            <div className="flex items-center gap-2">
                {getPaginationItems(currentPage, totalPages).map((item, index) => (
                    item === '...'
                        ? (
                            <span
                                key={`ellipsis-${index}`}
                                className="px-1 text-(--text-muted)"
                            >
                                ...
                            </span>
                        )
                        : (
                            <button
                                key={item}
                                type="button"
                                disabled={loading}
                                onClick={() => onPageChange(item)}
                                className={`font-bold transition active:text-(--accent-hover) ${
                                    item === currentPage
                                        ? 'text-(--accent)'
                                        : 'text-(--text)'
                                }`}
                            >
                                {item}
                            </button>
                        )
                ))}
            </div>

            <PaginationArrowButton
                direction="right"
                disabled={currentPage >= totalPages || loading}
                onClick={() => onPageChange(currentPage + 1)}
            />
        </div>
    )
}
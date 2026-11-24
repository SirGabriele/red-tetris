import PaginationArrowButton from "@client/src/pages/scoreboard/component/PaginationArrowButton.tsx";

interface PaginationProps {
    currentPage: number
    totalPages: number
    loading: boolean
    onPageChange: (page: number) => void
}

type PaginationItem = number | '...' | null

function getPaginationItems(currentPage: number, totalPages: number): PaginationItem[] {
    const previousCount = currentPage - 1
    const nextCount = Math.max(0, totalPages - currentPage)
    const previousPages: PaginationItem[] = previousCount > 3
        ? [1, '...', currentPage - 1]
        : Array.from({length: previousCount}, (_, index) => index + 1)
    const nextPages: PaginationItem[] = nextCount > 3
        ? [currentPage + 1, '...', totalPages]
        : Array.from({length: nextCount}, (_, index) => currentPage + index + 1)

    return [
        ...Array<PaginationItem>(3 - previousPages.length).fill(null),
        ...previousPages,
        currentPage,
        ...nextPages,
        ...Array<PaginationItem>(3 - nextPages.length).fill(null),
    ]
}

export default function Pagination({
                                       currentPage,
                                       totalPages,
                                       loading,
                                       onPageChange
                                   }: PaginationProps) {
    return (
        <div className="grid w-full grid-cols-[2rem_14rem_2rem] items-center justify-center gap-2 font-mono text-(--text)">
            <PaginationArrowButton
                direction="left"
                disabled={currentPage <= 1 || loading}
                onClick={() => onPageChange(currentPage - 1)}
            />

            <div className="grid grid-cols-7 items-center text-center">
                {getPaginationItems(currentPage, totalPages).map((item, index) => (
                    item === null
                        ? <span key={`empty-${index}`} aria-hidden="true"/>
                        : item === '...'
                        ? (
                            <span
                                key={`ellipsis-${index}`}
                                className="text-(--text-muted)"
                            >
                                ...
                            </span>
                        )
                        : (
                            <button
                                key={item === currentPage ? 'current-page' : item}
                                type="button"
                                aria-current={item === currentPage ? 'page' : undefined}
                                disabled={loading || totalPages === 0}
                                onClick={() => onPageChange(item)}
                                className={`font-bold transition active:text-(--accent-hover) ${
                                    item === currentPage
                                        ? 'text-(--accent)'
                                        : 'text-(--text)'
                                }`}
                            >
                                {item === currentPage
                                    ? <span key={item} className="motion-safe:animate-[scoreboard-fade-in_220ms_ease-out]">{item}</span>
                                    : item}
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

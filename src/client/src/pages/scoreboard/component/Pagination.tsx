import PaginationArrowButton from '@client/src/pages/scoreboard/component/PaginationArrowButton.tsx'

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
        totalPages > 0 ? currentPage : null,
        ...nextPages,
        ...Array<PaginationItem>(3 - nextPages.length).fill(null),
    ]
}

export default function Pagination({
                                       currentPage: requestedPage,
                                       totalPages: pageCount,
                                       loading,
                                       onPageChange
                                   }: PaginationProps) {
    const totalPages = Number.isSafeInteger(pageCount) ? Math.max(0, pageCount) : 0
    const currentPage = Number.isSafeInteger(requestedPage)
        ? Math.max(1, Math.min(requestedPage, totalPages))
        : 1

    return (
        <div className="grid w-full grid-cols-[2rem_14rem_2rem] items-center justify-center gap-2 font-mono text-(--text)">
            <PaginationArrowButton
                direction="left"
                disabled={currentPage <= 1 || loading}
                onClick={() => onPageChange(currentPage - 1)}
            />

            <div className="grid grid-cols-7 items-center text-center">
                {getPaginationItems(currentPage, totalPages).map((item, index) => {
                    if (item === null) {
                        return <span key={`empty-${index}`} aria-hidden="true"/>
                    }
                    if (item === '...') {
                        return <span key={`ellipsis-${index}`} aria-hidden="true" className="text-(--text-muted)">...</span>
                    }

                    const isCurrent = item === currentPage
                    const disabled = loading || isCurrent
                    return (
                        <button
                            key={item}
                            type="button"
                            aria-current={isCurrent ? 'page' : undefined}
                            aria-disabled={disabled}
                            onClick={() => {
                                if (!disabled) onPageChange(item)
                            }}
                            className={`rounded font-bold transition focus-visible:outline-2 focus-visible:outline-(--accent)
                                ${disabled ? 'cursor-default' : 'cursor-pointer hover:text-(--accent-hover) active:text-(--accent-hover)'}
                                ${isCurrent ? 'text-(--accent)' : 'text-(--text)'}`}
                        >
                            {isCurrent
                                ? <span className="inline-block motion-safe:animate-[scoreboard-fade-in_220ms_ease-out]">{item}</span>
                                : item}
                        </button>
                    )
                })}
            </div>

            <PaginationArrowButton
                direction="right"
                disabled={currentPage >= totalPages || loading}
                onClick={() => onPageChange(currentPage + 1)}
            />
        </div>
    )
}

interface PaginationArrowButtonProps {
    direction: 'left' | 'right'
    disabled: boolean
    onClick: () => void
}

export default function PaginationArrowButton({
                                                  direction,
                                                  disabled,
                                                  onClick
                                              }: PaginationArrowButtonProps) {
    return (
        <button
            type="button"
            aria-label={direction === 'left' ? 'Previous page' : 'Next page'}
            disabled={disabled}
            onClick={onClick}
            className="
                flex h-8 w-8 items-center justify-center rounded-sm border font-bold transition
                border-(--accent-border) bg-(--bg-card) text-(--accent)
                active:bg-(--accent-bg) active:text-(--accent-hover)
                disabled:cursor-not-allowed disabled:border-(--border) disabled:text-(--text-muted) disabled:opacity-30
            "
        >
            {direction === 'left' ? '◀' : '▶'}
        </button>
    )
}
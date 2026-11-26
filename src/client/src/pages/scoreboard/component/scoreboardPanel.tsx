import type {ScoreboardDto} from '@shared/http/dto/scoreboard.dto.ts'
import Pagination from '@client/src/pages/scoreboard/component/Pagination.tsx'

function formatPlayerName(name: string): string {
    return name.slice(0, 3).toUpperCase()
}

interface ScoreboardPanelProps {
    scoreboard: ScoreboardDto
    loading: boolean
    error: boolean
    onPageChange: (page: number) => void
    onRetry: () => void
}

export default function ScoreboardPanel({
                                            scoreboard,
                                            loading,
                                            error,
                                            onPageChange,
                                            onRetry
                                        }: ScoreboardPanelProps) {
    return (
        <div className="flex flex-col gap-5">
            <div
                role="region"
                aria-label="Scoreboard results"
                className="flex h-130 w-90 flex-col overflow-hidden rounded-md border border-(--accent-border)
                    bg-(--bg-card) pt-6 shadow-(--shadow-red)"
            >
                <div className="grid grid-cols-[3rem_1fr_auto] border-b border-(--border) px-6 pb-3 font-mono
                    text-xs tracking-[0.15em] text-(--text-muted)">
                    <span>#</span>
                    <span>PLAYER</span>
                    <span>SCORE</span>
                </div>

                <div
                    className={`relative flex min-h-0 flex-1 flex-col motion-safe:transition-opacity motion-safe:duration-150
                        ${loading ? 'opacity-75' : 'opacity-100'}`}
                    aria-busy={loading}
                >
                    <div
                        key={scoreboard.currentPage}
                        className="grid min-h-0 flex-1 motion-safe:animate-[scoreboard-fade-in_220ms_ease-out]"
                        style={{gridTemplateRows: `repeat(${scoreboard.pageSize}, minmax(0, 1fr))`}}
                    >
                        {scoreboard.scores.map((score, index) => (
                            <div
                                key={`${score.name}-${score.score}-${index}`}
                                className="grid grid-cols-[3rem_1fr_auto] items-center border-b
                                        border-(--border) px-6 transition hover:bg-(--accent-bg)"
                            >
                                <span className="font-mono text-sm text-(--accent-dark)">
                                    {(scoreboard.currentPage - 1) * scoreboard.pageSize + index + 1}.
                                </span>

                                <span className="whitespace-pre font-mono font-bold tracking-[0.2em] text-(--text-h)">
                                    {formatPlayerName(score.name)}
                                </span>

                                <span className="font-mono font-bold tabular-nums text-(--accent)">
                                    {score.score.toLocaleString('fr-FR')}
                                </span>
                            </div>
                        ))}
                    </div>
                    {error && (
                        <div className="absolute inset-0 grid place-items-center px-6">
                            <div className="rounded-md bg-(--bg-card) px-4 py-3 text-center font-mono text-(--accent)">
                                <p role="alert">Unable to retrieve scores.</p>
                                <button type="button" className="mt-2 cursor-pointer underline" onClick={onRetry}>
                                    Retry
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <Pagination
                currentPage={scoreboard.currentPage}
                totalPages={scoreboard.totalPages}
                loading={loading}
                onPageChange={onPageChange}
            />
        </div>
    )
}

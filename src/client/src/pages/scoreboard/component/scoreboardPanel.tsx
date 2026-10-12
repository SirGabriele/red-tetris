import type {ScoreboardDto} from '@shared/http/dto/scoreboard.dto.ts'
import {formatPlayerName} from '@client/src/pages/scoreboard/scoreboardNameFormatter.ts'
import Pagination from '@client/src/pages/scoreboard/component/Pagination.tsx'

interface ScoreboardPanelProps {
    title: string
    scoreboard: ScoreboardDto
    loading: boolean
    onPageChange: (page: number) => void
}

export default function ScoreboardPanel({
                                            title,
                                            scoreboard,
                                            loading,
                                            onPageChange
                                        }: ScoreboardPanelProps) {
    return (
        <div className="flex flex-col gap-5">
            <div className="flex w-full justify-center">
                <p className="font-mono tracking-[0.25em] text-(--text)">
                    {title}
                </p>
            </div>

            <div className="flex h-130 w-90 flex-col overflow-hidden rounded-md border border-(--accent-border)
                bg-(--bg-card) pt-6 shadow-(--shadow-red)">
                <div className="grid grid-cols-[3rem_1fr_auto] border-b border-(--border) px-6 pb-3 font-mono
                    text-xs tracking-[0.15em] text-(--text-muted)">
                    <span>#</span>
                    <span>PLAYER</span>
                    <span>SCORE</span>
                </div>

                <div className="flex flex-1 flex-col">
                    {loading
                        ? Array.from({ length: scoreboard.pageSize }).map((_, index) => (
                            <div
                                key={index}
                                className="grid flex-1 grid-cols-[3rem_1fr_auto] items-center border-b
                                    border-(--border) px-6"
                            >
                                <span className="h-3 w-4 animate-pulse rounded bg-(--border-light)"/>
                                <span className="h-4 w-14 animate-pulse rounded bg-(--border-light)"/>
                                <span className="h-4 w-12 animate-pulse rounded bg-(--accent-bg)"/>
                            </div>
                        ))
                        : scoreboard.scores.map((score, index) => (
                            <div
                                key={`${score.name}-${score.score}-${index}`}
                                className="grid flex-1 grid-cols-[3rem_1fr_auto] items-center border-b
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
                        ))
                    }
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
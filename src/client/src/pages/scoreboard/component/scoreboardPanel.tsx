import {useEffect, useState} from 'react'
import type {ScoreboardDto} from '@shared/http/dto/scoreboard.dto.ts'
import {formatPlayerName} from '@client/src/pages/scoreboard/scoreboardNameFormatter.ts'
import Pagination from '@client/src/pages/scoreboard/component/Pagination.tsx'

const SKELETON_DELAY_MS = 180

interface ScoreboardPanelProps {
    scoreboard: ScoreboardDto
    initialLoading: boolean
    loading: boolean
    onPageChange: (page: number) => void
}

export default function ScoreboardPanel({
                                            scoreboard,
                                            initialLoading,
                                            loading,
                                            onPageChange
                                        }: ScoreboardPanelProps) {
    const [showDelayedSkeleton, setShowDelayedSkeleton] = useState(false)

    useEffect(() => {
        if (!loading || initialLoading) {
            setShowDelayedSkeleton(false)
            return
        }

        const timer = window.setTimeout(() => setShowDelayedSkeleton(true), SKELETON_DELAY_MS)
        return () => window.clearTimeout(timer)
    }, [initialLoading, loading])

    const showSkeleton = initialLoading || (loading && showDelayedSkeleton)

    return (
        <div className="flex flex-col gap-5">
            <div className="flex h-130 w-90 flex-col overflow-hidden rounded-md border border-(--accent-border)
                bg-(--bg-card) pt-6 shadow-(--shadow-red)">
                <div className="grid grid-cols-[3rem_1fr_auto] border-b border-(--border) px-6 pb-3 font-mono
                    text-xs tracking-[0.15em] text-(--text-muted)">
                    <span>#</span>
                    <span>PLAYER</span>
                    <span>SCORE</span>
                </div>

                <div
                    className={`flex min-h-0 flex-1 flex-col motion-safe:transition-opacity motion-safe:duration-150
                        ${loading && !showSkeleton ? 'opacity-75' : 'opacity-100'}`}
                    aria-busy={loading}
                >
                    <div
                        key={showSkeleton ? 'skeleton' : scoreboard.currentPage}
                        className={`grid min-h-0 flex-1
                            ${initialLoading ? '' : 'motion-safe:animate-[scoreboard-fade-in_220ms_ease-out]'}`}
                        style={{gridTemplateRows: `repeat(${scoreboard.pageSize}, minmax(0, 1fr))`}}
                        aria-hidden={showSkeleton || undefined}
                    >
                        {showSkeleton
                            ? Array.from({ length: scoreboard.pageSize }).map((_, index) => (
                                <div
                                    key={index}
                                    className="grid grid-cols-[3rem_1fr_auto] items-center border-b
                                        border-(--border) px-6"
                                >
                                    <span className="h-3 w-4 rounded bg-(--border-light) motion-safe:animate-pulse"/>
                                    <span className="h-4 w-14 rounded bg-(--border-light) motion-safe:animate-pulse"/>
                                    <span className="h-4 w-12 rounded bg-(--accent-bg) motion-safe:animate-pulse"/>
                                </div>
                            ))
                            : scoreboard.scores.map((score, index) => (
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
                            ))
                        }
                    </div>
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

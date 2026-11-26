import {useEffect, useState} from 'react'

import {SCOREBOARD_PAGE_SIZE, type ScoreboardDto} from '@shared/http/dto/scoreboard.dto.ts'
import {getScoreboard} from '@client/src/pages/scoreboard/api/scoreResource.ts'
import ScoreboardPanel from '@client/src/pages/scoreboard/component/scoreboardPanel.tsx'

const EMPTY_SCOREBOARD: ScoreboardDto = {
    scores: [],
    currentPage: 1,
    totalPages: 0,
    pageSize: SCOREBOARD_PAGE_SIZE
}

export default function ScoreboardPage() {
    const [scoreboard, setScoreboard] = useState<ScoreboardDto | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)
    const [request, setRequest] = useState({page: 1})

    useEffect(() => {
        let active = true
        void getScoreboard(request.page).then(result => {
            if (!active) return

            if (result === null) {
                setError(true)
            } else {
                setScoreboard(result)
            }
            setLoading(false)
        })
        return () => {
            active = false
        }
    }, [request])

    const loadScoreboard = (page: number) => {
        setLoading(true)
        setError(false)
        setRequest({page})
    }

    return (
        <section className="mx-auto flex w-full max-w-7xl flex-1 flex-col items-center justify-evenly gap-8 px-4 py-8 lg:flex-row">
            <div className="flex max-w-xl flex-col items-start">
                <p className="mb-6 font-mono tracking-[0.25em] text-(--text)">
                    CHECKOUT OUT THE
                </p>

                <h1 className="text-7xl font-black">
                    <span className="text-(--accent)">SCORE</span>
                    <span className="text-(--text-h)">BOARD</span>
                </h1>
            </div>

            <div className="flex flex-row items-center gap-20">
                <ScoreboardPanel
                    scoreboard={scoreboard ?? EMPTY_SCOREBOARD}
                    loading={loading}
                    error={error}
                    onPageChange={loadScoreboard}
                    onRetry={() => loadScoreboard(request.page)}
                />
            </div>
        </section>
    )
}

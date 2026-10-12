import {useEffect, useState} from 'react'

import {SCOREBOARD_PAGE_SIZE, type ScoreboardDto} from '@shared/http/dto/scoreboard.dto.ts'
import * as scoreResource from '@client/src/pages/scoreboard/scoreResource.ts'
import ScoreboardPanel from '@client/src/pages/scoreboard/component/scoreboardPanel.tsx'

const EMPTY_SCOREBOARD: ScoreboardDto = {
    scores: [],
    currentPage: 1,
    totalPages: 1,
    pageSize: SCOREBOARD_PAGE_SIZE
}

export default function ScoreboardPage() {
    const [scoreboard, setScoreboard] = useState<ScoreboardDto>(EMPTY_SCOREBOARD)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)

    const loadScoreboard = async (page: number) => {
        setLoading(true)
        setError(false)

        try {
            setScoreboard(await scoreResource.getScoreboard(page))
        } catch (error) {
            console.error(error)
            setError(true)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        void loadScoreboard(1)
    }, [])

    const handlePageChange = (page: number) => {
        void loadScoreboard(page)
    }

    return (
        <section className="mx-auto flex w-full max-w-7xl flex-1 items-center justify-between px-8">
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
                {error
                    ? (
                        <p className="font-mono text-(--accent)">
                            Unable to retrieve scores.
                        </p>
                    )
                    : (
                        <>
                            <ScoreboardPanel
                                title="TODAY'S GREATEST"
                                scoreboard={scoreboard}
                                loading={true}
                                onPageChange={handlePageChange}
                            />

                            <ScoreboardPanel
                                title="ALL TIMES GREATEST"
                                scoreboard={scoreboard}
                                loading={loading}
                                onPageChange={handlePageChange}
                            />
                        </>
                    )
                }
            </div>
        </section>
    )
}
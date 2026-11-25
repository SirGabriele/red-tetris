import {act, cleanup, fireEvent, render, screen, waitForElementToBeRemoved, within} from '@testing-library/react'
import {afterEach, describe, expect, it, vi} from 'vitest'

import ScoreboardPage from '@client/src/pages/scoreboard/ScoreboardPage.tsx'
import {SCOREBOARD_PAGE_SIZE} from '@shared/http/dto/scoreboard.dto.ts'
import {BACK_URL} from '@shared/projectConfig.ts'

afterEach(() => {
    cleanup()
    vi.unstubAllGlobals()
})

describe('ScoreboardPage', () => {
    it('should load and paginate the scores', async () => {
        const firstPage = {
            scores: [{name: 'Jane', score: 123}],
            currentPage: 1,
            totalPages: 8,
            pageSize: SCOREBOARD_PAGE_SIZE,
        }
        let resolveSecondPage!: (response: Response) => void
        const secondPage = new Promise<Response>(resolve => {
            resolveSecondPage = resolve
        })
        const fetchScores = vi.fn()
            .mockResolvedValueOnce(Response.json(firstPage))
            .mockReturnValueOnce(secondPage)
        vi.stubGlobal('fetch', fetchScores)

        render(<ScoreboardPage/>)

        expect(await screen.findByText('123')).toBeInTheDocument()
        expect(fetchScores).toHaveBeenNthCalledWith(1, `${BACK_URL}/scoreboard/1`)

        fireEvent.click(screen.getByRole('button', {name: 'Next page'}))

        expect(screen.getByText('123')).toBeInTheDocument()
        expect(screen.getByRole('button', {name: '1', current: 'page'})).toBeInTheDocument()
        expect(screen.getByRole('button', {name: 'Next page'})).toBeDisabled()

        await waitForElementToBeRemoved(screen.getByText('123'))
        expect(screen.getByRole('button', {name: '1', current: 'page'})).toBeInTheDocument()

        await act(async () => {
            resolveSecondPage(Response.json({
                ...firstPage,
                scores: [{name: 'Sam', score: 98}],
                currentPage: 2,
            }))
        })

        expect(await screen.findByText('98')).toBeInTheDocument()
        expect(screen.queryByText('123')).not.toBeInTheDocument()
        expect(screen.getByRole('button', {name: '2', current: 'page'})).toBeInTheDocument()
        expect(fetchScores).toHaveBeenNthCalledWith(2, `${BACK_URL}/scoreboard/2`)
    })

    it('should keep the scoreboard visible on a failed request and allow a retry', async () => {
        const fetchScores = vi.fn()
            .mockResolvedValueOnce(new Response(null, {status: 503}))
            .mockResolvedValueOnce(Response.json({
                scores: [{name: 'Jane', score: 123}],
                currentPage: 1,
                totalPages: 1,
                pageSize: SCOREBOARD_PAGE_SIZE,
            }))
        vi.stubGlobal('fetch', fetchScores)

        render(<ScoreboardPage/>)

        const results = screen.getByRole('region', {name: 'Scoreboard results'})
        const table = within(results)
        expect(table.getByText('PLAYER')).toBeInTheDocument()
        expect(await table.findByRole('alert')).toHaveTextContent('Unable to retrieve scores.')
        expect(table.getByText('SCORE')).toBeInTheDocument()

        fireEvent.click(screen.getByRole('button', {name: '1', current: 'page'}))

        expect(await table.findByText('123')).toBeInTheDocument()
        expect(table.queryByRole('alert')).not.toBeInTheDocument()
        expect(fetchScores).toHaveBeenCalledTimes(2)
    })
})

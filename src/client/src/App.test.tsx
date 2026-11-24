import {cleanup, fireEvent, render, screen, within} from '@testing-library/react'
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest'

import App from '@client/src/App.tsx'
import {SCOREBOARD_PAGE_SIZE} from '@shared/http/dto/scoreboard.dto.ts'
import {BACK_URL} from '@shared/projectConfig.ts'
import {ROUTES} from "@shared/utils/routesUtils.ts";

beforeEach(() => {
    cleanup()
    window.history.pushState({}, '', ROUTES.HOME)
})

afterEach(() => {
    vi.unstubAllGlobals()
})

describe('App', () => {
    it('should display home page on root route', () => {
        render(<App/>)

        expect(within(screen.getByRole('main')).getByRole('heading', {name: 'RED-TETRIS'})).toBeInTheDocument()
    })

    it('should display game page on /game', () => {
        window.history.pushState({}, '', ROUTES.GAME)

        render(<App/>)

        expect(within(screen.getByRole('main')).getByRole('heading', {name: /^join\s+room$/i})).toBeInTheDocument()
    })

    it('should navigate to the game when Play now is clicked', () => {
        render(<App/>)

        const main = within(screen.getByRole('main'))
        fireEvent.click(main.getByRole('button', {name: /^play\s+now$/i}))

        expect(window.location.pathname).toBe(ROUTES.GAME)
        expect(main.getByRole('heading', {name: /^join\s+room$/i})).toBeInTheDocument()
    })

    it('should load and paginate the scoreboard on /scoreboard', async () => {
        const firstPage = {
            scores: [{name: 'Jane', score: 123}],
            currentPage: 1,
            totalPages: 8,
            pageSize: SCOREBOARD_PAGE_SIZE,
        }
        const fetchScores = vi.fn()
            .mockResolvedValueOnce(Response.json(firstPage))
            .mockResolvedValueOnce(Response.json({
                ...firstPage,
                scores: [{name: 'Sam', score: 98}],
                currentPage: 2,
            }))
        vi.stubGlobal('fetch', fetchScores)
        window.history.pushState({}, '', ROUTES.SCOREBOARD)

        render(<App/>)

        const main = within(screen.getByRole('main'))
        expect(main.getByRole('heading', {name: /^score\s*board$/i})).toBeInTheDocument()
        expect(await main.findByText('123')).toBeInTheDocument()
        expect(fetchScores).toHaveBeenNthCalledWith(1, `${BACK_URL}/scoreboard/1`)

        fireEvent.click(main.getByRole('button', {name: 'Next page'}))

        expect(await main.findByText('98')).toBeInTheDocument()
        expect(fetchScores).toHaveBeenNthCalledWith(2, `${BACK_URL}/scoreboard/2`)
    })

    it('should redirect unknown route to home', async () => {
        window.history.pushState({}, '', '/unknown')

        render(<App/>)

        expect(await within(screen.getByRole('main')).findByRole('heading', {name: 'RED-TETRIS'})).toBeInTheDocument()
        expect(window.location.pathname).toBe(ROUTES.HOME)
    })
})

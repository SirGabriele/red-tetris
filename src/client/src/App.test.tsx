import {act, cleanup, fireEvent, render, screen, within} from '@testing-library/react'
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest'

import App from '@client/src/App.tsx'
import {SCOREBOARD_PAGE_SIZE} from '@shared/http/dto/scoreboard.dto.ts'
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

    it('should display the scoreboard on /scoreboard', async () => {
        vi.stubGlobal('fetch', vi.fn().mockResolvedValue(Response.json({
            scores: [],
            currentPage: 1,
            totalPages: 0,
            pageSize: SCOREBOARD_PAGE_SIZE,
        })))
        window.history.pushState({}, '', ROUTES.SCOREBOARD)

        await act(async () => {
            render(<App/>)
        })

        expect(within(screen.getByRole('main')).getByRole('heading', {name: /^score\s*board$/i}))
            .toBeInTheDocument()
    })

    it('should redirect unknown route to home', async () => {
        window.history.pushState({}, '', '/unknown')

        render(<App/>)

        expect(await within(screen.getByRole('main')).findByRole('heading', {name: 'RED-TETRIS'})).toBeInTheDocument()
        expect(window.location.pathname).toBe(ROUTES.HOME)
    })
})

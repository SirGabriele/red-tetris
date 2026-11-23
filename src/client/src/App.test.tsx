import {cleanup, render, screen, within} from '@testing-library/react'
import {beforeEach, describe, expect, it} from 'vitest'

import App from '@client/src/App.tsx'
import {ROUTES} from "@shared/utils/routesUtils.ts";

beforeEach(() => {
    cleanup()
    window.history.pushState({}, '', ROUTES.HOME)
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

    it('should display scoreboard page on /scoreboard', () => {
        window.history.pushState({}, '', ROUTES.SCOREBOARD)

        render(<App/>)

        expect(within(screen.getByRole('main')).getByText('Scoreboard Page')).toBeInTheDocument()
    })

    it('should redirect unknown route to home', async () => {
        window.history.pushState({}, '', '/unknown')

        render(<App/>)

        expect(await within(screen.getByRole('main')).findByRole('heading', {name: 'RED-TETRIS'})).toBeInTheDocument()
        expect(window.location.pathname).toBe(ROUTES.HOME)
    })
})

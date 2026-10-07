import {cleanup, render, screen, waitFor} from '@testing-library/react'
import {beforeEach, describe, expect, it, vi} from 'vitest'
import {Outlet} from 'react-router-dom'

import App from '@client/src/App.tsx'
import {ROUTES} from "@shared/utils/routesUtils.ts";

vi.mock('@client/src/components/layout/Layout.tsx', () => ({
    default: () => (
        <>
            <div>Layout</div>
            <Outlet/>
        </>
    )
}))

vi.mock('@client/src/pages/HomePage.tsx', () => ({
    default: () => <div>Home Page</div>
}))

vi.mock('@client/src/pages/GamePage.tsx', () => ({
    default: () => <div>Game Page</div>
}))

vi.mock('@client/src/pages/ScoreboardPage.tsx', () => ({
    default: () => <div>Scoreboard Page</div>
}))

beforeEach(() => {
    cleanup()
    window.history.pushState({}, '', ROUTES.HOME)
})

describe('App', () => {
    it('should display home page on root route', () => {
        render(<App/>)

        expect(screen.getByText('Layout')).toBeInTheDocument()
        expect(screen.getByText('Home Page')).toBeInTheDocument()
    })

    it('should display game page on /game', () => {
        window.history.pushState({}, '', ROUTES.GAME)

        render(<App/>)

        expect(screen.getByText('Layout')).toBeInTheDocument()
        expect(screen.getByText('Game Page')).toBeInTheDocument()
    })

    it('should display game page on /scoreboard', () => {
        window.history.pushState({}, '', ROUTES.SCOREBOARD)

        render(<App/>)

        expect(screen.getByText('Layout')).toBeInTheDocument()
        expect(screen.getByText('Scoreboard Page')).toBeInTheDocument()
    })

    it('should redirect unknown route to home', async () => {
        window.history.pushState({}, '', '/unknown')

        render(<App/>)

        await waitFor(() => {
            expect(screen.getByText('Home Page')).toBeInTheDocument()
        })
    })
})
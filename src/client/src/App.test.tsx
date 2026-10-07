import {cleanup, render, screen, waitFor} from '@testing-library/react'
import {beforeEach, describe, expect, it, vi} from 'vitest'
import {Outlet} from 'react-router-dom'

import App from '@client/src/App.tsx'

vi.mock('@client/src/components/Layout.tsx', () => ({
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

vi.mock('@client/src/components/Test1.tsx', () => ({
    default: () => <div>Test 1</div>
}))

vi.mock('@client/src/components/Test2.tsx', () => ({
    default: () => <div>Test 2</div>
}))

beforeEach(() => {
    cleanup()
    window.history.pushState({}, '', '/')
})

describe('App', () => {
    it('should display home page on root route', () => {
        render(<App/>)

        expect(screen.getByText('Layout')).toBeInTheDocument()
        expect(screen.getByText('Home Page')).toBeInTheDocument()
    })

    it('should display game page on /game', () => {
        window.history.pushState({}, '', '/game')

        render(<App/>)

        expect(screen.getByText('Layout')).toBeInTheDocument()
        expect(screen.getByText('Game Page')).toBeInTheDocument()
    })

    it.each([
        ['/test1', 'Test 1'],
        ['/test2', 'Test 2'],
        ['/scoreboard', 'Test 2']
    ])('should display correct page on %s', (route, content) => {
        window.history.pushState({}, '', route)

        render(<App/>)

        expect(screen.getByText(content)).toBeInTheDocument()
    })

    it('should redirect unknown route to home', async () => {
        window.history.pushState({}, '', '/unknown')

        render(<App/>)

        await waitFor(() => {
            expect(screen.getByText('Home Page')).toBeInTheDocument()
        })
    })
})
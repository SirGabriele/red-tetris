import {cleanup, fireEvent, render, screen} from '@testing-library/react'
import {afterEach, describe, expect, it, vi} from 'vitest'

import Pagination from '@client/src/pages/scoreboard/component/Pagination.tsx'

afterEach(cleanup)

describe('Pagination', () => {
    it('should display the current page and its neighbors in the middle of the range', () => {
        const onPageChange = vi.fn()
        render(<Pagination currentPage={5} totalPages={10} loading={false} onPageChange={onPageChange}/>)

        expect(screen.getAllByRole('button', {name: /^\d+$/}).map(button => button.textContent))
            .toEqual(['1', '4', '5', '6', '10'])
        expect(screen.getAllByText('...')).toHaveLength(2)

        fireEvent.click(screen.getByRole('button', {name: 'Previous page'}))
        fireEvent.click(screen.getByRole('button', {name: '10'}))

        expect(onPageChange.mock.calls).toEqual([[4], [10]])
    })

    it('should keep the arrows and current page in the same slots at the start and end', () => {
        const onPageChange = vi.fn()
        const {rerender} = render(
            <Pagination currentPage={1} totalPages={11} loading={false} onPageChange={onPageChange}/>
        )

        const previous = screen.getByRole('button', {name: 'Previous page'})
        const next = screen.getByRole('button', {name: 'Next page'})
        const first = screen.getByRole('button', {name: '1', current: 'page'})
        const pageSlots = first.parentElement!

        expect(pageSlots.children).toHaveLength(7)
        expect(pageSlots.children[3]).toBe(first)
        expect(pageSlots.previousElementSibling).toBe(previous)
        expect(pageSlots.nextElementSibling).toBe(next)
        expect(previous).toBeDisabled()
        expect(next).toBeEnabled()
        expect(screen.getAllByRole('button', {name: /^\d+$/}).map(button => button.textContent))
            .toEqual(['1', '2', '11'])

        rerender(<Pagination currentPage={11} totalPages={11} loading={false} onPageChange={onPageChange}/>)

        expect(pageSlots.children).toHaveLength(7)
        expect(pageSlots.children[3]).toBe(screen.getByRole('button', {name: '11', current: 'page'}))
        expect(pageSlots.previousElementSibling).toBe(previous)
        expect(pageSlots.nextElementSibling).toBe(next)
        expect(previous).toBeEnabled()
        expect(next).toBeDisabled()
        expect(screen.getAllByRole('button', {name: /^\d+$/}).map(button => button.textContent))
            .toEqual(['1', '10', '11'])
        expect(screen.getAllByText('...')).toHaveLength(1)
    })

    it.each([-3, 0, 1.5, NaN, Infinity])('should fall back to page one for invalid current page %s', currentPage => {
        const onPageChange = vi.fn()
        render(<Pagination currentPage={currentPage} totalPages={3} loading={false} onPageChange={onPageChange}/>)

        expect(screen.getByRole('button', {name: '1', current: 'page'})).toBeInTheDocument()
        expect(screen.getAllByRole('button', {name: /^\d+$/}).map(button => button.textContent))
            .toEqual(['1', '2', '3'])
        fireEvent.click(screen.getByRole('button', {name: 'Previous page'}))
        fireEvent.click(screen.getByRole('button', {name: 'Next page'}))

        expect(onPageChange.mock.calls).toEqual([[2]])
    })

    it('should clamp a current page past the end to the last page', () => {
        const onPageChange = vi.fn()
        render(<Pagination currentPage={99} totalPages={3} loading={false} onPageChange={onPageChange}/>)

        expect(screen.getByRole('button', {name: '3', current: 'page'})).toBeInTheDocument()
        fireEvent.click(screen.getByRole('button', {name: 'Next page'}))
        fireEvent.click(screen.getByRole('button', {name: 'Previous page'}))

        expect(onPageChange.mock.calls).toEqual([[2]])
    })

    it.each([0, -3, 1.5, NaN, Infinity])('should disable pagination for empty or invalid page count %s', totalPages => {
        const onPageChange = vi.fn()
        render(<Pagination currentPage={1} totalPages={totalPages} loading={false} onPageChange={onPageChange}/>)

        const page = screen.getByRole('button', {name: '1', current: 'page'})
        expect(page.parentElement?.children[3]).toBe(page)
        expect(page).toBeDisabled()
        expect(screen.getByRole('button', {name: 'Previous page'})).toBeDisabled()
        expect(screen.getByRole('button', {name: 'Next page'})).toBeDisabled()
    })

    it('should disable every navigation button while loading', () => {
        const onPageChange = vi.fn()
        render(<Pagination currentPage={2} totalPages={3} loading={true} onPageChange={onPageChange}/>)

        for (const button of screen.getAllByRole('button')) {
            expect(button).toBeDisabled()
            fireEvent.click(button)
        }
        expect(onPageChange).not.toHaveBeenCalled()
    })
})

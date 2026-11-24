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

    it('should display the final pages and disable the next arrow on the last page', () => {
        render(<Pagination currentPage={10} totalPages={10} loading={false} onPageChange={vi.fn()}/>)

        expect(screen.getAllByRole('button', {name: /^\d+$/}).map(button => button.textContent))
            .toEqual(['1', '7', '8', '9', '10'])
        expect(screen.getAllByText('...')).toHaveLength(1)
        expect(screen.getByRole('button', {name: 'Next page'})).toBeDisabled()
    })
})

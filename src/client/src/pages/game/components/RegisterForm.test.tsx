import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import {cleanup, render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RegisterForm from './RegisterForm';

describe('RegisterForm', () => {
    const mockOnSubmit = vi.fn().mockResolvedValue(undefined);

    beforeEach(() => {
        render(<RegisterForm onSubmit={mockOnSubmit}/>);
    });

    afterEach(() => {
        cleanup();
    });

    it('should call onSubmit when the form button is clicked with valid values', async () => {
        const user = userEvent.setup();

        await user.type(screen.getByTestId('player-name-form-field'), 'Jane');
        await user.type(screen.getByTestId('room-id-form-field'), '123');
        await user.click(screen.getByTestId('submit-button-form-field'));

        expect(mockOnSubmit).toHaveBeenCalledWith('Jane', '123');
    });

    it('should not call onSubmit when the form button is clicked with invalid values', async () => {
        const user = userEvent.setup();

        await user.type(screen.getByTestId('player-name-form-field'), 'Jane');
        await user.type(screen.getByTestId('room-id-form-field'), '123456');
        await user.click(screen.getByTestId('submit-button-form-field'));

        expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    it('should display error when player name is invalid', async () => {
        const user = userEvent.setup();
        const nameTooLong = '0'.repeat(51);

        await user.type(screen.getByTestId('player-name-form-field'), nameTooLong);
        await user.tab();

        expect(
            screen.getByText('must only contain letters and numbers, up to 50 characters')
        ).toBeInTheDocument();
    });

    it('should display error when room ID is invalid', async () => {
        const user = userEvent.setup();

        await user.type(screen.getByTestId('room-id-form-field'), '12345');
        await user.tab();

        expect(
            screen.getByText('must be between 1 and 9999')
        ).toBeInTheDocument();
    });
});
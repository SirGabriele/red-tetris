import type {Dispatch, SetStateAction} from "react";

type FormFieldProps = {
    setPlayerName: Dispatch<SetStateAction<string>>;
    validateForm: () => boolean;
};

export default function PlayerNameFormField({ setPlayerName, validateForm }: FormFieldProps) {
    return (
        <div>
            <label htmlFor="name" className="mb-2 block text-sm text-(--text)">
                Your&nbsp;name
            </label>

            <input
                id="name"
                name="name"
                type="text"
                placeholder="Jane, John..."
                required
                className="w-full
                    border border-(--accent)/40
                    focus:border-(--accent) focus:shadow-(--shadow-red-soft)
                    bg-(--bg-secondary)
                    px-4 py-3
                    placeholder:text-(--text-muted)
                    outline-none
                    transition
                "
                data-testid="player-name-form-field"
                onChange={e => setPlayerName(e.target.value)}
                onBlur={validateForm}
            />
        </div>
    );
}
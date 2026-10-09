import {useFormStatus} from "react-dom";

export default function FormButton() {
    const data = useFormStatus();
    const isLoading = data.pending;

    return (
        <button
            type="submit"
            disabled={isLoading}
            className="mt-4
                w-full
                cursor-pointer
                bg-(--accent)
                px-6
                py-3
                font-bold
                text-white
                transition
                hover:bg-(--accent-hover)
                hover:shadow-[0_0_25px_var(--accent-glow)]"
            data-testid="submit-button-form-field"
        >
            {isLoading ? 'Loading...' : 'Play'}
        </button>
    )
}
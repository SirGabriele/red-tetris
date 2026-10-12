import {useFormStatus} from "react-dom";
import {Spinner} from "@client/src/components/Spinner.tsx";

export default function FormButton() {
    const data = useFormStatus();
    const isLoading = data.pending;

    return (
        <button
            type="submit"
            disabled={isLoading}
            className="flex items-center justify-center gap-2
                w-full
                bg-(--accent)
                mt-4 px-6 py-3
                font-bold text-white
                transition
                hover:bg-(--accent-hover) hover:shadow-[0_0_25px_var(--accent-glow)]
                cursor-pointer disabled:cursor-not-allowed
                disabled:opacity-70"
            data-testid="submit-button-form-field"
        >
            {isLoading && (<Spinner/>)}<span>{isLoading ? 'Loading...' : 'Play'}</span>
        </button>
    )
}
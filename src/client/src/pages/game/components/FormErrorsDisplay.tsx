import type {FormErrors} from "@client/src/pages/game/components/RegisterForm.tsx";

type FormErrorsProps = {
    errors: FormErrors
}

export default function FormErrorsDisplay({ errors }: FormErrorsProps) {
    return (
        <div>
            {
                errors.length > 0 && (
                    <div className="mt-4 border border-(--accent)/30 bg-(--accent)/5 p-4">
                        <div className="mb-2 flex items-center gap-2">
                            <span className="h-2 w-2 bg-(--accent) shadow-[0_0_8px_rgba(255,45,45,0.7)]"/>
                            <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-(--accent-hover)">
                                Validation&nbsp;errors
                            </p>
                        </div>

                        <ul className="space-y-2">
                            {errors.map(e => (
                                <li
                                    key={e.key}
                                    className="border-l-2 border-(--accent-hover)/40 pl-3 text-sm text-(--text)"
                                >
                    <span className="font-semibold text-(--accent-light)">
                        {e.key.length > 20 ? `${e.key.slice(0, 20)}...` : e.key}
                    </span>
                                    <span className="mx-2 text-(--text-muted)">→</span>
                                    <span>{e.message}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )
            }
        </div>
    )
}
import {useNavigate} from 'react-router-dom'

export default function HomePage() {
    const navigate = useNavigate()

    return (
        <section className="mx-auto flex w-full max-w-7xl flex-1 items-center justify-between px-8">
            <div className="flex max-w-xl flex-col items-start">
                <p className="mb-6 font-mono tracking-[0.25em] text-(--text)">
                    PIMPLE.&nbsp;RIMLESS.&nbsp;TED.
                </p>

                <h1>
                    <span className="text-(--accent)">RED-</span>TETRIS
                </h1>

                <button onClick={() => navigate('/game')}
                        className=" mt-10 cursor-pointer rounded-md bg-(--accent) px-10 py-4 text-lg font-bold
                        text-white transition hover:bg-(--accent-hover) hover:shadow-(--shadow-red)">
                    Play&nbsp;now
                </button>
            </div>

            <div className=" flex h-130 w-90 items-center justify-center rounded-md border
                 border-(--accent)/40 bg-black/30 shadow-[0_0_50px_rgba(255,45,45,0.12)]">
                <span className="font-mono text-(--text-muted)">
                    Tetris&nbsp;preview
                </span>
            </div>
        </section>
    )
}
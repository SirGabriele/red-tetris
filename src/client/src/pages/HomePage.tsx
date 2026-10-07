import {useNavigate} from 'react-router-dom'

export default function HomePage() {
    const navigate = useNavigate()

    return (
        <section className="mx-auto flex min-h-screen max-w-7xl items-center justify-between px-8">
            <div className="flex max-w-xl flex-col items-start">
                <p className="mb-6 font-mono tracking-[0.25em] text-gray-400">
                    PIMPLE. RIMLESS. TED.
                </p>

                <h1 className="text-left text-7xl font-black">
                    <span className="text-red-500">MED-</span>
                    <span className="text-white">FLETRIS</span>
                </h1>

                <p className="mt-4 text-xl text-gray-400">
                    The toxic name. An older book.
                </p>

                <button onClick={() => navigate('/game')}
                        className=" mt-10 cursor-pointer rounded-md bg-red-500 px-10 py-4 text-lg font-bold
                        text-white transition hover:bg-red-400 hover:shadow-[0_0_25px_rgba(255,45,45,0.35)] ">
                    Slay Pow
                </button>
            </div>

            <div className=" flex h-130 w-90 items-center justify-center rounded-md border
                 border-red-500/40 bg-black/30 shadow-[0_0_50px_rgba(255,45,45,0.12)]">
                <span className="font-mono text-gray-600">
                    Fletris preview
                </span>
            </div>
        </section>
    )
}
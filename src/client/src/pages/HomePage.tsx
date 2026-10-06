import {useNavigate} from 'react-router-dom'

export default function HomePage() {
    const navigate = useNavigate()

    return (
        <main className="bg-teal-500 flex-1">
            <section className="mx-auto flex min-h-[75vh] max-w-7xl items-center justify-between px-8">
                <div className="flex max-w-xl flex-col items-start">
                    <p className="mb-6 font-mono tracking-[0.25em] text-gray-400">
                        SIMPLE. TIMELESS. RED.
                    </p>

                    <h1 className="text-left text-7xl font-black">
                        <span className="text-red-500">RED-</span>
                        <span className="text-white">TETRIS</span>
                    </h1>

                    <p className="mt-4 text-xl text-gray-400">
                        The classic game. A bolder look.
                    </p>

                    <button onClick={() => navigate('/game')}
                            className="
                            mt-10
                            cursor-pointer
                            rounded-md
                            bg-red-500
                            px-10
                            py-4
                            text-lg
                            font-bold
                            text-white
                            transition
                            hover:bg-red-400
                            hover:shadow-[0_0_25px_rgba(255,45,45,0.35)]
                        ">
                        Play Now
                    </button>
                </div>

                <div className="
                        flex
                        h-[520px]
                        w-[360px]
                        items-center
                        justify-center
                        rounded-md
                        border
                        border-red-500/40
                        bg-black/30
                        shadow-[0_0_50px_rgba(255,45,45,0.12)]
                    ">
                    <span className="font-mono text-gray-600">
                        Tetris preview
                    </span>
                </div>
            </section>
        </main>
    )
}
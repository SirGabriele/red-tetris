import {NavLink} from 'react-router-dom'

export default function Header() {
    const navClass = ({ isActive }: { isActive: boolean }) =>
        `relative px-4 py-5 text-sm transition ${isActive ? 'text-red-500' : 'text-gray-400 hover:text-white'}`

    return (
        <header className="border-b border-white/10">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-8">
                <NavLink to="/" className="flex items-center gap-3 py-4">
                    <div className="grid grid-cols-3 gap-0.5">
                        <span className="h-3 w-3 bg-red-500"/>
                        <span className="h-3 w-3 bg-red-500"/>
                        <span className="h-3 w-3 bg-red-500"/>
                        <span className="h-3 w-3"/>
                        <span className="h-3 w-3 bg-red-500"/>
                        <span className="h-3 w-3"/>
                    </div>

                    <span className="text-xl font-black tracking-[0.15em]">
						<span className="text-red-500">RED-</span>
						<span className="text-white">TETRIS</span>
					</span>
                </NavLink>

                <nav className="flex items-center">
                    <NavLink to="/" end className={navClass}>
                        {({ isActive }) => (
                            <>
                                Home
                                {isActive && <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-red-500"/>}
                            </>
                        )}
                    </NavLink>

                    <NavLink to="/game" className={navClass}>
                        {({ isActive }) => (
                            <>
                                Play
                                {isActive && <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-red-500"/>}
                            </>
                        )}
                    </NavLink>

                    <NavLink to="/scoreboard" className={navClass}>
                        {({ isActive }) => (
                            <>
                                Scoreboard
                                {isActive && <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-red-500"/>}
                            </>
                        )}
                    </NavLink>
                </nav>
            </div>
        </header>
    )
}
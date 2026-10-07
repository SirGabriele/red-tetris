import {NavLink} from "react-router-dom";

export default function NavBar() {

    const navClass = ({ isActive }: { isActive: boolean }) =>
        `relative px-4 py-5 text-sm transition ${isActive ? 'text-red-500' : 'text-gray-400 hover:text-white'}`

    return (
        <header className="fixed w-full border-b border-white/10 bg-[#08090b]/95">
            <div className="mx-auto flex items-center justify-between px-8">
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
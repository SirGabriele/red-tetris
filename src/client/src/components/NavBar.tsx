import {NavLink} from "react-router-dom";

export default function NavBar() {
    return (
        <nav className="px-4 py-2 bg-gray-600 text-white flex gap-4">
            <NavLink to="/" className={({ isActive }) =>
                `transition-colors ${
                    isActive ? "bg-gray-400" : "hover:bg-gray-500"
                }`
            }>
                Home
            </NavLink>
            <NavLink to="/Game" className={({ isActive }) =>
                `transition-colors ${
                    isActive ? "bg-gray-400" : "hover:bg-gray-500"
                }`
            }>
                Game
            </NavLink>
            <NavLink to="/test1" className={({ isActive }) =>
                `transition-colors ${
                    isActive ? "bg-gray-400" : "hover:bg-gray-500"
                }`
            }>
                Test1
            </NavLink>
            <NavLink to="/test2" className={({ isActive }) =>
                `transition-colors ${
                    isActive ? "bg-gray-400" : "hover:bg-gray-500"
                }`
            }>
                Test2
            </NavLink>
        </nav>
    )
}
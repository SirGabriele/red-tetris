import type {ReactNode} from 'react'
import {NavLink} from 'react-router-dom'

type NavBarLinkProps = {
    to: string
    children: ReactNode
    end?: boolean
}

export default function navBarLink({ to, children, end = false }: NavBarLinkProps) {
    return (
        <NavLink to={to} end={end} className="relative px-4 py-5 text-sm">
            {({ isActive }) => (
                <>
                    {children}
                    {isActive && <span className="absolute right-3 bottom-0 left-3 h-0.5 bg-red-500"/>}
                </>
            )}
        </NavLink>
    )
}
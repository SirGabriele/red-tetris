import NavBarLink from '@client/src/components/layout/NavBarLink.tsx'
import {ROUTES} from '@shared/utils/routesUtils.ts'

export default function NavBar() {
    return (
        <header className="sticky w-full border-b border-white/10 bg-(--bg)/95">
            <div className="px-8">
                <nav className="flex">
                    <NavBarLink to={ROUTES.HOME} end>Home</NavBarLink>
                    <NavBarLink to={ROUTES.GAME}>Play</NavBarLink>
                    <NavBarLink to={ROUTES.SCOREBOARD}>Scoreboard</NavBarLink>
                </nav>
            </div>
        </header>
    )
}
import {Outlet} from 'react-router-dom'
import NavBar from '@client/src/components/layout/NavBar.tsx'

export default function Layout() {
    return (
        <div className="flex min-h-screen flex-col">
            <NavBar/>

            <main className="flex flex-1">
                <Outlet/>
            </main>
        </div>
    )
}
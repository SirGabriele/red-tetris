import {Outlet} from "react-router-dom";
import NavBar from "@client/src/components/NavBar.tsx";

export default function Layout() {
    return (
        <div className="min-h-screen flex flex-col">
            <NavBar/>
            <main className="flex-1">
                <Outlet/>
            </main>
        </div>
    )
}
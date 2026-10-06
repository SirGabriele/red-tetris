import NavBar from "@client/src/components/NavBar.tsx";
import {Outlet} from "react-router-dom";

export default function Layout() {
    return (
        <div>
            <NavBar/>
            <Outlet/>
        </div>
    )
}
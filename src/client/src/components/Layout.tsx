import {Outlet} from "react-router-dom";
import Header from "@client/src/components/layout/Header.tsx";

export default function Layout() {
    return (
        <div className="h-fit min-h-screen bg-red-200">
            <Header/>
            <Outlet/>
        </div>
    )
}
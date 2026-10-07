import {BrowserRouter, Navigate, Route, Routes} from 'react-router-dom'
import Layout from "@client/src/components/layout/Layout.tsx";
import HomePage from "@client/src/pages/HomePage.tsx";
import GamePage from "@client/src/pages/GamePage.tsx";
import Scoreboard from "@client/src/pages/Scoreboard.tsx";
import {ROUTES} from "@shared/utils/routesUtils.ts";


export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<Layout/>}>
                    <Route path={ROUTES.HOME} element={<HomePage/>}/>
                    <Route path={ROUTES.GAME} element={<GamePage/>}/>
                    <Route path={ROUTES.SCOREBOARD} element={<Scoreboard/>}/>

                    <Route path="*" element={<Navigate to="/" replace/>}/>
                </Route>
            </Routes>
        </BrowserRouter>
    )
}
import {BrowserRouter, Navigate, Route, Routes} from 'react-router-dom'
import Layout from "@client/src/components/Layout.tsx";
import Test1 from "@client/src/components/Test1.tsx";
import Test2 from "@client/src/components/Test2.tsx";
import HomePage from "@client/src/pages/HomePage.tsx";
import GamePage from "@client/src/pages/GamePage.tsx";


function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route element={<Layout/>}>
					<Route path="/" element={<HomePage/>}/>
					<Route path="/game" element={<GamePage/>}/>
					<Route path="/test1" element={<Test1/>}/>
					<Route path="/test2" element={<Test2/>}/>

					<Route path="*" element={<Navigate to="/" replace/>}/>
				</Route>
			</Routes>
		</BrowserRouter>
	)
}

export default App
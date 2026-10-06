import {BrowserRouter, Navigate, Route, Routes} from 'react-router-dom'

import HomePage from '@client/src/pages/HomePage'

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<HomePage/>}/>
				{/*<Route path="/game" element={<GamePage/>}/>*/}

				<Route path="*" element={<Navigate to="/" replace/>}/>
			</Routes>
		</BrowserRouter>
	)
}

export default App
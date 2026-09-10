import {useState} from 'react'
import {getRoot} from '@client/src/api/server.api'

function App() {
	const [message, setMessage] = useState('')

	const callBackend = async () => {
		try {
			const response = await getRoot()
			setMessage(response.message)
		} catch (error) {
			console.error(error)
			setMessage('Error while calling backend')
		}
	}

	return (
		<main className="flex min-h-screen flex-col items-center justify-center gap-4">
			<button
				onClick={callBackend}
				className="rounded bg-red-600 px-4 py-2 text-white"
			>
				Call backend
			</button>

			{message && <p>{message}</p>}
		</main>
	)
}

export default App
import { io } from "socket.io-client"
import { useState } from "react"
const socket = io.connect(`${process.env.REACT_APP_SERVER_URL}`)
export default function Chat() {
	const [comment, setComment] = useState('')
	const message = (e) => {
		e.preventDefault()
		console.log('click')
		socket.emit('send_comment', { comment: comment })
	}
	return (
		<div className="home">
			hello from Chat
			<form onSubmit={message}>
				<input
					type='text'
					id='message'
					placeholder='message ...'
					onChange={e => setComment(e.target.value)}
				/>
			</form>
			<button onClick={message}>connect</button>
		</div>
	)
}
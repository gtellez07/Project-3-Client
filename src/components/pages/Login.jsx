import { useState } from 'react'
import axios from 'axios'
import jwt_decode from 'jwt-decode'
import { Navigate } from 'react-router-dom'
import classNames from 'classnames'

export default function Login({ currentUser, setCurrentUser }) {
	// state for the controlled form
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [msg, setMsg] = useState('')

	// submit event handler
	const handleSubmit = async e => {
		e.preventDefault()
		try {
			// post fortm data to the backend
			const reqBody = {
				email,
				password
			}
			const response = await axios.post(`${process.env.REACT_APP_SERVER_URL}users/login`, reqBody)

			// save the token in localstorage
			const { token } = response.data
			localStorage.setItem('jwt', token)

			// decode the token
			const decoded = jwt_decode(token)

			// set the user in App's state to be the decoded token
			setCurrentUser(decoded)

		} catch (err) {
			console.warn(err)
			if (err.response) {
				setMsg(err.response.data.msg)
			}
		}
	}

	// conditionally render a navigate component
	if (currentUser) {
		return <Navigate to="/" />
	}

	return (
		<div>
			<div className='field is-grouped is-grouped-centered'>
				<div className='title is-1'>
					Login to Your Account

					<p>{msg}</p>
				</div>

			</div>
			<div className='field is-grouped is-grouped-centered'>

				<form onSubmit={handleSubmit}>
					<label className='label' htmlFor='email'>Email:</label>
					<div className='field '>
						<input
							className='input is-primary'
							autoComplete="off"
							type="email"
							id="email"
							placeholder='Your email...'
							onChange={e => setEmail(e.target.value)}
							value={email}
						/>
					</div>

					<label className='label' htmlFor='password'>Password:</label>
					<div className='field'>
						<input
							className='input is-primary'
							type="password"
							id="password"
							placeholder='Password...'
							onChange={e => setPassword(e.target.value)}
							value={password}
						/>
					</div>
					<div className='field is-grouped is-grouped-centered'>
						<button className='button is-small has-background-primary' type="submit">Login</button>
					</div>
				</form>
			</div>
		</div>
	)
}
import { useState } from 'react'
import axios from 'axios'
import jwt_decode from 'jwt-decode'
import { Navigate } from 'react-router-dom'

export default function Register({ currentUser, setCurrentUser }) {
	// state for the controlled form
	const [name, setName] = useState('')
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [msg, setMsg] = useState('')

	// submit event handler
	const handleSubmit = async e => {
		e.preventDefault()
		try {
			// post fortm data to the backend
			const reqBody = {
				name,
				email,
				password
			}
			const response = await axios.post(`${process.env.REACT_APP_SERVER_URL}users/register`, reqBody)

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
		return <Navigate to="/profile" />
	}

	return (
		<div>
			<div className='field is-grouped is-grouped-centered'>
				<div className='title is-1'>
					Register for An Account
					<p>{msg}</p>
				</div>

			</div>
			<div className='field is-grouped is-grouped-centered'>
				<form onSubmit={handleSubmit}>
					<label className='label' htmlFor='name'>Name:</label>
					<div className='field'>
						<input
							className='input is-primary'
							type="text"
							id="name"
							placeholder='Your username...'
							onChange={e => setName(e.target.value)}
							value={name}
						/>
					</div>

					<label className='label' htmlFor='email'>Email:</label>
					<input
						className='input is-primary'
						type="email"
						id="email"
						placeholder='Your email...'
						onChange={e => setEmail(e.target.value)}
						value={email}
					/>

					<label className='label' htmlFor='password'>Password:</label>
					<input
						className='input is-primary'
						type="password"
						id="password"
						placeholder='Password...'
						onChange={e => setPassword(e.target.value)}
						value={password}
					/>
					<div className='field is-grouped is-grouped-centered'>

						<button className='button is-small has-background-primary' type="submit">Register</button>
					</div>
				</form>
			</div>
		</div>
	)
}
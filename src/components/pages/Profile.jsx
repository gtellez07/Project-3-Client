

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

export default function Profile({ currentUser, handleLogout }) {
	// state for the secret message (aka user privilaged data)
	const [msg, setMsg] = useState('')

	const navigate = useNavigate()

	// useEffect for getting the user data and checking auth
	useEffect(() => {
		const fetchData = async () => {
			try {
				// get the token from local storage
				const token = localStorage.getItem('jwt')
				// make the auth headers
				const options = {
					headers: {
						'Authorization': token
					}
				}
				// hit the auth locked endpoint
				const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}users/auth-locked`, options)
				// example POST with auth headers (options are always last argument)
				// await axios.post(url, requestBody (form data), options)
				// set the secret user message in state
				setMsg(response.data.msg)
			} catch (err) {
				// if the error is a 401 -- that means that auth failed
				console.warn(err)
				if (err.response) {
					if (err.response.status === 401) {
						// panic!
						handleLogout()
						// send the user to the login screen
						navigate('/login')
					}
				}
			}
		}
		fetchData()
	}, []) // only fire on the first render of this component

	//delete button
	const handleDelete = async () => {
		try {
			// get the token from local storage
			const token = localStorage.getItem('jwt')
			// make the auth headers
			const options = {
				headers: {
					'Authorization': token
				}
			}
			// hit the auth locked endpoint
			const response = await axios.delete(`${process.env.REACT_APP_SERVER_URL}users/${currentUser.id}`, options)
			// example POST with auth headers (options are always last argument)
			// await axios.post(url, requestBody (form data), options)
			// set the secret user message in state
			setMsg(response.data.msg)
			console.log(response.data.msg)
			handleLogout()
			navigate('/login')
		} catch (err) {
			// if the error is a 401 -- that means that auth failed
			console.warn(err)
			if (err.response) {
				if (err.response.status === 401) {
					// panic!
					handleLogout()
					// send the user to the login screen
					navigate('/login')
				}
			}
		}
	}


	return (
		<section className="hero is-large">
			<section className="hero-body is-medium has-background-warning">
				<div className='field'>
					<div className='field is-grouped is-grouped-centered'>
						<h1 className='title is-2'>Here's your profile, {currentUser?.name}</h1>
					</div>
					<div className='field is-grouped is-grouped-centered'>
						<p className='subtitle is-4'>Your email is: {currentUser?.email}</p>
					</div>
					<div className='field is-grouped is-grouped-centered'>
						<p className='subtitle is-5'>Bio: {currentUser?.bio}</p>
					</div>
					<div className='field is-grouped is-grouped-centered'>
						<h3 className='subtitle is-5'>{msg}</h3>
					</div>
					<div className='field is-grouped is-grouped-centered'>
						<h2 className='subtitle is-5'>Thank You for Using CHAPPIE!</h2>
					</div>
					<div className="profile">
						<div className="field is-grouped is-grouped-centered">
							<button className="button is-danger" onClick={handleDelete}>Delete Account</button>
						</div>
					</div>
				</div>
			</section>
		</section>
	)
}
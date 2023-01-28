import { Link } from 'react-router-dom'


export default function SideBar({ currentUser, handleLogout }) {
	const loggedIn = (
		<aside className='menu'>
			<ul className='menu-list'>
				{/* if the user is logged in... */}
				<li className='has-background-primary'>
					<Link to="/">
						<p>Home</p>
					</Link>
				</li>
				<li className='has-background-primary'>
					<Link to="/">
						<span onClick={handleLogout}>Logout</span>
					</Link>
				</li>
				<li className='has-background-primary'>
					<Link to="/profile">
						Profile
					</Link>
				</li>
			</ul>

		</aside>
	)

	const loggedOut = (
		<aside className='menu'>
			<ul className='menu-list'>
				<li className='has-background-primary'>
					<Link to="/">
						<p>Home</p>
					</Link>
				</li>
				<li className='has-background-primary'>
					<Link to="/register">
						Register
					</Link>
				</li>
				<li className='has-background-primary'>
					<Link to="/login">
						Login
					</Link>
				</li>
			</ul>

			{/* if the user is not logged in... */}
		</aside>
	)

	return (
		<>
			{currentUser ? loggedIn : loggedOut}
		</>

	)
}
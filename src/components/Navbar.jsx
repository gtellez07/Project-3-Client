import { Link } from 'react-router-dom'
import { Navbar } from 'react-bulma-components'
import classnames from 'classnames'
export default function SideBar({ currentUser, handleLogout }) {
	const loggedIn = (
		<Navbar className='is-static-left'>
			<Navbar.Brand></Navbar.Brand>

			{/* if the user is logged in... */}
			<Link to="/">
				<p>Home</p>
			</Link>

			<Link to="/">
				<span onClick={handleLogout}>Logout</span>
			</Link>

			<Link to="/profile">
				Profile
			</Link>
		</Navbar>


	)

	const loggedOut = (
		<aside className='menu'>
			<ul className='menu-list'>
				<li>
					<Link to="/">
						<p>Home</p>
					</Link>
				</li>
				<li>
					<Link to="/register">
						Register
					</Link>
				</li>
				<li>
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
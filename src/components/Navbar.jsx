import { Link } from 'react-router-dom'


export default function SideBar({ currentUser, handleLogout }) {
	const loggedIn = (
		<nav className="navbar is-dark" role="navigation" aria-label="main navigation">
			<div id="navbarBasicExample" className="navbar-menu">
				<div className="navbar-start">
					<Link to="/" className='navbar-item'>
						Home
					</Link>

					<Link to="/profile" className='navbar-item'>
						Profile
					</Link>

					<Link to="/" className='navbar-item'>
						<span onClick={handleLogout}>Logout</span>
					</Link>

				</div>
			</div>
		</nav>
	)

	const loggedOut = (
		<nav className="navbar is-light" role="navigation" aria-label="main navigation">
			<div id="navbarBasicExample" className="navbar-menu">
				<div className="navbar-start">
					<Link to="/" className='navbar-item'>
						Home
					</Link>

					<Link to="/register" className='navbar-item'>
						Register
					</Link>

					<Link to="/login" className='navbar-item'>
						Login
					</Link>

				</div>
			</div>
		</nav>
	)

	return (
		<>
			{currentUser ? loggedIn : loggedOut}
		</>

	)
}
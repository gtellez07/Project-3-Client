import {
  BrowserRouter as Router,
  Routes,
  Route
} from 'react-router-dom'
import { useState, useEffect } from 'react'
import Login from './components/pages/Login'
import Profile from './components/pages/Profile'
import Register from './components/pages/Register'
import Chat from './components/pages/Chat'
import SideBar from './components/Navbar'
import 'bulma/css/bulma.css'
import './App.css'
import jwt_decode from 'jwt-decode'
import ChatForm from './components/pages/ChatForm'
import ChatRoom from './components/pages/ChatRoom'


function App() {
  // the currently logged in user will be stored up here in state
  const [currentUser, setCurrentUser] = useState(null)

  // useEffect -- if the user navigates away form the page, we will log them back in
  useEffect(() => {
    // check to see if token is in storage
    const token = localStorage.getItem('jwt')
    if (token) {
      // if so, we will decode it and set the user in app state
      setCurrentUser(jwt_decode(token))
    } else {
      setCurrentUser(null)
    }
  }, []) // happen only once

  // event handler to log the user out when needed
  const handleLogout = () => {
    // check to see if a token exists in local storage
    if (localStorage.getItem('jwt')) {
      // if so, delete it
      localStorage.removeItem('jwt')
      // set the user in the App state to be null
      setCurrentUser(null)
    }
  }

  return (
    <Router>
      <header>
        <SideBar
          currentUser={currentUser}
          handleLogout={handleLogout}
        />
      </header>

      <div className="App">
        <Routes>
          <Route
            path="/"
            element={<Chat />}
          />

          <Route
            path="/register"
            element={<Register currentUser={currentUser} setCurrentUser={setCurrentUser} />}
          />

          <Route
            path="/login"
            element={<Login currentUser={currentUser} setCurrentUser={setCurrentUser} />}
          />

          {/*optionally conditionally render auth locked routes */}
          {/* 
			<Route 
			   path="/profile" 
               element={currentUser ? <Profile handleLogout={handleLogout} currentUser={currentUser} setCurrentUser={setCurrentUser} /> : <Navigate to="/login" />}
            /> 
		  */}

          <Route
            path="/profile"
            element={<Profile handleLogout={handleLogout} currentUser={currentUser} setCurrentUser={setCurrentUser} />}
          />
          <Route path="/chat-form" element={<ChatForm currentUser={currentUser}/>}/>
          <Route 
          path="/chat-room/:id"
          element={<ChatRoom currentUser={currentUser}/>}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

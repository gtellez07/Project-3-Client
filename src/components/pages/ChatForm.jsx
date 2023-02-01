import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from "react-router-dom";

export default function ChatForm(props) {
    // state hook for form input field
    const [name, setName] = useState('')
    // console.log(props.currentUser)
    let navigate = useNavigate();
    //handle submit function for form
    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const response = await axios.post(`${process.env.REACT_APP_SERVER_URL}chats`, { title: name })
            console.log(response.data._id)
            navigate(`/chat-room/${response.data._id}`)
        } catch (err) {
            console.log(err)
        }
    }


    let loggedIn = <div className='field is-grouped is-grouped-centered'>
        <form onSubmit={handleSubmit}>
            <div className='field is-grouped is-grouped-centered'>
                <label className='label' htmlFor="title">Title:</label>
                <input

                    autoComplete='off'
                    className='input'
                    type="text"
                    id="title"
                    value={name}
                    onChange={e => setName(e.target.value)}
                />
            </div>
            <div className='field is-grouped is-grouped-centered'>
                <button className='button' type="submit">Create Chat</button>
            </div>
        </form>
    </div>

    let notLoggedIn = <div>
        <h2>Login to create a chat room</h2>
        <Link to='/login'>
            Login Page
        </Link><br></br>
        <Link to='/register'>
            Register for an account
        </Link>
    </div>
    return (
        <div>
            {props.currentUser ? loggedIn : notLoggedIn}
        </div>
    )
}
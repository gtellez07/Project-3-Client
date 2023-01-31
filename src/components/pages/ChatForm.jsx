import React, {useState} from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

export default function ChatForm(props) {
    // state hook for form input field
    const [name, setName] = useState('')
    // console.log(props.currentUser)
    let navigate = useNavigate();
    //handle submit function for form
    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const response = await axios.post(`${process.env.REACT_APP_SERVER_URL}chats`, {title:name})
            console.log(response.data._id)
            navigate(`/chat-room/${response.data._id}`)
        } catch (err) {
            console.log(err)
        }
    }


    return(
        <form onSubmit={handleSubmit}>
        <div>
        <label htmlFor="title">Title:</label>
            <input 
            type="text"
            id="title" 
            value={name} 
            onChange={e => setName(e.target.value)} 
            />
            </div>
            <button type="submit">Create Chat</button>
        </form>
    )
}
import { io } from "socket.io-client";
import { useState, useEffect } from "react";
import axios from 'axios'
const socket = io.connect(`${process.env.REACT_APP_SERVER_URL}`);
export default function Chat() {
  const [currentUserComment, setCurrentUserComment] = useState([]);
  const [comment, setComment] = useState("");
  const [otherUserComment, setOtherUserComment] = useState([]);
  const [search,setSearch] = useState('')
  const[showSearch,setShowSearch]= useState(false)
  const [data,setData] = useState([])

  const message = (e) => {
    e.preventDefault();
    console.log(e);
    setCurrentUserComment([...currentUserComment, comment]);
    socket.emit("send-comment", { comment: currentUserComment });
  };

  const handleSearch = async (e)=>{
    e.preventDefault()
    try{
      const searchFor = await axios.get(`${process.env.REACT_APP_SERVER_URL}chats?search=${search}`)
      console.log(searchFor.data)
      setShowSearch(!showSearch)
      setData(searchFor.data)
    }catch(err){
      console.warn(err)
    }
  }

  const findChat = async (id)=>{
    try{
      const chat = await axios.get(`${process.env.REACT_APP_SERVER_URL}chats/${id}`)
      console.log(chat.data)
    }catch(err){
      console.warn(err)
    }
  }

  useEffect(() => {
    socket.on("receive-comment", (comment) => {
      setOtherUserComment([...otherUserComment, comment.comment]);
    });
  }, [socket]);

  let currentUserComments = currentUserComment.map((comment, idx) => {
    return (
      <div key={`comment-${idx}`}>
        <p>{comment}</p>
      </div>
    );
  });

  let otherUserComments = otherUserComment.map((comment, idx) => {
    return (
      <div key={`otherUserComment-${idx}`}>
        <p>{comment}</p>
      </div>
    );
  });

  

  return (
    <div className="home">
      <form onSubmit={handleSearch}>
        <label htmlFor="search">Search Chat: </label>
        <input
          id="search"
          type='text'
          value={search}
          onChange={(e)=>setSearch(e.target.value)}
          />
          <button type="submit">Search</button>
      </form>
      <div onClick={()=>findChat(data._id)}>
      <p>{data.title}</p>
      </div>
      <h1>
        <strong>Chat Room</strong>
      </h1>
      <p>your comment:</p>
      {currentUserComments}
      <p>other user:</p>
      {otherUserComments}
      <form onSubmit={message}>
        <input
          autoComplete="off"
          type="text"
          id="message"
          placeholder="message ..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
      <button type = 'submit' >connect</button>
      </form>
    </div>
  );
}

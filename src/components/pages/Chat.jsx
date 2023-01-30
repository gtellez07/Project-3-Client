import { io } from "socket.io-client";
import { useState, useEffect } from "react";
import axios from 'axios'
const socket = io.connect(`${process.env.REACT_APP_SERVER_URL}`);
export default function Chat() {
  const [currentUserComment, setCurrentUserComment] = useState([]);
  const [comment, setComment] = useState("");
  const [otherUserComment, setOtherUserComment] = useState([]);
  const [search, setSearch] = useState('')
  const [showSearch, setShowSearch] = useState(false)
  const [list, setList] = useState({})
  const [chatRoom, setChatRoom] = useState('')

  const message = async (e) => {
    e.preventDefault();
    console.log(chatRoom);
    setCurrentUserComment([...currentUserComment, comment]);
    socket.emit("send-comment", { comment: currentUserComment, room: chatRoom });
    try {
      const comments = await axios.post(`${process.env.REACT_APP_SERVER_URL}chats/${chatRoom}/comment`, { content: `${comment}` })

      console.log(comments)
    } catch (err) {
      console.log(err)
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault()
    try {
      const searchFor = await axios.get(`${process.env.REACT_APP_SERVER_URL}chats?search=${search}`)
      setShowSearch(!showSearch)
      const searchList = searchFor.data.map((search) => {
        return (
          <div key={search._id} onClick={() => joinChat(search._id)}>
            {search.title}
          </div>
        )
      })
      setList(searchList)

    } catch (err) {
      console.warn(err)
    }
  }

  const joinChat = async (id) => {
    try {
      setChatRoom(`${id}`)
      socket.emit('join-chat', `${id}`)
      console.log(id)
    } catch (err) {
      console.warn(err)
    }
  }

  // const commentList = async function () {
  //   try {
  //     const comment = await axios.post(`${process.env.REACT_APP_SERVER_URL}`)

  //   } catch (err) {
  //     console.log(err)
  //   }
  // }


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
          autoComplete="off"
          id="search"
          type='text'
          value={search}
          placeholder='Look for a chat!'
          onChange={(e) => setSearch(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      {showSearch ? list : null}


      <h1>
        <strong>{list?.title}</strong>
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
        <button type='submit' >connect</button>
      </form>
    </div>
  );
}

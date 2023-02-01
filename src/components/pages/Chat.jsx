import { io } from "socket.io-client";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from 'axios'
import { PLACEHOLDERS_ALIAS } from "@babel/types";
const socket = io.connect(`${process.env.REACT_APP_SERVER_URL}`);
export default function Chat() {
  const [currentUserComment, setCurrentUserComment] = useState([]);
  const [comment, setComment] = useState("");
  const [otherUserComment, setOtherUserComment] = useState([]);
  const [search, setSearch] = useState('')
  const [showSearch, setShowSearch] = useState(false)
  const [list, setList] = useState({})
  const [chatRoom, setChatRoom] = useState('')
  let navigate = useNavigate();

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
      const searchFor = await axios.get(`${process.env.REACT_APP_SERVER_URL}chats?search=${search.toLowerCase()}`)
      console.log(searchFor.data)
      setShowSearch(!showSearch)
      console.log(search)
      const searchList = searchFor.data.map((search) => {
        return (
          <a className="dropdown-item" key={search._id} onClick={() => joinChat(search._id)}>
            {search.title}
          </a>
        )
      })
      setList(searchList)
    } catch (err) {
      console.warn(err)
    }
  }


  const joinChat = async (id) => {
    try {
      setChatRoom(id)
      socket.emit('join-chat', `${id}`)
      console.log(id)
    } catch (err) {
      console.warn(err)
    }
    console.log(chatRoom)
    navigate(`/chat-room/${id}`)
  }

  useEffect(() => {
    socket.on("receive-comment", (comment) => {
      setOtherUserComment([...otherUserComment, comment.comment]);
    });
  }, []);

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
    <>
      <section className="hero is-large">
        <section className="hero-body is-medium has-background-warning">

          <div className="field has-text-centered is-bold">
            <p className="title is-1">Welcome To CHAPPIE</p>
          </div>
          <div className="field is-grouped is-grouped-centered">
            <form onSubmit={handleSearch}>
              <label className="label title is-2" htmlFor="search">Search for a Chat</label>
              <div className="dropdown is-active">
                <div className="dropdown-trigger">
                  <input
                    className="input"
                    autoComplete="off"
                    id="search"
                    type='text'
                    value={search}
                    placeholder='Look for a chat!'
                    onChange={(e) => setSearch(e.target.value)}
                    required
                  />
                </div>
                <div className="dropdown-menu">
                  <div className="dropdown-content">
                    {showSearch ? list : null}
                  </div>
                </div>
              </div>
              <button className="button mx-1" type="submit">Find</button>
              <button className="button" type='submit' onClick={() => navigate('/chat-form')}>+</button>
            </form>

          </div>
        </section>
      </section>
    </>
  );
}

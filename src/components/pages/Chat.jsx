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
  const [chatRoom, setChatRoom]= useState('')

  const message = (e) => {
    e.preventDefault();
    console.log(e);
    setCurrentUserComment([...currentUserComment, comment]);
    socket.emit("send-comment", { comment: currentUserComment, room:chatRoom });
  };

  const handleSearch = async (e)=>{
    e.preventDefault()
    try{
      const searchFor = await axios.get(`${process.env.REACT_APP_SERVER_URL}chats?search=${search}`)
      console.log(searchFor.data)
      setShowSearch(!showSearch)
      searchFor.data.forEach((search)=>{
        console.log(search, "hihfidhfd")
        // let newSearch = [...data,search]
        let newSearch = data.push(search)
        setData(newSearch)
        
      })
      console.log(data,"⚠️⚠️⚠️⚠️⚠️")
      
      //setData(searchFor.data)
    }catch(err){
      console.warn(err)
    }
  }

  const findChat = async (id)=>{
    try{
      const chat = await axios.get(`${process.env.REACT_APP_SERVER_URL}chats/${id}`)
      setChatRoom(`${chat?.data?._id}`)
      socket.emit('join-chat',`${chat?.data?._id}`)
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

  // const searchResults = data.map((search)=>{
  //   return(
  //     <div onClick={()=>findChat(search._id)} key={`chatroom-${search._id}`}>
  //       <p>{search.title}</p>
  //     </div>
  //   )
  // })
   let searchResults
  for(let i in data){
    console.log(data[i])
  }
  console.log(data)

  return (
    <div className="home">
      <form onSubmit={handleSearch}>
        <label htmlFor="search">Search Chat: </label>
        <input
          autoComplete="off"
          id="search"
          type='text'
          value={search}
          onChange={(e)=>setSearch(e.target.value)}
          />
          <button type="submit">Search</button>
      </form>
      {searchResults}
      <h1>
        <strong>{data?.title}</strong>
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

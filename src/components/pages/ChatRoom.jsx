import { useEffect,useState } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
import axios from 'axios'
const socket = io.connect(`${process.env.REACT_APP_SERVER_URL}`);
export default function ChatRoom(props) {
    const [comments,setComment] = useState([])
    const [sendComment,setSendComment]=useState('')
    const [receiveComment,setReceiveComment]=useState(null)
    let [rendered,setRendered]=useState(0)
    let {id} = useParams()

    const handleSubmit= async (e)=>{
        e.preventDefault()
        socket.emit('send-comment',{ comment: sendComment, room: id })
        try{
            const send = await axios.post(`${process.env.REACT_APP_SERVER_URL}chats/${id}/comment`,{content:sendComment})
            console.log(send.data)
            let updateList = comments.map((comment)=>{
                return(
                    <div key={`comment${comment._id}`}>
                        <p>{comment.content}</p>
                    </div>
                )
            })
            updateList = updateList.push(
                <div key={`new-comment${Math.floor(Math.random() * 101)}`}>
                    <p>{sendComment}</p>
                </div>
            )
            setSendComment('')   
            setComment(updateList)
        }catch(err){
            console.log(err)
        }
    }
    const apiPing = async () => {
        try{
            //console.log(id)
            const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}chats/${id}/comment`)
             const commentList = response.data.content.map((comment)=>{
                return(
                    <div key={`comment${comment._id}`}>
                        <p>{comment.content}</p>
                    </div>
                )
            })
            console.log(commentList)
            setComment(commentList)
        }catch(err){
            console.log(err)
        }
    }

  useEffect(() => {
    socket.emit('join-chat',`${id}`)
    //console.log(socket)
    socket.on('receive-comment',(comment)=>{
        console.log(comment,"comment reciev3d")
        setReceiveComment(comment)
    })
    apiPing()
    setRendered(rendered+=1)
  },[id]);
//console.log(comments)
  return (
    <div>
        {comments.length && rendered>=1 > 0? comments :null}
        {}
        <form onSubmit={handleSubmit}>
            <input
                type='text'
                placeholder='text'
                value={sendComment}
                onChange={(e)=>setSendComment(e.target.value)}
                required
            />
            <button type="submit">Send</button>
        </form>
    </div>
    );
}

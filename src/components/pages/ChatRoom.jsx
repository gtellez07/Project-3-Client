import { useEffect,useState } from "react";
import { Link, useParams } from "react-router-dom";
import { io } from "socket.io-client";
import axios from 'axios'
import { useNavigate } from "react-router-dom";

const socket = io.connect(`${process.env.REACT_APP_SERVER_URL}`);
export default function ChatRoom(props) {
    let [comments,setComment] = useState(null)
    let [key,setKey] = useState(1)
    const [sendComment,setSendComment]=useState('')
    // const [fullList,setFullList]=useState({})
    // const [receiveComment,setReceiveComment]=useState(null)
    let [apiPinged,setApiPinged]=useState(false)
    let {id} = useParams()
    let navigate = useNavigate();
    const handleSubmit= async (e)=>{
        e.preventDefault()

        if(!props.currentUser){
            setSendComment('Login to comment')
        }else{
            socket.emit('send-comment',{ comment: sendComment, room: id })
            try{
                const send = await axios.post(`${process.env.REACT_APP_SERVER_URL}chats/${id}/comment`,{content:sendComment})
                let updatedList= <div key={`new-comment${key}`}><p>{sendComment}</p></div>
            let newKey = key+1
            setKey(newKey)
                let y= []
                for(let i in comments){
                    console.log(comments[i])
                    y.push(comments[i])
                }
                

            setComment([...y,updatedList])
            setSendComment('')   
        }catch(err){
            navigate('/error')
            console.log(err)
        }
    }
}
    
    const apiPing = async () => {
        try{
            const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}chats/${id}/comment`)
            const commentList = response.data.content.map((comment)=>{
                return(
                    <div key={`comment${comment._id}`}>
                        <p>{comment.content}</p>
                    </div>
                )
            })
            setComment(commentList)
        }catch(err){
            navigate('/error')
            console.log(err)
        }
    }

  useEffect(() => {
    socket.emit('join-chat',`${id}`)
    console.log(apiPinged)
    apiPing()
    setApiPinged((current) => !current)
    console.log(apiPinged)
  },[id]);

  useEffect(()=>{
    socket.on('receive-comment',(comment)=>{
        console.log(comment,"comment reciev3d")
        let receiveUpdate=  <div key={`new-comment${Math.floor(Math.random() * 101)}`}><p>{comment}</p></div>
        let x= []
        for(let i in comments){
            console.log(comments[i])
            x.push(comments[i])
        }
        setComment([...x,receiveUpdate])
        console.log(comments)
        //setReceiveComment(comment)
    })
  })

  let notLoggedIn= <div className="field is-grouped is-grouped-centered">
  <div>
  <p className="title is-2">Please Login to Interact With Chat</p>
  </div>
  </div>
  return (
    <div>
        {!props.currentUser ? notLoggedIn :null}
        {apiPinged ? comments:null}
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

import { useEffect,useState } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
import axios from 'axios'
import { render } from "@testing-library/react";
import { type } from "@testing-library/user-event/dist/type";
const socket = io.connect(`${process.env.REACT_APP_SERVER_URL}`);
export default function ChatRoom(props) {
    let [comments,setComment] = useState(null)
    const [sendComment,setSendComment]=useState('')
    const [fullList,setFullList]=useState({})
    const [receiveComment,setReceiveComment]=useState(null)
    let [apiPinged,setApiPinged]=useState(false)
    let {id} = useParams()

    const handleSubmit= async (e)=>{
        e.preventDefault()
        socket.emit('send-comment',{ comment: sendComment, room: id })
        try{
            const send = await axios.post(`${process.env.REACT_APP_SERVER_URL}chats/${id}/comment`,{content:sendComment})
            console.log(send.data)
            // let updateList = comments.map((comment)=>{
            //     return(
            //         <div key={`comment${comment._id}`}>
            //             <p>{comment.content}</p>
            //         </div>
            //     )
            // })
            // updateList = updateList.push(
            //     <div key={`new-comment${Math.floor(Math.random() * 101)}`}>
            //         <p>{sendComment}</p>
            //     </div>
            // )
            let updatedList= <div key={`new-comment${Math.floor(Math.random() * 101)}`}><p>{sendComment}</p></div>
            let y= []
            for(let i in comments){
                console.log(comments[i])
                y.push(comments[i])
            }
            setComment([...y,updatedList])
            setFullList([...comments,updatedList])
          //  console.log(fullList)
            // setComment([...comments,updatedList])
            setSendComment('')   
            //setComment(updateList)
        }catch(err){
            console.log(err)
        }
    }
    const apiPing = async () => {
        try{
            //console.log(id)
            console.log('ping')
            const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}chats/${id}/comment`)
             const commentList = response.data.content.map((comment)=>{
                return(
                    <div key={`comment${comment._id}`}>
                        <p>{comment.content}</p>
                    </div>
                )
            })
            //console.log(commentList)
            setComment(commentList)
            
            // setRendered(render+1)
        }catch(err){
            console.log(err)
        }
    }

  useEffect(() => {
    socket.emit('join-chat',`${id}`)
    console.log(apiPinged)
    apiPing()
    setApiPinged((current) => !current)
    console.log(apiPinged)
    //console.log(socket)
    // let add1 = rendered + 1
    // setRendered(add1)
  },[id]);

  useEffect(()=>{
    socket.on('receive-comment',(comment)=>{
        console.log(comment,"comment reciev3d")
        let receiveUpdate=  <div key={`new-comment${Math.floor(Math.random() * 101)}`}><p>{comment}</p></div>
        // setApiPinged((current) => !current)
        console.log(fullList)
        //console.log(Object.keys(comments).length)
        let x= []
        for(let i in comments){
            console.log(comments[i])
            x.push(comments[i])
        }
        console.log(x)
        // setFullList([...fullList,receiveUpdate])
        setComment([...x,receiveUpdate])
        console.log(comments)
        setReceiveComment(comment)
    })
  })
//console.log(comments)
//console.log(Object.keys(fullList).length)
// for(let i in fullList){
//     console.log(fullList[i])
// }
let sub 

 if (Object.keys(fullList).length >1){
    fullList.forEach((comment)=>{
        console.log(comment)
    })
 }
  return (
    <div>
        {/* { rendered<=1 > 0? comments.map(comment=>console.log(comment)) :null} */}
        {/* { apiPinged ? comments:null} */}
        {apiPinged ? comments:null}
        {/* {Object.keys(fullList).length >1 ?  fullList : null } */}
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

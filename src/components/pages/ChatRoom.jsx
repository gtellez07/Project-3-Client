import { useEffect,useState } from "react";
import { useParams } from "react-router-dom";
import axios from 'axios'
export default function ChatRoom(props) {
    const [comments,setComment] = useState({})
    let {id} = useParams()

  useEffect(() => {
    const apiPing = async () => {
        try{
            console.log(id)
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
            console.log(err)
        }
    }
    apiPing()
  },[]);

  return (
    <div>
        {comments.length > 0? comments :null}
    </div>
    );
}

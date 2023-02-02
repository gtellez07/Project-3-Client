import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
import axios from 'axios'
const socket = io.connect(`${process.env.REACT_APP_SERVER_URL}`);
export default function ChatRoom(props) {
    let [comments, setComment] = useState(null)
    let [key, setKey] = useState(1)
    const [sendComment, setSendComment] = useState('')
    let [apiPinged, setApiPinged] = useState(false)
    const [chatName, setChatName] = useState('')
    let [userId, setUserId] = useState('')
    let {id} = useParams()
    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!props.currentUser) {
            setSendComment('Login to comment')

        }else{
            socket.emit('send-comment',{ comment: sendComment, room: id, userName:props.currentUser.name,userId:props.currentUser.id})
            try{
                let body={
                    content: sendComment,
                    userName: props.currentUser.name,
                    userId: props.currentUser.id
                }

                const send = await axios.post(`${process.env.REACT_APP_SERVER_URL}chats/${id}/comment`,body)
                let date = new Date()
                date = date.toString()
                let time = date.slice(16,24)
                date = date.slice(0,15)
                console.log(time)
                // date = date
                let updatedList= 
                <div key={`new-comment${key}`}>
                  <p>{sendComment}</p>
                  <div className="tags has-addons">
                    <span className="tag is-dark">-{body.userName} </span>
                    <span className="tag">{date}</span>
                    <span className="tag is-dark">{time}</span>
                  </div>
                </div>
                let newKey = key+1
                setKey(newKey)
                let y= []
                for(let i in comments){
                    y.push(comments[i])
                }
                setComment([...y, updatedList])
                setSendComment('')
            } catch (err) {
                console.log(err)
            }
        }
    }
    const apiPing = async () => {
        try {
            setUserId(props.currentUser?.id)
            const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}chats/${id}/comment`)
            setChatName(response?.data.title)
            const commentList = response.data.content.map((comment) => {
                let date = comment.createdAt
                date = date.slice(0,10)
                // let date = new Date(comment.createdAt)
                // date = date.getTime()
                // console.log(date.getTime())
                // date = date.splice()
                let user 
                
                // comment.userId == props.currentUser.id ? user = 'You' : user= comment.userName
                return (
                    <div key={`comment${comment._id}`}>

                        <p> {comment.content}</p>
                    <div className="tags has-addons">
                        <span className="tag is-dark">-{comment.userName}</span>
                        <span className="tag">{date}</span>
                        <span></span>
                    </div>

                    </div>
                )
            })
            setComment(commentList)
        } catch (err) {
            console.log(err)
        }
    }
    // useEffect(()=>{
    //     console.log(comments, "uo")
    //     let list 
    //     if( comments != null)
    //     list = comments.map((comment)=>{
    //         console.log(comment.props)
    //         return(
    //             <>

    //             </>
    //         )
    //     })
    // },[comments])

    useEffect(() => {
        socket.emit('join-chat', `${id}`)
        apiPing()
        setApiPinged((current) => !current)
    }, [id]);

    useEffect(() => {
        socket.on('receive-comment', (comment) => {
            console.log(comment)
            let dateNow = new Date()
            dateNow =dateNow.toString()
            let currentTime = dateNow.slice(16,24)
            dateNow = dateNow.toString().slice(0,15)

            console.log(dateNow)
            let receiveUpdate = <div key={key}>
            <p>{comment.comment}</p>
            <div className="tags has-addons">
                <span className="tag is-dark">-{comment.userName}</span>
                <span className="tag">{dateNow}</span>
                <span className="tag is-dark">{currentTime}</span>
            </div>
            </div>
            let newKey = key+1
            setKey(newKey)
            let x = []
            for (let i in comments) {
                //console.log(comments[i])
                x.push(comments[i])
            }
            setComment([...x, receiveUpdate])
        })
    })
    let notLoggedIn = <div className="field is-grouped is-grouped-centered">
        <div>
            <p className="title is-2">Please Login to Interact With Chat</p>
        </div>
    </div>
    return (
        <section className="hero is-large">
            <section className="hero-body is-medium has-background-warning">
                <div className="container">
                    <div className="field">
                        <div className="field is-grouped is-grouped-centered">
                            <p className="title is-1">{chatName}</p>
                        </div>
                        {!props.currentUser ? notLoggedIn : null}
                        {apiPinged ? comments : null}
                        <div className="field is-grouped is-grouped-centered">
                            <form onSubmit={handleSubmit}>
                                <input
                                    className="input"
                                    type='text'
                                    placeholder='text'
                                    value={sendComment}
                                    onChange={(e) => setSendComment(e.target.value)}
                                    required
                                />
                            </form>
                           <button className="button" onClick={handleSubmit}>Send</button>
                        </div>
                    </div>
                </div>
            </section>
        </section>
    );
}

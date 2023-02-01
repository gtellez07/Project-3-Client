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
    let { id } = useParams()
    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!props.currentUser) {
            setSendComment('Login to comment')

        } else {
            socket.emit('send-comment', { comment: sendComment, room: id })
            try {
                let body = {
                    content: sendComment,
                    userName: props.currentUser.name,
                    userId: props.currentUser.id
                }
                const send = await axios.post(`${process.env.REACT_APP_SERVER_URL}chats/${id}/comment`, body)
                let updatedList = <div key={`new-comment${key}`}><p>{sendComment}</p></div>
                let newKey = key + 1
                setKey(newKey)
                let y = []
                for (let i in comments) {
                    console.log(comments[i])
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
            const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}chats/${id}/comment`)
            console.log(response.data)
            setChatName(response.data.title)
            const commentList = response.data.content.map((comment) => {
                return (
                    <div key={`comment${comment._id}`}>
                        <p className="comment mx-6">{comment.content}</p>
                    </div>
                )
            })
            setComment(commentList)
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        socket.emit('join-chat', `${id}`)
        console.log(apiPinged)
        apiPing()
        setApiPinged((current) => !current)
        console.log(apiPinged)
    }, [id]);

    useEffect(() => {
        socket.on('receive-comment', (comment) => {
            console.log(comment, "comment reciev3d")
            let receiveUpdate = <div key={`new-comment${Math.floor(Math.random() * 101)}`}><p>{comment}</p></div>

            let x = []
            for (let i in comments) {
                console.log(comments[i])
                x.push(comments[i])
            }
            setComment([...x, receiveUpdate])
            console.log(comments)
            //setReceiveComment(comment)
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
                            <button className="button" type="submit">Send</button>
                        </div>
                    </div>
                </div>
            </section>
        </section>
    );
}

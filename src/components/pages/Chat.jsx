import { io } from "socket.io-client";
import { useState, useEffect } from "react";
const socket = io.connect(`${process.env.REACT_APP_SERVER_URL}`);
export default function Chat() {
  const [currentUserComment, setCurrentUserComment] = useState([]);
  const [comment, setComment] = useState("");
  const [otherUserComment, setOtherUserComment] = useState([]);

  const message = (e) => {
    e.preventDefault();
    console.log(e);
    setCurrentUserComment([...currentUserComment, comment]);
    socket.emit("send-comment", { comment: currentUserComment });
  };

  useEffect(() => {
    socket.on("receive-comment", (comment) => {
      setOtherUserComment([...otherUserComment, comment.comment]);
      //alert(comment.comment)
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
    <div className="home">
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
      </form>
      <button onClick={message}>connect</button>
    </div>
  );
}

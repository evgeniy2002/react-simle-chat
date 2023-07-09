import React from 'react';
import socket from '../socket';

function Chat({ users, messages, roomId, userName, addMessage }) {
  const [messageValue, setMessageValue] = React.useState('');

  const scrollRef = React.useRef(null);

  const onSendMessage = () => {
    console.log(messageValue);
    socket.emit('ROOM:NEW_MESSAGE', {
      userName,
      roomId,
      text: messageValue,
    });
    addMessage({ userName, text: messageValue });
    setMessageValue('');
  };

  React.useEffect(() => {
    scrollRef.current.scrollTo(0, 99999);
  }, [messages]);

  return (
    <div className="chat">
      <div className="chat-users">
        Комната: <b>{roomId}</b>
        <hr />
        <b>Онлайн ({users.length}):</b>
        <ul>
          {users.map((item) => (
            <li>{item}</li>
          ))}
        </ul>
      </div>
      <div className="chat-messages">
        <div className="messages" ref={scrollRef}>
          {messages.map((message) => (
            <div className="message">
              <p>{message.text}</p>
              <div>
                <span>{message.userName}</span>
              </div>
            </div>
          ))}
        </div>
        <form>
          <textarea
            value={messageValue}
            onChange={(e) => setMessageValue(e.target.value)}
            className="form-control"
            rows="3"></textarea>
          <button onClick={onSendMessage} type="button" className="btn btn-primary">
            Отправить
          </button>
        </form>
      </div>
    </div>
  );
}

export default Chat;

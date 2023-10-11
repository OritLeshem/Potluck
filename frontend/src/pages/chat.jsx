import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { socketService, SOCKET_EMIT_SEND_MSG, SOCKET_EMIT_TYPING, SOCKET_EMIT_STOP_TYPING, SOCKET_EMIT_TOPIC, SOCKET_EMIT_NEW_MSG, SOCKET_EVENT_TYPING, SOCKET_EVENT_STOP_TYPING, SOCKET_EVENT_ADD_MSG } from '../services/socket.service-copy';
import { useParams } from 'react-router-dom';
import { addMsgToChatHistory, loadGather, loadGathers } from '../store/gather/gather.actions';
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service';
import { utilService } from '../services/util.service';

export function Chat() {
  const gather = useSelector(storeState => storeState.gatherModule.gather);

  const [msg, setMsg] = useState('');
  const [msgs, setMsgs] = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);
  const user = useSelector(storeState => storeState.userModule.user);
  const { gatherId } = useParams()
  const timeoutId = useRef(null);
  const chatContainerRef = useRef(null);

  useEffect(() => {
    loadGathers();
    onLoadGather(gatherId);
  }, [gatherId]);

  async function onLoadGather(gatherId) {
    try {
      await loadGather(gatherId);
      showSuccessMsg('Gather set');
    } catch (err) {
      showErrorMsg('Cannot set gather');
    }
  }

  useEffect(() => {
    if (gather) {
      setMsgs(gather.chatHistory);
    }
  }, [gather]);
  useEffect(() => {
    // Join room
    socketService.emit(SOCKET_EMIT_TOPIC, gatherId);

    // Add listeners
    socketService.on(SOCKET_EMIT_SEND_MSG, addMsg);
    socketService.on(SOCKET_EVENT_TYPING, addTypingUser);
    socketService.on(SOCKET_EVENT_STOP_TYPING, removeTypingUser);

    // Remove on unmount
    return () => {
      socketService.off(SOCKET_EMIT_SEND_MSG, addMsg);
      socketService.off(SOCKET_EMIT_TYPING, addTypingUser);
      socketService.off(SOCKET_EMIT_STOP_TYPING, removeTypingUser);
      clearTimeout(timeoutId.current);
    };
  }, []);

  useEffect(() => {
    // Scroll to bottom of chat container when messages are added
    chatContainerRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [msgs]);

  function addMsg(newMsg) {
    setMsgs((prevMsgs) => [...prevMsgs, newMsg]);

  }

  function addTypingUser(user) {
    setTypingUsers((prevTypingUsers) => ([...prevTypingUsers, user]));
  }

  function removeTypingUser(user) {
    setTypingUsers((prevTypingUsers) => prevTypingUsers.filter((existingUser) => existingUser !== user));
  }

  function handleChange(ev) {
    ev.preventDefault();
    setMsg(ev.target.value);

    if (!timeoutId.current) socketService.emit(SOCKET_EMIT_TYPING, user?.fullname || 'Guest');

    if (timeoutId.current) clearTimeout(timeoutId.current);

    timeoutId.current = setTimeout(() => {
      socketService.emit(SOCKET_EMIT_STOP_TYPING, user?.fullname || 'Guest');
      timeoutId.current = null;
    }, 2000);
  }

  async function sendMessage(ev) {
    ev.preventDefault();
    if (!msg) return
    // const from = user?.fullname || 'Guest';
    const from = user
    const newMsg = { _id: utilService.makeId(), txt: msg, from }
    socketService.emit(SOCKET_EMIT_NEW_MSG, { from, txt: msg });
    // socketService.emit(SOCKET_EMIT_STOP_TYPING, from);
    setMsgs(prev => [...prev, newMsg])
    await addMsgToChatHistory(gatherId, newMsg);

    clearTimeout(timeoutId.current);
    timeoutId.current = null;
    setMsg('');
  }

  return (
    <div className="chat-container">

      <ul className="msgs-container">
        {msgs?.map((msg, idx) => (
          <li key={idx}>
            <div className="msg-container">
              <img src={msg.from.imgUrl} alt="user.imgUrl" />
              <p className='bubble' >
                <span>{`${user.fullname === msg.from.fullname ? 'Me' : msg.from.fullname}: `}</span>
                {` ${msg.txt}`}
              </p>
            </div>
          </li>
        ))}
        <div ref={chatContainerRef} />
      </ul>

      <form onSubmit={sendMessage}>
        <div className='type-your-msg'>
          <p style={{ color: "#b5b6ba" }} className="typing-msg">
            {typingUsers.length ? `${typingUsers[0]} is typing....` : ''}
          </p>
          <input
            className='type-your-msg-input'
            type="text"
            placeholder="Type your message here..."
            value={msg}
            onChange={handleChange}
          />
          <button>{'>>'}</button>
        </div>
      </form>

      <div id="bottom" style={{ display: 'none' }}>scroll to bottom</div>
    </div>
  );
}
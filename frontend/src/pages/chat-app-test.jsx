// import React, { useEffect, useRef, useState, useLayoutEffect } from 'react';
// import { useSelector } from 'react-redux';
// import { socketService, SOCKET_EMIT_SEND_MSG, SOCKET_EMIT_TYPING, SOCKET_EMIT_STOP_TYPING, SOCKET_EMIT_TOPIC, SOCKET_EMIT_NEW_MSG, SOCKET_EVENT_SEND_MSG, SOCKET_EVENT_TYPING, SOCKET_EVENT_STOP_TYPING, SOCKET_EVENT_ADD_MSG } from '../services/socket.service-copy';

// export function Chat({ topic = "picnic", history }) {
//     const [msg, setMsg] = useState('');
//     const [msgs, setMsgs] = useState(history || []);
//     const [typingUsers, setTypingUsers] = useState([]);
//     const messagesEndRef = useRef(null);
//     const user = useSelector(storeState => storeState.userModule.user);
//     const timeoutId = useRef(null);

//     useEffect(() => {
//         // Join room
//         socketService.emit(SOCKET_EMIT_TOPIC, topic);

//         // Add listeners
//         socketService.on(SOCKET_EVENT_ADD_MSG, addMsg);
//         socketService.on(SOCKET_EVENT_TYPING, addTypingUser);
//         socketService.on(SOCKET_EVENT_STOP_TYPING, removeTypingUser);

//         // Remove on unmount
//         return () => {
//             socketService.off(SOCKET_EMIT_SEND_MSG, addMsg);
//             socketService.off(SOCKET_EMIT_TYPING, addTypingUser);
//             socketService.off(SOCKET_EMIT_STOP_TYPING, removeTypingUser);
//             clearTimeout(timeoutId.current);
//         };
//     }, []);

//     useEffect(() => {
//         scrollToBottom();
//     }, [msgs]);

//     function addMsg(newMsg) {
//         setMsgs(prevMsgs => [...prevMsgs, newMsg]);
//         setTimeout(() => {
//             scrollToBottom();
//         }, 100);
//     }

//     function addTypingUser(user) {
//         setTypingUsers((prevTypingUsers) => ([...prevTypingUsers, user]));
//     }

//     function removeTypingUser(user) {
//         setTypingUsers((prevTypingUsers) => prevTypingUsers.filter((existingUser) => existingUser !== user));
//     }

//     function handleChange(ev) {
//         ev.preventDefault();
//         setMsg(ev.target.value);

//         if (!timeoutId.current) socketService.emit(SOCKET_EMIT_TYPING, user?.fullname || 'Guest');
//         if (timeoutId.current) clearTimeout(timeoutId.current);
//         timeoutId.current = setTimeout(() => {
//             socketService.emit(SOCKET_EMIT_STOP_TYPING, user?.fullname || 'Guest');
//             timeoutId.current = null;
//         }, 2000);
//     }

//     function sendMessage(ev) {
//         ev.preventDefault();
//         const from = user?.fullname || 'Guest';
//         socketService.emit(SOCKET_EMIT_NEW_MSG, { from, txt: msg });
//         socketService.emit(SOCKET_EMIT_STOP_TYPING, from);
//         clearTimeout(timeoutId.current);
//         timeoutId.current = null;
//         setMsg('');
//     }

//     function scrollToBottom() {
//         if (messagesEndRef && messagesEndRef.current) {
//             messagesEndRef.current.({ behavior: 'smooth', block: 'end' });
//         }
//     }

//     return (
//         <div className="chat-container">
//             <ul className="msgs-container">
//                 {msgs.map((msg, idx) => (
//                     <li key={idx}>
//                         <div className="msg-container">
//                             <img src={user.imgUrl} alt="user.imgUrl" />
//                             <p className='bubble' >
//                                 <span> {`${user.fullname === msg.from ? 'Me' : msg.from}: `}</span>
//                                 {` ${msg.txt}`}
//                             </p>
//                         </div>
//                     </li>
//                 ))}
//                 <div ref={messagesEndRef} />
//             </ul>

//             <form onSubmit={sendMessage}>
//                 <div className='type-your-msg'>
//                     <p className="typing-msg">{typingUsers.length ? `${typingUsers[0]} is typing....` : ''}</p>

//                     <input className='type-your-msg-input' type="text" placeholder="Type your message here..." value={msg} onChange={handleChange} />
//                     <button>{'>>'}</button>
//                 </div>
//             </form>
//         </div>
//     );
// }
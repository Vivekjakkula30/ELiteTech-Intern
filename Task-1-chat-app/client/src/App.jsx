import { useEffect, useState, useRef } from "react";
import socket from "./socket";
import "./App.css";
import EmojiPicker from "emoji-picker-react";

function App() {
  const chatBodyRef = useRef(null);

  const [username, setUsername] = useState("");
  const [joined, setJoined] = useState(false);
  const [message, setMessage] = useState("");
  const [messageList, setMessageList] = useState([]);
  const [showEmoji, setShowEmoji] = useState(false);
  const [replyMessage, setReplyMessage] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [typing, setTyping] = useState("");

  // Join chat
  const joinChat = () => {
    if (username.trim() !== "") {
      setJoined(true);
      socket.emit("join_chat", username);
    }
  };

  // Join with Enter
  const handleJoinKeyPress = (e) => {
    if (e.key === "Enter") {
      joinChat();
    }
  };

  // Send message
  const sendMessage = () => {
    if (message.trim() !== "") {
      const messageData = {
        text: message,
        sender: socket.id,
        username,
        replyTo: replyMessage ? replyMessage.text : null,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setMessageList((list) => [...list, messageData]);
      socket.emit("send_message", messageData);

      setMessage("");
      setReplyMessage(null);
      setShowEmoji(false);
    }
  };

  // Send with Enter
  const handleMessageKeyPress = (e) => {
    socket.emit("typing", username);

    if (e.key === "Enter") {
      sendMessage();
    }
  };

  // Delete message
  const deleteMessage = (index) => {
    setMessageList((list) => list.filter((_, i) => i !== index));
  };

  // Fetch messages
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch("http://localhost:5000/messages");
        const data = await response.json();

        const filteredMessages = data.filter(
          (msg) =>
            msg.username === username ||
            onlineUsers.some((user) => user.username === msg.username)
        );

        setMessageList(filteredMessages);
      } catch (error) {
        console.log("Error fetching messages:", error);
      }
    };

    fetchMessages();
  }, [username, onlineUsers]);

  // Socket listeners
  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessageList((list) => [...list, data]);
    });

    socket.on("online_users", (users) => {
      setOnlineUsers(users);
    });

    socket.on("show_typing", (data) => {
      setTyping(data);

      setTimeout(() => {
        setTyping("");
      }, 2000);
    });

    // Reset on refresh/disconnect
    socket.on("disconnect", () => {
      setJoined(false);
      setUsername("");
    });

    return () => {
      socket.off("receive_message");
      socket.off("online_users");
      socket.off("show_typing");
      socket.off("disconnect");
    };
  }, []);

  // Auto-scroll
  useEffect(() => {
    chatBodyRef.current?.scrollTo({
      top: chatBodyRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messageList]);

  // Join screen
  if (!joined) {
    return (
      <div className="app">
        <div className="join-container">
          <div className="join-card">
            <div className="join-avatar">💬</div>
            <h1>Welcome Back</h1>
            <p>Join the conversation</p>

            <div className="join-input-box">
              <input
                type="text"
                placeholder="Enter your name..."
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyDown={handleJoinKeyPress}
              />
              <button onClick={joinChat}>Join</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Chat screen
  return (
    <div className="app">
      <div className="chat-container">
        <div className="chat-header">
          <h2>✨ Live Chat</h2>
          <p>{onlineUsers.length} users online</p>
        </div>

        <div className="online-users">
          {onlineUsers.length > 0 ? (
            onlineUsers.map((user, index) => (
              <span key={index}>🟢 {user.username}</span>
            ))
          ) : (
            <span>No users online</span>
          )}
        </div>

        <div className="chat-body" ref={chatBodyRef}>
          {messageList.map((msg, index) => (
            <div
              key={index}
              className={`message-box ${
                msg.sender === socket.id || msg.username === username
                  ? "own"
                  : "other"
              }`}
              onDoubleClick={() => setReplyMessage(msg)}
            >
              {msg.replyTo && (
                <div className="reply-box">
                  Replying to: {msg.replyTo}
                </div>
              )}

              <div className="message-top">
                <div className="avatar">
                  {msg.username.charAt(0).toUpperCase()}
                </div>

                <strong>{msg.username}</strong>
              </div>

              <p>{msg.text}</p>
              <small>{msg.time}</small>

              {msg.sender === socket.id && (
                <button
                  className="delete-btn"
                  onClick={() => deleteMessage(index)}
                >
                  🗑
                </button>
              )}
            </div>
          ))}
        </div>

        {typing && <div className="typing">{typing}</div>}

        {replyMessage && (
          <div className="reply-preview">
            Replying to: {replyMessage.text}
            <button onClick={() => setReplyMessage(null)}>❌</button>
          </div>
        )}

        {showEmoji && (
          <div className="emoji-picker">
            <EmojiPicker
              onEmojiClick={(emojiData) =>
                setMessage((prev) => prev + emojiData.emoji)
              }
            />
          </div>
        )}

        <div className="chat-footer">
          <button onClick={() => setShowEmoji(!showEmoji)}>😊</button>

          <input
            type="text"
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleMessageKeyPress}
          />

          <button onClick={sendMessage}>➤</button>
        </div>
      </div>
    </div>
  );
}

export default App;
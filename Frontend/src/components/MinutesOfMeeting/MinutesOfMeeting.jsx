import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import "../../styles/MinutesOfMeeting/MinutesOfMeeting.css";
import Loader from '../Loader'

const MinutesOfMeeting = ({ projectId }) => {
  const { user } = useSelector((state) => state.user);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const messagesContainerRef = useRef(null);

  useEffect(() => {
    const fetchMessages = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`/api/v1/minutes-of-meeting/${projectId}`);
        setMessages(response.data);
      } catch (error) {
        console.error("Error fetching minutes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [projectId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  };

  const handleAddMessage = async () => {
    if (!newMessage.trim()) return;

    setPosting(true);
    const messageData = {
      pid: projectId,
      text: newMessage,
      added_by: user.id,
      date: new Date(),
    };

    try {
      const response = await axios.post("/api/v1/minutes-of-meeting/", messageData);
      const addedMessage = response.data;
      if (!addedMessage.added_by || !addedMessage.added_by.name) {
        addedMessage.added_by = { _id: user.id, name: user.name };
      }
      setMessages([...messages, addedMessage]);
      setNewMessage("");
      setTimeout(scrollToBottom, 100);
    } catch (error) {
      console.error("Error adding message:", error);
    } finally {
      setPosting(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleAddMessage();
    }
  };

  const formatDate = (dateString) => {
    const messageDate = new Date(dateString);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    if (messageDate.toDateString() === today.toDateString()) {
      return "Today";
    } else if (messageDate.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return messageDate.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    }
  };

  const groupMessagesByDate = () => {
    return messages.reduce((acc, msg) => {
      const dateKey = formatDate(msg.date);
      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }
      acc[dateKey].push(msg);
      return acc;
    }, {});
  };

  const groupedMessages = groupMessagesByDate();

  if(loading) return <Loader/>;

  return (
    <div className="mom-container">
      <h2>Notes</h2>

      {/* Messages List */}
      <div className="messages-list" ref={messagesContainerRef}>
        {loading ? (
          <p className="loading-message">Loading messages...</p>
        ) : messages.length === 0 ? (
          <p>No messages yet.</p>
        ) : (
          Object.entries(groupedMessages).map(([date, msgs]) => (
            <div key={date} className="message-group">
              <div className="date-separator">{date}</div>
              {msgs.map((msg) => {
                const isCurrentUser = msg.added_by?._id === user.id;
                const senderName = msg.added_by?.name || "Unknown User";
                return (
                  <div key={msg._id} className={`message-item ${isCurrentUser ? "sent" : "received"}`}>
                    <div className="message-content">
                      {!isCurrentUser && <strong>{senderName}</strong>}
                      <p>{msg.text}</p>
                      <span className="message-time">
                        {new Date(msg.date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ))
        )}
      </div>

      {/* Input Field */}
      <div className="message-input">
        <input
          type="text"
          placeholder={posting ? "Sending..." : "Type a message..."}
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={posting}
        />
      </div>
    </div>
  );
};

export default MinutesOfMeeting;

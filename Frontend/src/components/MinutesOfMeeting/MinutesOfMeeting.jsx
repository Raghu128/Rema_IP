import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import "../../styles/MinutesOfMeeting/MinutesOfMeeting.css";

const MinutesOfMeeting = ({ projectId }) => {
  const { user } = useSelector((state) => state.user);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [userNames, setUserNames] = useState({});
  const messagesContainerRef = useRef(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get(`/api/v1/minutes-of-meeting/${projectId}`);
        const messagesData = response.data;

        const uniqueUserIds = [...new Set(messagesData.map((msg) => msg.added_by))];
        const userNamesMap = {};
        await Promise.all(
          uniqueUserIds.map(async (userId) => {
            userNamesMap[userId] = await getUserName(userId);
          })
        );

        setUserNames(userNamesMap);
        setMessages(messagesData);
      } catch (error) {
        console.error("Error fetching minutes:", error);
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

  const getUserName = async (userId) => {
    if (userNames[userId]) return userNames[userId];

    try {
      const response = await axios.get(`/api/v1/userbyid/${userId}`);
      const userName = response.data[0]?.name || "Unknown User";
      setUserNames((prev) => ({ ...prev, [userId]: userName }));
      return userName;
    } catch (err) {
      console.error("Error fetching user name", err);
      return "Unknown User";
    }
  };

  const handleAddMessage = async () => {
    if (!newMessage.trim()) return;

    const messageData = {
      pid: projectId,
      text: newMessage,
      added_by: user.id,
      date: new Date(),
    };

    try {
      const response = await axios.post("/api/v1/minutes-of-meeting/", messageData);
      const addedMessage = response.data;

      const senderName = await getUserName(user.id);

      setMessages([...messages, { ...addedMessage, added_by: user.id }]);
      setUserNames((prev) => ({ ...prev, [user.id]: senderName }));
      setNewMessage("");

      setTimeout(scrollToBottom, 100);
    } catch (error) {
      console.error("Error adding message:", error);
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

  return (
    <div className="mom-container">
      <h2>Minutes of Meeting</h2>

      {/* Messages List */}
      <div className="messages-list" ref={messagesContainerRef}>
        {messages.length === 0 ? (
          <p>No messages yet.</p>
        ) : (
          Object.entries(groupedMessages).map(([date, messages]) => (
            <div key={date} className="message-group">
              <div className="date-separator">{date}</div>
              {messages.map((msg) => {
                const isCurrentUser = msg.added_by === user.id;
                const senderName = userNames[msg.added_by] || "Loading...";

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
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </div>
    </div>
  );
};

export default MinutesOfMeeting;

import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import "../../styles/MinutesOfMeeting/MinutesOfMeeting.css";
import Loader from '../Loader';
import { PaperPlaneRight, Clock } from 'phosphor-react';
import io from 'socket.io-client';

const MinutesOfMeeting = ({ projectId }) => {
  const { user } = useSelector((state) => state.user);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const messagesContainerRef = useRef(null);
  const socketRef = useRef(null);

  // Initialize socket connection and fetch messages
  useEffect(() => {
    // Initialize socket connection
    const newSocket = io(import.meta.env.VITE_BACKEND_URL, {
      withCredentials: true,
    });
    socketRef.current = newSocket;

    const fetchMessages = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`/api/v1/minutes-of-meeting/${projectId}`);
        // Remove any potential duplicates from initial fetch
        const uniqueMessages = response.data.reduce((acc, current) => {
          const x = acc.find(item => item._id === current._id);
          if (!x) {
            return acc.concat([current]);
          } else {
            return acc;
          }
        }, []);
        setMessages(uniqueMessages);
      } catch (error) {
        console.error("Error fetching minutes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [projectId]);

  // Socket.IO message handler
  useEffect(() => {
    if (!socketRef.current || !projectId) return;

    // Join project room
    socketRef.current.emit('join_project', projectId);

    const handleNewMessage = (message) => {
      setMessages(prev => {
        // Check if message already exists to prevent duplicates
        const messageExists = prev.some(m => m._id === message._id);
        if (!messageExists) {
          return [...prev, message];
        }
        return prev;
      });
      setTimeout(scrollToBottom, 100);
    };

    socketRef.current.on('new_message', handleNewMessage);

    return () => {
      if (socketRef.current) {
        socketRef.current.off('new_message', handleNewMessage);
      }
    };
  }, [projectId]);

  // Scroll to bottom when messages change
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
      // Don't update state here - let the socket event handle it
      setNewMessage("");
    } catch (error) {
      console.error("Error adding message:", error);
    } finally {
      setPosting(false);
    }
  };

  
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
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

  const renderMessageText = (text) => {
    return text.split('\n').map((line, i) => (
      <React.Fragment key={i}>
        {line}
        {i < text.split('\n').length - 1 && <br />}
      </React.Fragment>
    ));
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

  if (loading) return <Loader />;

  return (
    <div className="meeting-notes-container">
      <div className="meeting-notes-header">
        <h2>Meeting Notes</h2>
        <p className="meeting-notes-subtitle">All discussions and decisions in one place</p>
      </div>

      <div className="meeting-notes-list" ref={messagesContainerRef}>
        {loading ? (
          <div className="meeting-notes-loading">
            <div className="meeting-notes-spinner"></div>
            <p>Loading messages...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="meeting-notes-empty">
            <img src="/images/empty-notes.svg" alt="No messages" />
            <p>No notes yet. Start the conversation!</p>
          </div>
        ) : (
          Object.entries(groupedMessages).map(([date, msgs]) => (
            <div key={date} className="meeting-notes-group">
              <div className="meeting-notes-date">
                <span>{date}</span>
              </div>
              {msgs.map((msg) => {
                const isCurrentUser = msg.added_by?._id === user.id;
                const senderName = msg.added_by?.name || "Unknown User";
                return (
                  <div key={msg._id} className={`meeting-notes-item ${isCurrentUser ? "meeting-notes-sent" : "meeting-notes-received"}`}>
                    {!isCurrentUser && (
                      <div className="meeting-notes-avatar">
                        {senderName.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="meeting-notes-content-wrapper">
                      {!isCurrentUser && <div className="meeting-notes-sender">{senderName}</div>}
                      <div className="meeting-notes-content">
                        <p className="meeting-notes-text">{renderMessageText(msg.text)}</p>
                        <div className="meeting-notes-time">
                          <Clock size={12} weight="fill" />
                          <span>
                            {new Date(msg.date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ))
        )}
      </div>

      <div className="meeting-notes-input-container">
        <div className="meeting-notes-input">
          <textarea
            placeholder={posting ? "Sending..." : "Type your note here..."}
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={posting}
            rows="1"
            className="meeting-notes-textarea"
          />
          <button 
            onClick={handleAddMessage} 
            disabled={posting || !newMessage.trim()}
            className="meeting-notes-send-button"
          >
            <PaperPlaneRight size={20} weight="fill" />
          </button>
        </div>
        <p className="meeting-notes-hint">Press Enter to send, Shift+Enter for new line</p>
      </div>
    </div>
  );
};

export default MinutesOfMeeting;
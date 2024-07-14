import React, { useState, useEffect, useRef } from "react";
import { database } from "../firebase";
import { ref, onValue, push, set, update } from "firebase/database";
import { Box, TextField, Button, Paper, Typography } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";

function Chat({ user }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const messagesRef = ref(database, "messages");
    const unsubscribe = onValue(messagesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const messageList = Object.entries(data).map(([id, msg]) => ({
          id,
          ...msg,
        }));
        setMessages(messageList);

        messageList.forEach((msg) => {
          if (msg.sender !== user.uid && msg.status === "sent") {
            update(ref(database, `messages/${msg.id}`), {
              status: "delivered",
            });
          }
        });
      }
    });
    return () => unsubscribe();
  }, [user.uid]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      const messagesRef = ref(database, "messages");
      const newMessageRef = push(messagesRef);
      set(newMessageRef, {
        text: newMessage,
        sender: user.uid,
        timestamp: Date.now(),
        status: "sent",
      });
      setNewMessage("");
    }
  };

  const handleReadMessage = (messageId) => {
    update(ref(database, `messages/${messageId}`), { status: "read" });
  };

  return (
    <Paper
      elevation={3}
      sx={{ flex: 1, display: "flex", flexDirection: "column", height: "70vh" }}
    >
      <Box sx={{ flex: 1, overflow: "auto", p: 2 }}>
        {messages.map((msg) => (
          <Box
            key={msg.id}
            onClick={() => handleReadMessage(msg.id)}
            sx={{
              mb: 1,
              p: 1,
              backgroundColor:
                msg.sender === user.uid ? "primary.main" : "secondary.main",
              borderRadius: 2,
              maxWidth: "70%",
              alignSelf: msg.sender === user.uid ? "flex-end" : "flex-start",
              display: "inline-block",
            }}
          >
            <Typography variant="body1">{msg.text}</Typography>
            {msg.sender === user.uid && (
              <Typography variant="caption" sx={{ ml: 1 }}>
                {msg.status === "sent" && "✓"}
                {msg.status === "delivered" && "✓✓"}
                {msg.status === "read" && "✓✓ 🔵"}
              </Typography>
            )}
          </Box>
        ))}
        <div ref={messagesEndRef} />
      </Box>
      <Box
        component="form"
        onSubmit={handleSendMessage}
        sx={{ p: 2, display: "flex" }}
      >
        <TextField
          fullWidth
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message"
          variant="outlined"
          size="small"
        />
        <Button
          type="submit"
          variant="contained"
          endIcon={<SendIcon />}
          sx={{ ml: 1 }}
        >
          Send
        </Button>
      </Box>
    </Paper>
  );
}

export default Chat;

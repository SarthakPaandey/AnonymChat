import React, { useState, useEffect, useRef } from "react";
import { database } from "../firebase";
import { ref, onValue, push, set, update } from "firebase/database";
import {
  Box,
  TextField,
  Button,
  Paper,
  Typography,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import PersonIcon from "@mui/icons-material/Person";

function Chat({ user }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [users, setUsers] = useState([]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const usersRef = ref(database, "users");
    const unsubscribe = onValue(usersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const userList = Object.entries(data).map(([id, user]) => ({
          id,
          ...user,
        }));
        setUsers(userList.filter((user) => user.online));
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (selectedUser) {
      const messagesRef = ref(database, `messages/${selectedUser.id}`);
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
              update(ref(database, `messages/${selectedUser.id}/${msg.id}`), {
                status: "delivered",
              });
            }
          });
        }
      });
      return () => unsubscribe();
    }
  }, [selectedUser, user.uid]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() && selectedUser) {
      const messagesRef = ref(database, `messages/${selectedUser.id}`);
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
    update(ref(database, `messages/${selectedUser.id}/${messageId}`), {
      status: "read",
    });
  };

  const handleUserSelect = (user) => {
    setSelectedUser(user);
  };

  return (
    <Box
      sx={{ display: "flex", height: "calc(100vh - 64px)", overflow: "hidden" }}
    >
      <Paper
        elevation={3}
        sx={{
          width: 250,
          mr: 2,
          overflow: "hidden",
          borderRadius: "15px",
          display: "flex",
          flexDirection: "column",
        }}
        className="animated-gradient"
      >
        <Typography
          variant="h6"
          sx={{ p: 2, color: "white", textAlign: "center" }}
        >
          Online Users
        </Typography>
        <Divider sx={{ bgcolor: "rgba(255, 255, 255, 0.2)" }} />
        <Box sx={{ flex: 1, overflowY: "auto" }}>
          <List>
            {users.map((user) => (
              <ListItem
                key={user.id}
                onClick={() => handleUserSelect(user)}
                sx={{
                  cursor: "pointer",
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                  },
                }}
              >
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: "rgba(255, 255, 255, 0.2)" }}>
                    <PersonIcon sx={{ color: "white" }} />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary={user.id} sx={{ color: "white" }} />
              </ListItem>
            ))}
          </List>
        </Box>
      </Paper>
      <Paper
        elevation={3}
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          height: "100%",
          overflow: "hidden",
          borderRadius: "15px",
        }}
        className="animated-gradient"
      >
        <Box sx={{ flex: 1, overflow: "auto", p: 2 }}>
          {selectedUser ? (
            <>
              <Typography
                variant="h6"
                sx={{ mb: 2, color: "white", textAlign: "center" }}
              >
                Chat with {selectedUser.id}
              </Typography>
              {messages.map((msg) => (
                <Box
                  key={msg.id}
                  onClick={() => handleReadMessage(msg.id)}
                  sx={{
                    mb: 2,
                    display: "flex",
                    justifyContent:
                      msg.sender === user.uid ? "flex-end" : "flex-start",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems:
                        msg.sender === user.uid ? "flex-end" : "flex-start",
                    }}
                  >
                    <Avatar
                      sx={{
                        bgcolor:
                          msg.sender === user.uid
                            ? "rgba(255, 255, 255, 0.5)"
                            : "rgba(255, 255, 255, 0.3)",
                        mb: 1,
                      }}
                    >
                      {msg.sender.charAt(0).toUpperCase()}
                    </Avatar>
                    <Paper
                      elevation={1}
                      sx={{
                        p: 1,
                        backgroundColor:
                          msg.sender === user.uid
                            ? "rgba(255, 255, 255, 0.9)"
                            : "rgba(255, 255, 255, 0.7)",
                        borderRadius: 2,
                        maxWidth: "70%",
                        wordWrap: "break-word",
                      }}
                    >
                      <Typography variant="body1">{msg.text}</Typography>
                    </Paper>
                    {msg.sender === user.uid && (
                      <Typography
                        variant="caption"
                        sx={{
                          mt: 0.5,
                          color: (theme) =>
                            ({
                              read: "blue",
                              sent: "green",
                              delivered: "orange",
                            }[msg.status] || "white"),
                        }}
                      >
                        {msg.status === "sent" && "✓"}
                        {msg.status === "delivered" && "✓✓"}
                        {msg.status === "read" && "✓✓ 🔵"}
                      </Typography>
                    )}
                  </Box>
                </Box>
              ))}
              <div ref={messagesEndRef} />
            </>
          ) : (
            <Typography
              variant="h6"
              sx={{ color: "white", textAlign: "center" }}
            >
              Select a user to start chatting
            </Typography>
          )}
        </Box>
        <Box
          component="form"
          onSubmit={handleSendMessage}
          sx={{
            p: 2,
            bgcolor: "rgba(255, 255, 255, 0.1)",
            display: "flex",
            alignItems: "center",
          }}
        >
          <TextField
            fullWidth
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message"
            variant="outlined"
            size="small"
            multiline
            sx={{
              mr: 1,
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "white" },
                "&:hover fieldset": { borderColor: "white" },
                "&.Mui-focused fieldset": { borderColor: "white" },
              },
              "& .MuiInputBase-input": { color: "white" },
              "& .MuiInputBase-root": {
                wordWrap: "break-word",
                maxHeight: "100px",
                overflowY: "auto",
              },
            }}
          />
          <Button
            type="submit"
            variant="contained"
            endIcon={<SendIcon />}
            sx={{
              bgcolor: "rgba(255,255,255,0.3)",
              "&:hover": { bgcolor: "rgba(255,255,255,0.5)" },
            }}
          >
            Send
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}

export default Chat;

import React, { useState, useEffect } from "react";
import { database } from "../firebase";
import { ref, onValue } from "firebase/database";
import {
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Paper,
  Typography,
  Divider,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";

function UserList() {
  const [users, setUsers] = useState([]);

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

  return (
    <Paper
      elevation={3}
      sx={{
        width: 250,
        mr: 2,
        overflow: "hidden",
        borderRadius: "15px",
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
      <List sx={{ maxHeight: "calc(70vh - 56px)", overflowY: "auto" }}>
        {users.map((user) => (
          <ListItem key={user.id}>
            <ListItemAvatar>
              <Avatar sx={{ bgcolor: "rgba(255, 255, 255, 0.2)" }}>
                <PersonIcon sx={{ color: "white" }} />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary={user.id} sx={{ color: "white" }} />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
}

export default UserList;

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
    <Paper elevation={3} sx={{ width: 250, mr: 2, overflow: "auto" }}>
      <Typography variant="h6" sx={{ p: 2 }}>
        Online Users
      </Typography>
      <List>
        {users.map((user) => (
          <ListItem key={user.id}>
            <ListItemAvatar>
              <Avatar>
                <PersonIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary={user.id} />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
}

export default UserList;

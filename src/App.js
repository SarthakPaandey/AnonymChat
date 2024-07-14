import React, { useState, useEffect } from "react";
import { auth, setupPresence } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  Box,
  Container,
} from "@mui/material";
import Login from "./components/Login";
import Chat from "./components/Chat";
import UserList from "./components/UserList";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#90caf9",
    },
    secondary: {
      main: "#f48fb1",
    },
  },
});

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      if (user) {
        setupPresence(user.uid);
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg">
        <Box sx={{ height: "100vh", display: "flex", flexDirection: "column" }}>
          {user ? (
            <Box sx={{ display: "flex", flex: 1, mt: 2 }}>
              <UserList />
              <Chat user={user} />
            </Box>
          ) : (
            <Login />
          )}
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default App;

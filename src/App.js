import React, { useState, useEffect } from "react";
import { auth, setupPresence } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  Box,
  Container,
  AppBar,
  Toolbar,
  Typography,
  Button,
} from "@mui/material";
import Login from "./components/Login";
import Chat from "./components/Chat";
// import UserList from "./components/UserList"; // Removed import
import "./App.css";

const theme = createTheme({
  palette: {
    primary: {
      main: "#ffffff",
    },
    secondary: {
      main: "#f50057",
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

  const handleLogout = () => {
    auth.signOut();
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          flexGrow: 1,
          height: "100vh",
          display: "flex",
          flexDirection: "column",
        }}
        className="animated-gradient"
      >
        <AppBar position="static" color="transparent" elevation={0}>
          <Toolbar>
            <Typography
              variant="h6"
              component="div"
              sx={{ flexGrow: 1 }}
              className="animated-text"
            >
              Cool Chat App
            </Typography>
            {user && (
              <Button color="inherit" onClick={handleLogout}>
                Logout
              </Button>
            )}
          </Toolbar>
        </AppBar>
        <Container
          maxWidth="lg"
          sx={{ mt: 2, flexGrow: 1, display: "flex", flexDirection: "column" }}
        >
          {user ? (
            <Box sx={{ display: "flex", flexGrow: 1 }}>
              {/* <UserList /> */} {/* Removed UserList component */}
              <Chat user={user} />
            </Box>
          ) : (
            <Login />
          )}
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;

import {
  Box,
  Container,
  createTheme,
  CssBaseline,
  Grid,
  Snackbar,
  ThemeProvider,
} from "@mui/material";
import { RouterProvider } from "react-router-dom";
import router from "./components/Routes";
import client from "./constants/apollo-client";
import { ApolloProvider } from "@apollo/client/react";
import Header from "./components/header/Header";
import ChatList from "./components/chat-list/ChatList";
import { usePath } from "./hooks/usePath";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

const App = () => {
  const { path } = usePath();

  const showChatList = path === "/" || path.includes("chats");

  return (
    <ApolloProvider client={client}>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            minHeight: "100dvh",
            height: showChatList ? { xs: "auto", md: "100dvh" } : "auto",
          }}
        >
          <Header />
          <Container
            maxWidth="xl"
            sx={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column" }}
          >
            {showChatList ? (
              <Grid
                container
                spacing={5}
                sx={{
                  flex: 1,
                  minHeight: 0,
                  flexWrap: { md: "nowrap" },
                  overflow: { md: "hidden" },
                }}
              >
                <Grid size={{ xs: 12, md: 5, lg: 4, xl: 3 }}>
                  <ChatList />
                </Grid>
                <Grid
                  size={{ xs: 12, md: 7, lg: 8, xl: 9 }}
                  sx={{
                    minWidth: 0,
                    minHeight: 0,
                    display: "flex",
                    flexDirection: "column",
                    overflow: "hidden",
                  }}
                >
                  <Routes />
                </Grid>
              </Grid>
            ) : (
              <Routes />
            )}
          </Container>
        </Box>
        <Snackbar />
      </ThemeProvider>
    </ApolloProvider>
  );
};

const Routes = () => {
  return <RouterProvider router={router} />;
};

export default App;

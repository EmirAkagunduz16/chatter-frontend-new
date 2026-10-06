import { createBrowserRouter } from "react-router-dom";
import SignUp from "./auth/SignUp";
import Login from "./auth/Login";
import { Home } from "./home/Home";
import Guard from "./auth/Guard";
import Chat from "./chat/Chat";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <SignUp />,
  },
  {
    path: "/",
    element: (
      <Guard>
        <Home />
      </Guard>
    ),
  },
  {
    path: "/chats/:_id",
    element: (
      <Guard>
        <Chat />
      </Guard>
    ),
  },
]);

export default router;

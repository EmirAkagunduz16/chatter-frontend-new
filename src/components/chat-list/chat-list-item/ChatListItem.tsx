import {
  Avatar,
  Divider,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material";
import router from "../../Routes";
import { ChatFragmentFragment as Chat } from "../../../gql/graphql";
import { useGetMe } from "../../../hooks/useGetMe";

interface ChatListProps {
  chat: Chat;
  selected: boolean;
}
const ChatListItem = ({ chat, selected }: ChatListProps) => {
  const { data } = useGetMe();
  const isOwnMessage =
    !!chat.latestMessage && chat.latestMessage.user._id === data?.me._id;

  return (
    <>
      <ListItem
        alignItems="flex-start"
        disablePadding
      >
        <ListItemButton
          onClick={() => router.navigate(`/chats/${chat._id}`)}
          selected={selected}
        >
          <ListItemAvatar>
            <Avatar
              alt="Remy Sharp"
              src="/static/images/avatar/1.jpg"
            />
          </ListItemAvatar>
          <ListItemText
            primary={chat.name}
            secondary={
              <>
                <Typography
                  component="span"
                  variant="body2"
                  sx={{ color: "text.primary", display: "inline" }}
                >
                  {chat.latestMessage
                    ? isOwnMessage
                      ? "You:"
                      : chat.latestMessage.user.username + ":"
                    : ""}
                </Typography>
                {" " + (chat.latestMessage?.content ?? "")}
              </>
            }
          />
        </ListItemButton>
      </ListItem>
      <Divider variant="inset" />
    </>
  );
};

export default ChatListItem;

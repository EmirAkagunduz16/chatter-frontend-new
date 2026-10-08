import { useEffect, useRef, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { useGetChat } from "../../hooks/useGetChat";
import {
  Avatar,
  Box,
  Divider,
  Grid,
  IconButton,
  InputBase,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { useCreateMessage } from "../../hooks/useCreateMessage";
import { useGetMessages } from "../../hooks/useGetMessages";
import { scrollbarStyles } from "../../styles/scrollbar";
import { MessagesQuery } from "../../gql/graphql";
import { PAGE_SIZE } from "../../constants/page-size";
import { useCountMessages } from "../../hooks/useCountMessages";
import InfiniteScroll from "react-infinite-scroller";
import { UNKNOWN_ERROR_SNACK_MESSAGE } from "../../constants/errors";
import { snackVar } from "../../constants/snack";

const Chat = () => {
  const params = useParams();
  const [message, setMessage] = useState("");
  const chatId = params._id!;
  const { data } = useGetChat({ _id: chatId });
  const [createMessage] = useCreateMessage();
  const {
    data: existingMessages,
    fetchMore,
    loading,
    error,
  } = useGetMessages({
    chatId,
    skip: 0,
    limit: PAGE_SIZE,
  });
  const fetchingMore = useRef(false);
  const [messages, setMessages] = useState<MessagesQuery["messages"]>([]);
  const sortedMessages = [...messages].sort(
    (messageA, messageB) =>
      new Date(messageA.createdAt as unknown as Date).getTime() -
      new Date(messageB.createdAt as unknown as Date).getTime(),
  );
  const latestMessageId = sortedMessages[sortedMessages.length - 1]?._id;
  const divRef = useRef<HTMLDivElement | null>(null);
  const [paginationFailed, setPaginationFailed] = useState(false);
  const location = useLocation();
  const { messagesCount, countMessages } = useCountMessages(chatId);

  const loadMore = async () => {
    if (loading || !data || fetchingMore.current || paginationFailed) {
      return;
    }
    fetchingMore.current = true;
    try {
      await fetchMore({
        variables: {
          skip: messages?.length,
          limit: PAGE_SIZE,
        },
      });
    } catch {
      setPaginationFailed(true);
      snackVar(UNKNOWN_ERROR_SNACK_MESSAGE);
    } finally {
      fetchingMore.current = false;
    }
  };

  useEffect(() => {
    countMessages();
  }, [countMessages]);

  useEffect(() => {
    if (existingMessages) {
      setMessages(existingMessages.messages);
    }
  }, [existingMessages]);

  const scrollToBottom = () => divRef.current?.scrollIntoView();

  useEffect(() => {
    setMessage("");
  }, [location]);

  useEffect(() => {
    scrollToBottom();
  }, [location, latestMessageId]);

  const handleCreateMessage = async () => {
    if (!message.trim()) {
      return;
    }

    await createMessage({
      variables: { createMessageInput: { content: message, chatId } },
    });
    setMessage("");
    scrollToBottom();
  };

  return (
    <Stack
      sx={{
        height: { xs: "calc(100dvh - 56px)", md: "100%" },
        minHeight: 0,
        minWidth: 0,
      }}
    >
      <Typography
        component="h1"
        variant="h4"
        sx={{ my: 3, fontWeight: 700, flexShrink: 0 }}
      >
        {data?.chat.name}
      </Typography>
      <Box
        sx={(theme) => ({
          ...scrollbarStyles(theme),
          flex: 1,
          minHeight: 0,
          minWidth: 0,
          overflowY: "auto",
          overflowX: "hidden",
          padding: "1rem",
        })}
      >
        <InfiniteScroll
          pageStart={0}
          isReverse={true}
          loadMore={loadMore}
          hasMore={
            !loading &&
            !error &&
            !paginationFailed &&
            !!data &&
            messages &&
            messagesCount
              ? messages.length < messagesCount
              : false
          }
          useWindow={false}
        >
          {sortedMessages.map((message) => (
            <Grid
              key={message._id}
              container
              sx={{
                alignItems: "center",
                marginBottom: "1rem",
              }}
              spacing={1}
            >
              <Grid size={{ xs: 2, lg: 1 }}>
                <Stack
                  sx={{ alignItems: "center", justifyContent: "center" }}
                  spacing={1}
                >
                  <Avatar
                    src={message.user.imageUrl}
                    sx={{ height: 52, width: 52 }}
                  />
                  <Typography variant="caption">
                    {message.user.username}
                  </Typography>
                </Stack>
              </Grid>
              <Grid
                size={{ xs: 10, lg: 11 }}
                sx={{ minWidth: 0 }}
              >
                <Stack>
                  <Paper sx={{ width: "fit-content", maxWidth: "100%" }}>
                    <Typography
                      sx={{
                        padding: "0.9rem",
                        overflowWrap: "anywhere",
                        whiteSpace: "pre-wrap",
                      }}
                    >
                      {message.content}
                    </Typography>
                  </Paper>
                  <Typography
                    variant="caption"
                    sx={{ marginLeft: "0.25rem" }}
                  >
                    {new Date(
                      message.createdAt as unknown as Date,
                    ).toLocaleTimeString()}{" "}
                    -{" "}
                    {new Date(
                      message.createdAt as unknown as Date,
                    ).toLocaleDateString()}
                  </Typography>
                </Stack>
              </Grid>
            </Grid>
          ))}
        </InfiniteScroll>
        <div ref={divRef}></div>
      </Box>
      <Paper
        sx={{
          p: "2px 4px",
          display: "flex",
          flexShrink: 0,
          alignItems: "center",
          width: "100%",
          margin: "1rem 0",
        }}
      >
        <InputBase
          sx={{ ml: 1, flex: 1, width: "100%" }}
          onChange={(event) => setMessage(event.target.value)}
          value={message}
          placeholder="Message"
          onKeyDown={async (event) => {
            if (event.key === "Enter") {
              await handleCreateMessage();
            }
          }}
        />
        <Divider
          sx={{ height: 28, m: 0.5 }}
          orientation="vertical"
        />
        <IconButton
          onClick={handleCreateMessage}
          disabled={!message.trim()}
          color="primary"
          sx={{ p: "10px" }}
        >
          <SendIcon />
        </IconButton>
      </Paper>
    </Stack>
  );
};

export default Chat;

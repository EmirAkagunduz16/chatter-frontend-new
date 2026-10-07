import ChatListItem from "./chat-list-item/ChatListItem";
import { Box, Divider, Stack } from "@mui/material";
import ChatListHeader from "./chat-list-header/ChatListHeader";
import { useEffect, useRef, useState } from "react";
import ChatListAdd from "./chat-list-add/ChatListAdd";
import { useGetChats } from "../../hooks/useGetChats";
import { usePath } from "../../hooks/usePath";
import { scrollbarStyles } from "../../styles/scrollbar";
import { useMessageCreated } from "../../hooks/useMessageCreated";
import { PAGE_SIZE } from "../../constants/page-size";
import InfiniteScroll from "react-infinite-scroller";
import { useCountChats } from "../../hooks/useCountChats";
import { snackVar } from "../../constants/snack";
import { UNKNOWN_ERROR_SNACK_MESSAGE } from "../../constants/errors";

const ChatList = () => {
  const [chatListAddVisible, setChatListAddVisible] = useState(false);
  const [selectedChatId, setSelectedChatId] = useState("");
  const { data, fetchMore, loading, error } = useGetChats({
    skip: 0,
    limit: PAGE_SIZE,
  });
  const fetchingMore = useRef(false);
  const [paginationFailed, setPaginationFailed] = useState(false);
  const { path } = usePath();
  const { chatsCount, countChats } = useCountChats();

  const loadMore = async () => {
    if (loading || !data || fetchingMore.current || paginationFailed) {
      return;
    }
    fetchingMore.current = true;
    try {
      await fetchMore({
        variables: { skip: data.chats.length, limit: PAGE_SIZE },
      });
    } catch {
      setPaginationFailed(true);
      snackVar(UNKNOWN_ERROR_SNACK_MESSAGE);
    } finally {
      fetchingMore.current = false;
    }
  };

  useEffect(() => {
    countChats();
  }, [countChats]);

  useMessageCreated({ chatIds: data?.chats.map((chat) => chat._id) || [] });

  useEffect(() => {
    const pathSplit = path.split("chats/");
    if (pathSplit.length === 2) {
      setSelectedChatId(pathSplit[1]);
    }
  }, [path]);

  return (
    <>
      <ChatListAdd
        open={chatListAddVisible}
        handleClose={() => setChatListAddVisible(false)}
      />
      <Stack>
        <ChatListHeader handleAddChat={() => setChatListAddVisible(true)} />
        <Divider />
        <Box
          sx={(theme) => ({
            ...scrollbarStyles(theme),
            width: "100%",
            bgcolor: "background.paper",
            maxHeight: "82vh",
            overflow: "auto",
          })}
        >
          <InfiniteScroll
            pageStart={0}
            loadMore={loadMore}
            hasMore={
              !loading &&
              !error &&
              !paginationFailed &&
              !!data &&
              chatsCount !== undefined &&
              data.chats.length < chatsCount
            }
            useWindow={false}
          >
            {data?.chats &&
              [...data.chats]
                .sort((chatA, chatB) => {
                  if (!chatA.latestMessage) {
                    return -1;
                  }
                  return (
                    new Date(
                      chatA.latestMessage?.createdAt as unknown as Date,
                    ).getTime() -
                    new Date(
                      chatB.latestMessage?.createdAt as unknown as Date,
                    ).getTime()
                  );
                })
                .map((chat) => (
                  <ChatListItem
                    key={chat._id}
                    chat={chat}
                    selected={chat._id === selectedChatId}
                  />
                ))
                .reverse()}
          </InfiniteScroll>
        </Box>
      </Stack>
    </>
  );
};

export default ChatList;

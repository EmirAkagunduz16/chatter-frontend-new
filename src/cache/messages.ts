import type { ApolloCache } from "@apollo/client";
import type { MessageFragmentFragment } from "../gql/graphql";
import { getMessagesDocument } from "../hooks/useGetMessages";

export const updateMessages = (
  cache: ApolloCache,
  message: MessageFragmentFragment,
) => {
  const messagesQueryOptions = {
    query: getMessagesDocument,
    variables: {
      chatId: message.chatId,
    },
  };
  const messages = cache.readQuery({
    ...messagesQueryOptions,
  });
  cache.writeQuery({
    ...messagesQueryOptions,
    data: {
      messages: (messages?.messages || []).concat(message),
    },
  });
};

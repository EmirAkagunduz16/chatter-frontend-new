import { useQuery } from "@apollo/client/react";
import { graphql } from "../gql";
import { ChatsQueryVariables } from "../gql/graphql";

export const getChatsDocument = graphql(`
  query Chats($skip: Int!, $limit: Int!) {
    chats(skip: $skip, limit: $limit) {
      ...ChatFragment
    }
  }
`);

const useGetChats = (variables: ChatsQueryVariables) => {
  return useQuery(getChatsDocument, { variables });
};

export { useGetChats };

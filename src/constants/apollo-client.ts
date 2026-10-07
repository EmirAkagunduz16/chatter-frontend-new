import {
  ApolloClient,
  ApolloLink,
  CombinedGraphQLErrors,
  HttpLink,
  InMemoryCache,
  ServerError,
  split,
} from "@apollo/client";
import { ErrorLink } from "@apollo/client/link/error";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { API_URL, WS_URL } from "./urls";
import excludedRoutes from "./excluded-routes";
import { onLogout } from "../utils/logout";
import { createClient } from "graphql-ws";
import { getMainDefinition } from "@apollo/client/utilities";

const logoutLink = new ErrorLink(({ error }) => {
  if (excludedRoutes.includes(window.location.pathname)) {
    return;
  }

  const isGraphQLUnauthorized =
    CombinedGraphQLErrors.is(error) &&
    error.errors.some((graphQLError) => {
      const originalError = graphQLError.extensions?.originalError as
        | { statusCode?: number }
        | undefined;

      return originalError?.statusCode === 401;
    });

  const isHttpUnauthorized = ServerError.is(error) && error.statusCode === 401;

  if (isGraphQLUnauthorized || isHttpUnauthorized) {
    void onLogout().catch(console.error);
  }
});

const httpLink = new HttpLink({ uri: `${API_URL}/graphql` });
const wsLink = new GraphQLWsLink(
  createClient({
    url: `ws://${WS_URL}/graphql`,
  }),
);

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink,
  httpLink,
);

const client = new ApolloClient({
  link: ApolloLink.from([logoutLink, splitLink]),
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          chats: {
            keyArgs: false,
            merge(existing = [], incoming, { args }) {
              const skip = args?.skip ?? 0;
              const merged = existing.slice(0);
              for (let i = 0; i < incoming.length; ++i) {
                merged[skip + i] = incoming[i];
              }
              return merged;
            },
          },
        },
      },
    },
  }),
});

export default client;

import {
  ApolloClient,
  ApolloLink,
  CombinedGraphQLErrors,
  HttpLink,
  InMemoryCache,
  ServerError,
} from "@apollo/client";
import { ErrorLink } from "@apollo/client/link/error";
import { API_URL } from "./urls";
import excludedRoutes from "./excluded-routes";
import { onLogout } from "../utils/logout";

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

const client = new ApolloClient({
  link: ApolloLink.from([logoutLink, httpLink]),
  cache: new InMemoryCache(),
});

export default client;

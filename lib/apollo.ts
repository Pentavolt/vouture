import { ApolloClient, ApolloLink, InMemoryCache, from } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { RetryLink } from "@apollo/client/link/retry";
import { createUploadLink } from "apollo-upload-client";
import { storage } from "./store";
import { isExpired } from "./utils";
import { RefreshDocument } from "../generated/gql/graphql";
import { API_URL } from "./constants";

const refreshLink = setContext(async (operation) => {
  const accessToken = storage.getString("jwt");
  const refreshToken = storage.getString("rwt");
  if (accessToken && isExpired(accessToken)) {
    if (!refreshToken) return operation;
    client
      .query({
        query: RefreshDocument,
        variables: { refreshToken: refreshToken },
        fetchPolicy: "network-only",
      })
      .then(({ data }) => {
        storage.set("jwt", data.refresh.accessToken);
        storage.set("rwt", data.refresh.refreshToken);
      })
      .catch((e) => console.error("ERR", e));
    return operation;
  }
});

const authLink = new ApolloLink((operation, forward) => {
  const token = storage.getString("jwt");
  operation.setContext(({ headers = {} }) => ({
    headers: {
      ...headers,
      Authorization: token ? `Bearer ${token}` : "",
      "Apollo-Require-Preflight": "true",
      "Content-Type": "application/json",
    },
  }));

  return forward(operation);
});

const retryLink = new RetryLink({
  delay: { initial: 300 },
  attempts: { max: 3, retryIf: (error, _operation) => !!error },
});

export const client = new ApolloClient({
  uri: API_URL,
  credentials: "include",
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          feed: {
            keyArgs: false,
            merge: (existing = {}, incoming) => ({ ...existing, ...incoming }),
          },
          familiar: {
            keyArgs: false,
            merge: (existing = {}, incoming) => {
              return { ...existing, ...incoming };
            },
          },
        },
      },
      Post: {
        fields: {
          likes: {
            keyArgs: false,
            merge: (_, incoming: any[]) => incoming,
          },
        },
      },
    },
  }),
  link: from([
    refreshLink,
    authLink,
    retryLink,
    createUploadLink({ uri: API_URL }),
  ]),
});

import { useFocusEffect } from "@react-navigation/native";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { AppState, AppStateStatus, BackHandler } from "react-native";
import { storage } from "./store";
import {
  LoginDocument,
  MeDocument,
  RegisterDocument,
  User,
} from "../generated/gql/graphql";
import { useLazyQuery, useMutation } from "@apollo/client";
import { client } from "./apollo";

interface AuthContextType {
  user?: User;
  loading: boolean;
  error?: any;
  login: (email: string, password: string) => void;
  register: (email: string, username: string, password: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

// Export the provider as we need to wrap the entire app with it.
export function AuthProvider({
  children,
}: {
  children: ReactNode;
}): JSX.Element {
  const [user, setUser] = useState<User>();
  const [error, setError] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingInitial, setLoadingInitial] = useState<boolean>(true);
  const [create] = useMutation(RegisterDocument);
  const [me] = useLazyQuery(MeDocument);
  const [mutate] = useMutation(LoginDocument);

  // Check if there is a currently active session
  // when the provider is mounted for the first time.

  // If there is an error, it means there is no session.

  // Finally, just signal the component that the initial load
  // is over.

  useEffect(() => {
    const value = storage.getString("session");
    if (!value) {
      setError("Please sign in.");
      setUser(undefined);
    } else {
      setUser(JSON.parse(value) as User);
    }

    setLoadingInitial(false);
  }, []);

  // Flags the component loading state and posts the login
  // data to the server.

  // An error means that the email/password combination is
  // not valid.

  // Finally, just signal the component that loading the
  // loading state is over.

  const login = async (email: string, password: string) => {
    // TODO: Test if this new login logic works.
    setLoading(true);
    mutate({
      variables: { email, password },
      onCompleted: async ({ login }) => {
        if (!login) throw new Error("Invalid credentials.");
        storage.set("jwt", login.accessToken);
        storage.set("rwt", login.refreshToken);

        const { data, error } = await me({
          fetchPolicy: "network-only",
        });

        if (error && error instanceof Error) throw new Error(error.message);
        if (!data) throw new Error("Invalid user.");
        storage.set("session", JSON.stringify(data.me));
        setUser(data.me as User);
        setLoading(false);
      },
    });
  };

  // Sends sign up details to the server. On success we just apply
  // the created user to the state.
  const register = async (
    email: string,
    username: string,
    password: string
  ) => {
    setLoading(true);
    create({
      variables: { email, password, username },
      onCompleted: async () => await login(email, password),
      onError: (e) => setError(e),
    });
  };

  // Call the logout endpoint and then remove the user
  // from the state.
  const logout = async () => {
    storage.delete("jwt");
    storage.delete("rwt");
    storage.delete("session");
    setUser(undefined);
    client.resetStore();
  };

  // Make the provider update only when it should.
  // We only want to force re-renders if the user,
  // loading or error states change.

  // Whenever the `value` passed into a provider changes,
  // the whole tree under the provider re-renders, and
  // that can be very costly! Even in this case, where
  // you only get re-renders when logging in and out
  // we want to keep things very performant.
  const memo = useMemo(
    () => ({
      user,
      loading,
      error,
      login,
      register,
      logout,
    }),
    [user, loading, error]
  );

  // We only want to render the underlying app after we
  // assert for the presence of a current user.

  return (
    <AuthContext.Provider value={memo}>
      {!loadingInitial && children}
    </AuthContext.Provider>
  );
}

// Let's only export the `useAuth` hook instead of the context.
// We only want to use the hook directly and never the context component.
export function useAuth() {
  return useContext(AuthContext);
}

export const useIsForeground = (): boolean => {
  const [isForeground, setIsForeground] = useState(true);

  useEffect(() => {
    const onChange = (state: AppStateStatus): void => {
      setIsForeground(state === "active");
    };
    const listener = AppState.addEventListener("change", onChange);
    return () => listener.remove();
  }, [setIsForeground]);

  return isForeground;
};

export function useRefreshOnFocus<T>(refetch: () => Promise<T>) {
  const first = useRef(true);

  useFocusEffect(
    useCallback(() => {
      if (first.current) {
        first.current = false;
        return;
      }

      refetch();
    }, [refetch])
  );
}

export const useBottomSheetBack = (open: boolean, onClose: () => void) => {
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        if (!open) return false;
        onClose();
        return true;
      };

      BackHandler.addEventListener("hardwareBackPress", onBackPress);
      return () => {
        BackHandler.removeEventListener("hardwareBackPress", onBackPress);
      };
    }, [open, onClose])
  );
};

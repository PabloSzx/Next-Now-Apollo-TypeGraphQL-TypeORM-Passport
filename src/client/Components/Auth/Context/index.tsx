import gql from "graphql-tag";
import { createContext, FunctionComponent, useEffect, useState } from "react";
import { useQuery } from "react-apollo";

import { User } from "../../../../server";

export const AuthContext = createContext({
  user: null,
  setUser: () => {},
  loading: true,
} as {
  user: User | null;
  setUser: (user: User | null) => void;
  loading: boolean;
});

export const Auth: FunctionComponent = ({ children }) => {
  const [user, setUser] = useState(null as User | null);

  const { loading, data } = useQuery<{
    current_user: User;
  }>(
    gql`
      query {
        current_user {
          email
          name
          admin
        }
      }
    `,
    { ssr: false }
  );

  useEffect(() => {
    if (data && data.current_user) {
      setUser(data.current_user);
    }
  }, [data]);

  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

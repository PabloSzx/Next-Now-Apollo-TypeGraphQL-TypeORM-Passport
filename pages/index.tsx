import gql from "graphql-tag";
import Head from "next/head";
import Link from "next/link";
import { useContext } from "react";
import { useMutation } from "react-apollo";

import { AuthContext } from "../src/client/Components/Auth/Context";

const Home = () => {
  const { user, setUser } = useContext(AuthContext);
  const [logout] = useMutation<boolean>(gql`
    mutation {
      logout
    }
  `);

  return (
    <div>
      <Head>
        <title>Homea</title>
      </Head>

      {user && <h1>Welcome {user.name}</h1>}
      <nav>
        {!user ? (
          <>
            <Link href="/login">
              <button>Login</button>
            </Link>
            <Link href="/sign_up">
              <button>Sign Up</button>
            </Link>
          </>
        ) : (
          <>
            {user.admin && (
              <Link href="/admin">
                <button>Admin Dashboard</button>
              </Link>
            )}
            <button
              type="button"
              onClick={async () => {
                await logout();

                setUser(null);
              }}
            >
              Logout
            </button>
          </>
        )}
      </nav>
    </div>
  );
};

export default Home;

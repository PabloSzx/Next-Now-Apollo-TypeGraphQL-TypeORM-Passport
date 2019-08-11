import gql from "graphql-tag";
import Link from "next/link";
import Router from "next/router";
import { useContext, useEffect, useState } from "react";
import { useMutation } from "react-apollo";

import { AuthContext } from "../src/client/Components/Auth/Context";
import { LoginInput, User } from "../src/server";

export default () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { user, setUser } = useContext(AuthContext);

  useEffect(() => {
    if (user) {
      Router.push("/");
    }
  }, [user]);

  const [signUp, { loading }] = useMutation<
    { login: User },
    { input: LoginInput }
  >(
    gql`
      mutation login($input: LoginInput!) {
        login(input: $input) {
          email
          name
          admin
        }
      }
    `,
    {
      variables: {
        input: {
          email,
          password,
        },
      },
    }
  );

  return (
    <div>
      <Link href="/">
        <button>Home</button>
      </Link>

      <form
        onSubmit={async ev => {
          ev.preventDefault();
          try {
            const data = await signUp({
              variables: {
                input: {
                  email,
                  password,
                },
              },
            });
            if (data && data.data) {
              setUser(data.data.login);
            }
          } catch (err) {
            window.alert(err);
          }
        }}
      >
        <input
          name="email"
          placeholder="email"
          onChange={({ target: { value } }) => setEmail(value)}
        />
        <input
          name="password"
          type="password"
          placeholder="password"
          onChange={({ target: { value } }) => setPassword(value)}
        />
        <button type="submit" disabled={loading}>
          Login
        </button>
      </form>
    </div>
  );
};

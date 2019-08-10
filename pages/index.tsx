import gql from "graphql-tag";
import Head from "next/head";
import { useQuery } from "react-apollo";

const Home = () => {
  const { loading, data } = useQuery(gql`
    query {
      books {
        title
      }
    }
  `);

  return (
    <div>
      <Head>
        <title>Home</title>
      </Head>

      {loading ? "Loading..." : JSON.stringify(data, null, 4)}
    </div>
  );
};

export default Home;

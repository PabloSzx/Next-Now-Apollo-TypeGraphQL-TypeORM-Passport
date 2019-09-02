import next from "next";
import notifier from "node-notifier";

import server from "./api/graphql";

const nextApp = next({ dev: process.env.NODE_ENV !== "production" });

const nextHandle = nextApp.getRequestHandler();

server.use((req, res) => nextHandle(req, res));

nextApp.prepare().then(() => {
  const port = process.env.PORT || 3000;

  server.listen({ port }, () => {
    const message = `Server Listening on port ${port}!`;
    console.log(message);
    if (process.env.NODE_ENV !== "production") {
      notifier.notify({
        title: "🚀  Server ready",
        message: `at http://localhost:${port}`,
      });
    }
  });
});

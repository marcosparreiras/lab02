import { app } from "./app";

app.listen({ port: Number(process.env.PORT) }).then(() => {
  console.log(`Http server is running on port ${process.env.PORT}`);
});

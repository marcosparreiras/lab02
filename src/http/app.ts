import fastify from "fastify";
import { Registry } from "../registry/registry";
import { SqlUserRepository } from "../adapters/sql-user-repository";
import { createUserController } from "./routes/create-user-controller";
import { getUserController } from "./routes/get-user-controller";
import { errorHandler } from "./middlewares/error-handles";
import { PostgresSQL } from "../adapters/postgres-sql";

const postgresSQL = new PostgresSQL(
  "postgres://admin:admin@localhost:5432/my_db"
);

const userRepository = new SqlUserRepository(postgresSQL);
Registry.getInstance().setUserRepository(userRepository);

export const app = fastify();

app.register(createUserController);
app.register(getUserController);
app.setErrorHandler(errorHandler);

import { randomUUID } from "node:crypto";
import { Client } from "pg";
import { app } from "../app";
import request from "supertest";

describe("GET /users/:id", () => {
  let databaseConnection: Client;
  beforeAll(async () => {
    await app.ready();
    databaseConnection = new Client(
      "postgres://admin:admin@localhost:5432/my_db"
    );
    await databaseConnection.connect();
  });

  afterEach(async () => {
    await databaseConnection.query("DELETE FROM users");
  });

  afterAll(async () => {
    await app.close();
    await databaseConnection.end();
  });

  it("Should be able to get a user by id", async () => {
    const user = {
      id: randomUUID(),
      name: "John Doe",
      email: "johndoe@example.com",
    };

    await databaseConnection.query(
      "INSERT INTO users(id, name, email) VALUES ($1, $2, $3)",
      [user.id, user.name, user.email]
    );
    const response = await request(app.server).get(`/users/${user.id}`);

    expect(response.status).toEqual(200);
    expect(response.body.user).toEqual(
      expect.objectContaining({
        id: user.id,
        name: user.name,
        email: user.email,
      })
    );
  });

  it("Should not be able to get an unexistent user", async () => {
    const id = randomUUID();
    const response = await request(app.server).get(`/users/${id}`);
    expect(response.status).toEqual(400);
    expect(response.body).toEqual(
      expect.objectContaining({
        message: expect.any(String),
      })
    );
  });
});

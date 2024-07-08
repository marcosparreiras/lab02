import { app } from "../app";
import request from "supertest";
import { Client } from "pg";
import { randomUUID } from "crypto";

describe("POST /users", () => {
  let databaseConnection: Client;
  beforeAll(async () => {
    await app.ready();
    databaseConnection = new Client(
      "postgres://admin:admin@localhost:5432/my_db"
    );
    await databaseConnection.connect();
  });

  beforeEach(async () => {
    await databaseConnection.query("DELETE FROM users");
  });

  afterAll(async () => {
    await app.close();
    await databaseConnection.end();
  });

  it("Should be able to create a user", async () => {
    const data = {
      name: "John Doe",
      email: "johndoe@example.com",
    };

    const response = await request(app.server).post("/users").send(data);

    expect(response.status).toEqual(201);

    const databaseQuery = await databaseConnection.query(
      "SELECT * FROM users WHERE id = $1",
      [response.body?.userId]
    );

    expect(databaseQuery.rows[0]).toEqual(
      expect.objectContaining({
        name: "John Doe",
        email: "johndoe@example.com",
        id: expect.any(String),
      })
    );
  });

  it("Should not be able to create a user with duplicate email", async () => {
    const email = "johndoe@example.com";
    await databaseConnection.query(
      "INSERT INTO users(id, name, email) VALUES($1, $2, $3)",
      [randomUUID(), "John Doe", email]
    );
    const data = {
      name: "Jany Doe",
      email,
    };
    const response = await request(app.server).post("/users").send(data);
    expect(response.status).toEqual(400);
    const databaseQuery = await databaseConnection.query(
      "SELECT * FROM users WHERE name = $1",
      [data.name]
    );
    expect(databaseQuery.rows).toHaveLength(0);
  });
});

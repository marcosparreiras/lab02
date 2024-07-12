import { app } from "../app";
import request from "supertest";
import { PostgresSQL } from "../../adapters/postgres-sql";
import { randomUUID } from "crypto";

describe("POST /users", () => {
  let sql: PostgresSQL;

  beforeAll(async () => {
    await app.ready();
    sql = new PostgresSQL("postgres://admin:admin@localhost:5432/my_db");
    await sql.query("DELETE FROM users", []);
  });

  beforeEach(async () => {
    await sql.query("BEGIN", []);
  });

  afterEach(async () => {
    await sql.query("ROLLBACK", []);
  });

  afterAll(async () => {
    await app.close();
  });

  it("Should be able to create a user", async () => {
    const data = {
      name: "John Doe",
      email: "johndoe@example.com",
    };

    const response = await request(app.server).post("/users").send(data);

    expect(response.status).toEqual(201);

    const databaseQuery = await sql.query("SELECT * FROM users WHERE id = $1", [
      response.body?.userId,
    ]);

    expect(databaseQuery[0]).toEqual(
      expect.objectContaining({
        name: "John Doe",
        email: "johndoe@example.com",
        id: expect.any(String),
      })
    );
  });

  it("Should not be able to create a user with duplicate email", async () => {
    const email = "johndoe@example.com";
    await sql.query("INSERT INTO users(id, name, email) VALUES($1, $2, $3)", [
      randomUUID(),
      "John Doe",
      email,
    ]);
    const data = {
      name: "Jany Doe",
      email,
    };
    const response = await request(app.server).post("/users").send(data);
    expect(response.status).toEqual(400);
    expect(response.body).toEqual(
      expect.objectContaining({
        message: expect.any(String),
      })
    );

    const databaseQuery = await sql.query(
      "SELECT * FROM users WHERE name = $1",
      [data.name]
    );
    expect(databaseQuery).toHaveLength(0);
  });
});

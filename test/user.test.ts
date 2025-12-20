import { describe, expect, it } from "vitest";
import app from "../src/index";
import User from "../src/models/UserModel";

// ********************
// user auth test
// ********************
describe("User API Test 1", () => {
  it("should not authenticate user", async () => {
    const res = await app.request("/api/user/auth", {
      method: "GET",
    });

    expect(res.status).toBe(401);
  });
});


describe("User API Test 2", () => {
  it("should authenticate user", async () => {
    const cookie =
      "auth_token=eyJhbGciOiJIUzI1NiJ9.eyJ1aWQiOiI2OTI4NDNiOGMzYzgwOTI4YjRiZTlmOTgiLCJyb2xlIjoiYWRtaW4iLCJleHAiOjE3NjYyOTgzNTl9.-bTuoOfVN3XkyW9chraU9tnt4FgPpDecxNibfObNVA4";

    const res = await app.request("/api/user/auth", {
      method: "GET",
      headers: {
        Cookie: cookie,
      },
    });

    expect(res.status).toBe(202);
  });
});

// ********************
// user login test
// ********************
describe("User API Test 3", () => {
  it("should not log in user", async () => {
    const res = await app.request("/api/user/login", {
      method: "POST",
      body: JSON.stringify({
        name: "wrong name",
        password: "wrong pass",
      }),
    });

    expect(res.status).toBe(401);
  });
});

// should log in user
describe("User API Test 4", () => {
  it("should log in user", async () => {
    const res = await app.request("/api/user/login", {
      method: "POST",
      body: JSON.stringify({
        name: "admin",
        password: "admin",
      }),
    });

    expect(res.status).toBe(200);
  });
});

// ********************
// user logout test
// ********************
describe("User API Test 5", () => {
  it("should not logout user", async () => {
    const cookie =
      "auth_token=eyJhbGciOiJIUzI1NiJ9.eyJ1aWQiOiI2OTI4NDNiOGMzYzgwOTI4YjRiZTlmOTgiLCJyb2xlIjoiYWRtaW4iLCJleHAiOjE3NjYyOTgzNTl9.-";

    const res = await app.request("/api/user/logout", {
      method: "DELETE",
      headers: {
        Cookie: cookie,
      },
    });

    expect(res.status).toBe(401);
  });
});

describe("User API Test 5", () => {
  it("should logout user", async () => {
    const cookie =
      "auth_token=eyJhbGciOiJIUzI1NiJ9.eyJ1aWQiOiI2OTI4NDNiOGMzYzgwOTI4YjRiZTlmOTgiLCJyb2xlIjoiYWRtaW4iLCJleHAiOjE3NjYyOTgzNTl9.-bTuoOfVN3XkyW9chraU9tnt4FgPpDecxNibfObNVA4";

    const res = await app.request("/api/user/logout", {
      method: "DELETE",
      headers: {
        Cookie: cookie,
      },
    });

    expect(res.status).toBe(200);
  });
});

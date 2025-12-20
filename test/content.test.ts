import { describe, it, expect } from "vitest";
import app from "../src/index";

// ********************
// content test (GET)
// ********************
describe("Content test 1", () => {
  it("should return data successfully", async () => {
    const page = "home";
    const contentType = "text";
    const res = await app.request(
      `/api/content?page=${page}&contentType=${contentType}`,
      {
        method: "GET",
      }
    );

    expect(res.status).toBe(200);
  });
});

//
describe("Content test 2", () => {
  it("should not return data", async () => {
    const page = "home";
    const contentType = "tex";
    const res = await app.request(
      `/api/content?page=${page}&contentType=${contentType}`,
      {
        method: "GET",
      }
    );

    expect(res.status).toBe(400);
  });
});

// ********************
// content test (POST)
// ********************
describe("Content test 3", () => {
  it("should not post data ", async () => {
    const page = "home";
    const contentType = "text";
    const blockType = "hero";
    const res = await app.request(
      `/api/content?page=${page}&contentType=${contentType}&blockType=${blockType}`,
      {
        method: "POST",
      }
    );

    expect(res.status).toBe(400);
  });
});

describe("Content test 4", () => {
  it("should post data successfully", async () => {
    const page = "home";
    const contentType = "text";
    const blockType = "hero";
    const res = await app.request(
      `/api/content?page=${page}&contentType=${contentType}&blockType=${blockType}`,
      {
        headers: { "content-type": "application/json" },
        method: "POST",
        body: JSON.stringify({
          title: "Advanced eCommerce Development",
          subtitle:
            "We build custom digital commerce platforms designed for performance, flexibility, and long-term growth.",
        }),
      }
    );

    expect(res.status).toBe(201);
  });
});

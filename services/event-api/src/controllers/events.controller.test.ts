import request from "supertest";
import { createApp } from "../app";
import { createEvent } from "../services/event.service";

// Mock the event service to avoid DB calls
jest.mock("../services/event.service");

const app = createApp();

describe("POST /events", () => {
  it("should accept a valid event", async () => {
    (createEvent as jest.Mock).mockResolvedValue({ id: "123" });

    const payload = {
      id: "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
      type: "USER_CREATED",
      version: 1,
      occurredAt: new Date().toISOString(),
      payload: { email: "test@example.com" },
    };

    const res = await request(app).post("/events").send(payload);

    expect(res.status).toBe(202);
    expect(res.body).toEqual({ message: "Event accepted for processing" });
    expect(createEvent).toHaveBeenCalled();
  });

  it("should reject invalid event schema", async () => {
    const payload = {
      type: "USER_CREATED", 
      // missing id, version, etc.
    };

    const res = await request(app).post("/events").send(payload);

    expect(res.status).toBe(400);
  });
});

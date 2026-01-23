import { sendEmail } from "./notification.handler";

describe("Worker Notification Handler", () => {
  it("should simulate email sending success (mostly)", async () => {
    // We can't easily test randomness deterministically without mocking Math.random
    // But we can check that it runs without immediate syntax errors.
    // For a real test, we'd mock Math.random to return > 0.2
    jest.spyOn(Math, "random").mockReturnValue(0.5); // > 0.2, so success

    const event = { id: "test-id", type: "TEST" };
    await expect(sendEmail(event)).resolves.not.toThrow();
  });

  it("should throw error on simulated failure", async () => {
    jest.spyOn(Math, "random").mockReturnValue(0.1); // < 0.2, so failure

    const event = { id: "test-id", type: "TEST" };
    await expect(sendEmail(event)).rejects.toThrow("Simulated Network Error");
  });
});

import { describe, it, expect } from "vitest";
import { promiseAllKeyed } from "./utils";

describe("promiseAllKeyed", () => {
  it("should resolve object with promises", async () => {
    const input = {
      a: Promise.resolve(1),
      b: Promise.resolve(2),
      c: 3,
    };
    const result = await promiseAllKeyed(input);
    expect(result).toEqual({ a: 1, b: 2, c: 3 });
  });

  it("should handle empty object", async () => {
    const result = await promiseAllKeyed({});
    expect(result).toEqual({});
  });

  it("should reject if one promise rejects", async () => {
    const input = {
      a: Promise.resolve(1),
      b: Promise.reject(new Error("fail")),
    };
    await expect(promiseAllKeyed(input)).rejects.toThrow("fail");
  });

  it("should preserve keys matching values", async () => {
    const input = {
      first: new Promise<string>((resolve) => setTimeout(() => resolve("first"), 10)),
      second: new Promise<string>((resolve) => setTimeout(() => resolve("second"), 5)),
    };
    const result = await promiseAllKeyed(input);
    expect(result).toEqual({ first: "first", second: "second" });
  });
});

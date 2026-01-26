import { test, expect } from "@playwright/test";

test.describe("Payment Resilience Flow", () => {
  test.beforeEach(async ({ page }) => {
    // Mock API responses
    await page.route("/api/v1/products", async (route) => {
      await route.fulfill({
        json: [{ id: 1, name: "Red Rose", price: 10000, stockQuantity: 10 }],
      });
    });

    // Mock Order Creation with Idempotency Key check
    await page.route("/api/v1/orders/direct", async (route) => {
      const headers = route.request().headers();
      if (!headers["idempotency-key"]) {
        return route.fulfill({ status: 400, body: "Missing Idempotency-Key" });
      }
      await route.fulfill({ json: { id: 123, status: "PENDING" } });
    });
  });

  test("should include Idempotency-Key in order request", async ({ page }) => {
    await page.goto("/products");

    // Select product and click "Direct Buy"
    await page.click("text=바로 구매");

    // Fill Checkout Form (Mock)
    await page.click("text=확인"); // Checkout Dialog Confirm

    // Select Payment Method
    await page.click("text=신용카드");

    // Intercept request to verify header
    const orderRequestPromise = page.waitForRequest(
      (req) => req.url().includes("/orders/direct") && req.method() === "POST"
    );

    await page.click('button:has-text("결제하기")');

    const request = await orderRequestPromise;
    expect(request.headers()["idempotency-key"]).toBeDefined();
    expect(request.headers()["idempotency-key"]).toMatch(/^[0-9a-f-]+$/); // UUID format
  });

  test("should show retry UI on payment failure", async ({ page }) => {
    // Setup Payment Failure Mock
    await page.route("/api/v1/payments/*", async (route) => {
      await route.fulfill({
        status: 500,
        json: { message: "Gateway Timeout" },
      });
    });

    await page.goto("/products");
    await page.click("text=바로 구매");
    await page.click("text=확인");

    // Try Payment
    await page.click('button:has-text("결제하기")');

    // Expect Error Message and Retry Button
    await expect(page.locator("text=결제에 실패했습니다")).toBeVisible();
    await expect(page.locator('button:has-text("재시도")')).toBeVisible();
  });
});

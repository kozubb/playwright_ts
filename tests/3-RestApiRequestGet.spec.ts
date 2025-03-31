import { test, expect, request } from "@playwright/test";

test("GET Request check product status", async ({ request }) => {
  const restApiUrl: string = "https://rest-api.qa24.s4d.eu";
  const activeProductId: number = 15;
  const inactiveProductId: number = 170;
  const activeProductStatus: any = await request.get(
    restApiUrl + "/api/v1/products/status?productIds=" + activeProductId,
    {
      headers: {
        apiKey: "7c6580a2-43d3-4e37-882f-34b28f20e9fd",
        Accept: "application/json",
      },
    }
  );
  expect(activeProductStatus.ok).toBeTruthy();
  expect(activeProductStatus.status()).toBe(200);
  const responseBody: any = await activeProductStatus.json();
  console.log(responseBody);
  expect(responseBody[0].id).toBe(activeProductId);
  expect(responseBody[0]).toHaveProperty("active", true);

  const inactiveProductStatus: any = await request.get(
    restApiUrl + "/api/v1/products/status?productIds=" + inactiveProductId,
    {
      headers: {
        apiKey: "7c6580a2-43d3-4e37-882f-34b28f20e9fd",
        Accept: "application/json",
      },
    }
  );
  expect(inactiveProductStatus.ok).toBeTruthy();
  expect(inactiveProductStatus.status()).toBe(200);
  const responseBody2: any = await inactiveProductStatus.json();
  console.log(responseBody2);
  expect(responseBody2[0].id).toBe(inactiveProductId);
  expect(responseBody2[0]).toHaveProperty("active", false);
});

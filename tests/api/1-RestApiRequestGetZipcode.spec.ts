import { test, expect, request } from "@playwright/test";

test("GET Request Zipcode", async ({ request }) => {
  const restApiUrl: string = "https://api.zippopotam.us/";
  const countryCode: string = "us";
  const zipCode: number = 28270;
  const country: string = "United States";
  const stateCode: string = "NC";
  const stateName: string = "North Carolina";
  const city: string = "Charlotte";
  const zipcodeRequestStatus: any = await request.get(
    restApiUrl + countryCode + "/" + zipCode,
    {
      headers: {
        Accept: "application/json",
      },
    }
  );
  expect(zipcodeRequestStatus.ok).toBeTruthy();
  expect(zipcodeRequestStatus.status()).toBe(200);
  const responseBody: any = await zipcodeRequestStatus.json();
  console.log(responseBody);
  expect(responseBody.country).toBe(country);
  expect(responseBody).toHaveProperty("country", country);
  expect(responseBody.places[0]).toHaveProperty("place name", city);
  expect(responseBody.places[0]).toHaveProperty(
    "state abbreviation",
    stateCode
  );
  expect(responseBody.places[0].state).toBe(stateName);
});

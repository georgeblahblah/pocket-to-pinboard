import fetch, { Response } from "node-fetch";
import { handler } from "./app";
const POCKET_ACCESS_TOKEN = "pat123";
const POCKET_CONSUMER_KEY = "pck987";
const PINBOARD_TOKEN = "pin456";

const mockConfig: Record<string, string> = {
  pocketAccessToken: POCKET_ACCESS_TOKEN,
  pocketConsumerKey: POCKET_CONSUMER_KEY,
  pinboardToken: PINBOARD_TOKEN,
};

jest.mock("./config", () => ({
  getConfigItem: async (key: string) => Promise.resolve(mockConfig[key]),
}));

jest.mock("node-fetch");
const fetchMock = fetch as jest.MockedFunction<typeof fetch>;

/*
This is an integration test. The config module and responses
from the Pocket & Pinboard APIs are mocked
*/
test("the handler should exit early if there are no bookmarks received from Pocket", async () => {
  fetchMock.mockResolvedValueOnce({
    ok: true,
    json: () =>
      Promise.resolve({
        list: {},
      }),
  } as Response);
  await handler();
  // assert the correct URL was passed to fetch
  expect(fetchMock.mock.calls[0][0]).toBe(`https://getpocket.com/v3/get`);
  // assert the correct query parameters were passed
  expect(fetchMock.mock.calls[0][1]).toEqual(
    expect.objectContaining({
      body: JSON.stringify({
        consumer_key: mockConfig.pocketConsumerKey,
        access_token: mockConfig.pocketAccessToken,
        state: "unread",
        sort: "oldest",
        detailType: "complete",
      }),
    })
  );
  expect(fetchMock).toHaveBeenCalledTimes(1);
});

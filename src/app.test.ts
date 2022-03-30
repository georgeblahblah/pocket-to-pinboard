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
  expect(fetchMock).toHaveBeenCalledWith(`https://getpocket.com/v3/get`);
});

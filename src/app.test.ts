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

const jsonResponse = (json: any): Response =>
  ({
    ok: true,
    json: () => Promise.resolve(json),
  } as Response);

jest.mock("./config", () => ({
  getConfigItem: async (key: string) => Promise.resolve(mockConfig[key]),
}));

jest.mock("node-fetch");
const fetchMock = fetch as jest.MockedFunction<typeof fetch>;

beforeEach(() => {
  jest.resetAllMocks();
});

/*
This is an integration test. The config module and responses
from the Pocket & Pinboard APIs are mocked
*/
test("the handler should exit early if there are no bookmarks received from Pocket", async () => {
  fetchMock.mockResolvedValueOnce(
    jsonResponse({
      list: {},
    })
  );
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

test("syncs bookmarks from Pocket to Pinboard", async () => {
  fetchMock.mockResolvedValueOnce(
    jsonResponse({
      list: {
        1: {
          item_id: "PocketID1",
          resolved_id: "1",
          given_url: "example.com",
          given_title: "Example Given",
          resolved_title: "Example Resolved",
          tags: {
            1: {
              item_id: "1",
              tag: "tag_name",
            },
          },
        },
      },
    })
  );

  fetchMock.mockResolvedValueOnce(
    jsonResponse({
      code: "done",
    })
  );

  fetchMock.mockResolvedValueOnce(jsonResponse({}));
  await handler();

  // assert request to Pinboard is correct
  const pinboardURL = new URL(fetchMock.mock.calls[1][0].toString());
  expect(pinboardURL.origin).toBe(`https://api.pinboard.in`);
  expect(pinboardURL.pathname).toBe(`/v1/posts/add`);
  expect(pinboardURL.searchParams.get("auth_token")).toBe(
    mockConfig.pinboardToken
  );
  expect(pinboardURL.searchParams.get("url")).toBe("example.com");
  expect(pinboardURL.searchParams.get("description")).toBe("Example Resolved");
  expect(pinboardURL.searchParams.get("shared")).toBe("no");
  expect(pinboardURL.searchParams.get("format")).toBe("json");
  expect(pinboardURL.searchParams.get("tags")).toBe("1");

  const archivePocketURL = new URL(fetchMock.mock.calls[2][0].toString());
  expect(archivePocketURL.origin).toBe(`https://getpocket.com`);
  expect(archivePocketURL.pathname).toBe(`/v3/send`);

  expect(archivePocketURL.searchParams.get("consumer_key")).toBe(
    mockConfig.pocketConsumerKey
  );
  expect(archivePocketURL.searchParams.get("access_token")).toBe(
    mockConfig.pocketAccessToken
  );

  expect(
    JSON.parse(archivePocketURL.searchParams.get("actions") ?? "")
  ).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        item_id: "PocketID1",
        action: "archive",
      }),
    ])
  );
});

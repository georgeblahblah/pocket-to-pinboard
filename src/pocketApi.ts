import fetch, { Request } from "node-fetch";

const apiBase = "https://getpocket.com/v3";

type PocketGet = {
  consumerKey: string;
  accessToken: string;
  state?: "unread" | "all";
  contentType?: "article";
  sort?: "newest" | "oldest";
  detailType?: "simple" | "complete";
};

type PocketItem = {
  itemId: "string";
  resolvedId: "string";
  givenUrl: "string";
  givenTitle: "string";
  resolvedTitle: "string";
};

type GetResponseItem = {
  item_id: string;
  resolved_id: string;
  given_url: string;
  given_title: string;
  resolved_title: string;
};

type GetResponse = {
  status: number;
  list: Record<string, GetResponseItem>;
};

// Endpoint documentation: https://getpocket.com/developer/docs/v3/retrieve
export async function get({
  consumerKey,
  accessToken,
  state = "unread",
  contentType = "article",
  sort = "oldest",
  detailType = "complete",
}: PocketGet): Promise<PocketItem[]> {
  const resp = await fetch(`${apiBase}/get`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      consumer_key: consumerKey,
      access_token: accessToken,
      state: state,
      contentType: contentType,
      sort,
      detailType: detailType,
    }),
  });
  // TODO: type check the response
  const json = (await resp.json()) as GetResponse;

  return Object.values(json.list).map(
    (responseItem) =>
      ({
        itemId: responseItem.item_id,
        resolvedId: responseItem.resolved_id,
        givenUrl: responseItem.given_url,
        givenTitle: responseItem.given_title,
        resolvedTitle: responseItem.resolved_title,
      } as PocketItem)
  );
}

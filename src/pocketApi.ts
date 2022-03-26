import fetch, { Request } from "node-fetch";

const apiBase = "https://getpocket.com/v3";

export type PocketGet = {
  consumerKey: string;
  accessToken: string;
  state?: "unread" | "all";
  contentType?: "article";
  sort?: "newest" | "oldest";
  detailType?: "simple" | "complete";
};

export type PocketItem = {
  itemId: "string";
  resolvedId: "string";
  givenUrl: "string";
  givenTitle: "string";
};

type GetResponseItem = {
  item_id: string;
  resolved_id: string;
  given_url: string;
  given_title: string;
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
  const url = new URL("/get", apiBase);
  const searchParams = url.searchParams;
  searchParams.set("consumer-key", consumerKey);
  searchParams.set("access-token", accessToken);
  searchParams.set("state", state);
  searchParams.set("contentType", contentType);
  searchParams.set("sort", sort);
  searchParams.set("detailType", detailType);

  const resp = await fetch(url.toString());
  // TODO: type check the response
  const json = (await resp.json()) as GetResponse;

  return Object.values(json.list).map(
    (responseItem) =>
      ({
        itemId: responseItem.item_id,
        resolvedId: responseItem.resolved_id,
        givenUrl: responseItem.given_url,
        givenTitle: responseItem.given_title,
      } as PocketItem)
  );
}

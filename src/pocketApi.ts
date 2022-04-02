import fetch from "node-fetch";
import { isEmptyString } from "./lib";

const apiBase = "https://getpocket.com/v3";

type AuthProps = {
  consumerKey: string;
  accessToken: string;
};

type GetRequestProps = AuthProps & {
  state?: "unread" | "all";
  sort?: "newest" | "oldest";
  detailType?: "simple" | "complete";
};

type ItemId = string;

type ArchiveRequestProps = AuthProps & {
  itemIds: ItemId[];
};

type PocketTag = {
  itemId: string;
  tag: string;
};

export type PocketItem = {
  itemId: string;
  resolvedId: string;
  givenUrl: string;
  givenTitle?: string;
  resolvedTitle?: string;
  tags: string[];
};

type GetResponseItem = {
  item_id: string;
  resolved_id: string;
  given_url: string;
  given_title: string;
  resolved_title: string;
  tags?: Record<string, PocketTag>;
};

type GetBookmarksResponse = {
  status: number;
  list?: Record<string, GetResponseItem>;
};

type ArchiveBookmarkError = {
  error: true;
};

type ArchiveBookmarkSuccess = {
  success: true;
};

type ArchiveBookmarkResult = ArchiveBookmarkError | ArchiveBookmarkSuccess;
type ArchiveBookmarkResponse = {
  status: number;
};

// Endpoint documentation: https://getpocket.com/developer/docs/v3/retrieve
export async function getBookmarks({
  consumerKey,
  accessToken,
  state = "unread",
  sort = "oldest",
  detailType = "complete",
}: GetRequestProps): Promise<PocketItem[]> {
  const resp = await fetch(`${apiBase}/get`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      consumer_key: consumerKey,
      access_token: accessToken,
      state: state,
      sort,
      detailType: detailType,
    }),
  });
  // TODO: type check the response
  const json = (await resp.json()) as GetBookmarksResponse;

  return Object.values(json.list ?? []).map(
    (responseItem) =>
      ({
        itemId: responseItem.item_id,
        resolvedId: responseItem.resolved_id,
        givenUrl: responseItem.given_url,
        givenTitle: !isEmptyString(responseItem.given_title)
          ? responseItem.given_title
          : undefined,
        resolvedTitle: !isEmptyString(responseItem.resolved_title)
          ? responseItem.resolved_title
          : undefined,
        tags: Object.keys(responseItem.tags ?? {}),
      } as PocketItem)
  );
}

export async function archiveBookmarks({
  consumerKey,
  accessToken,
  itemIds = [],
}: ArchiveRequestProps): Promise<ArchiveBookmarkResult> {
  const url = new URL(`${apiBase}/send`);
  url.searchParams.append("consumer_key", consumerKey);
  url.searchParams.append("access_token", accessToken);
  url.searchParams.append(
    "actions",
    JSON.stringify(
      itemIds.map((itemId) => ({
        item_id: itemId,
        action: "archive",
      }))
    )
  );
  const resp = await fetch(url.toString());
  const json = (await resp.json()) as ArchiveBookmarkResponse;
  if (json.status === 1) {
    return {
      success: true,
    } as ArchiveBookmarkSuccess;
  } else {
    return {
      error: true,
    } as ArchiveBookmarkError;
  }
}

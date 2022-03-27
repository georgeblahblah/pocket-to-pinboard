import fetch from "node-fetch";

const apiBase = "https://getpocket.com/v3";

type AuthProps = {
  consumerKey: string;
  accessToken: string;
};

type GetRequestProps = AuthProps & {
  state?: "unread" | "all";
  contentType?: "article";
  sort?: "newest" | "oldest";
  detailType?: "simple" | "complete";
};

type ItemId = string;

type ArchiveRequestProps = AuthProps & {
  itemIds: ItemId[];
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

type GetBookmarksResponse = {
  status: number;
  list: Record<string, GetResponseItem>;
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
  contentType = "article",
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
      contentType: contentType,
      sort,
      detailType: detailType,
    }),
  });
  // TODO: type check the response
  const json = (await resp.json()) as GetBookmarksResponse;

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
  const resp = await fetch(url.toString(), {
    headers: {
      "Content-Type": "application/json",
    },
  });
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

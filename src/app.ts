import { getConfigItem } from "./config";
import * as pocketApi from "./pocketApi";
import * as pinboardApi from "./pinboardApi";

export const handler = async () => {
  // get config for the pocket API
  const pocketAccessToken = await getConfigItem("pocketAccessToken");
  const pocketConsumerKey = await getConfigItem("pocketConsumerKey");

  // fetch unread bookmarks from pocket
  const pocketBookmarks = await pocketApi.getBookmarks({
    consumerKey: pocketConsumerKey,
    accessToken: pocketAccessToken,
  });

  // save the bookmarks to pinboard
  const pinboardToken = await getConfigItem("pinboardToken");
  pocketBookmarks.map(async (pb) => {
    const result = await pinboardApi.saveBookmark({
      authToken: `${pinboardToken}`,
      url: pb.givenUrl,
      description: pb.resolvedTitle,
    });
  });

  // archive the bookmarks in pocket
};

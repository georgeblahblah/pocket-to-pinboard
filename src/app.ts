import { getConfigItem } from "./config";
import { get as getFromPocket } from "./pocketApi";
import { saveBookmark as saveToPinboard } from "./pinboardApi";

export const handler = async () => {
  // get config for the pocket API
  const pocketAccessToken = await getConfigItem("pocketAccessToken");
  const pocketConsumerKey = await getConfigItem("pocketConsumerKey");

  // fetch unread bookmarks from pocket
  const pocketBookmarks = await getFromPocket({
    consumerKey: pocketConsumerKey,
    accessToken: pocketAccessToken,
  });

  // save the bookmarks to pinboard
  const pinboardToken = await getConfigItem("pinboardToken");
  pocketBookmarks.map(async (pb) => {
    const result = await saveToPinboard({
      authToken: `${pinboardToken}`,
      url: pb.givenUrl,
      description: pb.resolvedTitle,
    });
  });

  // mark the bookmarks as unread in pocket
};

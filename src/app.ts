import { getConfigItem } from "./config";
import { get as getFromPocket } from "./pocketApi";

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
  // mark the bookmarks as unread in pocket
};

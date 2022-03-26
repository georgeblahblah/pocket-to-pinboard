import { getConfigItem } from "./config";

export const handler = async () => {
  // get OAuth access token
  const pocketAccessToken = await getConfigItem("pocketAccessToken");
  // fetch unread bookmarks from pocket

  // save the bookmarks to pinboard
  // mark the bookmarks as unread in pocket
};

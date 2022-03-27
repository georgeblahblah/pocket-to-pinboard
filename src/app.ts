import { getConfigItem } from "./config";
import * as pocketApi from "./pocketApi";
import * as pinboardApi from "./pinboardApi";

export const handler = async () => {
  // get config for the pocket API
  const pocketAccessToken = await getConfigItem("pocketAccessToken");
  const pocketConsumerKey = await getConfigItem("pocketConsumerKey");

  // fetch unread bookmarks from pocket
  console.info("=> Fetching bookmarks from Pocket");
  const pocketBookmarks = await pocketApi.getBookmarks({
    consumerKey: pocketConsumerKey,
    accessToken: pocketAccessToken,
  });
  console.info(`=> Fetched ${pocketBookmarks.length} bookmarks from Pocket`);

  // save the bookmarks to pinboard
  console.info(`=> Adding bookmarks to Pinboard`);
  const pinboardToken = await getConfigItem("pinboardToken");
  pocketBookmarks.map(async (pb) => {
    const result = await pinboardApi.saveBookmark({
      authToken: `${pinboardToken}`,
      url: pb.givenUrl,
      description: pb.resolvedTitle,
    });
  });

  // archive the bookmarks in pocket
  console.info(`=> Archiving bookmarks in Pocket`);
  const pocketItemIdsToArchive = pocketBookmarks.map((pb) => pb.itemId);
  await pocketApi.archiveBookmarks({
    consumerKey: pocketAccessToken,
    accessToken: pocketAccessToken,
    itemIds: pocketItemIdsToArchive,
  });
  console.info(`=> Archived bookmarks in Pocket`);
};

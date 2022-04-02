import type { PocketItem } from "./pocketApi";

export const isEmptyString = (str: string | undefined = ""): boolean =>
  str.length == 0;

export const getDescription = (pocketBookmark: PocketItem): string => {
  if (pocketBookmark.resolvedTitle) return pocketBookmark.resolvedTitle;
  else if (pocketBookmark.givenTitle) return pocketBookmark.givenTitle;
  else return pocketBookmark.givenUrl;
};

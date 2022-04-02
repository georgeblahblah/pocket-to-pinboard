import { getDescription, isEmptyString } from "./lib";
import { PocketItem } from "./pocketApi";

test("isEmptyString should be false if input is not an empty string", () => {
  expect(isEmptyString("123")).toBeFalsy();
  expect(isEmptyString("abc")).toBeFalsy();
  expect(isEmptyString("ABC123&^^%")).toBeFalsy();
});

test("isEmptyString should return true if string is empty", () => {
  expect(isEmptyString("")).toBeTruthy();
  expect(isEmptyString()).toBeTruthy();
});

test("getDescription should return the correct value", () => {
  const pocketBookmarkNoTitle = {
    givenUrl: "test.com",
    itemId: "1",
    resolvedId: "1",
    tags: [],
  } as PocketItem;
  const resultA = getDescription(pocketBookmarkNoTitle);
  expect(resultA).toBe("test.com");

  const pocketBookmarkNoResolvedTitle = {
    givenUrl: "test.com",
    itemId: "1",
    resolvedId: "1",
    tags: [],
    givenTitle: "givenTitle",
  } as PocketItem;
  const resultB = getDescription(pocketBookmarkNoResolvedTitle);
  expect(resultB).toBe("givenTitle");

  const pocketBookmarkWithResolvedTitle = {
    givenUrl: "test.com",
    itemId: "1",
    resolvedId: "1",
    tags: [],
    resolvedTitle: "resolvedTitle",
  } as PocketItem;
  const resultC = getDescription(pocketBookmarkWithResolvedTitle);
  expect(resultC).toBe("resolvedTitle");
});

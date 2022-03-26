import fetch from "node-fetch";
const apiBase = "https://api.pinboard.in/v1";

type PinboardAuthRequest = {
  authToken: string;
};

export type PinboardSaveRequest = {
  url: string;
  description: string;
  shared?: boolean;
  tags?: string[];
  replace?: boolean;
};

type PinboardSaveSuccess = {
  success: true;
};
type PinboardSaveFail = {
  error: true;
};
type PinboardSaveResponse = PinboardSaveSuccess | PinboardSaveFail;

const success = (): PinboardSaveSuccess => ({
  success: true,
});

const fail = (): PinboardSaveFail => ({
  error: true,
});

export const saveBookmark = async ({
  url,
  description,
  shared = false,
  replace = false,
  tags = [],
  authToken,
}: PinboardSaveRequest &
  PinboardAuthRequest): Promise<PinboardSaveResponse> => {
  const apiUrl = new URL(`${apiBase}/posts/add`);
  apiUrl.searchParams.append("auth_token", authToken);
  apiUrl.searchParams.append("url", url);
  apiUrl.searchParams.append("description", description);
  apiUrl.searchParams.append("shared", shared ? "yes" : "no");
  apiUrl.searchParams.append("replace", replace ? "yes" : "no");
  apiUrl.searchParams.append("format", "json");
  if (tags.length) {
    apiUrl.searchParams.append("tags", tags.join(","));
  }
  const resp = await fetch(`${apiUrl.toString()}`, {
    headers: {
      Accept: "application/json",
    },
  });

  const json = (await resp.json()) as { code: string };

  if (json.code === "done") return success();
  else return fail();
};

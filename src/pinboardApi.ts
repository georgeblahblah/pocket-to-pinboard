import fetch from "node-fetch";
const apiBase = "https://api.pinboard.in/v1";

type PinboardAuthRequest = {
  authToken: string;
};

type PinboardSaveRequest = {
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

const includes = (a: string) => (b: string) => a === b;

const saveBookmark = async ({
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
  apiUrl.searchParams.append("shared", shared ? "yes" : "no");
  apiUrl.searchParams.append("replace", replace ? "yes" : "no");
  apiUrl.searchParams.append("format", "json");
  if (description) {
    apiUrl.searchParams.append("description", description);
  }

  if (tags.some(includes("toread"))) {
    apiUrl.searchParams.append("toread", "yes");
  }

  if (tags.length) {
    apiUrl.searchParams.append(
      "tags",
      tags.filter((v) => !includes("toread")(v)).join(",")
    );
  }
  const resp = await fetch(`${apiUrl.toString()}`);

  const json = (await resp.json()) as { code: string };

  if (json.code === "done") return success();
  else return fail();
};

export const createPinboardApi = (authToken: string) => ({
  saveBookmark: (props: PinboardSaveRequest) =>
    saveBookmark({ ...props, authToken }),
});

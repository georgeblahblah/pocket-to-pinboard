const pocketAccessToken = process.env.POCKET_ACCESS_TOKEN || "";

const config = new Map<string, string>().set(
  "pocketAccessToken",
  pocketAccessToken
);

export const getConfigItem = (key: string): Promise<string> => {
  const configItem = config.get(key);
  if (configItem) {
    return Promise.resolve(configItem);
  } else {
    throw new Error(`No value for key ${key}`);
  }
};

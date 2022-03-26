const pocketAccessToken = process.env.POCKET_ACCESS_TOKEN || "";
const pocketConsumerKey = process.env.POCKET_CONSUMER_KEY || "";
const pinboardToken = process.env.PINBOARD_TOKEN || "";

const config = new Map<string, string>();
config.set("pocketAccessToken", pocketAccessToken);
config.set("pocketConsumerKey", pocketConsumerKey);
config.set("pinboardToken", pinboardToken);

export const getConfigItem = (key: string): Promise<string> => {
  const configItem = config.get(key);
  if (configItem) {
    return Promise.resolve(configItem);
  } else {
    throw new Error(`No value for key ${key}`);
  }
};

import { SSMClient, GetParametersCommand } from "@aws-sdk/client-ssm";

type Config = Record<string, string>;
let state: Config;

const AWS_REGION = "eu-west-2";
const parameterPathPrefix = "/pocketToPinboard/";

const makeParameterPaths = (parameterNames: string[]): string[] =>
  parameterNames.map(
    (parameterName) => `${parameterPathPrefix}${parameterName}`
  );

const ssmClient = new SSMClient({
  region: AWS_REGION,
});

const parameterPaths = makeParameterPaths([
  "pocketAccessToken",
  "pocketConsumerKey",
  "pinboardToken",
]);

const fetchConfigFromSSM = async (): Promise<Config> => {
  if (state) {
    return Promise.resolve(state);
  }
  const command = new GetParametersCommand({
    Names: parameterPaths,
    WithDecryption: true,
  });

  const response = await ssmClient.send(command);
  response.Parameters?.forEach((parameter) => {
    const maybeParameterName = parameter.Name;
    if (maybeParameterName !== undefined) {
      state[maybeParameterName] = parameter.Value!.replace(
        parameterPathPrefix,
        ""
      );
    }
  });
  return state;
};

export const getConfigItem = async (key: string): Promise<string> => {
  const conf: Config = await fetchConfigFromSSM();
  if (conf[key]) {
    return conf[key];
  } else {
    throw new Error(`No value for key ${key}`);
  }
};

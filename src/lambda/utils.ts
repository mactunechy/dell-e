import { Configuration, OpenAIApi } from "openai";
import * as AWS from "aws-sdk";
import {
  SecretsManagerClient,
  GetSecretValueCommand,
} from "@aws-sdk/client-secrets-manager";

const ssm = new AWS.SSM();
const OPENAI_SECRET_NAME = "dell-e/openai";

const getOpenaiSecret = async () => {
  const client = new SecretsManagerClient({ region: "us-west-1" });
  const command = new GetSecretValueCommand({
    SecretId: OPENAI_SECRET_NAME,
  });
  const smResponse = (await client.send(command)) as any;
  console.log("smResponse", smResponse);
  return JSON.parse(smResponse.SecretString);
};

export const generateImage = async (prompt: string) => {
  try {
    const secret = await getOpenaiSecret();

    const configuration = new Configuration({
      apiKey: secret.api_key,
    });
    const openai = new OpenAIApi(configuration);

    const response = await openai.createImage({
      prompt: prompt,
      n: 1,
      size: "1024x1024",
      response_format: "b64_json",
    });
    return { b64_image: response.data.data[0].b64_json };
  } catch (err) {
    console.log("Failed to generate image", err);
    return { error: true, message: err };
  }
};

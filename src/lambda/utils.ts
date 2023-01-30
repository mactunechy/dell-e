import { Configuration, OpenAIApi } from "openai";
import * as AWS from "aws-sdk";

const ssm = new AWS.SSM();
const OPENAI_SECRET_NAME = "dell-e/openai";

export const generateImage = async (prompt: string) => {
  try {
    const getSecretResult = await ssm
      .getParameter({ Name: OPENAI_SECRET_NAME })
      .promise();

    const secretJson = getSecretResult.Parameter?.Value;
    const secret = JSON.parse(secretJson as string);

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

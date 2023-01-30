import { Configuration, OpenAIApi } from "openai";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import {
  SecretsManagerClient,
  GetSecretValueCommand,
} from "@aws-sdk/client-secrets-manager";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";

const s3 = new S3Client({ region: "us-west-1" });
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

    console.log("secret", secret);

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

    console.log("response", response);

    return { b64_image: response.data.data[0].b64_json };
  } catch (err) {
    console.log("Failed to generate image", err);
    return { error: true, message: err };
  }
};

export const saveImageToS3 = async (b64_image: string) => {
  const bucketName = process.env.BUCKET_NAME;
  const imageName = `${uuidv4()}.jpg`;

  const imageBuffer = Buffer.from(b64_image, "base64");

  const params = {
    Bucket: bucketName,
    Key: imageName,
    Body: imageBuffer,
  };

  const command = new PutObjectCommand(params);

  try {
    const url = await getSignedUrl(s3, command, {});
    console.log("url", url);
    return { imageUrl: url };
  } catch (error) {
    console.log("failed to save image", error);
    throw error;
  }
};

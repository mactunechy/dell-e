import { Configuration, OpenAIApi } from "openai";

import {
  SecretsManagerClient,
  GetSecretValueCommand,
} from "@aws-sdk/client-secrets-manager";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";
import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";

const s3 = new S3Client({ region: "us-west-1" });
const dynamo = new DynamoDBClient({ region: "us-west-1" });
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

  try {
    const key = `images/${Date.now()}`;

    const result = await s3.send(
      new PutObjectCommand({
        Bucket: bucketName,
        Key: key,
        Body: imageBuffer,
        ACL: "public-read",
      })
    );

    return { imageUrl: `https://${bucketName}.s3.amazonaws.com/${key}` };
  } catch (err) {
    console.log("Failed to upload", err);
    return { error: true, message: err };
  }
};

export const savePostToDynamo = async (post: {
  prompt: string;
  author: string;
  imageUrl: string;
}) => {
  const tableName = process.env.TABLE_NAME;

  const params = {
    TableName: tableName,
    Item: {
      pk: { S: uuidv4() },
      prompt: { S: post.prompt },
      author: { S: post.author },
      imageUrl: { S: post.imageUrl },
    },
  };

  try {
    const result = await dynamo.send(new PutItemCommand(params));
    console.log("save post result", result);
    return { result };
  } catch (err) {
    console.log("Failed to save post", err);
    return { error: true, message: err };
  }
};

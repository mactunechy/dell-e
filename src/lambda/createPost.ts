import { APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda";
import { generateImage, saveImageToS3, savePostToDynamo } from "./utils";

interface IEventBody {
  prompt: string;
  author: string;
  shouldSave: boolean;
}

export const handler = async (
  event: APIGatewayEvent
): Promise<APIGatewayProxyResult> => {
  try {
    console.log("event", event);
    const body: IEventBody = JSON.parse(event.body as string);
    const { prompt, author, shouldSave } = body;
    const generateImageResult = await generateImage(prompt);

    if (generateImageResult.error)
      throw new Error(generateImageResult.message as string);

    const { imageUrl } = await saveImageToS3(
      generateImageResult.b64_image as string
    );

    if (shouldSave && imageUrl)
      await savePostToDynamo({ prompt, author, imageUrl });

    return {
      statusCode: 200,
      body: JSON.stringify({ imageUrl, author, prompt }),
    };
  } catch (error) {
    console.log(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: { message: error } }),
    };
  }
};

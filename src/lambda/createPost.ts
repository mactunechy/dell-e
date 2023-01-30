import { APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda";
import { generateImage } from "./utils";

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
    const image = await generateImage(prompt);

    console.log("image", image);

    return {
      statusCode: 200,
      body: JSON.stringify({ image, author, shouldSave }),
    };
  } catch (error) {
    console.log(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: { message: error } }),
    };
  }
};

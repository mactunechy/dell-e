import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";
import { APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda";

export const handler = async (
  event: APIGatewayEvent
): Promise<APIGatewayProxyResult> => {
  const tableName = process.env.TABLE_NAME;
  try {
    const client = new DynamoDBClient({ region: "us-west-1" });
    const result = await client.send(new ScanCommand({ TableName: tableName }));

    return {
      statusCode: 200,
      body: JSON.stringify(result.Items),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: { message: error } }),
    };
  }
};

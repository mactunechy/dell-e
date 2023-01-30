import { StackProps, Stack } from "aws-cdk-lib";
import { Construct } from "constructs";
import { ApiGatewayStack } from "./api-getway-stack";
import { DynamoStack } from "./dynamo-stack";
import { LambdaStack } from "./lambda-stack";
import { S3BucketStack } from "./s3-bucket-stack";

export class DellEStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const bucketsStack = new S3BucketStack(this, "S3BucketStack");
    const dynamodbStack = new DynamoStack(this, "DynamoStack");

    const lambdaStack = new LambdaStack(this, "LambdaStack", {
      aiImagesBucket: bucketsStack.aiImagesBucket,
      delletable: dynamodbStack.delletable,
    });

    new ApiGatewayStack(this, "ApiGatewayStack", {
      getAllPostsLambda: lambdaStack.getAllPostsLambda,
    });
  }
}

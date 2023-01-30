import { StackProps, Stack } from "aws-cdk-lib";
import { Construct } from "constructs";
import { ApiGatewayStack } from "./api-getway-stack";
import { DynamoStack } from "./dynamo-stack";
import { LambdaStack } from "./lambda-stack";
import { S3BucketStack } from "./s3-bucket-stack";

export class DellEStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const lambdaStack = new LambdaStack(this, "LambdaStack");

    const bucketsStack = new S3BucketStack(this, "S3BucketStack", {
      getAllPostsLambda: lambdaStack.getAllPostsLambda,
    });
    const dynamodbStack = new DynamoStack(this, "DynamoStack", {
      getAllPostsLambda: lambdaStack.getAllPostsLambda,
    });

    new ApiGatewayStack(this, "ApiGatewayStack", {
      getAllPostsLambda: lambdaStack.getAllPostsLambda,
    });
  }
}

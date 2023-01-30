import {
  Stack,
  StackProps,
  aws_lambda_nodejs as lambda_nodejs,
  aws_lambda as lambda,
  Duration,
} from "aws-cdk-lib";
import { Construct } from "constructs";
import * as path from "path";

export class LambdaStack extends Stack {
  public readonly getAllPostsLambda: lambda_nodejs.NodejsFunction;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    this.getAllPostsLambda = new lambda_nodejs.NodejsFunction(
      this,
      "GetAllPostsLambda",
      {
        memorySize: 1024,
        timeout: Duration.seconds(5),
        runtime: lambda.Runtime.NODEJS_16_X,
        handler: "handler",
        entry: path.join(__dirname, `/../src/lambda/getAllPosts.ts`),
      }
    );
  }
}

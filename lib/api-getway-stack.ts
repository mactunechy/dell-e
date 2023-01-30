import {
  Stack,
  StackProps,
  aws_apigateway as apigw,
  aws_lambda as lambda,
  aws_logs as logs,
} from "aws-cdk-lib";
import { Construct } from "constructs";

interface ApiGatewayStackProps extends StackProps {
  getAllPostsLambda: lambda.IFunction;
  createPostLambda: lambda.IFunction;
}

export class ApiGatewayStack extends Stack {
  constructor(scope: Construct, id: string, props: ApiGatewayStackProps) {
    super(scope, id, props);

    const api = new apigw.RestApi(this, "api", {
      description: "delle-e api gateway",
      cloudWatchRole: true,
      deployOptions: {
        stageName: "dev",
        loggingLevel: apigw.MethodLoggingLevel.INFO,
      },
      // 👇 enable CORS
      defaultCorsPreflightOptions: {
        allowHeaders: [
          "Content-Type",
          "X-Amz-Date",
          "Authorization",
          "X-Api-Key",
        ],
        allowMethods: ["OPTIONS", "GET", "POST", "PUT", "PATCH", "DELETE"],
        allowCredentials: true,
        allowOrigins: ["http://localhost:3000"],
      },
    });

    const posts = api.root.addResource("posts");
    posts.addMethod(
      "GET",
      new apigw.LambdaIntegration(props.getAllPostsLambda, { proxy: true })
    );
    posts.addMethod(
      "POST",
      new apigw.LambdaIntegration(props.createPostLambda, { proxy: true })
    );
  }
}

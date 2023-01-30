import {
  Stack,
  StackProps,
  aws_apigateway as apigw,
  aws_lambda as lambda,
} from "aws-cdk-lib";
import { Construct } from "constructs";

interface ApiGatewayStackProps extends StackProps {
  getAllPostsLambda: lambda.IFunction;
}

export class ApiGatewayStack extends Stack {
  constructor(scope: Construct, id: string, props: ApiGatewayStackProps) {
    super(scope, id, props);

    const api = new apigw.LambdaRestApi(this, "DellEAPI", {
      proxy: false,
      handler: props.getAllPostsLambda,
    });

    const getAllPostsEndpoint = api.root.addResource("posts");
    getAllPostsEndpoint.addMethod(
      "GET",
      new apigw.LambdaIntegration(props.getAllPostsLambda)
    );
  }
}

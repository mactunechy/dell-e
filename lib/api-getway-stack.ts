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

    new apigw.LambdaRestApi(this, "DellEAPI", {
      handler: props.getAllPostsLambda,
    });
  }
}

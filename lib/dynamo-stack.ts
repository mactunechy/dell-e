import {
  Stack,
  aws_dynamodb as dynamodb,
  aws_lambda as lambda,
  StackProps,
} from "aws-cdk-lib";
import { Construct } from "constructs";

interface DynamoStackProps extends StackProps {
  getAllPostsLambda: lambda.IFunction;
}

export class DynamoStack extends Stack {
  public readonly delletable: dynamodb.Table;
  constructor(scope: Construct, id: string, props: DynamoStackProps) {
    super(scope, id);

    this.delletable = new dynamodb.Table(this, "DelleTable", {
      partitionKey: { name: "pk", type: dynamodb.AttributeType.STRING },
      sortKey: { name: "prompt", type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
    });

    this.delletable.addGlobalSecondaryIndex({
      indexName: "prompt-index",
      partitionKey: { name: "prompt", type: dynamodb.AttributeType.STRING },
      sortKey: { name: "pk", type: dynamodb.AttributeType.STRING },
    });

    this.delletable.grantReadData(props.getAllPostsLambda);
  }
}

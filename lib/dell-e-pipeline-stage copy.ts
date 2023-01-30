import { StackProps, Stage } from "aws-cdk-lib";
import { Construct } from "constructs";
import { DynamoStack } from "./dynamo-stack";
import { S3BucketStack } from "./s3-bucket-stack";

export class DellEPipelineStage extends Stage {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const bucketsStack = new S3BucketStack(this, "S3BucketStack");
    const dynamodbStack = new DynamoStack(this, "DynamoStack");
  }
}

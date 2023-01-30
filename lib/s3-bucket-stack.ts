import {
  Stack,
  StackProps,
  aws_s3 as s3,
  aws_lambda as lambda,
} from "aws-cdk-lib";
import { Construct } from "constructs";

export class S3BucketStack extends Stack {
  public readonly aiImagesBucket: s3.Bucket;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    this.aiImagesBucket = new s3.Bucket(this, "MyBucket", {
      bucketName: "dell-e-ai-images",
      publicReadAccess: true,
    });
  }
}

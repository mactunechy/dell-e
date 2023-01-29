import {
  Stack,
  StackProps,
}  from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { S3BucketStack } from './s3-bucket-stack';

export class DellEStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const bucketsStack =  new S3BucketStack(this, 'S3BucketStack')

  }
}

import {
  Stack,
  StackProps,
  aws_lambda_nodejs as lambda_nodejs,
  aws_lambda as lambda,
  Duration,
  aws_s3 as s3,
  aws_dynamodb as dynamo,
  aws_secretsmanager as ssm,
} from "aws-cdk-lib";
import { Construct } from "constructs";
import * as path from "path";

interface LambdaStackProps extends StackProps {
  aiImagesBucket: s3.IBucket;
  delletable: dynamo.ITable;
}

export class LambdaStack extends Stack {
  public readonly getAllPostsLambda: lambda_nodejs.NodejsFunction;
  public readonly createPostLambda: lambda_nodejs.NodejsFunction;

  constructor(scope: Construct, id: string, props: LambdaStackProps) {
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
        environment: {
          BUCKET_NAME: props.aiImagesBucket.bucketName,
          TABLE_NAME: props.delletable.tableName,
        },
      }
    );

    this.createPostLambda = new lambda_nodejs.NodejsFunction(
      this,
      "CreatePostsLambda",
      {
        memorySize: 1024,
        //TODO: do investigations to get an optimal timeout
        timeout: Duration.seconds(15),
        runtime: lambda.Runtime.NODEJS_16_X,
        handler: "handler",
        entry: path.join(__dirname, `/../src/lambda/createPost.ts`),
        environment: {
          BUCKET_NAME: props.aiImagesBucket.bucketName,
          TABLE_NAME: props.delletable.tableName,
        },
      }
    );

    // Grant the lambda permission to read from the bucket
    props.aiImagesBucket.grantRead(this.getAllPostsLambda);

    // Grant the lambda permission to read from the table
    props.delletable.grantReadWriteData(this.createPostLambda);

    const openaiSecret = ssm.Secret.fromSecretNameV2(
      this,
      "OpenaiSecret",
      "dell-e/openai"
    );

    // Grant the lambda permission to read from the secret
    openaiSecret.grantRead(this.createPostLambda);
  }
}

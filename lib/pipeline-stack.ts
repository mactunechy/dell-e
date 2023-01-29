import {
  aws_codepipeline as codepipeline,
  aws_codepipeline_actions as codepipeline_actions,
  SecretValue,
  Stack,
  StackProps,
} from "aws-cdk-lib";
import { Construct } from "constructs";

export class PipelineStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const pipeline = new codepipeline.Pipeline(this, "DellEPipeline", {
      pipelineName: "DellEPipeline",
    });

    const sourceOutput = new codepipeline.Artifact();
    const sourceAction = new codepipeline_actions.GitHubSourceAction({
      actionName: "GitHub_Source",
      owner: "mactunechy",
      repo: "aws-cdk",
      oauthToken: SecretValue.secretsManager("dell-e/github-token"),
      output: sourceOutput,
      branch: "main", // default: 'master'
    });
    pipeline.addStage({
      stageName: "Source",
      actions: [sourceAction],
    });
  }
}

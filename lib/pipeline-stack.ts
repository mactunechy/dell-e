import {
  aws_codepipeline as codepipeline,
  aws_codepipeline_actions as codepipeline_actions,
  SecretValue,
  Stack,
  StackProps,
  aws_codebuild as codebuild,
} from "aws-cdk-lib";
import { Construct } from "constructs";
import { DellEStack } from "./dell-e-stack";

export class PipelineStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // Retrieve the source code from GitHub
    const sourceOutput = new codepipeline.Artifact();
    const sourceAction = new codepipeline_actions.GitHubSourceAction({
      actionName: "GitHub_Source",
      owner: "mactunechy",
      repo: "dell-e",
      oauthToken: SecretValue.secretsManager("dell-e/github-token"),
      output: sourceOutput,
      branch: "main", // default: 'master'
    });

    // Build the source code
    const project = new codebuild.PipelineProject(this, "MyProject");

    const buildAction = new codepipeline_actions.CodeBuildAction({
      actionName: "CodeBuild",
      project,
      input: sourceOutput,
      outputs: [new codepipeline.Artifact()], // optional
      executeBatchBuild: true, // optional, defaults to false
      combineBatchBuildArtifacts: true, // optional, defaults to false
    });

    new codepipeline.Pipeline(this, "DellEPipeline", {
      pipelineName: "DellEPipeline",
      stages: [
        {
          stageName: "Source",
          actions: [sourceAction],
        },
        {
          stageName: "Deploy",
          actions: [buildAction],
        },
      ],
    });
  }
}

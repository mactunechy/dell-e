import {
  aws_codepipeline as codepipeline,
  Stack,
  StackProps,
} from "aws-cdk-lib";
import { Construct } from "constructs";
import {
  CodeBuildStep,
  CodePipeline,
  CodePipelineSource,
} from "aws-cdk-lib/pipelines";
import { DellEPipelineStage } from "./dell-e-pipeline-stage";

export class PipelineStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const pipeline = new CodePipeline(this, "BlogPipeline", {
      pipelineName: "DellEPipeline",
      synth: new CodeBuildStep("SynthStep", {
        input: CodePipelineSource.connection("mactunechy/dell-e", "main", {
          connectionArn:
            "arn:aws:codestar-connections:us-west-1:280031520882:connection/7079e53f-e482-4e95-9c48-60a5a7502c45",
        }),
        installCommands: ["npm install -g aws-cdk"],
        commands: ["npm ci", "npm run build", "npx cdk synth"],
      }),
    });

    pipeline.addStage(new DellEPipelineStage(this, "Deploy"));
  }
}

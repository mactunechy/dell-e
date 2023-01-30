import { StackProps, Stage } from "aws-cdk-lib";
import { Construct } from "constructs";
import { DellEStack } from "./dell-e-stack";

export class DellEPipelineStage extends Stage {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    //Instantiate the dell-e-stack of resources
    new DellEStack(this, "DellEStack");
  }
}

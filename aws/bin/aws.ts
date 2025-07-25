#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import 'source-map-support/register';
import { SurfBuddyStack } from '../lib/aws-stack';
import * as dotenv from "dotenv";

dotenv.config();
const app = new cdk.App();

console.log(
  "Deploying to env: ",
  process.env.ENVIRONMENT === "prod" ? "prod" : "dev"
);
new SurfBuddyStack(
  app,
  (process.env.ENVIRONMENT === "prod" ? "prod" : "dev") + "SurfBuddy",
  process.env.ENVIRONMENT === "prod",
  {
    env: {
      account:
        process.env.ENVIRONMENT === "prod"
          ? process.env.PROD_ACCOUNT
          : process.env.DEV_ACCOUNT,
      region: "eu-west-1",
    },
  }
);
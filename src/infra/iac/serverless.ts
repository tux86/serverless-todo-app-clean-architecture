import type { AWS } from '@serverless/typescript'

import { functions } from '@/infra/iac/functions'
import { defaultIam } from '@/infra/iac/iam/defaultIam'
import { resources } from '@/infra/iac/ressources'

export const serverlessConfiguration: AWS = {
  service: 'todo-api',
  frameworkVersion: '3',
  useDotenv: true,
  configValidationMode: 'error',
  plugins: ['serverless-esbuild', 'serverless-offline'],
  package: { individually: true },
  provider: {
    name: 'aws',
    runtime: 'nodejs18.x',
    stage: '${opt:stage, "dev"}',
    region: '${env:AWS_REGION}' as AWS['provider']['region'],
    architecture: 'arm64',
    memorySize: 128,
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000'
    },
    iam: defaultIam()
  },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node18',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
      watch: {
        pattern: ['src/**/*.ts']
      }
    }
  },
  functions: functions(),
  resources: resources()
}

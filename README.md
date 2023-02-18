# S3PublicStack

Creates an `S3` private stack from the contents of `./web`, which is then published via a public `CloudFront` `CDN`.
By default it is done inside the `eu-central-1` region.

The `cdk.json` file tells the CDK Toolkit how to execute your app.

## Useful commands

* `npm run build`   compile typescript to js
* `npm run watch`   watch for changes and compile
* `npm run test`    perform the jest unit tests
* `cdk deploy`      deploy this stack to your default AWS account/region
* `cdk diff`        compare deployed stack with current state
* `cdk synth`       emits the synthesized CloudFormation template

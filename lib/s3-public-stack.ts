import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';
import { BucketEncryption } from 'aws-cdk-lib/aws-s3';
import { CfnOutput, RemovalPolicy } from 'aws-cdk-lib';
import { Distribution, OriginAccessIdentity } from 'aws-cdk-lib/aws-cloudfront';
import { S3Origin } from 'aws-cdk-lib/aws-cloudfront-origins';

export class S3PublicStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Let's create a bucket where we store the website's contents
    const bucket = new s3.Bucket(this, 'WebSiteContents', {
      bucketName: 'web-site-contents',
      versioned: false,
      accessControl: s3.BucketAccessControl.PRIVATE,
      encryption: BucketEncryption.S3_MANAGED,
      removalPolicy: RemovalPolicy.DESTROY
    });

    const originAccessIdentity = new OriginAccessIdentity(this, 'WebSiteOriginAccess');
    // Grant read for CloudFront
    bucket.grantRead(originAccessIdentity);

    // Upload the ./web folder to our bucket
    new s3deploy.BucketDeployment(this, 'WebSiteDeployment', {
      sources: [s3deploy.Source.asset('./web')],
      destinationBucket: bucket
    });

    // Create a CloudFront distrobution
    const distrobution = new Distribution(this, 'WebSiteDistrobution', {
      defaultRootObject: 'index.html',
      defaultBehavior: {
        origin: new S3Origin(bucket, { originAccessIdentity })
      }
    })

    new CfnOutput(this, 'Bucket', { value: bucket.bucketName });
    new CfnOutput(this, 'Domain name', { value: distrobution.domainName });
  }
}

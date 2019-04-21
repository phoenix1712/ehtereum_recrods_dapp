var bucketName = 'csce678-project';
var bucketRegion = 'us-east-1';
var IdentityPoolId = 'us-east-1:873474e2-ee37-45eb-8212-66ecb38280ea';

AWS.config.update({
  region: bucketRegion,
  credentials: new AWS.CognitoIdentityCredentials({
    IdentityPoolId: IdentityPoolId
  })
});

var s3 = new AWS.S3({
  apiVersion: '2006-03-01',
  params: {Bucket: bucketName}
});

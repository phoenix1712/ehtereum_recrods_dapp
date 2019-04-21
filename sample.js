// Load the SDK and UUiID

var fs=require('fs');
/*
var PDFParser=require('pdf2json');
var pdfFilePath = './grade.pdf'
var PDFDocument = require('pdfkit');

if (fs.existsSync(pdfFilePath)) {
  //Read the content of the pdf from the downloaded path
  var pdfParser = new PDFParser(this,1);
  pdfParser.on("pdfParser_dataError", function (errData) {
     console.error(errData.parserError)
  });
  pdfParser.on("pdfParser_dataReady", function (pdfData) {
  //console.log('here is the content: '+pdfParser.getRawTextContent());
  pdf_data = pdfParser.getRawTextContent();
  //console.log('body'+data)
  });

  pdfParser.loadPDF(pdfFilePath);
} else {
    console.log('OOPs file not present in the downloaded folder');
    //Throw an error if the file is not found in the path mentioned
    browser.assert.ok(fs.existsSync(pdfFilePath));
}
*/

var AWS = require('aws-sdk');
var uuid = require('uuid');
const s3 = new AWS.S3();

// Create unique bucket name
var bucketName = 'csce678-final-1'
// Create name for uploaded object key
var keyName = 'hello.txt';

//const fs = require('fs');
var content;
// First I want to read the file

fs.readFile('./hello_world.txt', function read(err, data) {
    if (err) {
        throw err;
    }
    content = data;

    // Invoke the next step here however you like
    console.log(content);   // Put all of the code here (not the best solution)
	// Or put the next step in a function and invoke it
});


// Create a promise on S3 service object
var bucketPromise = new AWS.S3({apiVersion: '2006-03-01'}).createBucket({Bucket: bucketName}).promise();

// Handle promise fulfilled/rejected states
bucketPromise.then(
  function(data) {
    // Create params for putObject call
    //var objectParams = {Bucket: bucketName, Key: keyName, Body: 'output.pdf', ContentType : 'application/pdf', ContentDisposition: 'attachment'};
    var objectParams = {Bucket: bucketName, Key: keyName, Body: content};
    var uploadPromise = new AWS.S3({apiVersion: '2006-03-01'}).putObject(objectParams).promise();
    uploadPromise.then(
      function(data) {
        console.log("Successfully uploaded data to " + bucketName + "/" + keyName);
      });
}).catch(
  function(err) {
    console.error(err, err.stack);
});

//var s3 = new AWS.S3();
s3.getObject(
  { Bucket: "csce678-final-1", Key: "hello.txt" },
  function (error, data) {
    if (error != null) {
      console.log("Failed to retrieve an object: " + error);
    } else {
      console.log("Loaded " + data.ContentLength + " bytes");
      console.log(data.Body);
      // do something with data.Body
    }
  }
);

/*
const s3 = new AWS.S3();
document = new PDFDocument();

document.pipe(fs.createWriteStream('output.pdf'));
document.end();
document.on('end', function () {
  fs.readFile('output.pdf', function (err, data) {
    if (err) {
      console.log(err);
    }
    s3.upload({
      Bucket: 'csce678-final',
      Key: 'grade.pdf',
      Body: data,
      ContentType: 'application/pdf',
      acl: 'private',
      contentDisposition: 'attachment',
      ServerSideEncryption: 'AES256'
    }, function(err, data) {
      if (err) {
        console.log(err);
      }
    });
  });
});

*/

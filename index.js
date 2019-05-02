web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"))
var account;
web3.eth.getAccounts().then((f) => {
 account = f[0];
})

abi = JSON.parse('[{"constant":true,"inputs":[{"name":"studentID","type":"uint64"},{"name":"password","type":"bytes16"}],"name":"fetchRecord","outputs":[{"name":"","type":"bytes16"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"authID","type":"bytes32"}],"name":"validAuthority","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"authID","type":"bytes32"},{"name":"studentID","type":"uint64"},{"name":"record","type":"bytes16"},{"name":"password","type":"bytes16"}],"name":"updateRecord","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"studentID","type":"uint64"},{"name":"oldPassword","type":"bytes16"},{"name":"newPassword","type":"bytes16"}],"name":"updatePassword","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"studentID","type":"uint64"},{"name":"password","type":"bytes16"}],"name":"passwordAuth","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"authIDs","type":"bytes32[]"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"}]')

contract = new web3.eth.Contract(abi);
contract.options.address = "0xD957b6c533459a66981eEAF01cb7699fdEc9b061";
// update this contract address with your contract address

AWS.config.credentials.get(function(err) {
    if (err) alert(err);
    console.log(AWS.config.credentials);
});

var bucketName = 'csce678-project'; // Enter your bucket name
var bucket = new AWS.S3({
    params: {
        Bucket: bucketName
    }
});

var pdfDataURL;
var pdfHash;

function updateRecord() {
 student = $("#student").val();
 auth = $("#auth").val();
 password = md5($("#password").val());

 if(typeof pdfHash === 'undefined' || pdfHash === "" || student === ""){
   if(student === ""){
     alert("Enter Student ID.");
   } else if(typeof pdfHash === 'undefined' || pdfHash === ""){
     alert("Upload a file.");
   } else {
      alert("Enter Student ID, \n Upload a file.");
   }
 } else {
   contract.methods.updateRecord(web3.utils.asciiToHex(auth), student, "0x"+pdfHash, "0x"+password).send({from: account}).then((f) => {
     alert("Record has been updated.")
     var keyName = student + '.txt';
     content = pdfDataURL;
     var params = {
         Key: keyName,
         Body: content,
         ACL: 'public-read'
     };
     bucket.putObject(params, function(err, data) {
         if (err) {
             results.innerHTML = 'ERROR: ' + err;
         } else {
             console.log(data);
         }
     });
   });

 }
}

function fetchRecord() {
 student = $("#student").val();
 password = md5($("#password").val());
 contract.methods.fetchRecord(student, "0x"+password).call().then((pdfHashFetched) => {
   bucket.getObject({
       Key: student+'.txt'
   }, function(err, data) {
     if (err) {
         alert("The file has been tampered.");
     } else {
       var pdfDataURL = new TextDecoder("utf-8").decode(data.Body);
       if("0x"+md5(pdfDataURL) == pdfHashFetched) {
         var pdfAsArray = convertDataURIToBinary(pdfDataURL);
         var pdfjsLib = window['pdfjs-dist/build/pdf'];
         downloadFile(new Blob([pdfAsArray]), student+".pdf");
       } else {
         alert("The file has been tampered.");
       }
     }
   });
 }).catch((error) => {
    console.log('Error occurred!', error);
    alert("Check your Student ID and password!");
 });
}

function updatePassword() {
   student = $("#studentID").val();
   oldPassword = md5($("#oldPassword").val());
   newPassword = md5($("#newPassword").val());
   contract.methods.updatePassword(student, "0x"+oldPassword, "0x"+newPassword).send({from: account}).then((f) => {
     alert("Password has been updated.")
   });
}

function uploadFile(){
  var file = document.getElementById("record_file").files[0];
  getAsText(file);
}

function getAsText(readFile) {
  var reader = new FileReader();
  reader.readAsDataURL(readFile);
  reader.onload = loaded;
}

function loaded(evt) {
  pdfDataURL = evt.target.result;
  pdfHash = md5(pdfDataURL);
}

function convertDataURIToBinary(dataURI) {
  var BASE64_MARKER = ';base64,';
  var base64Index = dataURI.indexOf(BASE64_MARKER) + BASE64_MARKER.length;
  var base64 = dataURI.substring(base64Index);
  var raw = window.atob(base64);
  var rawLength = raw.length;
  var array = new Uint8Array(new ArrayBuffer(rawLength));

  for(var i = 0; i < rawLength; i++) {
    array[i] = raw.charCodeAt(i);
  }
  return array;
}

const downloadFile = (blob, fileName) => {
  const link = document.createElement('a');
  // create a blobURI pointing to our Blob
  link.href = URL.createObjectURL(blob);
  link.download = fileName;
  // some browser needs the anchor to be in the doc
  document.body.append(link);
  link.click();
  link.remove();
  // in case the Blob uses a lot of memory
  window.addEventListener('focus', e=>URL.revokeObjectURL(link.href), {once:true});
};
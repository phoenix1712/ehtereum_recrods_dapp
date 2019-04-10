web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"))
var account;
web3.eth.getAccounts().then((f) => {
 account = f[0];
})

abi = JSON.parse('[{"constant":false,"inputs":[{"name":"authID","type":"bytes32"},{"name":"studentID","type":"uint256"},{"name":"record","type":"bytes16"}],"name":"updateRecord","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"authID","type":"bytes32"}],"name":"validAuthority","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"studentList","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"studentID","type":"uint256"}],"name":"fetchRecord","outputs":[{"name":"","type":"bytes16"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"studentID","type":"uint256"}],"name":"validStudent","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"authList","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"studentRecords","outputs":[{"name":"","type":"bytes16"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"authIDs","type":"bytes32[]"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"}]')

contract = new web3.eth.Contract(abi);
contract.options.address = "0x831E2a73428Fe5058513Eb0AAF2546b9f49E7279";
// update this contract address with your contract address

var pdfDataURL;
var pdfHash;


function updateRecord() {
 student = $("#student").val();
 auth = $("#auth").val();

 if(typeof pdfHash === 'undefined' || pdfHash === "" || student === ""){
   if(student === ""){
     alert("Enter Student ID.");
   } else if(typeof pdfHash === 'undefined' || pdfHash === ""){
     alert("Upload a file.");
   } else {
      alert("Enter Student ID, \n Upload a file.");
   }
 } else {
   contract.methods.updateRecord(web3.utils.asciiToHex(auth), student, "0x"+pdfHash).send({from: account}).then((f) => {
     alert("Record has been updated.")
     // S3.put(pdfDataURL);
     // pdfDataURL = "";
     // pdfHash = "";
     // $("#record_file").replaceWith($("#record_file").val('').clone(true));
   });

 }
}

function fetchRecord() {
 student = $("#student").val();
 var pdfHashFetched;
 contract.methods.fetchRecord(student).call().then((pdfHashFetched) => {
   // pdfDataURL = S3.get()
   if("0x"+md5(pdfDataURL) == pdfHashFetched) {
     var pdfAsArray = convertDataURIToBinary(pdfDataURL);
     var pdfjsLib = window['pdfjs-dist/build/pdf'];
     downloadFile(new Blob([pdfAsArray]), student+".pdf");
   } else {
     alert("The file has been tampered.");
   }
 })
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

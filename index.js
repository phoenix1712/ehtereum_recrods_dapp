web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"))
var account;
web3.eth.getAccounts().then((f) => {
 account = f[0];
})

abi = JSON.parse('[{"constant":false,"inputs":[{"name":"authID","type":"bytes32"},{"name":"studentID","type":"uint256"},{"name":"record","type":"uint256"}],"name":"updateRecord","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"authID","type":"bytes32"}],"name":"validAuthority","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"studentList","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"studentID","type":"uint256"}],"name":"fetchRecord","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"studentID","type":"uint256"}],"name":"validStudent","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"authList","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"studentRecords","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"authIDs","type":"bytes32[]"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"}]')

contract = new web3.eth.Contract(abi);
contract.options.address = "0x332ddbC8Da9EA94156b3cAD84C42237935c116a7";
// update this contract address with your contract address

var pdfDataURL;
var pdfHash;


function updateRecord() {
 student = $("#student").val();
 auth = $("#auth").val();
 record = $("#record").val();
 console.log(student);

 contract.methods.updateRecord(web3.utils.asciiToHex(auth), student,record).send({from: account}).then((f) => {
   $("#record").val("");
 })
}

function fetchRecord() {
 student = $("#student").val();
 console.log(student);

 contract.methods.fetchRecord(student).call().then((f) => {
   $("#record").val(f);
 })

 var pdfAsArray = convertDataURIToBinary(pdfDataURL);
 var pdfjsLib = window['pdfjs-dist/build/pdf'];
 downloadFile(new Blob([pdfAsArray]), student+".pdf");
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

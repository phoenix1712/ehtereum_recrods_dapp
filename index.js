web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"))
var account;
web3.eth.getAccounts().then((f) => {
 account = f[0];
})

abi = JSON.parse('[{"constant":false,"inputs":[{"name":"authID","type":"bytes32"},{"name":"studentID","type":"uint256"},{"name":"record","type":"uint256"}],"name":"updateRecord","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"authID","type":"bytes32"}],"name":"validAuthority","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"studentList","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"studentID","type":"uint256"}],"name":"fetchRecord","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"studentID","type":"uint256"}],"name":"validStudent","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"authList","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"studentRecords","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"authIDs","type":"bytes32[]"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"}]')

contract = new web3.eth.Contract(abi);
contract.options.address = "0x44526aa031f4C4b5Fcd0Db2c474E6110882B97D1";
// update this contract address with your contract address

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
}

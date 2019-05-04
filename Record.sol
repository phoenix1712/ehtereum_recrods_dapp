
pragma solidity >=0.4.0 <0.6.0;
// We have to specify what version of compiler this code will compile with

library Library {
  struct data {
     bytes16 record;
     bytes16 password;
     bool isValue;
   }
}

contract Record {
  using Library for Library.data;
  mapping(uint64 => Library.data) studentRecords;
  mapping(bytes32 => bool) authList;

  constructor(bytes32[] memory authIDs) public {
    for(uint i = 0; i < authIDs.length; i++) {
      authList[authIDs[i]] = true;
    }
  }

  function fetchRecord(uint64 studentID, bytes16 password) view public returns (bytes16) {
    require(validStudent(studentID));
    require(passwordAuth(studentID, password));
    return studentRecords[studentID].record;
  }

  function updateRecord(bytes32 authID, uint64 studentID, bytes16 record, bytes16 password) public {
    require(validAuthority(authID));
    if(!validStudent(studentID)){
      studentRecords[studentID].isValue = true;
    }
    studentRecords[studentID].password = password;
    studentRecords[studentID].record = record;
  }

  function updatePassword(uint64 studentID, bytes16 oldPassword, bytes16 newPassword) public{
    require(validStudent(studentID));
    require(passwordAuth(studentID, oldPassword));
    studentRecords[studentID].password = newPassword;
  }

  function validStudent(uint64 studentID) view private returns (bool) {
    return studentRecords[studentID].isValue;
  }

  function passwordAuth(uint64 studentID, bytes16 password) view public returns (bool) {
    return studentRecords[studentID].password == password;
  }

  function validAuthority(bytes32 authID) view public returns (bool) {
    return authList[authID];
  }
}

pragma solidity >=0.4.0 <0.6.0;
// We have to specify what version of compiler this code will compile with

library Library {
  struct data {
     bytes16 record;
     bytes16 password;
   }
}

contract Record {
  using Library for Library.data;
  mapping(uint64 => Library.data) studentRecords;

  uint64[] public studentList;
  bytes32[] public authList;

  constructor(bytes32[] memory authIDs) public {
    authList = authIDs;
  }

  function fetchRecord(uint64 studentID, bytes16 password) view public returns (bytes16) {
    require(validStudent(studentID));
    require(passwordAuth(studentID, password));
    return studentRecords[studentID].record;
  }

  function updateRecord(bytes32 authID, uint64 studentID, bytes16 record, bytes16 password) public {
    require(validAuthority(authID));
    if(!validStudent(studentID)){
      studentList.push(studentID);
    }
    studentRecords[studentID].password = password;
    studentRecords[studentID].record = record;
  }

  function updatePassword(uint64 studentID, bytes16 oldPassword, bytes16 newPassword) public{
    require(validStudent(studentID));
    if(studentRecords[studentID].password == oldPassword){
      studentRecords[studentID].password = newPassword;
    }
  }

  function validStudent(uint64 studentID) view public returns (bool) {
    for(uint i = 0; i < studentList.length; i++) {
      if (studentList[i] == studentID) {
        return true;
      }
    }
    return false;
  }

  function passwordAuth(uint64 studentID, bytes16 password) view public returns (bool) {
    if(studentRecords[studentID].password == password) {
      return true;
    }
    return false;
  }

  function validAuthority(bytes32 authID) view public returns (bool) {
    for(uint i = 0; i < authList.length; i++) {
      if (authList[i] == authID) {
        return true;
      }
    }
    return false;
  }
}

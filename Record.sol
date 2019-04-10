pragma solidity >=0.4.0 <0.6.0;
// We have to specify what version of compiler this code will compile with

contract Record {

  mapping (uint256 => bytes16) public studentRecords;

  uint256[] public studentList;
  bytes32[] public authList;

  constructor(bytes32[] memory authIDs) public {
    authList = authIDs;
  }

  function fetchRecord(uint256 studentID) view public returns (bytes16) {
    require(validStudent(studentID));
    return studentRecords[studentID];
  }

  function updateRecord(bytes32 authID, uint256 studentID, bytes16 record) public {
    require(validAuthority(authID));
    if(!validStudent(studentID)){
      studentList.push(studentID);  
    }
    studentRecords[studentID] = record;
  }

  function validStudent(uint256 studentID) view public returns (bool) {
    for(uint i = 0; i < studentList.length; i++) {
      if (studentList[i] == studentID) {
        return true;
      }
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

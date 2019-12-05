import React from 'react';
import ReactDOM from 'react-dom';
import DiffList from './diffList';

const sampleData = {
  "sections": {
    "ids": [
      "ECS-032A-A01",
      "ECS-032A-A02",
      "ECS-032A-A03",
      "ECS-032A-A04",
      "ECS-032A-A05",
      "ECS-032A-A06",
    ],
    "sectionsKeyById": {
      "268526": "ECS-032A-A01",
      "268527": "ECS-032A-A02",
      "268528": "ECS-032A-A03",
      "268529": "ECS-032A-A04",
      "268530": "ECS-032A-A05",
      "268531": "ECS-032A-A06",
    },
    "list": {
      "ECS-032A-A01": {
        "id": 268526,
        "sectionGroupId": 222353,
        "uniqueKey": "ECS-032A-A01",
        "title": "Intro to Programming",
        "crn": "62294",
        "subjectCode": "ECS",
        "courseNumber": "032A",
        "sequenceNumber": "A01",
        "seats": 50,
        "instructors": [
          {
            "uniqueKey": "nhanford",
            "firstName": "Nathan",
            "lastName": "Hanford",
            "loginId": "nhanford",
            "ucdStudentSID": null,
            "noRemote": true
          },
          {
            "uniqueKey": "kstevens",
            "firstName": "Kristian",
            "lastName": "Stevens",
            "loginId": "KSTEVENS",
            "ucdStudentSID": "804894344",
            "noLocal": true
          }
        ],
        "activities": [
          {
            "id": 417068,
            "uniqueKey": "ECS-032A-A-A-1",
            "typeCode": "A",
            "bannerLocation": null,
            "dayIndicator": "0010100",
            "startTime": "1510",
            "endTime": "1630"
          },
          {
            "id": 417067,
            "uniqueKey": "ECS-032A-A01-D-1",
            "typeCode": "D",
            "bannerLocation": null,
            "dayIndicator": "0001000",
            "startTime": "1210",
            "endTime": "1300",
            "dwChanges": {
              "bannerLocation": {
                "isToDo": false,
                "value": "HOAGLD 00113"
              },
              "dayIndicator": {
                "isToDo": true,
                "value": "0100000"
              },
              "startTime": {
                "isToDo": false,
                "value": "1310"
              },
              "endTime": {
                "isToDo": false,
                "value": "1400"
              }
            }
          }
        ],
        "dwHasChanges": true,
        "dwChanges": {
          "seats": {
            "isToDo": false,
            "value": 49
          }
        },
        "groupHead": true
      },
      "ECS-032A-A02": {
        "id": 268527,
        "sectionGroupId": 222353,
        "uniqueKey": "ECS-032A-A02",
        "title": "Intro to Programming",
        "crn": "62295",
        "subjectCode": "ECS",
        "courseNumber": "032A",
        "sequenceNumber": "A02",
        "seats": 50,
        "instructors": [
          {
            "uniqueKey": "nhanford",
            "firstName": "Nathan",
            "lastName": "Hanford",
            "loginId": "nhanford",
            "ucdStudentSID": null,
            "noRemote": true
          },
          {
            "uniqueKey": "kstevens",
            "firstName": "Kristian",
            "lastName": "Stevens",
            "loginId": "KSTEVENS",
            "ucdStudentSID": "804894344",
            "noLocal": true
          }
        ],
        "activities": [
          {
            "id": 417068,
            "uniqueKey": "ECS-032A-A-A-1",
            "typeCode": "A",
            "bannerLocation": null,
            "dayIndicator": "0010100",
            "startTime": "1510",
            "endTime": "1630"
          },
          {
            "id": 417069,
            "uniqueKey": "ECS-032A-A02-D-1",
            "typeCode": "D",
            "bannerLocation": null,
            "dayIndicator": "0010000",
            "startTime": "0800",
            "endTime": "0850",
            "dwChanges": {
              "bannerLocation": {
                "isToDo": false,
                "value": "OLSON 00251"
              },
              "startTime": {
                "isToDo": false,
                "value": "1000"
              },
              "endTime": {
                "isToDo": false,
                "value": "1050"
              }
            }
          }
        ],
        "dwHasChanges": true,
        "dwChanges": {
          "seats": {
            "isToDo": false,
            "value": 49
          }
        },
        "groupHead": true
      },
      "ECS-032A-A03": {
        "id": 268528,
        "sectionGroupId": 222353,
        "uniqueKey": "ECS-032A-A03",
        "title": "Intro to Programming",
        "crn": "62296",
        "subjectCode": "ECS",
        "courseNumber": "032A",
        "sequenceNumber": "A03",
        "seats": 50,
        "instructors": [
          {
            "uniqueKey": "nhanford",
            "firstName": "Nathan",
            "lastName": "Hanford",
            "loginId": "nhanford",
            "ucdStudentSID": null,
            "noRemote": true
          },
          {
            "uniqueKey": "kstevens",
            "firstName": "Kristian",
            "lastName": "Stevens",
            "loginId": "KSTEVENS",
            "ucdStudentSID": "804894344",
            "noLocal": true
          }
        ],
        "activities": [
          {
            "id": 417068,
            "uniqueKey": "ECS-032A-A-A-1",
            "typeCode": "A",
            "bannerLocation": null,
            "dayIndicator": "0010100",
            "startTime": "1510",
            "endTime": "1630"
          },
          {
            "id": 417070,
            "uniqueKey": "ECS-032A-A03-D-1",
            "typeCode": "D",
            "bannerLocation": null,
            "dayIndicator": "0100000",
            "startTime": "1410",
            "endTime": "1500",
            "dwChanges": {
              "bannerLocation": {
                "isToDo": false,
                "value": "HOAGLD 00113"
              },
              "dayIndicator": {
                "isToDo": false,
                "value": "0001000"
              },
              "startTime": {
                "isToDo": false,
                "value": "1310"
              },
              "endTime": {
                "isToDo": false,
                "value": "1400"
              }
            }
          }
        ],
        "dwHasChanges": true,
        "dwChanges": {
          "seats": {
            "isToDo": false,
            "value": 48
          }
        },
        "groupHead": true
      },
      "ECS-032A-A04": {
        "id": 268529,
        "sectionGroupId": 222353,
        "uniqueKey": "ECS-032A-A04",
        "title": "Intro to Programming",
        "crn": "62297",
        "subjectCode": "ECS",
        "courseNumber": "032A",
        "sequenceNumber": "A04",
        "seats": 50,
        "instructors": [
          {
            "uniqueKey": "nhanford",
            "firstName": "Nathan",
            "lastName": "Hanford",
            "loginId": "nhanford",
            "ucdStudentSID": null,
            "noRemote": true
          },
          {
            "uniqueKey": "kstevens",
            "firstName": "Kristian",
            "lastName": "Stevens",
            "loginId": "KSTEVENS",
            "ucdStudentSID": "804894344",
            "noLocal": true
          }
        ],
        "activities": [
          {
            "id": 417068,
            "uniqueKey": "ECS-032A-A-A-1",
            "typeCode": "A",
            "bannerLocation": null,
            "dayIndicator": "0010100",
            "startTime": "1510",
            "endTime": "1630"
          },
          {
            "id": 417071,
            "uniqueKey": "ECS-032A-A04-D-1",
            "typeCode": "D",
            "bannerLocation": null,
            "dayIndicator": "0100000",
            "startTime": "1710",
            "endTime": "1800",
            "dwChanges": {
              "bannerLocation": {
                "isToDo": false,
                "value": "BAINER 01132"
              },
              "dayIndicator": {
                "isToDo": false,
                "value": "0001000"
              },
              "startTime": {
                "isToDo": false,
                "value": "1810"
              },
              "endTime": {
                "isToDo": false,
                "value": "1900"
              }
            }
          }
        ],
        "dwHasChanges": true,
        "dwChanges": {
          "seats": {
            "isToDo": false,
            "value": 48
          }
        },
        "groupHead": true
      },
      "ECS-032A-A05": {
        "id": 268530,
        "sectionGroupId": 222353,
        "uniqueKey": "ECS-032A-A05",
        "title": "Intro to Programming",
        "crn": "62298",
        "subjectCode": "ECS",
        "courseNumber": "032A",
        "sequenceNumber": "A05",
        "seats": 50,
        "instructors": [
          {
            "uniqueKey": "nhanford",
            "firstName": "Nathan",
            "lastName": "Hanford",
            "loginId": "nhanford",
            "ucdStudentSID": null,
            "noRemote": true
          },
          {
            "uniqueKey": "kstevens",
            "firstName": "Kristian",
            "lastName": "Stevens",
            "loginId": "KSTEVENS",
            "ucdStudentSID": "804894344",
            "noLocal": true
          }
        ],
        "activities": [
          {
            "id": 417068,
            "uniqueKey": "ECS-032A-A-A-1",
            "typeCode": "A",
            "bannerLocation": null,
            "dayIndicator": "0010100",
            "startTime": "1510",
            "endTime": "1630"
          },
          {
            "id": 417072,
            "uniqueKey": "ECS-032A-A05-D-1",
            "typeCode": "D",
            "bannerLocation": null,
            "dayIndicator": "0001000",
            "startTime": "1610",
            "endTime": "1700",
            "dwChanges": {
              "bannerLocation": {
                "isToDo": false,
                "value": "OLSON 00251"
              },
              "dayIndicator": {
                "isToDo": false,
                "value": "0000100"
              },
              "startTime": {
                "isToDo": false,
                "value": "1100"
              },
              "endTime": {
                "isToDo": false,
                "value": "1150"
              }
            }
          }
        ],
        "dwHasChanges": true,
        "dwChanges": {
          "seats": {
            "isToDo": false,
            "value": 48
          }
        },
        "groupHead": true
      },
      "ECS-032A-A06": {
        "id": 268531,
        "sectionGroupId": 222353,
        "uniqueKey": "ECS-032A-A06",
        "title": "Intro to Programming",
        "crn": "62299",
        "subjectCode": "ECS",
        "courseNumber": "032A",
        "sequenceNumber": "A06",
        "seats": 50,
        "instructors": [
          {
            "uniqueKey": "nhanford",
            "firstName": "Nathan",
            "lastName": "Hanford",
            "loginId": "nhanford",
            "ucdStudentSID": null,
            "noRemote": true
          },
          {
            "uniqueKey": "kstevens",
            "firstName": "Kristian",
            "lastName": "Stevens",
            "loginId": "KSTEVENS",
            "ucdStudentSID": "804894344",
            "noLocal": true
          }
        ],
        "activities": [
          {
            "id": 417068,
            "uniqueKey": "ECS-032A-A-A-1",
            "typeCode": "A",
            "bannerLocation": null,
            "dayIndicator": "0010100",
            "startTime": "1510",
            "endTime": "1630"
          },
          {
            "id": 417073,
            "uniqueKey": "ECS-032A-A06-D-1",
            "typeCode": "D",
            "bannerLocation": null,
            "dayIndicator": "0000100",
            "startTime": "0900",
            "endTime": "0950",
            "dwChanges": {
              "bannerLocation": {
                "isToDo": false,
                "value": "H GYM 00290"
              },
              "dayIndicator": {
                "isToDo": false,
                "value": "0000010"
              },
              "startTime": {
                "isToDo": false,
                "value": "1210"
              },
              "endTime": {
                "isToDo": false,
                "value": "1300"
              }
            }
          }
        ],
        "dwHasChanges": true,
        "dwChanges": {
          "seats": {
            "isToDo": false,
            "value": 48
          }
        },
        "groupHead": true
      }
    }
  },
  "syncActions": {
    "ids": [
      291
    ],
    "list": {
      "291": {
        "id": 291,
        "sectionProperty": "activities",
        "childProperty": "dayIndicator",
        "childUniqueKey": "ECS-032A-A01-D-1",
        "sectionGroupId": 222353,
        "sectionId": 268526,
        "sectionUniqueKey": "ECS-032A-A01",
        "description": "Change ECS 032A section A01 (62294) Discussion days from M to W"
      }
    }
  },
  "uiState": {}
}

ReactDOM.render(<DiffList sections={sampleData.sections} />, document.getElementById('app'));

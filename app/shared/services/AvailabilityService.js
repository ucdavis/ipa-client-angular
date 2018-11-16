class AvailabilityService {
  constructor () {
    return {
      /**
       * Will convert a blob to an array of day/time descriptions
       * @param  {array} blob A 75 length array representing unavailabilities
       */
      availabilityBlobToDescriptions (blob) {
        if (!blob) { return []; }

        var _this = this;
        var hoursArray = blob.split(',');

        if (hoursArray.length != 75) {
          return null;
        }

        var descriptions = [];
        descriptions.push(_this._describeDayArray(hoursArray.slice(0,14), "M"));
        descriptions.push(_this._describeDayArray(hoursArray.slice(15,29), "T"));
        descriptions.push(_this._describeDayArray(hoursArray.slice(30,44), "W"));
        descriptions.push(_this._describeDayArray(hoursArray.slice(45,59), "R"));
        descriptions.push(_this._describeDayArray(hoursArray.slice(60,74), "F"));

        return descriptions;
      },
      _describeDayArray (dayArray, dayCode) {
        var _this = this;
        var descriptions = {
          day: dayCode,
          times: ""
        };

        var startHour = 7;

        var startTimeBlock = null;
        var endTimeBlock = null;
        var blocks = [];

        dayArray.forEach( function(hourFlag, i) {
          if (hourFlag == "1") {
            if (startTimeBlock == null) {
              startTimeBlock = startHour + i;
              endTimeBlock = startHour + i + 1;
            } else {
              endTimeBlock++;
            }
          } else if (hourFlag == "0" && startTimeBlock != null) {
            blocks.push(_this._blockDescription(startTimeBlock, endTimeBlock));
            startTimeBlock = null;
          }
        });

        if (startTimeBlock != null) {
          blocks.push(_this._blockDescription(startTimeBlock, endTimeBlock));
        }

        if(blocks.length == 0) {
          // No availabilities were indicated
          blocks.push("Not available");
        }

        descriptions.times = blocks.join(", ");

        return descriptions;
      },
      _blockDescription (startTime, endTime) {
        var start = (startTime > 12 ? (startTime - 12) + "pm" : startTime + "am" );
        var end = (endTime > 12 ? (endTime - 12) + "pm" : endTime + "am" );

        return start + "-" + end;
      }
    };
  }
}

export default AvailabilityService;

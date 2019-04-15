/**
 * @ngdoc service
 * @name ipaClientAngularApp.tagService
 * @description
 * # TagService
 * Service in the ipaClientAngularApp.
 */
class TagService {
  constructor () {
    return {
      getTagTextColor: function(color) {
        var THRESHOLD = 180;
        var BLACK = "#000000";
        var WHITE = "#FFFFFF";
        if (color &&
            ((parseInt(color.substring(1, 3), 16) +
              parseInt(color.substring(3, 5), 16) +
              parseInt(color.substring(5, 7), 16)) / 3) > THRESHOLD) {
          return BLACK;
        } else {
          return WHITE;
        }
      }
    };
  }
}

export default TagService;

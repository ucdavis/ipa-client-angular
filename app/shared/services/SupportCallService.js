/**
 * @ngdoc service
 * @name ipaClientAngularApp.SupportCallService
 * @description
 * # SupportCallService
 * Service in the ipaClientAngularApp.
 */
class SupportCallService {
  constructor() {
    return {
      getLanguageProficiencyDescription: function (languageProficiencyId) {
        switch (languageProficiencyId) {
          case 0:
            return "Undergraduate degree from an institution where English is the sole language of instruction";
          case 1:
            return "Achieved a minimum score of 26 on the speaking subset of the TOEFL iBT";
          case 2:
            return "Achieved a minimum score of 8 on the speaking subset of the IELTS";
          case 3:
            return "Achieved a minimum score of 50 on the SPEAK";
          case 4:
            return "Achieved a “Pass” on the TOEP";
          default:
            return null;
        }
      }
    };
  }
}

export default SupportCallService;

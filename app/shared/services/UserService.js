class UserService {
  constructor () {
    return {
      // Will return a user if one is associated to the specified instructor
      getUserByInstructor: function(instructor, users) {
        return instructor.loginId ? users.byLoginId[instructor.loginId.toLowerCase()] : null;
      }
    };
  }
}

export default UserService;

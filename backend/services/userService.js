const User = require("../models/userModel");
const College = require("../models/collegeModel");

class UserService {
  static async getUserColleges(userId) {
    return await User.findById(userId).populate("colleges");
  }

  static async addCollegeToUser(userId, collegeData) {
    const { name, location, collegeId, admissionRate } = collegeData;

    const user = await User.findById(userId);
    let college = await College.findOne({ collegeId });

    if (!college) {
      college = new College({ name, location, collegeId, admissionRate });
      await college.save();
    }

    if (!user.colleges.includes(college._id)) {
      user.colleges.push(college._id);
      await user.save();
    }

    return college;
  }
}

module.exports = UserService;

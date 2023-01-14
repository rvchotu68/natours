const User = require('../models/users.model');

class UsersService {
  async getAllUsersDetails() {
    return await User.find();
  }

  filterObj(dataObj, ...fields) {
    const updatedObject = {};
    Object.keys(dataObj).forEach((ele) => {
      if (fields.includes(ele)) updatedObject[ele] = dataObj[ele];
    });
    console.log({ updatedObject });
    return updatedObject;
  }

  async updateUserDetails(id, req) {
    let updatedData;
    console.log('req', req);
    req.user.role === 'admin'
      ? (updatedData = req.body)
      : (updatedData = this.filterObj(req.body, 'name', 'email'));

    const userData = await User.findByIdAndUpdate(id, updatedData, {
      new: true,
      runValidators: true,
    });
    return userData;
  }

  async deleteUserAcc(user) {
    await User.findByIdAndUpdate(user._id, { active: false });
  }
}

module.exports = new UsersService();

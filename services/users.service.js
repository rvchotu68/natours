const User = require('../models/users.model');
const ApiFeatures = require('../utils/apiFeatures');

class UsersService {
  async getAllUsersDetails(req, filter) {
    const filters = new ApiFeatures(User.find(filter), req.query);
    filters.applyFilters();
    return await filters.query;
  }

  filterObj(dataObj, ...fields) {
    const updatedObject = {};
    Object.keys(dataObj).forEach((ele) => {
      if (fields.includes(ele)) updatedObject[ele] = dataObj[ele];
    });
    // console.log({ updatedObject });
    return updatedObject;
  }

  async updateUserDetails(id, req) {
    console.log('updateUserDetails');
    let updatedData;
    // console.log('req', req);
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

  async getUserService(id) {
    return await User.findById(id);
  }
}

module.exports = new UsersService();

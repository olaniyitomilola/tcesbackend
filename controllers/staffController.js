const {Staff} = require('../Class/Staff.js'); // the Staff class
const { insertStaff, getAllUsers, deleteUserById, getUserDetailsById } = require('../config/dbops.js');

const addNewStaff = async (req, res, next) => {
  try {
    const staffData = req.body;

    console.log(staffData)

    const inserted = await insertStaff(staffData);

    const staff = new Staff(inserted);
    res.status(201).json(staff);
  } catch (error) {
    console.error('Error adding new staff:', error);
    res.status(500).json({ message: 'Failed to add staff member.' });
  }
};

const getAllUsersController = async (req, res, next) => {
  try {
    const users = await getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Failed to retrieve users' });
  }
};

const editUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (!id) {
      return res.status(400).json({ message: 'User ID is required.' });
    }

    const updatedUser = await updateUserById(id, updates);

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found or no updates applied.' });
    }

    res.status(200).json({ message: 'User updated successfully.', user: updatedUser });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Server error while updating user.' });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: 'User ID is required.' });
    }

    const deletedUser = await deleteUserById(id);

    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.status(200).json({ message: 'User deleted successfully.' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Server error while deleting user.' });
  }
}

const getStaffDetails = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: 'User ID is required.' });
    }

    const user = await getUserDetailsById(id);

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user details:', error);
    res.status(500).json({ message: 'Server error while fetching user details.' });
  }
};



module.exports = {getStaffDetails, deleteUser,editUser, addNewStaff, getAllUsersController}
const { getUserByEmail, updateUserPasswordById, getUserById } = require('../config/dbops'); // Adjust path as needed
const bcrypt = require('bcrypt');

const validateEmail = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required.' });
    }

    const user = await getUserByEmail(email.trim().toLowerCase());

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    return res.status(200).json({
      id: user.id,
      is_activated: user.is_activated
    });
  } catch (error) {
    console.error('Error validating email:', error);
    next(error);
  }
};


const updatePassword = async (req, res, next) => {
  try {
    const { id, password } = req.body;
    console.log(id,password)
    // Ensure that the ID and password are provided
    if (!id || !password) {
        console.log(`id and pass`)
      return res.status(400).json({ message: 'ID and new password are required.' });
    }

    // Retrieve the user by their ID
    const user = await getUserById(id);

    // If user doesn't exist, return error
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds

    // Update the password in the database
    const updatedUser = await updateUserPasswordById(id, hashedPassword);

    // If the update is successful, return a success response
    if (updatedUser) {
      return res.status(200).json({
        message: 'Password updated successfully.',
        data: {id: updatedUser.id,
            first_name: updatedUser.first_name,
            last_name: updatedUser.last_name}
        
      });
    } else {
      return res.status(500).json({ message: 'Failed to update password.' });
    }
  } catch (error) {
    console.error('Error updating password:', error);
    next(error);
  }
};

const authenticateUser = async (req, res, next) => {
    try {
      const { email, password } = req.body;
  
      // Normalize email
      const normalizedEmail = email.toLowerCase();
  
      // Fetch user by email
      const user = await getUserByEmail(normalizedEmail);
  
      if (!user || user.is_deleted) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
  
      // Compare password
      const isMatch = await bcrypt.compare(password, user.password);
  
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
  
      // Successful login
      res.status(200).json({
        message: 'Authentication successful',
        user: {
          id: user.id,
          email: user.email,
          firstName: user.first_name,
          lastName: user.last_name,
          role: user.role,
          access: user.jobtype_management? 1:0,
          isActivated: user.is_activated
        }
      });
  
    } catch (error) {
      console.error('Error during authentication:', error);
      res.status(500).json({ message: 'Server error during authentication' });
    }
  };
  


module.exports = {validateEmail,updatePassword, authenticateUser}
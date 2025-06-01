
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const { User, BlackListedTokens } = require("../models");
const { where, Op } = require("sequelize");
const saltRounds = 10;
const sendResetEmail = require("../services/resetLink.services");
const sendVerificationEmail = require("../services/verificationEmail.services");







exports.register = async (req, res) => {
  const { name, firstName, lastName, email, password, role } = req.body;

  // Support both 'name' (frontend) and 'firstName/lastName' (API)
  const userFirstName = firstName || (name ? name.split(' ')[0] : null);
  const userLastName = lastName || (name ? name.split(' ').slice(1).join(' ') || 'User' : null);

  if (!userFirstName || !email || !password) {
    return res.status(400).json({ message: 'Name, email, and password are required' });
  }

  try {
    const existingUser = await User.findOne({ where: { email } });

    if (existingUser) {
      return res.status(409).json({ message: 'User with this email already exists.' });
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message: 'Password must be at least 8 characters with uppercase, lowercase, and number'
      });
    }


    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    const userId = crypto.randomUUID();

    await User.create({
      id: userId,
      firstName: userFirstName,
      lastName: userLastName,
      email,
      password: hashedPassword,
      role: role || 'customer',
      isEmailVerified: false,
      verificationToken,
      verificationTokenExpiry,
    });

    // Send verification email
    const verificationLink = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;

    try {
      await sendVerificationEmail(email, verificationLink);
    } catch (emailError) {
      console.error('Failed to send verification email:', emailError);
      // Continue even if email fails - user can request resend
    }

    res.status(201).json({
      message: 'Registration successful! Please check your email to verify your account.',
      requiresVerification: true
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Error registering user'
    });
  }
};



exports.login = async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }
  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }

    // Check if email is verified
    if (!user.isEmailVerified) {
      return res.status(403).json({
        message: 'Please verify your email address before logging in.',
        requiresVerification: true,
        email: user.email
      });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    return res.status(200).json({
      token,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        name: `${user.firstName} ${user.lastName}`.trim(),
        email: user.email,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
      },
      message: 'User logged in successfully'

    });

  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  };
}



// Verify email endpoint
exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Verification token is required'
      });
    }

    // Find user with matching token that hasn't expired
    const user = await User.findOne({
      where: {
        verificationToken: token,
        verificationTokenExpiry: { [Op.gt]: new Date() }
      }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired verification token. Please request a new verification email.'
      });
    }

    // Update user as verified
    await user.update({
      isEmailVerified: true,
      verificationToken: null,
      verificationTokenExpiry: null
    });

    return res.status(200).json({
      success: true,
      message: 'Email verified successfully! You can now log in.'
    });

  } catch (error) {
    console.error('Email verification error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};



// Resend verification email
exports.resendVerification = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    const user = await User.findOne({ where: { email } });

    if (!user) {
      // Don't reveal if user exists
      return res.status(200).json({
        success: true,
        message: 'If an account exists with this email, a verification link will be sent.'
      });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({
        success: false,
        message: 'Email is already verified. Please log in.'
      });
    }

    // Generate new verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    await user.update({
      verificationToken,
      verificationTokenExpiry
    });

    // Send verification email
    const verificationLink = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;

    try {
      await sendVerificationEmail(email, verificationLink);
    } catch (emailError) {
      console.error('Failed to resend verification email:', emailError);
      return res.status(500).json({
        success: false,
        message: 'Failed to send verification email. Please try again later.'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Verification email sent! Please check your inbox.'
    });

  } catch (error) {
    console.error('Resend verification error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};





exports.logout = async (req, res) => {
  try {

    if (!req.header('Authorization')) {
      return res.status(400).json({ message: 'No token provided' });
    }

    const authtoken = req.header('Authorization')?.split(' ')[1];
    if (!authtoken) {
      return res.status(400).json({ message: 'No token provided' });
    }
    await BlackListedTokens.create({
      token: authtoken,
      user_id: req.user.id,
      expires_at: new Date(req.user.exp * 1000)

    }

    );

    return res.status(200).json({ message: 'User logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}






exports.forgotPassword = async (req, res) => {

  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  try {
    const user = await User.findOne({ where: { email: email } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    // generate a reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 15 * 60 * 1000);


    await user.update({
      reset_token: resetToken,
      reset_token_expires: resetTokenExpiry,
    });

    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    //TODO:Send Email
    await sendResetEmail(user.email, resetLink);
    return res.status(200).json({
      success: true,
      message: 'Password reset link sent to your email'
    })


  } catch (error) {
    console.log("ERROR :", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });

  }
};





exports.resetPassword = async (req, res) => {
  try {
    const { token, newPass } = req.body;

    // Check if token is provided
    if (!token) {
      return res.status(400).json({ success: false, message: "Reset token is required" });
    }

    // Check if new password is provided
    if (!newPass) {
      return res.status(400).json({ success: false, message: "New password is required" });
    }

    // Find the user whose reset token matches and is not expired
    const user = await User.findOne({
      where: {
        reset_token: token, // Token must match the one saved in DB
        reset_token_expiry: { [Op.gt]: new Date() } // Token must not be expired (expiry > now)
      }
    });

    // If no matching user is found, token is invalid or expired
    if (!user) {
      return res.status(400).json({ success: false, message: "Reset token is invalid or expired" });
    }

    // Validate password using regex (min 8 chars, at least one uppercase, one lowercase, and one number)
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(newPass)) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters with uppercase, lowercase, and number"
      });
    }

    // Hash the new password before saving it
    const hashedPassword = await bcrypt.hash(newPass, saltRounds);

    // Update the user's password and clear the reset token fields
    await user.update({
      password: hashedPassword,           // Save new hashed password
      reset_token: null,                  // Clear the reset token (invalidate it)
      reset_token_expiry: null            // Clear the expiry timestamp
    });

    // Respond with success message
    return res.status(200).json({
      success: true,
      message: "Password reset successfully"
    });

  } catch (error) {
    // Log and handle unexpected server errors
    console.error("Reset Password Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};


exports.refreshToken = async (req, res) => {
  try {
    // Get the token from Authorization header
    const authHeader = req.header('Authorization');
    const token = authHeader?.split(' ')[1];

    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Token is required'
      });
    }

    // Check if token is blacklisted (user logged out)
    const isBlacklisted = await BlackListedTokens.findOne({ where: { token } });
    if (isBlacklisted) {
      return res.status(401).json({
        success: false,
        message: 'Token has been invalidated. Please login again.'
      });
    }

    // Verify the current token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      // If token is expired, we can still decode it to get user ID
      // and issue a new one (only if not too old)
      if (error.name === 'TokenExpiredError') {
        // Decode without verification to get payload
        decoded = jwt.decode(token);

        // Check if token expired more than 24 hours ago (grace period)
        const expiredAt = new Date(decoded.exp * 1000);
        const gracePeriod = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

        if (Date.now() - expiredAt.getTime() > gracePeriod) {
          return res.status(401).json({
            success: false,
            message: 'Token has expired beyond grace period. Please login again.'
          });
        }
      } else {
        return res.status(401).json({
          success: false,
          message: 'Invalid token'
        });
      }
    }

    // Verify user still exists and is active
    const user = await User.findByPk(decoded.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }

    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account has been deactivated'
      });
    }

    // Generate new token with fresh expiry
    const newToken = jwt.sign(
      {
        id: user.id,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }  // New 1-hour expiry
    );

    return res.status(200).json({
      success: true,
      message: 'Token refreshed successfully',
      token: newToken,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Refresh token error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};
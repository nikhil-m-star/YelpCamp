const jwt = require('jsonwebtoken');
const { ClerkExpressRequireAuth } = require('@clerk/clerk-sdk-node');
const User = require('./Models/user');

/**
 * Metadata about Authentication Strategy:
 * This middleware supports a dual-strategy authentication system:
 * 1. verified via local JWT (traditional 'Bearer <token>')
 * 2. verified via Clerk (if integrated)
 * 
 * It unifies the `req.user` object so downstream routes don't care about the provider.
 */

// Local JWT Verification Helper
// Checks for a custom prefix or standard Bearer token and verifies against local secret
const verifyLocalToken = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1];
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findById(decoded.userId);
            if (!user) return null; // Token valid but user gone
            return user;
        } catch (err) {
            return null; // Invalid token
        }
    }
    return null;
};

// Unified Middleware for Route Protection
module.exports.isLoggedIn = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: 'No token provided' });

    // 1. Attempt Local Authentication
    // If the token is a valid local JWT, we attach the user and proceed.
    const localUser = await verifyLocalToken(req, res);
    if (localUser) {
        req.user = localUser;
        req.authType = 'local';
        return next();
    }

    // 2. Attempt Clerk Authentication (Fallback)
    // If local auth fails, we assume it might be a Clerk token.
    if (!process.env.CLERK_SECRET_KEY) {
        // If Clerk is not configured, we can't verify, so fail here.
        return res.status(401).json({ message: 'Invalid token' });
    }

    // Use Clerk's middleware logic manually
    // We wrap their middleware to handle the response flow
    try {
        await ClerkExpressRequireAuth({
            onError: (err) => {
                throw new Error('Clerk Auth Failed');
            }
        })(req, res, async () => {
            // If we reach here, Clerk verification passed.
            // Now we ensure the Clerk user exists in our local Mongo database.
            if (req.auth && req.auth.userId) {
                let user = await User.findOne({ clerkId: req.auth.userId });

                // JIT (Just-In-Time) Provisioning
                // If the user doesn't exist locally, create them using data from Clerk
                if (!user) {
                    const { clerkClient } = require('@clerk/clerk-sdk-node');
                    const clerkUser = await clerkClient.users.getUser(req.auth.userId);
                    user = new User({
                        clerkId: req.auth.userId,
                        // Generate a username if none exists, or use Clerk's
                        username: clerkUser.username || `user_${req.auth.userId.substring(0, 8)}`,
                        email: clerkUser.emailAddresses[0].emailAddress
                    });
                    await user.save();
                }

                req.user = user; // standardize req.user
                req.authType = 'clerk';
                next();
            } else {
                res.status(401).json({ message: 'Unauthorized' });
            }
        });
    } catch (error) {
        res.status(401).json({ message: 'Authentication failed' });
    }
};
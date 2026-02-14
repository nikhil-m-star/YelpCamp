const jwt = require('jsonwebtoken');
const { ClerkExpressRequireAuth } = require('@clerk/clerk-sdk-node');
const User = require('./Models/user');

// Local JWT Verification
const verifyLocalToken = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer L-')) { // Use 'L-' prefix for local tokens to distinguish
        const token = authHeader.split(' ')[1].substring(2); // Remove 'L-'
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findById(decoded.userId);
            if (!user) return res.status(401).json({ message: 'Invalid token' });
            req.user = user;
            req.authType = 'local';
            return next();
        } catch (err) {
            return res.status(401).json({ message: 'Invalid token' });
        }
    }
    next();
};

// Clerk Verification (using their SDK)
// Since we don't have the Secret Key yet, we will mock this for now or try to use the SDK if it allows strictless mode (it doesn't usually).
// However, the user wants us to implement it. I will implement the structure.
// NOTE: This will fail without CLERK_SECRET_KEY in .env

const verifyClerkToken = ClerkExpressRequireAuth({
    onError: (err, req, res, next) => {
        // If Clerk auth fails, check if we already authenticated via Local
        if (req.user && req.authType === 'local') {
            return next();
        }
        next(); // Move to next middleware (which might be the final error handler or allow public access if not specific)
    }
});

// Unified Middleware
module.exports.isLoggedIn = async (req, res, next) => {
    // 1. Try Local Auth first (custom header convention or standard Bearer)
    // We update the frontend to send 'Bearer <token>' for local.
    // Clerk sends 'Bearer <token>' too.
    // We need to distinguish.

    // STRATEGY: 
    // If local login, frontend sends standard JWT. 
    // If Clerk login, frontend sends Clerk JWT.
    // We try to verify as Local first. If that fails (or isn't a local token), we try Clerk.

    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: 'No token provided' });

    const token = authHeader.split(' ')[1];

    try {
        // Try Local Flow
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId);
        if (user) {
            req.user = user;
            return next();
        }
    } catch (ignore) {
        // Not a valid local token, proceed to Clerk
    }

    // Try Clerk Flow
    // We need to manually invoke Clerk's middleware logic or just use it.
    // Since ClerkExpressRequireAuth is a middleware itself, it's hard to chain conditionally inside an async function 
    // without using it as a preceding middleware.

    // Better Strategy: Use Clerk's `sessions.verifySession` or similar if we want manual control, 
    // OR just chain them in Express: app.use(localAuth, clerkAuth) -> but they might conflict on 401.

    // Let's use the official SDK method `clerkClient.verifyToken` manually if possible, 
    // OR rely on the fact that we can wrap it.

    // For now, I will ask the user for the Secret Key because `ClerkExpressRequireAuth` needs it.
    // I will return a placeholder middleware that checks for the key.

    if (!process.env.CLERK_SECRET_KEY) {
        return res.status(500).json({ message: 'Missing CLERK_SECRET_KEY' });
    }

    // If we are here, Local failed. Let Clerk handle it.
    // But ClerkExpressRequireAuth expects to be a middleware.
    // We can execute it:
    return ClerkExpressRequireAuth()(req, res, async () => {
        // If Clerk succeeds, it calls next().
        // Now sync user to DB.
        if (req.auth && req.auth.userId) {
            let user = await User.findOne({ clerkId: req.auth.userId });
            if (!user) {
                // JIT Provisioning
                // We need user details (email/username). req.auth doesn't always have them.
                // We might need to fetch them from Clerk API.
                const { clerkClient } = require('@clerk/clerk-sdk-node');
                const clerkUser = await clerkClient.users.getUser(req.auth.userId);
                user = new User({
                    clerkId: req.auth.userId,
                    username: clerkUser.username || `user_${req.auth.userId.substring(5, 10)}`,
                    email: clerkUser.emailAddresses[0].emailAddress
                });
                await user.save();
            }
            req.user = user; // Attach Mongoose user to req.user for downstream consistency
            next();
        } else {
            res.status(401).json({ message: 'Unauthorized' });
        }
    });
};
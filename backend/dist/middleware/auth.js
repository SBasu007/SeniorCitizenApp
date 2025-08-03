import 'dotenv/config';
import { createClerkClient } from "@clerk/backend";
/**
 * Authentication middleware that verifies JWT tokens using Clerk.
 *
 * This middleware:
 * 1. Extracts the Bearer token from the Authorization header
 * 2. Verifies the token with Clerk's backend API
 * 3. Adds user information to the request object
 * 4. Allows the request to proceed or returns an error
 *
 * @param req - Express request object (extended with user property)
 * @param res - Express response object
 * @param next - Express next function to continue middleware chain
 *
 * @returns Promise<void> - Either calls next() to continue or sends error response
 */
export default async function authenticateUser(req, res, next) {
    // Initialize Clerk client with secret key from environment variables
    const clerkClient = createClerkClient({
        secretKey: process.env.CLERK_SECRET_KEY
    });
    // Format expected: "Bearer <token>"
    const token = req.headers.authorization?.replace("Bearer ", "");
    console.log("🔍 Auth middleware - Token received:", token ? "Yes" : "No");
    console.log("🔍 Auth middleware - Full authorization header:", req.headers.authorization);
    // Check if token exists in request
    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    try {
        const session = await clerkClient.sessions.getSession(token);
        req.user = {
            userId: session.userId,
            sessionId: session.id
        };
        next();
    }
    catch (error) {
        console.error('Token verification failed:', error);
        return res.status(401).json({ message: "Invalid token" });
    }
}

import { Request, Response, NextFunction } from 'express';
import { jwtVerify, createRemoteJWKSet } from 'jose';
import 'dotenv/config';

export interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    sessionId: string;
  };
}

const jwks = createRemoteJWKSet(new URL(`${process.env.CLERK_JWKS_URL}`));

export default async function authenticateUser(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized: Missing token" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const { payload } = await jwtVerify(token, jwks, {
      issuer: process.env.CLERK_ISSUER,
    });

    req.user = {
      userId: payload.sub!,
      sessionId: payload.sid as string,
    };

    next();
  } catch (err) {
    console.error("JWT verification failed:", err);
    return res.status(401).json({ message: "Invalid token" });
  }
}

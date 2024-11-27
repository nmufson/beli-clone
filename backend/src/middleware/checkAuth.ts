import { Request, Response, NextFunction } from 'express';

export function checkAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: 'Not authenticated' });
}

export function preventAuthenticatedAccess(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (req.isAuthenticated()) {
    return res.redirect('/feed/user');
  }
  next();
}

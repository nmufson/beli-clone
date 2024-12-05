import { Request, Response } from 'express';

export async function checkAuth(req: Request, res: Response) {
  if (req.isAuthenticated()) {
    res.status(200).json({
      isAuthenticated: true,
    });
  } else {
    res.status(401).json({
      isAuthenticated: false,
    });
  }
}

export async function getHomePage(req: Request, res: Response) {
  res.json({
    message: 'Welcome to the Home Page! Please log in or continue as a guest.',
  });
}

export async function getFeedPage(req: Request, res: Response) {
  res.json({
    message: 'Welcome to the Feed Page!',
  });
}

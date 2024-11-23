import { Request, Response } from 'express';

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

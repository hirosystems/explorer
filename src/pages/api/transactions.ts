import { Request, Response } from 'express';
import fetch from 'isomorphic-unfetch';

export default async (req: Request, res: Response) => {
  const resp = await fetch('http://localhost:4010/transactions/lksjdfkls');
  const data = await resp.json();
  console.log(data);
  return res.json(data);
};

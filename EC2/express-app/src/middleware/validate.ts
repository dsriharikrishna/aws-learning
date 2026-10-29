import { Request, Response, NextFunction, RequestHandler } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { AppError } from './AppError';

export function validate(schema: ZodSchema, target: 'body' | 'query' | 'params' = 'body'): RequestHandler {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req[target]);
    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;
      next(AppError.badRequest('Validation failed', errors));
      return;
    }
    req[target] = result.data;
    next();
  };
}


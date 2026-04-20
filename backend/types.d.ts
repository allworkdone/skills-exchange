declare module 'express' {
  export interface Request {
    body: any;
    params: any;
    query: any;
    headers: any;
  }
  export interface Response {
    status(code: number): this;
    json(body: any): this;
    send(body?: string | Buffer | object): this;
  }
  export interface NextFunction {
    (err?: any): void;
  }
  export type RequestHandler = (req: Request, res: Response, next: NextFunction) => void;
}

declare module 'jsonwebtoken' {
  export function sign(payload: any, secret: string, options?: any): string;
  export function verify(token: string, secret: string, options?: any): any;
}

export interface AuthRequest {
  userId?: string;
  email?: string;
  body: any;
  params: any;
  query: any;
  headers: any;
}
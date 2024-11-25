export class BaseError extends Error {
    public statusCode: number;
  
    constructor(message: string, statusCode: number) {
      super(message);
      this.statusCode = statusCode;
      (Error as any).captureStackTrace(this, this.constructor);
    }
  }
  
  export class NotFoundError extends BaseError {
    constructor(message: string = "Resource not found") {
      super(message, 404);
    }
  }
  
  export class ValidationError extends BaseError {
    constructor(message: string) {
      super(message, 422);
    }
  }
  
  export class BadRequestError extends BaseError {
    constructor(message: string = "Bad Request") {
      super(message, 400);
    }
  }
  
  export class UnauthorizedError extends BaseError {
    constructor(message: string = "Unauthorized") {
      super(message, 401);
    }
  }
  
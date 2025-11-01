export interface ApiResponse<T = any> {
  status: number;
  success: boolean;
  data?: T;
  message?: string;
}

export const successResponse = <T = any>(data: T, message?: string, status: number = 200): ApiResponse<T> => {
  return {
    status,
    success: true,
    data,
    message: message || 'Success'
  };
};

export const errorResponse = (message: string, status: number = 500): ApiResponse => {
  return {
    status,
    success: false,
    message,
  };
};

export const sendResponse = <T = any>(res: any, response: ApiResponse<T>) => {
  return res.status(response.status).json(response);
};

export class ApiResponse<T = unknown> {
  public statusCode: number;
  public success: boolean;
  public message: string;
  public data?: T;

  constructor(statusCode: number, message: string, data?: T) {
    this.statusCode = statusCode;
    this.success = true;
    this.message = message;

    if (data !== undefined) {
      this.data = data;
    }
  }
}

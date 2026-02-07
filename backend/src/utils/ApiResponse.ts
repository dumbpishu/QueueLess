export class ApiResponse<T> {
  public statusCode: number;
  public success: boolean;
  public message: string;
  public data?: T | undefined;

  constructor(statusCode: number, data: T, message: string) {
    this.statusCode = statusCode;
    this.success = true;
    this.message = message;
    if (data !== undefined) {
      this.data = data;
    }
  }
}

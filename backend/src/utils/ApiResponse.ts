export class ApiResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: any;

  constructor(
    statusCode: number,
    data: any = null,
    message: string = "Request successful",
  ) {
    this.statusCode = statusCode;
    this.success = true;
    this.message = message;
    if (data) {
      this.data = data;
    }
  }
}

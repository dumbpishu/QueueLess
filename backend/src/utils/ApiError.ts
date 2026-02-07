export class ApiError extends Error {
  statusCode: number;
  success: boolean;
  errors: any;

  constructor(
    statusCode: number,
    message: string = "Something went wrong",
    errors: any = null,
  ) {
    super(message);

    this.statusCode = statusCode;
    this.success = false;

    if (errors) {
      this.errors = errors;
    }
  }
}

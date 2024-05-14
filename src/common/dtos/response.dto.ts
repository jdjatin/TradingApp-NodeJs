// src/common/dtos/response.dto.ts

export class ResponseDto<T> {
    statusCode: number; 
    message: [string];
    data: T;
  }
  
import { PipeTransform, Injectable, BadRequestException, HttpStatus } from '@nestjs/common';
import { ArgumentMetadata } from '@nestjs/common/interfaces';

@Injectable()
export class ValidateDatePipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    const { data } = metadata;

    // Validates startDate or endDate only if they exist in the request
    if (data === 'startDate' || data === 'endDate') {
      const date = new Date(value);
      const today = new Date();

      // Validates startDate should not be in the past
      if (data === 'startDate' && date < today) {
        throw new BadRequestException({
          statusCode: HttpStatus.BAD_REQUEST,
          message: `The ${data} cannot be in the past.`,
          error: 'Bad Request',
        })
      }

      // Validates endDate should not be before startDate or in the past
      if (data === 'endDate' && date < today) {
        throw new BadRequestException({
          statusCode: HttpStatus.BAD_REQUEST,
          message: `The ${data} cannot be in the past.`,
          error: 'Bad Request',
        });
      }

      // Validates that endDate is not before startDate
      if (data === 'endDate' && date < new Date(value.startDate)) {
        throw new BadRequestException({
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'End date cannot be before start date.',
          error: 'Bad Request',
        });
      }
    }

    return value;
  }
}

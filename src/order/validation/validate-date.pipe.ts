import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { ArgumentMetadata } from '@nestjs/common/interfaces';

@Injectable()
export class ValidateDatePipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    const { type, data } = metadata;

    // Validate startDate or endDate only if they exist in the request
    if (data === 'startDate' || data === 'endDate') {
      const date = new Date(value);
      const today = new Date();

      // Validate startDate should not be in the past
      if (data === 'startDate' && date < today) {
        throw new BadRequestException(`The ${data} cannot be in the past.`);
      }

      // Validate endDate should not be before startDate or in the past
      if (data === 'endDate' && date < today) {
        throw new BadRequestException(`The ${data} cannot be in the past.`);
      }

      // Validate that endDate is not before startDate
      if (data === 'endDate' && date < new Date(value.startDate)) {
        throw new BadRequestException('End date cannot be before start date.');
      }
    }

    return value;
  }
}

import { PipeTransform, Injectable } from '@nestjs/common';

@Injectable()
export class ParseQueryJSON implements PipeTransform {
  transform(value: string): any {
    if (value) return JSON.parse(value);
    return;
  }
}

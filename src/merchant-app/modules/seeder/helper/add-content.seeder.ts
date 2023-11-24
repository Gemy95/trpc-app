import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Seeder } from 'nestjs-seeder';
import { Content, ContentType } from '../../models';

@Injectable()
export class AddContentSeeder implements Seeder {
  constructor(@InjectModel(Content.name) private readonly nModel: Model<Content>) {}

  async seed(): Promise<any> {
    try {
      // const data = await this.nModel.create({
      //   privacy: [{ text: 'ar privacy', translation: [{ _lang: 'en', text: 'english privacy' }], status: 'active' }],
      //   termsAndConditions: [
      //     { text: 'ar terms', translation: [{ _lang: 'en', text: 'english terms' }], status: 'active' },
      //   ],
      //   landingPage: [
      //     {
      //       image: 'http url',
      //       title: 'this is merchant title',
      //       description: 'test description merchant',
      //       status: 'active',
      //     },
      //   ],
      //   faq: [{ questionAndAnswers: [{ question: 'q1 ?', answer: 'this is answer' }], status: 'active' }],
      //   contentType: ContentType.MERCHANT_FAQ,
      // });

      console.log('data=', 'run.....');
    } catch (error) {
      console.log('error=', error);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  async drop(): Promise<any> {}
}

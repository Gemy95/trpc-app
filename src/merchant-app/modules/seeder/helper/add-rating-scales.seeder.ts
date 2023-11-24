import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Seeder } from 'nestjs-seeder';

import { RatingScale } from '../../models';

@Injectable()
export class AddRatingScalesSeeder implements Seeder {
  constructor(@InjectModel(RatingScale.name) private readonly nModel: Model<RatingScale>) {}

  async seed(): Promise<any> {
    try {
      const data = await this.nModel.create([
        {
          name: 'غير راضٍ للغاية',
          translation: [
            {
              _lang: 'en',
              name: 'highly dissatisfied',
            },
          ],
          image:
            'https://shopex-uploads.s3.amazonaws.com/dev/e152f516-d1f3-4686-985d-468832635ddb-sentiment-dissatisfied_118688.png',
          level: 1,
        },
        {
          name: 'غير راض',
          translation: [
            {
              _lang: 'en',
              name: 'dissatisfied',
            },
          ],
          image:
            'https://shopex-uploads.s3.eu-central-1.amazonaws.com/dev/fc63a471-4b3e-4569-aed8-81293518a35c--sentiment-very-dissatisfied_90750.png',
          level: 2,
        },
        {
          name: 'محايد',
          translation: [
            {
              _lang: 'en',
              name: 'Neutral',
            },
          ],
          image:
            'https://shopex-uploads.s3.eu-central-1.amazonaws.com/dev/87e004fd-375c-4582-8ab7-41d426459130--sentiment-neutral_89840.png',
          level: 3,
        },
        {
          name: 'راضي',
          translation: [
            {
              _lang: 'en',
              name: 'Satisfied',
            },
          ],
          image:
            'https://shopex-uploads.s3.eu-central-1.amazonaws.com/dev/36c4c477-8d2b-49ec-baba-163e513657e5--sentiment-satisfied_90013.png',
          level: 4,
        },
        {
          name: 'راض للغاية',
          translation: [
            {
              _lang: 'en',
              name: 'Highly satisfied',
            },
          ],
          image:
            'https://shopex-uploads.s3.eu-central-1.amazonaws.com/dev/efd69986-9bcc-4161-987d-51bb42cc5ad9-sentiment-very-satisfied_118684.png',
          level: 5,
        },
      ]);

      console.log('data=', 'run.....');
    } catch (error) {
      console.log('error=', error);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  async drop(): Promise<any> {}
}

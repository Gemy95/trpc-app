import { z } from 'zod';

const SUPPORTED_LANGUAGES = ['ar', 'en'];

// export class Translation {
//   @Field()
//   @IsString()
//   @IsIn(SUPPORTED_LANGUAGES)
//   @IsNotEmpty()
//   readonly _lang: string;
// }

export const Translation = z.object({
  _lang: z.string(),
});

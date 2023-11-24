class Translation {
  _lang: string;
  name: string;
}

export class RatingScale {
  name: string;
  translation: Translation[];
  image: string;
  level: number;
}

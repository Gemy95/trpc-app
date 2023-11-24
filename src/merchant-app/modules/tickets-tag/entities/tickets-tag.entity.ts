class Translation {
  _lang: string;
  description: string;
}

export class TicketTag {
  description: string;

  isDeleted?: boolean;

  translation: Translation[];
}

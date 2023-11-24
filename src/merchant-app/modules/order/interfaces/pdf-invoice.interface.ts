import { join } from 'path';

interface PDFTranslation {
  _lang: string;
  name: string;
  _id: string;
}

interface PDFOption {
  _id: {
    name: string;
    extraPrice: number;
    translation: PDFTranslation[];
    _id: string;
  };
}

interface PDFGroup {
  productGroupId: string;
  options: PDFOption[];
}

export interface PDFItem {
  count: number;
  productId: {
    _id: string;
    name: string;
    price: number;
    translation: PDFProductTranslation[];
  };
  groups: PDFGroup[];
  _id: '62f7f6d94997a63610940da8';
}

export class PDFProductTranslation {
  _lang: string;
  name: string;
  description: string;
}

interface PDFChargeDetails {
  name: string;
  amount: number;
}

export interface PDFInvoice {
  _id: string;
  charges: PDFChargeDetails[];
  total: number;
  invoiceRefId: string;
  invoiceSeqId: number;
  order: {
    items: PDFItem[];
    client: {
      name: 'mustafa owner';
    };
  };
}

export const fonts = {
  Tajawal: {
    normal: join(__dirname, 'public', 'fonts', 'Tajawal', 'Tajawal-Regular.ttf'),
    bold: join(__dirname, 'public', 'fonts', 'Tajawal', 'Tajawal-Bold.ttf'),
  },
};

export const tableLayout = {
  defaultBorder: false,
  hLineWidth: function (i, node) {
    if (i === 0 || i === node.table.body.length) {
      return 0;
    }
    return i === node.table.headerRows ? 2 : 1;
  },
  vLineWidth: function (i) {
    return 0;
  },
  hLineColor: function (i) {
    return i === 1 ? 'black' : '#eaeaea';
  },
  paddingLeft: function (i, node) {
    return i === 0 ? 0 : 10;
  },
  paddingRight: function (i, node) {
    return i === node.table.widths.length - 1 ? 0 : 10;
  },
  paddingTop: function (i, node) {
    return 2;
  },
  paddingBottom: function (i, node) {
    return 2;
  },
  fillColor: function (rowIndex, node, columnIndex) {
    return '#fff';
  },
};

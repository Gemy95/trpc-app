import { StyleDictionary } from 'pdfmake/interfaces';

export const en = {
  PDF_COL_NAME: 'ITEM NAME',
  PDF_COL_COUNT: 'ITEM COUNT',
  PDF_COL_TOTAL: 'ITEM TOTAL',
  PDF_COL_INVOICE: 'Invoice',
  PDF_COL_INVOICE_NO: 'Invoice No.',
  PDF_COL_DATE_ISSUED: 'Date Issued',
  PDF_COL_STATUS: 'Status',
  PDF_COL_FROM: 'From',
  PDF_COL_TO: 'To',
  PDF_COL_COMPANY_NAME: 'Shoppex.',
  PDF_COL_PAYMENT_SUB: 'Payment Subtotal',
  PDF_COL_PAYMENT_TAX: 'Payment Tax',
  PDF_COL_PAYMENT_TOTAL: 'Total Amount',
  PDF_COL_NOTES: 'NOTES',
  PDF_TEXT_NOTE: 'You can scan QR code to get invoice details later',
};

export const ar = {
  PDF_COL_NAME: 'المنتج أسم ',
  PDF_COL_COUNT: 'الكمية',
  PDF_COL_TOTAL: 'السعر',
  PDF_COL_INVOICE: 'الفاتورة',
  PDF_COL_INVOICE_NO: 'الفاتورة رقم',
  PDF_COL_DATE_ISSUED: 'الفاتورة تاريخ',
  PDF_COL_STATUS: 'الفاتورة حالة',
  PDF_COL_FROM: 'من',
  PDF_COL_TO: 'إلى',
  PDF_COL_COMPANY_NAME: 'Shoppex.',
  PDF_COL_PAYMENT_SUB: 'الفرعي المجموع',
  PDF_COL_PAYMENT_TAX: 'المضافة الضريبة',
  PDF_COL_PAYMENT_TOTAL: 'إجمالي',
  PDF_COL_NOTES: 'ملاحظة',
  PDF_TEXT_NOTE: 'الفاتورة إلى للرجوع الكود مسح يمكنك',
};

export const pdfExtraStyles: StyleDictionary = {
  header: {
    fillColor: '#FFCB42',
    margin: [0, 5, 0, 5],
    alignment: 'left',
  },
  title: {
    color: '#333333',
    fontSize: 28,
    bold: true,
    alignment: 'left',
    margin: [0, 0, 0, 15],
  },
  subTitle: {
    color: '#aaaaab',
    bold: true,
    fontSize: 12,
    alignment: 'left',
  },
  subTitleData: {
    bold: true,
    color: '#333333',
    fontSize: 12,
    alignment: 'left',
  },
  transport: {
    color: '#aaaaab',
    bold: true,
    fontSize: 14,
    alignment: 'left',
    margin: [0, 20, 0, 5],
  },
  names: {
    bold: true,
    color: '#333333',
    alignment: 'left',
  },
  tableTwoCol: {
    alignment: 'left',
    margin: [0, 5, 0, 5],
  },
  totalPaymentStyle: {
    bold: true,
    fontSize: 20,
    alignment: 'left',
    margin: [0, 5, 0, 5],
  },
  notesTitle: {
    fontSize: 10,
    bold: true,
    margin: [0, 50, 0, 3],
  },
  notesText: {
    fontSize: 10,
  },
};

export const pdfExtraStylesArabic: StyleDictionary = {
  header: {
    fillColor: '#FFCB42',
    margin: [0, 5, 0, 5],
    alignment: 'right',
  },
  title: {
    color: '#333333',
    fontSize: 28,
    bold: true,
    alignment: 'right',
    margin: [0, 0, 0, 15],
  },
  subTitle: {
    color: '#aaaaab',
    bold: true,
    fontSize: 12,
    alignment: 'right',
  },
  subTitleData: {
    bold: true,
    color: '#333333',
    fontSize: 12,
    alignment: 'right',
  },
  transport: {
    color: '#aaaaab',
    bold: true,
    fontSize: 14,
    alignment: 'right',
    margin: [0, 20, 0, 5],
  },
  names: {
    bold: true,
    color: '#333333',
    alignment: 'right',
  },
  tableTwoCol: {
    alignment: 'right',
    margin: [0, 5, 0, 5],
  },
  totalPaymentStyle: {
    bold: true,
    fontSize: 20,
    alignment: 'right',
    margin: [0, 5, 0, 5],
  },
  notesTitle: {
    fontSize: 10,
    bold: true,
    margin: [0, 50, 0, 3],
  },
  notesText: {
    fontSize: 10,
  },
};

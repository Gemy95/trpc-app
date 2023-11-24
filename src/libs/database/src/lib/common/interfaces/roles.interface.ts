import { IPermission } from './permissions.interface';

export interface IRole {
  nameArabic: string;
  nameEnglish: string;
  permissions: IPermission[];
}

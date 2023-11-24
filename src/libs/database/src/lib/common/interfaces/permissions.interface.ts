export interface IPermission {
  name?: string;
  translation?: [
    {
      name: string;
      _lang: string;
    },
  ];
  value: string;
}

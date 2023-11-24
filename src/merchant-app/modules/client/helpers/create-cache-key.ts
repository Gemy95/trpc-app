export interface ICreateCacheKey {
  partOne: string;
  partTwo?: string;
}
export const createCacheKey = (createCacheKey: ICreateCacheKey) => {
  return `${createCacheKey.partOne}:${createCacheKey.partTwo}`;
};

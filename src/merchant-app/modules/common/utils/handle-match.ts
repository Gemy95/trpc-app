import { Types } from 'mongoose';

export default function (obj, query) {
  const match = {};
  if (typeof obj !== 'object' || !query) return {};
  Object.keys(obj).map((key) => {
    if (query[key]) {
      if (Array.isArray(query[key])) {
        match['$in'] = query[key].map((id: string) => new Types.ObjectId(id));
      }
      if (typeof query[key] === 'string') {
        match[key] = query[key];
      }
      if (!Array.isArray(query[key]) && typeof query[key] === 'object') {
        match[key] = Object.keys(query[key]).map((innerkey) => {
          return { [innerkey]: query[key][innerkey] };
        });
      }
    }
    if (typeof query[key] === 'boolean') {
      match[key] = query[key];
    }
  });
  return match;
}

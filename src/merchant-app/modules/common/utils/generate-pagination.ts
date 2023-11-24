export default function (limit: number, page: number) {
  const pagination = [];
  if (!isNaN(page) && !isNaN(limit)) {
    const skip = page <= 0 ? 0 : limit * (page - 1);
    pagination.push({ $skip: skip });
    pagination.push({ $limit: limit });
  }
  return pagination;
}

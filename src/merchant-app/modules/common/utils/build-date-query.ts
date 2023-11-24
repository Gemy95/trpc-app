export default function (fromCreatedAt: Date, toCreatedAt: Date) {
  return {
    $gte: new Date(fromCreatedAt.setUTCHours(0, 0, 0, 0)), // fromCreatedAt,
    $lte: new Date(toCreatedAt.setUTCHours(23, 59, 59, 999)),
  };
}

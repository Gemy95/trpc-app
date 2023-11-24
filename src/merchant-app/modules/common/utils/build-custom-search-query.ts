export default function (searchText: string, arrayFields: string[]) {
  const $regex = new RegExp(searchText, 'gi');
  const result = arrayFields.map((field) => {
    return {
      [field]: {
        $regex,
      },
    };
  });

  return {
    $or: result,
  };
}

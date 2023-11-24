export default function (searchText: string) {
  const $regex = new RegExp(searchText, 'gi');
  return [
    {
      name: {
        $regex,
      },
    },
    {
      'translation.name': {
        $regex,
      },
    },
  ];
}

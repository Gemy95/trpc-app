import * as CT from 'countries-and-timezones';

const Countries = {
  '+20': 'EGY',
  '+966': 'SA',
  '+1': 'USA',
};

export const getCountryTimeZone = (countryCode: string) => {
  try {
    const timezone = CT.getTimezonesForCountry(Countries[countryCode] || 'SA')[0].name;
    return timezone;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

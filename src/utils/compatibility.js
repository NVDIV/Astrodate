// Дані про сумісність за стихіями
const ELEMENTS = {
  Fire: ['Овен', 'Лев', 'Стрілець'],
  Earth: ['Телець', 'Діва', 'Козеріг'],
  Air: ['Близнюки', 'Терези', 'Водолій'],
  Water: ['Рак', 'Скорпіон', 'Риби']
};

const COMPATIBILITY_MAP = {
  Fire: 'Air',
  Air: 'Fire',
  Earth: 'Water',
  Water: 'Earth'
};

export const calculateCompatibility = (userA, userB) => {
  let score = 0;
  
  // Знаходимо стихії
  const getElement = (zodiac) => Object.keys(ELEMENTS).find(el => ELEMENTS[el].includes(zodiac));
  const elA = getElement(userA.zodiacSign);
  const elB = getElement(userB.zodiacSign);

  // Логіка нарахування балів
  if (elA === elB) score += 40; // Однакова стихія
  if (COMPATIBILITY_MAP[elA] === elB) score += 60; // Доповнюючі стихії
  if (userA.city === userB.city) score += 30; // Одне місто

  return score;
};

export const getSortedProfiles = (profiles, currentUser) => {
  return profiles
    .filter(p => p.uid !== currentUser.uid)
    .map(p => ({
      ...p,
      matchScore: calculateCompatibility(currentUser, p)
    }))
    .sort((a, b) => b.matchScore - a.matchScore);
};
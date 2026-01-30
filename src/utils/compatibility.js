/**
 * Матриця ідеальної сумісності за знаками (найвищі бали)
 * Кожен знак має список найбільш підходящих партнерів
 */
const ZODIAC_MATCHES = {
  'Овен': ['Лев', 'Стрілець', 'Терези', 'Близнюки'],
  'Телець': ['Діва', 'Козеріг', 'Скорпіон', 'Рак'],
  'Близнюки': ['Терези', 'Водолій', 'Стрілець', 'Овен'],
  'Рак': ['Скорпіон', 'Риби', 'Козеріг', 'Телець'],
  'Лев': ['Овен', 'Стрілець', 'Водолій', 'Близнюки'],
  'Діва': ['Телець', 'Козеріг', 'Риби', 'Рак'],
  'Терези': ['Близнюки', 'Водолій', 'Овен', 'Лев'],
  'Скорпіон': ['Рак', 'Риби', 'Телець', 'Діва'],
  'Стрілець': ['Овен', 'Лев', 'Близнюки', 'Терези'],
  'Козеріг': ['Телець', 'Діва', 'Рак', 'Скорпіон'],
  'Водолій': ['Близнюки', 'Терези', 'Лев', 'Стрілець'],
  'Риби': ['Рак', 'Скорпіон', 'Діва', 'Телець']
};

export const calculateCompatibility = (userA, userB) => {
  let score = 0;

  // Перевірка міста
  if (userA.city?.toLowerCase() === userB.city?.toLowerCase()) {
    score += 40;
  }

  // Перевірка знаку зодіаку
  const bestMatches = ZODIAC_MATCHES[userA.zodiacSign] || [];
  
  if (bestMatches.includes(userB.zodiacSign)) {
    score += 60; 
  } else if (userA.zodiacSign === userB.zodiacSign) {
    score += 30; 
  } else {
    score += 10; 
  }

  return score;
};

export const getSortedProfiles = (profiles, currentUser) => {
  if (!currentUser) return [];

  return profiles
    .filter(p => {
      // Прибираємо себе
      if (p.uid === currentUser.uid) return false;

      // Фільтр за преференціями статі
      if (currentUser.preference !== 'all') {
        if (p.gender !== currentUser.preference) return false;
      }

      // Зворотний фільтр для преференцій
      if (p.preference !== 'all') {
        if (currentUser.gender !== p.preference) return false;
      }

      return true;
    })
    .map(p => ({
      ...p,
      matchScore: calculateCompatibility(currentUser, p)
    }))
    .sort((a, b) => b.matchScore - a.matchScore);
};
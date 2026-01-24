export const getZodiacSign = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1;

    if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return "Овен";
    if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return "Телець";
    if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return "Близнюки";
    if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return "Рак";
    if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return "Лев";
    if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return "Діва";
    if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return "Терези";
    if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return "Скорпіон";
    if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return "Стрілець";
    if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return "Козоріг";
    if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return "Водолій";
    return "Риби";
};
export const sortCitations = (citations, field, order) => {
  const sortedCitations = [...citations].sort((a, b) => {
    const fieldA = field.split('.').reduce((obj, key) => obj && obj[key], a);
    const fieldB = field.split('.').reduce((obj, key) => obj && obj[key], b);

    const lowercaseFieldA = fieldA.toLowerCase();
    const lowercaseFieldB = fieldB.toLowerCase();

    if (lowercaseFieldA < lowercaseFieldB) return order === 'asc' ? -1 : 1;
    if (lowercaseFieldA > lowercaseFieldB) return order === 'asc' ? 1 : -1;
    return 0;
  });

  return sortedCitations;
};
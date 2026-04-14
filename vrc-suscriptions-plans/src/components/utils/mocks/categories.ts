const currentYear = new Date().getFullYear();

export const yearCategories = Array.from(
  { length: currentYear - 1991 + 1 },
  (_, i) => (currentYear - i).toString()
);

export const calculateAge = (birthYear: number): number => {
  return currentYear - birthYear;
};

export const getCategoryType = (
  age: number
): "infantil" | "juvenil" | "plantel" => {
  if (age > 19) return "plantel";
  if (age > 14) return "juvenil";
  return "infantil";
};

export const categoryAmounts = {
  infantil: 20000,
  juvenil: 40000,
  plantel: 60000,
};

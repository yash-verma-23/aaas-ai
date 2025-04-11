/** Removes duplicate values from an array */
export const removeDuplicates = (array: string[]) => {
  const uniqueValues = new Set(array);
  return Array.from(uniqueValues);
};

export function prepareSQLValues(values: Record<string, any>, startIndex = 1) {
  const updateKeys = Object.keys(values);
  const updateValues = Object.values(values);
  const updateSql = updateKeys.reduce((acc, curr, index) => {
    acc += `${index > 0 ? ", " : ""} ${curr}=$${index + 1 + startIndex}`;
    return acc;
  }, "");

  return [updateSql, updateValues];
}

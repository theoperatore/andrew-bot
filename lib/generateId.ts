export const generateId = (length = 22, appendTimestamp = true) => {
  const str = 'abcdefghijklmnopqrstuvwxyz';
  const time = Date.now();
  return (
    new Array(length)
      .fill(1)
      .map(() => str[Math.floor(Math.random() * str.length - 1)])
      .join('') + (appendTimestamp ? `${time}` : '')
  );
};

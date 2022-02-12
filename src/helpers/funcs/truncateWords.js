const truncateWords = (sentence, amount, tail) => {
  if (!sentence) {
    return;
  }
  const words = sentence.split(' ');
  if (amount >= words.length) {
    return sentence;
  }
  const truncated = words.slice(0, amount);
  return `${truncated.join(' ')}${tail}`;
};

export default truncateWords;

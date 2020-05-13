function randomChooseFrom(array: Array<any>) {
  return array[Math.floor(Math.random() * array.length)];
}

export { randomChooseFrom };

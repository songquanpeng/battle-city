function randomChooseFrom(array: Array<any>) {
  return array[Math.floor(Math.random() * array.length)];
}

function randomDecisionMaker(probability: number): boolean {
  return probability > Math.random();
}

function randomNumber(start: number, end: number): number {
  return Math.floor(Math.random() * (end - start)) + start;
}

export { randomChooseFrom };

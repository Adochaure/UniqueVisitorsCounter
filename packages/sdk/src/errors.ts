export class CounterError extends Error {
  public constructor(message: string) {
    super(message);
    this.name = 'CounterError';
  }
}

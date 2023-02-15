export default class Queue<T> {
  private queue: T[] = [];

  private resolveQueue: Array<{
    resolve: (value: T) => void;
    reject: (reason: Error) => void;
  }> = [];

  enqueue(item: T): void {
    if (this.resolveQueue.length > 0) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const { resolve, reject } = this.resolveQueue.shift()!;
      if (resolve) {
        resolve(item);
      } else {
        reject(new Error('Queue is closed'));
      }
    } else {
      this.queue.push(item);
    }
  }

  async dequeue(): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      if (this.queue.length > 0) {
        const item = this.queue.shift();
        if (item) {
          resolve(item);
        } else {
          reject(new Error('Queue is closed'));
        }
      } else {
        this.resolveQueue.push({ resolve, reject });
      }
    });
  }
}

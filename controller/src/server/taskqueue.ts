export default class TaskQueue {
  runs: string[];

  constructor(...parameters: string[]) {
    this.runs = [...parameters];
  }

  enqueue(run: string):void {
    this.runs.push(run);
  }

  dequeue():string {
    return this.runs.shift() as string;
  }

  getItemsCount():number {
    return this.runs.length;
  }
}

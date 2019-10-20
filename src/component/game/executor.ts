export interface IFn {
  (args: any[]): Promise<any>;
}

export interface IFnAndParams {
  fn: IFn,
  params: number[],
}

export default class Executor {
  private isWorking = false;
  private tasks: IFnAndParams[] = [];
  private afterLast?: (args: any[]) => any;

  constructor(afterLast?: (args: any[]) => any) {
    if (afterLast) {
      this.afterLast = afterLast;
    }
  }
  
  work(task: IFnAndParams) {
    if (!this.isWorking) {
      this.isWorking = true;
      const fn = this.generateTask(task);
      fn();
      return;
    }

    this.tasks.push(task);
  }

  next() {
    console.log(this);
    if (!this.tasks.length) {
      this.isWorking = false;

      if (this.afterLast) {
        this.afterLast([]);
      }
      return;
    }

    const task = this.tasks.shift();
    const nextFn = this.generateTask(task!);
    nextFn();
  }

  generateTask = (task: IFnAndParams) => {
    return async () => {
      const fn = task.fn;
      await fn(task.params);
      this.next();
    }
  }
}
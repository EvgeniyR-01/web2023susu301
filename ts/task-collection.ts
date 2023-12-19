'use strict';

import {Task} from './task';

class TaskCollection implements Iterable<Task> {
  private tasks: Array<Task>;

  public constructor() {
    this.tasks = [];
  }

  [Symbol.iterator]() {
    return this.tasks[Symbol.iterator]();
  }

  get(index: number): Task {
    return this.tasks[index];
  }

  set(index: number, value: Task) {
    this.tasks[index] = value;
  }

  forEach(callback: (task: Task) => void) {
    this.tasks.forEach(callback);
  }

  public get length(): number {
    return this.tasks.length;
  }

  public add(task: Task): void {
    this.tasks.push(task);
  }

  public remove(task: Task): void {
    const index: number = this.tasks.indexOf(task);
    if (index !== -1) {
      this.tasks.splice(index, 1);
    }
  }

  public getTasks(): Array<Task> {
    return this.tasks;
  }

  public find(task: Task): Task | undefined {
    return this.tasks.find((t) => Number(t.id) === Number(task.id));
  }

  public findById(taskId: number): Task | undefined {
    return this.tasks.find((t) => Number(t.id) === Number(taskId));
  }

  public getTasksByUserId(userId: number): TaskCollection {
    const userTasks: TaskCollection = new TaskCollection();
    for (const task of this.tasks) {
      if (Number(task.userId) === Number(userId)) {
        userTasks.add(task);
      }
    }
    return userTasks;
  }

  public setImportanceOptionById(taskId: number): void {
    for (const task of this.tasks) {
      if (Number(task.id) === Number(taskId)) {
        task.important = !task.important;
      }
    }
  }

  public clear(): void {
    this.tasks.length = 0;
  }

  public toArray(): Array<Task> {
    return this.tasks;
  }

  public toJSON(): Array<Task> {
    return this.tasks;
  }
}

export default TaskCollection;
export {TaskCollection};

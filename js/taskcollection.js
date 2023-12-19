'use strict';
class TaskCollection {
  constructor() {
    this.tasks = [];
  }
  *[Symbol.iterator]() {
    yield* this.tasks;
  }
  get length() {
    return this.tasks.length;
  }
  add(task) {
    this.tasks.push(task);
  }
  remove(task) {
    const index = this.tasks.indexOf(task);
    if (index !== -1) {
      this.tasks.splice(index, 1);
    }
  }
  getTasks() {
    return this.tasks;
  }
  find(task) {
    return this.tasks.find((t) => Number(t.id) === Number(task.id));
  }
  findById(taskId) {
    return this.tasks.find((t) => Number(t.id) === Number(taskId));
  }
  getTasksByUserId(userId) {
    const userTasks = new TaskCollection();
    for (const task of this.tasks) {
      if (Number(task.userId) === Number(userId)) {
        userTasks.add(task);
      }
    }
    return userTasks;
  }
  clear() {
    this.tasks.length = 0;
  }
}
export default TaskCollection;
export {TaskCollection};

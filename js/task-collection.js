'use strict';
class TaskCollection {
  constructor() {
    this.tasks = [];
  }
  [Symbol.iterator]() {
    return this.tasks[Symbol.iterator]();
  }
  get(index) {
    return this.tasks[index];
  }
  set(index, value) {
    this.tasks[index] = value;
  }
  forEach(callback) {
    this.tasks.forEach(callback);
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
  setImportanceOptionById(taskId) {
    for (const task of this.tasks) {
      if (Number(task.id) === Number(taskId)) {
        task.important = !task.important;
      }
    }
  }
  clear() {
    this.tasks.length = 0;
  }
  toArray() {
    return this.tasks;
  }
  toJSON() {
    return this.tasks;
  }
}
export default TaskCollection;
export {TaskCollection};

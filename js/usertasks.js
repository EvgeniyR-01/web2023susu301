'use strict';
import {TaskCollection} from './task-collection';
class UserTasks {
  constructor(user, taskCollection = null) {
    this.user = user;
    if (taskCollection === null) {
      this.taskCollection = new TaskCollection();
    } else {
      this.taskCollection = taskCollection;
    }
  }
  addTask(task) {
    this.taskCollection.add(task);
  }
  removeTask(task) {
    this.taskCollection.remove(task);
  }
  getTaskCollection() {
    return this.taskCollection;
  }
  getTasks() {
    return this.taskCollection.getTasks();
  }
  getUser() {
    return this.user;
  }
}
export default UserTasks;
export {UserTasks};

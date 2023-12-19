'use strict';

import {User} from './user';
import {Task} from './task';
import {TaskCollection} from './task-collection';

class UserTasks {
  private user: User;
  private taskCollection: TaskCollection;

  public constructor(user: User, taskCollection: TaskCollection | null = null) {
    this.user = user;
    if (taskCollection === null) {
      this.taskCollection = new TaskCollection();
    } else {
      this.taskCollection = taskCollection;
    }
  }

  public addTask(task: Task): void {
    this.taskCollection.add(task);
  }

  public removeTask(task: Task): void {
    this.taskCollection.remove(task);
  }

  public getTaskCollection(): TaskCollection {
    return this.taskCollection;
  }

  public getTasks(): Array<Task> {
    return this.taskCollection.getTasks();
  }

  public getUser(): User {
    return this.user;
  }
}

export default UserTasks;
export {UserTasks};

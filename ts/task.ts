'use strict';

class Task {
  public id: number;
  public userId: number;
  public title: string;
  public body: string;
  public important: boolean;
  public completed: boolean;
  private static numberOfTasks = 0;

  public constructor(userId: number, id: number, title: string, body: string = null, important: boolean = false, completed: boolean = false) {
    ++Task.numberOfTasks;
    if (!id) {
      this.id = Task.numberOfTasks;
    } else {
      this.id = id;
    }
    this.userId = userId;
    this.title = title;
    this.body = body;
    this.important = important;
    this.completed = completed;
  }

  public toObject(): object {
    return {
      userId: this.userId,
      id: this.id,
      title: this.title,
      description: this.body,
      important: this.important,
      completed: this.completed,
    };
  }

  public toObjectWithoutImportanceOption(): object {
    return {
      userId: this.userId,
      id: this.id,
      title: this.title,
      description: this.body,
      completed: this.completed,
    };
  }

  public toObjectWithoutDescriptionAndImportanceOption(): object {
    return {
      userId: this.userId,
      id: this.id,
      title: this.title,
      completed: this.completed,
    };
  }

  public static fromObject(obj: object): Task {
    return new Task(obj['userId'], obj['id'], obj['title'], obj['description'], obj['important'], obj['completed']);
  }

  public toJSON(): object {
    return this.toObjectWithoutImportanceOption();
  }
}

export default Task;
export {Task};

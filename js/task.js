'use strict';
class Task {
  constructor(userId, id, title, body = null, important = false, completed = false) {
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
  toObject() {
    return {
      userId: this.userId,
      id: this.id,
      title: this.title,
      description: this.body,
      important: this.important,
      completed: this.completed,
    };
  }
  toObjectWithoutImportanceOption() {
    return {
      userId: this.userId,
      id: this.id,
      title: this.title,
      description: this.body,
      completed: this.completed,
    };
  }
  toObjectWithoutDescriptionAndImportanceOption() {
    return {
      userId: this.userId,
      id: this.id,
      title: this.title,
      completed: this.completed,
    };
  }
  static fromObject(obj) {
    return new Task(obj['userId'], obj['id'], obj['title'], obj['description'], obj['important'], obj['completed']);
  }
  toJSON() {
    return this.toObjectWithoutImportanceOption();
  }
}
Task.numberOfTasks = 0;
export default Task;
export {Task};

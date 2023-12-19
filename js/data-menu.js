'use strict';
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
import {User} from './user';
import {UserCollection} from './user-collection';
import {Task} from './task';
import {TaskCollection} from './task-collection';
import {FetchMenu} from './fetch-menu';
class DataMenuWorkModes {}
DataMenuWorkModes.ADD = 0;
DataMenuWorkModes.EDIT = 1;
DataMenuWorkModes.REMOVE = 2;
DataMenuWorkModes.REMOVE_ALL = 3;
class DataMenu {
  static loadConfig(configPath) {
    return __awaiter(this, void 0, void 0, function* () {
      const response = yield fetch(configPath);
      const config = yield response.json();
      const settings = config['settings'];
      DataMenu.numberOfUsers = settings.numberOfUsers;
      DataMenu.fetchUsersTarget = settings.fetchUsersTarget;
      DataMenu.numberOfTasks = settings.numberOfTasks;
      DataMenu.fetchTasksTarget = settings.fetchTasksTarget;
    });
  }
  static loadUserFromServer(fetchUsersTarget, targetUserId) {
    return __awaiter(this, void 0, void 0, function* () {
      if (!fetchUsersTarget.endsWith('/')) {
        fetchUsersTarget += '/';
      }
      const itemData = yield FetchMenu.loadItem(fetchUsersTarget + targetUserId.toString());
      const user = User.fromObject(itemData);
      DataMenu.users.add(user);
    });
  }
  static loadUsersFromServer(fetchUsersTarget, numberOfUsers) {
    return __awaiter(this, void 0, void 0, function* () {
      const itemsData = yield FetchMenu.loadAllItems(fetchUsersTarget);
      for (let i = 0; i < numberOfUsers; i++) {
        const user = User.fromObject(itemsData[i]);
        DataMenu.users.add(user);
      }
    });
  }
  static saveUserOnServer(fetchUsersTarget, targetUser) {
    return __awaiter(this, void 0, void 0, function* () {
      if (!fetchUsersTarget.endsWith('/')) {
        fetchUsersTarget += '/';
      }
      yield FetchMenu.editItem(fetchUsersTarget + targetUser.id, targetUser);
    });
  }
  static saveUsersOnSever(fetchUsersTarget) {
    return __awaiter(this, void 0, void 0, function* () {
      yield FetchMenu.editAllItems(fetchUsersTarget, DataMenu.users.toArray());
    });
  }
  static deleteUserFromServer(fetchUsersTarget, targetUserId) {
    return __awaiter(this, void 0, void 0, function* () {
      if (!fetchUsersTarget.endsWith('/')) {
        fetchUsersTarget += '/';
      }
      yield FetchMenu.deleteItem(fetchUsersTarget + targetUserId.toString());
    });
  }
  static deleteUsersFromServer(fetchUsersTarget) {
    return __awaiter(this, void 0, void 0, function* () {
      yield FetchMenu.deleteAllItems(fetchUsersTarget, DataMenu.users.toArray());
    });
  }
  static loadTaskFromServer(fetchTasksTarget, targetTaskId) {
    return __awaiter(this, void 0, void 0, function* () {
      if (!fetchTasksTarget.endsWith('/')) {
        fetchTasksTarget += '/';
      }
      const itemData = yield FetchMenu.loadItem(fetchTasksTarget + targetTaskId.toString());
      const task = Task.fromObject(itemData);
      DataMenu.tasks.add(task);
    });
  }
  static loadTasksFromServer(fetchTasksTarget, numberOfTasks) {
    return __awaiter(this, void 0, void 0, function* () {
      const itemsData = yield FetchMenu.loadAllItems(fetchTasksTarget);
      if (numberOfTasks === 'all') {
        itemsData.forEach((itemData) => {
          const task = Task.fromObject(itemData);
          DataMenu.tasks.add(task);
        });
      } else if (typeof numberOfTasks === 'number') {
        for (let i = 0; i < numberOfTasks; i++) {
          try {
            const task = Task.fromObject(itemsData[i]);
            DataMenu.tasks.add(task);
          } catch (err) {
            console.error(err);
            break;
          }
        }
      } else {
        console.error('Wrong type of number of tasks');
      }
    });
  }
  static addTaskOnServer(fetchTasksTarget, targetTask) {
    return __awaiter(this, void 0, void 0, function* () {
      if (!fetchTasksTarget.endsWith('/')) {
        fetchTasksTarget += '/';
      }
      yield FetchMenu.addItem(fetchTasksTarget, targetTask);
    });
  }
  static saveTaskOnServer(fetchTasksTarget, targetTask) {
    return __awaiter(this, void 0, void 0, function* () {
      if (!fetchTasksTarget.endsWith('/')) {
        fetchTasksTarget += '/';
      }
      yield FetchMenu.editItem(fetchTasksTarget + targetTask.id, targetTask);
    });
  }
  static saveTasksOnServer(fetchTasksTarget) {
    return __awaiter(this, void 0, void 0, function* () {
      yield FetchMenu.editAllItems(fetchTasksTarget, DataMenu.tasks.toArray());
    });
  }
  static deleteTask(fetchTasksTarget, targetTaskId) {
    return __awaiter(this, void 0, void 0, function* () {
      if (!fetchTasksTarget.endsWith('/')) {
        fetchTasksTarget += '/';
      }
      yield FetchMenu.deleteItem(fetchTasksTarget + targetTaskId.toString());
    });
  }
  static deleteTasksFromServer(fetchTasksTarget) {
    return __awaiter(this, void 0, void 0, function* () {
      yield FetchMenu.deleteAllItems(fetchTasksTarget, DataMenu.tasks.toArray());
    });
  }
  static loadDataFromServer(fetchUsersTarget, fetchTasksTarget, numberOfUsers, numberOfTasks) {
    return __awaiter(this, void 0, void 0, function* () {
      yield DataMenu.loadUsersFromServer(fetchUsersTarget, numberOfUsers);
      yield DataMenu.loadTasksFromServer(fetchTasksTarget, numberOfTasks);
    });
  }
  static getTasksImportanceOptionFromLocalStorage() {
    return __awaiter(this, void 0, void 0, function* () {
      const storedTasksImportanceOption = localStorage.getItem('tasksImportanceOption');
      if (!storedTasksImportanceOption) {
        localStorage.setItem('tasksImportanceOption', JSON.stringify(Array.from(new Set())));
        return new Set();
      } else {
        const tasksImportanceOption = Array.from(JSON.parse(storedTasksImportanceOption));
        return new Set(tasksImportanceOption);
      }
    });
  }
  static setTasksImportanceOption(tasksImportanceOption) {
    return __awaiter(this, void 0, void 0, function* () {
      if (!tasksImportanceOption) {
        console.error('Tasks importance option not provided');
        return;
      }
      if (tasksImportanceOption.size === 0 || !(tasksImportanceOption instanceof Set)) {
        return;
      }
      DataMenu.tasksImportanceOption = tasksImportanceOption;
      tasksImportanceOption.forEach((taskId) => {
        DataMenu.tasks.setImportanceOptionById(taskId);
      });
    });
  }
  static loadTasksImportanceOption() {
    return __awaiter(this, void 0, void 0, function* () {
      const tasksImportanceOption = yield DataMenu.getTasksImportanceOptionFromLocalStorage();
      yield DataMenu.setTasksImportanceOption(tasksImportanceOption);
    });
  }
  static saveTasksImportanceOptionToLocalStorage() {
    return __awaiter(this, void 0, void 0, function* () {
      localStorage.setItem('tasksImportanceOption', JSON.stringify(Array.from(DataMenu.tasksImportanceOption)));
    });
  }
  static deleteTasksImportanceOptionFromLocalStorage() {
    return __awaiter(this, void 0, void 0, function* () {
      localStorage.removeItem('tasksImportanceOption');
    });
  }
  static getUser(targetUser) {
    return DataMenu.users.find(targetUser);
  }
  static getUserById(targetUserId) {
    return DataMenu.users.findById(targetUserId);
  }
  static getUserTaskCollection(user) {
    return DataMenu.tasks.getTasksByUserId(user.id);
  }
  static getUserTaskCollectionByUserId(targetUserId) {
    return DataMenu.tasks.getTasksByUserId(targetUserId);
  }
  static addTask(task) {
    return __awaiter(this, void 0, void 0, function* () {
      if (!task) {
        console.error('Task not provided');
        return;
      }
      DataMenu.workMode = DataMenuWorkModes.ADD;
      console.log(`Adding task (id=${task.id}) from user (id=${task.userId})`);
      DataMenu.tasks.add(task);
      if (task.important) {
        DataMenu.tasksImportanceOption.add(task.id);
      }
      yield DataMenu.saveTasksImportanceOptionToLocalStorage();
      yield DataMenu.addTaskOnServer(DataMenu.fetchTasksTarget, task);
    });
  }
  static editTask(task, taskTitle = null, taskBody = null, taskIsImportant = false, taskIsCompleted = false) {
    return __awaiter(this, void 0, void 0, function* () {
      if (!task) {
        console.error('Task not provided');
        return;
      }
      DataMenu.workMode = DataMenuWorkModes.EDIT;
      const taskToEdit = DataMenu.tasks.find(task);
      if (taskToEdit) {
        console.log(`Editing task (id=${task.id}) from user (id=${task.userId})`);
        if (taskTitle) {
          taskToEdit.title = taskTitle;
        }
        if (taskBody) {
          taskToEdit.body = taskBody;
        }
        taskToEdit.important = taskIsImportant;
        taskToEdit.completed = taskIsCompleted;
      }
      if (task.important) {
        DataMenu.tasksImportanceOption.add(task.id);
      } else {
        DataMenu.tasksImportanceOption.delete(task.id);
      }
      yield DataMenu.saveTasksImportanceOptionToLocalStorage();
      yield DataMenu.saveTaskOnServer(DataMenu.fetchTasksTarget, task);
    });
  }
  static removeTask(task) {
    return __awaiter(this, void 0, void 0, function* () {
      if (!task) {
        console.error('Task not provided');
        return;
      }
      DataMenu.workMode = DataMenuWorkModes.REMOVE;
      const taskToRemove = DataMenu.tasks.find(task);
      console.log(`Removing task (id=${task.id}) from user (id=${task.userId})`);
      if (taskToRemove) {
        DataMenu.tasksImportanceOption.delete(task.id);
        yield DataMenu.saveTasksImportanceOptionToLocalStorage();
        DataMenu.tasks.remove(taskToRemove);
        yield DataMenu.deleteTask(DataMenu.fetchTasksTarget, task.id);
      }
    });
  }
  static removeAllTasks(user) {
    return __awaiter(this, void 0, void 0, function* () {
      if (!user) {
        console.error('User not found');
        return;
      }
      DataMenu.workMode = DataMenuWorkModes.REMOVE_ALL;
      yield DataMenu.deleteTasksImportanceOptionFromLocalStorage();
      DataMenu.tasksImportanceOption.clear();
      yield DataMenu.deleteTasksFromServer(DataMenu.fetchTasksTarget);
      DataMenu.tasks.clear();
    });
  }
}
DataMenu.numberOfUsers = 0;
DataMenu.users = new UserCollection();
DataMenu.numberOfTasks = 0;
DataMenu.tasks = new TaskCollection();
DataMenu.currentTask = null;
DataMenu.currentUser = null;
DataMenu.tasksImportanceOption = new Set();
DataMenu.fetchUsersTarget = '';
DataMenu.fetchTasksTarget = '';
DataMenu.workMode = DataMenuWorkModes.ADD;
export default DataMenu;
export {DataMenu, DataMenuWorkModes};

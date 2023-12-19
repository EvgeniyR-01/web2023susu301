'use strict';

// import * as $ from 'jquery';
import {User} from './user';
import {UserCollection} from './user-collection';
import {Task} from './task';
import {TaskCollection} from './task-collection';
import {UserTasks} from './usertasks';
import {PageMenu} from './page-menu';
import {FetchMenu} from './fetch-menu';

class DataMenuWorkModes {
  public static ADD = 0;
  public static EDIT = 1;
  public static REMOVE = 2;
  public static REMOVE_ALL = 3;
}

class DataMenu {
  public static numberOfUsers: number = 0;
  public static users: UserCollection = new UserCollection();
  public static numberOfTasks: number | string = 0;
  public static tasks: TaskCollection = new TaskCollection();
  public static currentTask: Task = null;
  public static currentUser: User = null;
  public static tasksImportanceOption: Set<number> = new Set<number>(); // список с ID задач, отмеченных важными
  public static fetchUsersTarget: string = '';
  public static fetchTasksTarget: string = '';
  public static workMode: number = DataMenuWorkModes.ADD;

  // Загрузка файла конфигурации
  public static async loadConfig(configPath: string): Promise<void> {
    const response = await fetch(configPath);
    const config = await response.json();
    const settings = config['settings'];
    DataMenu.numberOfUsers = settings.numberOfUsers;
    DataMenu.fetchUsersTarget = settings.fetchUsersTarget;
    DataMenu.numberOfTasks = settings.numberOfTasks;
    DataMenu.fetchTasksTarget = settings.fetchTasksTarget;
  }

  // Запросы на получение, изменение, удаление данных пользователей с сервера

  public static async loadUserFromServer(fetchUsersTarget: string, targetUserId: number): Promise<void> {
    if (!fetchUsersTarget.endsWith('/')) {
      fetchUsersTarget += '/';
    }
    const itemData = await FetchMenu.loadItem(fetchUsersTarget + targetUserId.toString());
    const user = User.fromObject(itemData);
    DataMenu.users.add(user);
  }

  public static async loadUsersFromServer(fetchUsersTarget: string, numberOfUsers: number): Promise<void> {
    const itemsData = await FetchMenu.loadAllItems(fetchUsersTarget);
    for (let i = 0; i < numberOfUsers; i++) {
      const user = User.fromObject(itemsData[i]);
      DataMenu.users.add(user);
    }
  }

  public static async saveUserOnServer(fetchUsersTarget: string, targetUser: User): Promise<void> {
    if (!fetchUsersTarget.endsWith('/')) {
      fetchUsersTarget += '/';
    }
    await FetchMenu.editItem(fetchUsersTarget + targetUser.id, targetUser);
  }

  public static async saveUsersOnSever(fetchUsersTarget: string): Promise<void> {
    await FetchMenu.editAllItems(fetchUsersTarget, DataMenu.users.toArray());
  }

  public static async deleteUserFromServer(fetchUsersTarget: string, targetUserId: number): Promise<void> {
    if (!fetchUsersTarget.endsWith('/')) {
      fetchUsersTarget += '/';
    }
    await FetchMenu.deleteItem(fetchUsersTarget + targetUserId.toString());
  }

  public static async deleteUsersFromServer(fetchUsersTarget: string): Promise<void> {
    await FetchMenu.deleteAllItems(fetchUsersTarget, DataMenu.users.toArray());
  }

  // Запросы на получение, добавление, изменение, удаление задач на сервере

  public static async loadTaskFromServer(fetchTasksTarget: string, targetTaskId: number): Promise<void> {
    if (!fetchTasksTarget.endsWith('/')) {
      fetchTasksTarget += '/';
    }
    const itemData = await FetchMenu.loadItem(fetchTasksTarget + targetTaskId.toString());
    const task = Task.fromObject(itemData);
    DataMenu.tasks.add(task);
  }

  public static async loadTasksFromServer(fetchTasksTarget: string, numberOfTasks: number | string): Promise<void> {
    const itemsData = await FetchMenu.loadAllItems(fetchTasksTarget);
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
  }

  public static async addTaskOnServer(fetchTasksTarget: string, targetTask: Task): Promise<void> {
    if (!fetchTasksTarget.endsWith('/')) {
      fetchTasksTarget += '/';
    }
    await FetchMenu.addItem(fetchTasksTarget, targetTask);
  }

  public static async saveTaskOnServer(fetchTasksTarget: string, targetTask: Task): Promise<void> {
    if (!fetchTasksTarget.endsWith('/')) {
      fetchTasksTarget += '/';
    }
    await FetchMenu.editItem(fetchTasksTarget + targetTask.id, targetTask);
  }

  public static async saveTasksOnServer(fetchTasksTarget: string): Promise<void> {
    await FetchMenu.editAllItems(fetchTasksTarget, DataMenu.tasks.toArray());
  }

  public static async deleteTask(fetchTasksTarget: string, targetTaskId: number): Promise<void> {
    if (!fetchTasksTarget.endsWith('/')) {
      fetchTasksTarget += '/';
    }
    await FetchMenu.deleteItem(fetchTasksTarget + targetTaskId.toString());
  }

  public static async deleteTasksFromServer(fetchTasksTarget: string): Promise<void> {
    await FetchMenu.deleteAllItems(fetchTasksTarget, DataMenu.tasks.toArray());
  }

  public static async loadDataFromServer(fetchUsersTarget: string, fetchTasksTarget: string, numberOfUsers: number, numberOfTasks: number | string): Promise<void> {
    await DataMenu.loadUsersFromServer(fetchUsersTarget, numberOfUsers);
    await DataMenu.loadTasksFromServer(fetchTasksTarget, numberOfTasks);
  }

  // Методы для работы с локальным хранилищем

  public static async getTasksImportanceOptionFromLocalStorage(): Promise<Set<number>> {
    const storedTasksImportanceOption = localStorage.getItem('tasksImportanceOption');
    if (!storedTasksImportanceOption) {
      localStorage.setItem('tasksImportanceOption', JSON.stringify(Array.from(new Set<number>())));
      return new Set<number>();
    } else {
      const tasksImportanceOption: Array<number> = Array.from(JSON.parse(storedTasksImportanceOption));
      return new Set<number>(tasksImportanceOption);
    }
  }

  public static async setTasksImportanceOption(tasksImportanceOption: Set<number>): Promise<void> {
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
  }

  public static async loadTasksImportanceOption(): Promise<void> {
    const tasksImportanceOption = await DataMenu.getTasksImportanceOptionFromLocalStorage();
    await DataMenu.setTasksImportanceOption(tasksImportanceOption);
  }

  public static async saveTasksImportanceOptionToLocalStorage(): Promise<void> {
    localStorage.setItem('tasksImportanceOption', JSON.stringify(Array.from(DataMenu.tasksImportanceOption)));
  }

  public static async deleteTasksImportanceOptionFromLocalStorage(): Promise<void> {
    localStorage.removeItem('tasksImportanceOption');
  }

  // Методы для работы с локальной копией данных

  public static getUser(targetUser: User): User {
    return DataMenu.users.find(targetUser);
  }

  public static getUserById(targetUserId: number): User {
    return DataMenu.users.findById(targetUserId);
  }

  public static getUserTaskCollection(user: User): TaskCollection {
    return DataMenu.tasks.getTasksByUserId(user.id);
  }

  public static getUserTaskCollectionByUserId(targetUserId: number) {
    return DataMenu.tasks.getTasksByUserId(targetUserId);
  }

  public static async addTask(task: Task): Promise<void> {
    if (!task) {
      console.error('Task not provided');
      return;
    }

    DataMenu.workMode = DataMenuWorkModes.ADD;

    console.log(`Adding task (id=${task.id}) from user (id=${task.userId})`);
    DataMenu.tasks.add(task);
    if (task.important) {
      // добавляем в список важных задач, сохраняемых в localStorage
      DataMenu.tasksImportanceOption.add(task.id);
    }

    await DataMenu.saveTasksImportanceOptionToLocalStorage();
    await DataMenu.addTaskOnServer(DataMenu.fetchTasksTarget, task);
  }

  public static async editTask(task: Task, taskTitle: string = null, taskBody: string = null, taskIsImportant: boolean = false, taskIsCompleted: boolean = false): Promise<void> {
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
      // добавляем в список важных задач, сохраняемых в localStorage
      DataMenu.tasksImportanceOption.add(task.id);
    } else {
      DataMenu.tasksImportanceOption.delete(task.id);
    }

    await DataMenu.saveTasksImportanceOptionToLocalStorage();
    await DataMenu.saveTaskOnServer(DataMenu.fetchTasksTarget, task);
  }

  public static async removeTask(task: Task): Promise<void> {
    if (!task) {
      console.error('Task not provided');
      return;
    }

    DataMenu.workMode = DataMenuWorkModes.REMOVE;

    const taskToRemove = DataMenu.tasks.find(task);
    console.log(`Removing task (id=${task.id}) from user (id=${task.userId})`);

    if (taskToRemove) {
      DataMenu.tasksImportanceOption.delete(task.id); // убираем из списка важных задач, хранимых в localStorage
      await DataMenu.saveTasksImportanceOptionToLocalStorage();
      DataMenu.tasks.remove(taskToRemove);
      await DataMenu.deleteTask(DataMenu.fetchTasksTarget, task.id);
    }
  }

  public static async removeAllTasks(user: User): Promise<void> {
    if (!user) {
      console.error('User not found');
      return;
    }
    DataMenu.workMode = DataMenuWorkModes.REMOVE_ALL;

    await DataMenu.deleteTasksImportanceOptionFromLocalStorage();
    DataMenu.tasksImportanceOption.clear();
    await DataMenu.deleteTasksFromServer(DataMenu.fetchTasksTarget);
    DataMenu.tasks.clear();
  }
}

export default DataMenu;
export {DataMenu, DataMenuWorkModes};

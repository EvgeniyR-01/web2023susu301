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
import 'normalize.css';
import '../index.less';
import {Task} from './task';
import {PageMenu} from './page-menu';
import {DataMenu, DataMenuWorkModes} from './data-menu';
document.addEventListener('DOMContentLoaded', function (event) {
  return __awaiter(this, void 0, void 0, function* () {
    PageMenu.setTheme(PageMenu.getPreferredTheme());
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    themeToggleBtn.addEventListener('click', function (event) {
      return __awaiter(this, void 0, void 0, function* () {
        event.preventDefault();
        const toggledTheme = PageMenu.getPreferredTheme() === 'dark' ? 'light' : 'dark';
        PageMenu.setTheme(toggledTheme);
        PageMenu.setStoredTheme(toggledTheme);
      });
    });
    const toggleVerticalNavBarBtn = document.getElementById('toggle-vertical-navbar-btn');
    const verticalNavBar = document.getElementById('vertical-navbar');
    const allPageContent = document.getElementById('all-page-content');
    toggleVerticalNavBarBtn.addEventListener('click', function (event) {
      if (verticalNavBar.style.display === 'none') {
        verticalNavBar.style.display = 'block';
        allPageContent.style.marginLeft = verticalNavBar.style.width;
      } else {
        verticalNavBar.style.display = 'none';
        allPageContent.style.marginLeft = '0';
      }
    });
    $('.sortable-ul').sortable();
    const userSelect = document.getElementById('user-select');
    const addTaskBtn = document.getElementById('add-task-btn');
    const editTaskBtn = document.getElementById('edit-task-btn');
    const removeTaskBtn = document.getElementById('remove-task-btn');
    const saveTaskBtn = document.getElementById('task-modal-save-btn');
    const removeAllTasksBtn = document.getElementById('remove-all-tasks-btn');
    const confirmationModalConfirmBtn = document.getElementById('confirmation-modal-confirm-btn');
    userSelect.addEventListener('change', function (event) {
      return __awaiter(this, void 0, void 0, function* () {
        const selectedUserId = parseInt(userSelect.value);
        const user = DataMenu.getUserById(selectedUserId);
        if (user) {
          DataMenu.currentUser = user;
          yield PageMenu.renderTasks();
        }
      });
    });
    document.addEventListener('click', function (event) {
      return __awaiter(this, void 0, void 0, function* () {
        const clickedElement = event.target;
        if (!(clickedElement.closest('#horizontal-navbar') || clickedElement.closest('#vertical-navbar') || clickedElement.closest('#task-modal') || clickedElement.closest('ul'))) {
          yield PageMenu.deselectCurrentTask();
          yield PageMenu.deactivateBtn('edit-task-btn');
          yield PageMenu.deactivateBtn('remove-task-btn');
        }
      });
    });
    addTaskBtn.addEventListener('click', function (event) {
      return __awaiter(this, void 0, void 0, function* () {
        event.preventDefault();
        DataMenu.workMode = DataMenuWorkModes.ADD;
        yield PageMenu.openModal();
      });
    });
    editTaskBtn.addEventListener('click', function (event) {
      return __awaiter(this, void 0, void 0, function* () {
        event.preventDefault();
        const task = DataMenu.currentTask;
        DataMenu.workMode = DataMenuWorkModes.EDIT;
        yield PageMenu.openModal(task);
      });
    });
    removeTaskBtn.addEventListener('click', function (event) {
      return __awaiter(this, void 0, void 0, function* () {
        event.preventDefault();
        DataMenu.workMode = DataMenuWorkModes.REMOVE;
        const task = DataMenu.currentTask;
        if (task === null || task === void 0 ? void 0 : task.important) {
          $('#confirmation-modal').modal('show');
          return;
        }
        yield PageMenu.deselectCurrentTask();
        yield DataMenu.removeTask(task);
        yield PageMenu.renderTasks();
      });
    });
    removeAllTasksBtn.addEventListener('click', function (event) {
      event.preventDefault();
      DataMenu.workMode = DataMenuWorkModes.REMOVE_ALL;
    });
    confirmationModalConfirmBtn.addEventListener('click', function (event) {
      return __awaiter(this, void 0, void 0, function* () {
        event.preventDefault();
        if (DataMenu.workMode === DataMenuWorkModes.REMOVE) {
          yield DataMenu.removeTask(DataMenu.currentTask);
        } else if (DataMenu.workMode === DataMenuWorkModes.REMOVE_ALL) {
          yield DataMenu.removeAllTasks(DataMenu.currentUser);
        }
        yield PageMenu.deselectCurrentTask();
        yield PageMenu.renderTasks();
      });
    });
    saveTaskBtn.addEventListener('click', function (event) {
      return __awaiter(this, void 0, void 0, function* () {
        event.preventDefault();
        if (!PageMenu.checkValidForm('task-modal-form')) {
          return;
        }
        const currentUser = DataMenu.currentUser;
        const taskTitle = document.getElementById('task-modal-task-title');
        const taskDescription = document.getElementById('task-modal-task-description');
        const taskIsImportantCheckbox = document.getElementById('task-modal-task-is-important-checkbox');
        const taskIsCompletedCheckbox = document.getElementById('task-modal-task-is-completed-checkbox');
        if (DataMenu.workMode === DataMenuWorkModes.EDIT) {
          const task = DataMenu.currentTask;
          yield DataMenu.editTask(task, taskTitle.value, taskDescription.value, taskIsImportantCheckbox.checked, taskIsCompletedCheckbox.checked);
          yield PageMenu.renderTasks();
        } else {
          const newTask = new Task(DataMenu.currentUser.id, null, taskTitle.value, taskDescription.value, taskIsImportantCheckbox.checked, taskIsCompletedCheckbox.checked);
          yield DataMenu.addTask(newTask);
          yield PageMenu.renderTasks();
        }
        $('#task-modal').modal('hide');
      });
    });
    yield DataMenu.loadConfig('config.json');
    yield DataMenu.loadDataFromServer(DataMenu.fetchUsersTarget, DataMenu.fetchTasksTarget, DataMenu.numberOfUsers, DataMenu.numberOfTasks);
    yield DataMenu.loadTasksImportanceOption();
    yield PageMenu.renderTasks();
    yield PageMenu.hideLoader('tasks-loader');
    yield PageMenu.activateBtn('add-task-btn');
    DataMenu.currentUser = DataMenu.users.get(0);
    DataMenu.users.forEach((user) => {
      const option = document.createElement('option');
      option.value = user.id.toString();
      option.text = user.name;
      userSelect.add(option);
    });
  });
});

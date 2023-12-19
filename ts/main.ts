'use strict';

import 'normalize.css';
import '../index.less';

import {User} from './user';
import {UserCollection} from './user-collection';
import {Task} from './task';
import {TaskCollection} from './task-collection';
import {UserTasks} from './usertasks';
import {PageMenu} from './page-menu';
import {DataMenu, DataMenuWorkModes} from './data-menu';

document.addEventListener('DOMContentLoaded', async function (event) {
  PageMenu.setTheme(PageMenu.getPreferredTheme());

  const themeToggleBtn = document.getElementById('theme-toggle-btn') as HTMLButtonElement;
  themeToggleBtn.addEventListener('click', async function (event) {
    event.preventDefault();
    const toggledTheme = PageMenu.getPreferredTheme() === 'dark' ? 'light' : 'dark';
    PageMenu.setTheme(toggledTheme);
    PageMenu.setStoredTheme(toggledTheme);
  });

  const toggleVerticalNavBarBtn = document.getElementById('toggle-vertical-navbar-btn') as HTMLButtonElement;
  const verticalNavBar = document.getElementById('vertical-navbar') as HTMLElement;
  const allPageContent = document.getElementById('all-page-content') as HTMLElement;

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

  const userSelect = document.getElementById('user-select') as HTMLSelectElement;
  const addTaskBtn = document.getElementById('add-task-btn') as HTMLButtonElement;
  const editTaskBtn = document.getElementById('edit-task-btn') as HTMLButtonElement;
  const removeTaskBtn = document.getElementById('remove-task-btn') as HTMLButtonElement;
  const saveTaskBtn = document.getElementById('task-modal-save-btn') as HTMLButtonElement;
  const removeAllTasksBtn = document.getElementById('remove-all-tasks-btn') as HTMLButtonElement;
  const confirmationModalConfirmBtn = document.getElementById('confirmation-modal-confirm-btn') as HTMLButtonElement;

  userSelect.addEventListener('change', async function (event) {
    const selectedUserId = parseInt(userSelect.value);
    const user = DataMenu.getUserById(selectedUserId);
    if (user) {
      DataMenu.currentUser = user;
      // await PageMenu.renderTasks(user);
      await PageMenu.renderTasks();
    }
  });

  document.addEventListener('click', async function (event) {
    const clickedElement = event.target as Element;
    if (!(clickedElement.closest('#horizontal-navbar') || clickedElement.closest('#vertical-navbar') || clickedElement.closest('#task-modal') || clickedElement.closest('ul'))) {
      await PageMenu.deselectCurrentTask();
      await PageMenu.deactivateBtn('edit-task-btn');
      await PageMenu.deactivateBtn('remove-task-btn');
    }
  });

  addTaskBtn.addEventListener('click', async function (event) {
    event.preventDefault();
    DataMenu.workMode = DataMenuWorkModes.ADD;
    await PageMenu.openModal();
  });

  editTaskBtn.addEventListener('click', async function (event) {
    event.preventDefault();
    const task = DataMenu.currentTask;
    DataMenu.workMode = DataMenuWorkModes.EDIT;
    await PageMenu.openModal(task);
  });

  removeTaskBtn.addEventListener('click', async function (event) {
    event.preventDefault();
    DataMenu.workMode = DataMenuWorkModes.REMOVE;
    const task = DataMenu.currentTask;
    if (task?.important) {
      $('#confirmation-modal').modal('show');
      return;
    }
    await PageMenu.deselectCurrentTask();
    await DataMenu.removeTask(task);
    await PageMenu.renderTasks();
  });

  removeAllTasksBtn.addEventListener('click', function (event) {
    event.preventDefault();
    DataMenu.workMode = DataMenuWorkModes.REMOVE_ALL;
  });

  confirmationModalConfirmBtn.addEventListener('click', async function (event) {
    event.preventDefault();
    if (DataMenu.workMode === DataMenuWorkModes.REMOVE) {
      await DataMenu.removeTask(DataMenu.currentTask);
    } else if (DataMenu.workMode === DataMenuWorkModes.REMOVE_ALL) {
      await DataMenu.removeAllTasks(DataMenu.currentUser);
    }
    await PageMenu.deselectCurrentTask();
    await PageMenu.renderTasks();
  });

  saveTaskBtn.addEventListener('click', async function (event) {
    event.preventDefault();

    if (!PageMenu.checkValidForm('task-modal-form')) {
      return;
    }

    const currentUser = DataMenu.currentUser;
    const taskTitle = document.getElementById('task-modal-task-title') as HTMLInputElement;
    const taskDescription = document.getElementById('task-modal-task-description') as HTMLInputElement;
    const taskIsImportantCheckbox = document.getElementById('task-modal-task-is-important-checkbox') as HTMLInputElement;
    const taskIsCompletedCheckbox = document.getElementById('task-modal-task-is-completed-checkbox') as HTMLInputElement;

    if (DataMenu.workMode === DataMenuWorkModes.EDIT) {
      const task = DataMenu.currentTask;
      await DataMenu.editTask(task, taskTitle.value, taskDescription.value, taskIsImportantCheckbox.checked, taskIsCompletedCheckbox.checked);
      await PageMenu.renderTasks();
    } else {
      const newTask = new Task(DataMenu.currentUser.id, null, taskTitle.value, taskDescription.value, taskIsImportantCheckbox.checked, taskIsCompletedCheckbox.checked);
      await DataMenu.addTask(newTask);
      await PageMenu.renderTasks();
    }

    $('#task-modal').modal('hide');
  });

  await DataMenu.loadConfig('config.json');
  await DataMenu.loadDataFromServer(DataMenu.fetchUsersTarget, DataMenu.fetchTasksTarget, DataMenu.numberOfUsers, DataMenu.numberOfTasks);
  await DataMenu.loadTasksImportanceOption();
  await PageMenu.renderTasks();
  await PageMenu.hideLoader('tasks-loader');
  await PageMenu.activateBtn('add-task-btn');
  DataMenu.currentUser = DataMenu.users.get(0);

  DataMenu.users.forEach((user) => {
    const option = document.createElement('option') as HTMLOptionElement;
    option.value = user.id.toString();
    option.text = user.name;
    userSelect.add(option);
  });
});

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
import {DataMenu, DataMenuWorkModes} from './data-menu';
class PageMenu {
  static getLightThemeIcon() {
    const altText = 'Sun';
    const iconSrc = './src/images/sun.svg';
    return `<img src="${iconSrc}" alt="${altText}">`;
  }
  static getDarkThemeIcon() {
    const altText = 'Moon';
    const iconSrc = './src/images/moon.svg';
    return `<img src="${iconSrc}" alt="${altText}">`;
  }
  static switchThemeIcon(theme) {
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    if (theme === 'dark') {
      themeToggleBtn.classList.remove('btn-secondary');
      themeToggleBtn.classList.add('btn-warning');
      themeToggleBtn.title = 'Сменить тему на светлую';
      themeToggleBtn.innerHTML = PageMenu.getLightThemeIcon();
    } else {
      themeToggleBtn.classList.remove('btn-warning');
      themeToggleBtn.classList.add('btn-secondary');
      themeToggleBtn.title = 'Сменить тему на тёмную';
      themeToggleBtn.innerHTML = PageMenu.getDarkThemeIcon();
    }
  }
  static getStoredTheme() {
    return localStorage.getItem('theme');
  }
  static setStoredTheme(theme) {
    localStorage.setItem('theme', theme);
  }
  static getPreferredTheme() {
    const storedTheme = PageMenu.getStoredTheme();
    if (storedTheme) {
      return storedTheme;
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  static setTheme(theme) {
    if (theme === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.documentElement.setAttribute('data-bs-theme', 'dark');
      PageMenu.switchThemeIcon('dark');
    } else {
      document.documentElement.setAttribute('data-bs-theme', theme);
      PageMenu.switchThemeIcon(theme);
    }
  }
  static showLoader(loaderId) {
    return __awaiter(this, void 0, void 0, function* () {
      document.getElementById(loaderId).classList.remove('d-none');
    });
  }
  static hideLoader(loaderId) {
    return __awaiter(this, void 0, void 0, function* () {
      document.getElementById(loaderId).classList.add('d-none');
    });
  }
  static activateAllButtons() {
    return __awaiter(this, void 0, void 0, function* () {
      const buttons = document.getElementsByTagName('button');
      for (let i = 0; i < buttons.length; i++) {
        buttons[i].disabled = false;
      }
    });
  }
  static deactivateAllButtons() {
    return __awaiter(this, void 0, void 0, function* () {
      const buttons = document.getElementsByTagName('button');
      for (let i = 0; i < buttons.length; i++) {
        buttons[i].disabled = true;
      }
    });
  }
  static activateBtn(btnId) {
    return __awaiter(this, void 0, void 0, function* () {
      const btn = document.getElementById(btnId);
      if (btn) {
        btn.disabled = false;
      }
    });
  }
  static deactivateBtn(btnId) {
    return __awaiter(this, void 0, void 0, function* () {
      const btn = document.getElementById(btnId);
      if (btn) {
        btn.disabled = true;
      }
    });
  }
  static openModal(task = null) {
    return __awaiter(this, void 0, void 0, function* () {
      if (DataMenu.workMode === DataMenuWorkModes.ADD) {
        const userSelect = document.getElementById('user-select');
        const selectedUserId = parseInt(userSelect.value);
        const user = DataMenu.getUserById(selectedUserId);
        if (user) {
          DataMenu.currentUser = user;
        }
      } else if (DataMenu.workMode === DataMenuWorkModes.EDIT) {
        const userSelect = document.getElementById('user-select');
        userSelect.value = task.userId.toString();
      }
      const taskModalTitle = document.getElementById('task-modal-task-title');
      const taskModalDescription = document.getElementById('task-modal-task-description');
      const taskModalIsImportantCheckbox = document.getElementById('task-modal-task-is-important-checkbox');
      const taskModalIsCompletedCheckbox = document.getElementById('task-modal-task-is-completed-checkbox');
      taskModalTitle.value = '';
      taskModalDescription.value = '';
      taskModalIsImportantCheckbox.checked = false;
      taskModalIsCompletedCheckbox.checked = false;
      if (task === null || task === void 0 ? void 0 : task.title) {
        taskModalTitle.value = task.title;
      }
      if (task === null || task === void 0 ? void 0 : task.body) {
        taskModalDescription.value = task.body;
      }
      if (task === null || task === void 0 ? void 0 : task.important) {
        taskModalIsImportantCheckbox.checked = task.important;
      }
      if (task === null || task === void 0 ? void 0 : task.completed) {
        taskModalIsCompletedCheckbox.checked = task.completed;
      }
      $('#task-modal').modal('show');
    });
  }
  static checkValidForm(formId) {
    return __awaiter(this, void 0, void 0, function* () {
      const form = document.getElementById(formId);
      if (form.checkValidity() === false) {
        console.log('Form is not valid');
        form.classList.add('was-validated');
        return false;
      } else {
        form.classList.remove('was-validated');
        return true;
      }
    });
  }
  static deselectCurrentTask() {
    return __awaiter(this, void 0, void 0, function* () {
      DataMenu.currentTask = null;
      const listGroupItems = document.querySelectorAll('.list-group-item');
      listGroupItems.forEach(function (item) {
        item.classList.remove('active');
      });
      const editTaskBtn = document.getElementById('edit-task-btn');
      const removeTaskBtn = document.getElementById('remove-task-btn');
      editTaskBtn.disabled = true;
      removeTaskBtn.disabled = true;
    });
  }
  static renderTasks(user = null) {
    return __awaiter(this, void 0, void 0, function* () {
      const importantTaskList = document.getElementById('important-task-list');
      const taskList = document.getElementById('default-task-list');
      const completedTaskList = document.getElementById('completed-task-list');
      importantTaskList.innerHTML = '';
      taskList.innerHTML = '';
      completedTaskList.innerHTML = '';
      let taskCollection = null;
      if (user) {
        taskCollection = DataMenu.getUserTaskCollection(user);
      } else {
        taskCollection = DataMenu.tasks;
      }
      if ((taskCollection === null || taskCollection === void 0 ? void 0 : taskCollection.length) === 0) {
        yield Promise.all([PageMenu.deactivateBtn('edit-task-btn'), PageMenu.deactivateBtn('remove-task-btn'), PageMenu.deactivateBtn('remove-all-tasks-btn'), PageMenu.deselectCurrentTask()]);
        return;
      } else {
        yield PageMenu.activateBtn('remove-all-tasks-btn');
      }
      taskCollection.forEach((task) => {
        const taskUserId = task.userId;
        const taskUser = DataMenu.users.findById(taskUserId);
        const listItem = document.createElement('li');
        listItem.className = 'list-group-item';
        if (task === DataMenu.currentTask) {
          listItem.classList.add('active');
        }
        if (task.completed) {
          listItem.classList.add('border-success', 'border-2');
          completedTaskList.appendChild(listItem);
        } else if (task.important) {
          listItem.classList.add('border-warning', 'border-2');
          importantTaskList.appendChild(listItem);
        } else {
          taskList.appendChild(listItem);
        }
        listItem.innerHTML = `
        <strong>${taskUser.name}</strong>: ${task.title}
      `;
        listItem.addEventListener('click', function (event) {
          return __awaiter(this, void 0, void 0, function* () {
            event.preventDefault();
            yield PageMenu.deselectCurrentTask();
            yield Promise.all([PageMenu.activateBtn('edit-task-btn'), PageMenu.activateBtn('remove-task-btn')]);
            listItem.classList.add('active');
            DataMenu.currentTask = task;
          });
        });
        listItem.addEventListener('dblclick', function (event) {
          return __awaiter(this, void 0, void 0, function* () {
            event.preventDefault();
            DataMenu.workMode = DataMenuWorkModes.EDIT;
            DataMenu.currentTask = task;
            yield PageMenu.openModal(task);
          });
        });
      });
    });
  }
}
export default PageMenu;
export {PageMenu};

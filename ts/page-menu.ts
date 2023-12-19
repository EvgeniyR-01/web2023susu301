import {User} from './user';
import {Task} from './task';
import {DataMenu, DataMenuWorkModes} from './data-menu';
import TaskCollection from './task-collection';

class PageMenu {
  public static getLightThemeIcon(): string {
    const altText = 'Sun';
    const iconSrc = './src/images/sun.svg';
    return `<img src="${iconSrc}" alt="${altText}">`;
  }

  public static getDarkThemeIcon(): string {
    const altText = 'Moon';
    const iconSrc = './src/images/moon.svg';
    return `<img src="${iconSrc}" alt="${altText}">`;
  }

  public static switchThemeIcon(theme) {
    const themeToggleBtn = document.getElementById('theme-toggle-btn') as HTMLButtonElement;
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

  public static getStoredTheme(): string {
    return localStorage.getItem('theme');
  }

  public static setStoredTheme(theme): void {
    localStorage.setItem('theme', theme);
  }

  public static getPreferredTheme(): string {
    const storedTheme = PageMenu.getStoredTheme();
    if (storedTheme) {
      return storedTheme;
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  public static setTheme(theme): void {
    if (theme === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.documentElement.setAttribute('data-bs-theme', 'dark');
      PageMenu.switchThemeIcon('dark');
    } else {
      document.documentElement.setAttribute('data-bs-theme', theme);
      PageMenu.switchThemeIcon(theme);
    }
  }

  public static async showLoader(loaderId: string): Promise<void> {
    document.getElementById(loaderId).classList.remove('d-none');
  }

  public static async hideLoader(loaderId: string): Promise<void> {
    document.getElementById(loaderId).classList.add('d-none');
  }

  public static async activateAllButtons(): Promise<void> {
    const buttons = document.getElementsByTagName('button');
    for (let i = 0; i < buttons.length; i++) {
      buttons[i].disabled = false;
    }
  }

  public static async deactivateAllButtons(): Promise<void> {
    const buttons = document.getElementsByTagName('button');
    for (let i = 0; i < buttons.length; i++) {
      buttons[i].disabled = true;
    }
  }

  public static async activateBtn(btnId: string): Promise<void> {
    const btn = document.getElementById(btnId) as HTMLButtonElement;
    if (btn) {
      btn.disabled = false;
    }
  }

  public static async deactivateBtn(btnId: string): Promise<void> {
    const btn = document.getElementById(btnId) as HTMLButtonElement;
    if (btn) {
      btn.disabled = true;
    }
  }

  public static async openModal(task: Task = null): Promise<void> {
    if (DataMenu.workMode === DataMenuWorkModes.ADD) {
      const userSelect = document.getElementById('user-select') as HTMLSelectElement;
      const selectedUserId = parseInt(userSelect.value);
      const user = DataMenu.getUserById(selectedUserId);
      if (user) {
        DataMenu.currentUser = user;
      }
    } else if (DataMenu.workMode === DataMenuWorkModes.EDIT) {
      const userSelect = document.getElementById('user-select') as HTMLSelectElement;
      userSelect.value = task.userId.toString();
    }

    const taskModalTitle = document.getElementById('task-modal-task-title') as HTMLInputElement;
    const taskModalDescription = document.getElementById('task-modal-task-description') as HTMLInputElement;
    const taskModalIsImportantCheckbox = document.getElementById('task-modal-task-is-important-checkbox') as HTMLInputElement;
    const taskModalIsCompletedCheckbox = document.getElementById('task-modal-task-is-completed-checkbox') as HTMLInputElement;

    // Очищаем поле ввода перед открытием модального окна
    taskModalTitle.value = '';
    taskModalDescription.value = '';
    taskModalIsImportantCheckbox.checked = false;
    taskModalIsCompletedCheckbox.checked = false;

    // Заполним модальное окно данными текущей задачи
    if (task?.title) {
      taskModalTitle.value = task.title;
    }
    if (task?.body) {
      taskModalDescription.value = task.body;
    }
    if (task?.important) {
      taskModalIsImportantCheckbox.checked = task.important;
    }
    if (task?.completed) {
      taskModalIsCompletedCheckbox.checked = task.completed;
    }
    // Откроем модальное окно
    $('#task-modal').modal('show');
  }

  public static async checkValidForm(formId: string): Promise<boolean> {
    const form = document.getElementById(formId) as HTMLFormElement;

    if (form.checkValidity() === false) {
      console.log('Form is not valid');
      form.classList.add('was-validated');
      return false;
    } else {
      form.classList.remove('was-validated');
      return true;
    }
  }

  public static async deselectCurrentTask(): Promise<void> {
    DataMenu.currentTask = null;
    const listGroupItems = document.querySelectorAll('.list-group-item');
    listGroupItems.forEach(function (item) {
      item.classList.remove('active');
    });

    const editTaskBtn = document.getElementById('edit-task-btn') as HTMLButtonElement;
    const removeTaskBtn = document.getElementById('remove-task-btn') as HTMLButtonElement;
    editTaskBtn.disabled = true;
    removeTaskBtn.disabled = true;
  }

  public static async renderTasks(user: User = null): Promise<void> {
    const importantTaskList = document.getElementById('important-task-list');
    const taskList = document.getElementById('default-task-list');
    const completedTaskList = document.getElementById('completed-task-list');

    importantTaskList.innerHTML = '';
    taskList.innerHTML = '';
    completedTaskList.innerHTML = '';

    let taskCollection: TaskCollection = null;
    if (user) {
      // если задан конкретный пользователь, отображаем только его задачи
      taskCollection = DataMenu.getUserTaskCollection(user);
    } else {
      // если не задан пользователь, отображаем все задачи
      taskCollection = DataMenu.tasks;
    }
    if (taskCollection?.length === 0) {
      await Promise.all([PageMenu.deactivateBtn('edit-task-btn'), PageMenu.deactivateBtn('remove-task-btn'), PageMenu.deactivateBtn('remove-all-tasks-btn'), PageMenu.deselectCurrentTask()]);
      return;
    } else {
      await PageMenu.activateBtn('remove-all-tasks-btn');
    }

    taskCollection.forEach((task) => {
      const taskUserId = task.userId;
      const taskUser = DataMenu.users.findById(taskUserId);
      const listItem = document.createElement('li');
      listItem.className = 'list-group-item';

      // чтобы выделение не снималось после закрытия формы
      if (task === DataMenu.currentTask) {
        listItem.classList.add('active');
      }

      // заполняем список выполненных задач (не имеет значения, является ли задача важной)
      if (task.completed) {
        listItem.classList.add('border-success', 'border-2');
        completedTaskList.appendChild(listItem);
      }
      // заполняем список важных задач
      else if (task.important) {
        listItem.classList.add('border-warning', 'border-2');
        importantTaskList.appendChild(listItem);
      }
      // заполняем список обычных задач
      else {
        taskList.appendChild(listItem);
      }

      listItem.innerHTML = `
        <strong>${taskUser.name}</strong>: ${task.title}
      `;

      listItem.addEventListener('click', async function (event) {
        event.preventDefault();
        await PageMenu.deselectCurrentTask();
        await Promise.all([PageMenu.activateBtn('edit-task-btn'), PageMenu.activateBtn('remove-task-btn')]);
        listItem.classList.add('active');
        DataMenu.currentTask = task;
      });

      listItem.addEventListener('dblclick', async function (event) {
        event.preventDefault();
        DataMenu.workMode = DataMenuWorkModes.EDIT;
        DataMenu.currentTask = task;
        await PageMenu.openModal(task);
      });
    });
  }
}

export default PageMenu;
export {PageMenu};

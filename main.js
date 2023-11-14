import 'normalize.css';
import './index.less';

// установка продолжительности фокуса для кнопки
const button = document.getElementById('button-1');
button.addEventListener('click', () => {
  button.focus();

  setTimeout(() => {
    button.blur();
  }, 1000);
});

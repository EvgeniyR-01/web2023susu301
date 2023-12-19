fetch('./modals/confirmation-modal/confirmation-modal.html')
  .then((response) => response.text())
  .then((html) => {
    const modalElement = document.createElement('confirmation-modal');
    modalElement.innerHTML = html;
    document.body.appendChild(modalElement);
  })
  .catch((error) => {
    console.error('Ошибка при загрузке файла:', error);
  });

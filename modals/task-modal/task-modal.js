fetch('./modals/task-modal/task-modal.html')
  .then((response) => response.text())
  .then((html) => {
    const modalElement = document.createElement('task-modal');
    modalElement.innerHTML = html;
    document.body.appendChild(modalElement);
  })
  .then(() => {
    const forms = document.querySelectorAll('.needs-validation');

    // Loop over them and prevent submission
    Array.from(forms).forEach((form) => {
      form.addEventListener(
        'submit',
        (event) => {
          if (!form.checkValidity()) {
            event.preventDefault();
            event.stopPropagation();
          }

          form.classList.add('was-validated');
        },
        false
      );
    });
  })
  .catch((error) => {
    console.error('Ошибка при загрузке файла:', error);
  });

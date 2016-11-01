window.onload = () => {
  console.log('Script linked!');

  const $searchForm = document.querySelector('#search-submit');
  if ($searchForm) {
    const $message = document.querySelector('#message-box');
    let count = 0;
    window.addEventListener('keypress', (e) => {
      if (e.key == 'Enter' && e.ctrlKey) {
        if (count == 1) {
          $searchForm.submit();
        } else {
          $message.innerText = 'Press CTRL + ENTER one more time to submit!';
          $message.style.color = 'red';
          count++;
          setTimeout(() => {
            $message.innerText = 'Press CTRL + ENTER to submit!';
            $message.style.color = 'black';
          }, 3000);
        }
      }
    });
  }
}

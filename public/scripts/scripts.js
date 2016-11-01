window.onload = () => {
  console.log('Script linked!');

  // the following functionality allows a user to use the control and enter keys to submit the search
  // get the search form
  const $searchForm = document.querySelector('#search-submit');
  // check if it exists. Necessary because this script file is loaded onto all pages on our site
  if ($searchForm) {
    // if the form exists, then get the message box object
    const $message = document.querySelector('#message-box');
    // initialize a count to force the user to press the keys twice to submit
    let count = 0;
    window.addEventListener('keypress', (e) => {
      if (e.key == 'Enter' && e.ctrlKey) {
        // user pressed twice! let's go
        if (count == 1) {
          // do the submit on the form
          $searchForm.submit();
        // user only clicked once - tell them to click again!
        } else {
          $message.innerText = 'Press CTRL + ENTER one more time to submit!';
          $message.style.color = 'red';
          count++;
          // user must click again within three seconds; prevents against errors
          setTimeout(() => {
            $message.innerText = 'Press CTRL + ENTER to submit!';
            $message.style.color = 'black';
            count = 0;
          }, 3000);
        }
      }
    });
  }

  // the following functionality sets the click property of the logout button, which is a simple anchor tag
  const $logout = document.querySelector('#logout-button');
  // if the anchor tag exists - necessary because the user might be signed out and the anchor wouldn't exist
  if ($logout) {
    // get the log out form
    const $logoutForm = document.querySelector('#logout-form');
    $logout.addEventListener('click', (e) => {
      // stop the default action of an anchor tag click (aka redirecting the user to a new page)
      e.preventDefault();
      // do the log out
      $logoutForm.submit();
    })
  }
}

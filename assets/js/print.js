// Inspired by: https://stackoverflow.com/a/16895271
function printLSTM(divName) {

  // Hide lstm controls and all buttons
  document
    .getElementById('lstm-controls')
    .style
    .display = 'none';

  document
    .getElementById('lstm-generate')
    .style
    .display = 'none';

  document
    .getElementById('print-lstm')
    .style
    .display = 'none';

  document
    .getElementById('temp-note')
    .style
    .display = 'none';

  // Hide footer
  document
    .getElementsByClassName('page__meta')[0]
    .style
    .display = 'none';

  // Show jcw signature
  document
    .getElementById('jcw-signature')
    .style
    .display = 'block';

  // Show breaks
  document
    .getElementById('breaks')
    .style
    .display = 'block';

     window.print();

  // Show breaks
  document
    .getElementById('breaks')
    .style
    .display = 'none';

  // Hide jcw signature
  document
    .getElementById('jcw-signature')
    .style
    .display = 'none';

  // Show lstm controls and all buttons
  document
    .getElementById('lstm-controls')
    .style
    .display = 'flex';

  document
    .getElementById('lstm-generate')
    .style
    .display = 'block';

  document
    .getElementById('print-lstm')
    .style
    .display = 'block';

  document
    .getElementById('temp-note')
    .style
    .display = 'block';

  // Show footer
  document
    .getElementsByClassName('page__meta')[0]
    .style
    .display = 'block';
}

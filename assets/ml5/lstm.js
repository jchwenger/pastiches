// Text generation using LSTMs with ML5js https://ml5js.org/
// Adapted from here https://github.com/ml5js/ml5-examples/tree/release/p5js/LSTM
// Models trained using https://github.com/ml5js/training-lstm

const models = {
  "Rabelais et Montaigne":
  {
    "seed": "Oysiveté pleine de pantagrueliſme ",
    "nick": "François & Michel",
    "src": "rabelaisetmontaigne/"
  },
  "Jean-Jacques Rousseau":
  {
    "seed": "Je forme une entreprise qui n’eut jamais d’exemple & dont l’exécution n’aura point d’imitateur. ",
    "nick": "Jean-Jacques",
    "src": "/rousseau/"
  },
  "Kant avec Sade":
  {
    "seed": "Nous tenons que le boudoir sadien s’égale à ces lieux dont les écoles de la philosophie antique prirent leur nom ",
    "nick": "Donatien Alphonse François & Immanuel",
    "src": "kantavecsade/"
  },
  "Marcel Proust":
  {
    "seed": "Longtemps je me suis couché de bonne heure ",
    "nick": "Marcel",
    "src": "proust/"
  },
  "Louis-Ferdinand Céline":
  {
    "seed": "Ça a débuté comme ça ",
    "nick": "Louis-Ferdinand",
    "src": "celine/"
  },
  "Jacques Lacan":
  {
    "seed": "Sinthome : le mot existe dans les incunables ",
    "nick": "Jacques",
    "src": "lacan/"
  }
}

// Adverb for signature
const adverbs = [
  'Algorithmiquement vôtre,<br>',
  'Artificiellement vôtre,<br>',
  'Robotiquement vôtre,<br>',
  'Neuralement vôtre,<br>',
  'Probabilistiquement vôtre,<br>',
  'Machinalement vôtre, <br>',
  'Profondément vôtre, <br>',
  'Machiniquement vôtre, <br>',
  'Automatiquement vôtre, <br>',
];

let lstms = new Object();
let lstm = new Object();

const initModel = 'Jean-Jacques Rousseau';
let currentModel = initModel;

let textInput;
let lengthSlider;
let tempSlider;
let genBtn;
let rasaBtn;
let finishBtn;
let generating = false;
let generated = false;
let lstmReset = false;
let finis = false;
let seedIndex = 0;

function setup() {
  noCanvas();

  populate();

  // Grab the DOM elements
  textInput = select('#text-input');
  tempSlider = select('#temp-slider');
  genBtn = select('#generate');
  rasaBtn = select('#tabula');
  finisBtn = select('#finis');
  modelSelect = select('#model-select');

  // DOM element events
  genBtn.mousePressed(predict);
  rasaBtn.mousePressed(resetModel);
  finisBtn.mousePressed(printToggle);
  tempSlider.input(updateSliders);
  modelSelect.input(switchModel);

  // Update the slider values
  function updateSliders() {
    select('#temperature').html(tempSlider.value());
  }

  // Load the init model & initialize the current lstm
  lstms[initModel] = ml5.charRNN('/assets/ml5/models/' + models[initModel].src,
                                 modelReady(`« ${initModel} »`));

  // Assign the current lstm
  lstm = lstms[initModel];

  showHideId('lstm-buttons', 'none');
}

function populate() {

  let drpd = document
              .getElementById('model-select');

  for (let i in models) {
    drpd.options[drpd.options.length] = new Option(i, i);
  }

  for (i of drpd) {
    if (i.value == initModel){
      i.setAttribute('selected', '');
    }
  }

  select('#text-input')
    .attribute('placeholder', models[initModel].seed);
}

function modelReady(modelName) {

  // Status in italic
  document
    .getElementById('result')
    .style.fontStyle = 'italic';

  document
    .getElementById('result')
    .innerHTML = `Le réseau ${modelName} est prêt.`;
}

function predict() {

  if (generating) {

    generating = false;
    genBtn.html('Génère !');

  } else {

    generating = true;
    genBtn.html('Pause ?');

    typeRNN();

  }
}

// Typewriter found & adapted from here: https://codereview.stackexchange.com/a/185325
async function typeRNN() {

  let seed = await getSeed();

  generated = true;

  showHideId('lstm-buttons', 'flex');

  // Following DOM query only done once saving lots of time
  const result = document
                  .getElementById('result');

  // Status in roman
  result.style.fontStyle = 'normal';

  while (generating) {

    // If back at the beginning, reset
    if (lstmReset) {
      console.log('resetting from typewriter');
      await lstm.resetState();
      seed = await getSeed();
      lstmReset = false;
    }

    // Typewrite the seed
    if (seedIndex < seed.length) {

      // Feed the LSTM as we type the seed
      await lstm.feed(seed[seedIndex]);

      // Preventing re flow overhead by using textContent rather than innerHTML
      result.innerHTML = `${seed.substring(0, seedIndex+1)}`;
      seedIndex++;
      await wait(30);

    } else {

      // LSTM magic
      const temperature = tempSlider.value();
      const nextChar = await lstm.predict(temperature);
      await lstm.feed(nextChar.sample);
      result.innerHTML = `${result.innerHTML}${nextChar.sample}`;

    }
  }
}

function getSeed() {

  let txt = textInput.value();

  // If the user hasn't input something use the default seed
  if (txt.length === 0) {

    txt = models[currentModel].seed;

    console.log(`Using default seed: « ${txt} »`);

  } else {

    // Hack: if there is no space at the end, add one
    if (txt[txt.length-1] !== ' ') {

      txt = `${txt} `;

    }

    console.log(`Using seed: « ${txt} »`);
  }

  return txt;
}

// Switch model
async function switchModel() {

  if (generating) {
    generating = false;
    genBtn.html('Génère !');
    await wait(50);
  }

  lstmReset = true;
  seedIndex = 0;

  // Remove previous content and hide print button & signature, switch back to generate button
  clearId('signature');
  showHideId('signature', 'none');
  showHideId('lstm-buttons', 'none');

  document
    .getElementById('temp-slider')
    .value = 0.8;

  document
    .getElementById('temperature')
    .innerHTML = '0.8';

  document
    .getElementById('generate')
    .innerHTML = 'Génère !';

  genBtn.mousePressed(predict);

  // Get rid of the current model
  delete lstms[currentModel];

  // Get the name of the selected model
  currentModel = document
                  .getElementById('model-select')
                  .selectedOptions[0]
                  .innerHTML;

  // Clear text input & change placeholder text
  let inputDiv = document
                  .getElementById('text-input');
  inputDiv.value = '';
  inputDiv.setAttribute('placeholder', models[currentModel].seed);

  // Status in italic
  document
    .getElementById('result')
    .style.fontStyle = 'italic';

  // Update status
  document
    .getElementById('result')
    .innerHTML = 'Ça charge...';

  lstms[currentModel] = ml5.charRNN('/assets/ml5/models/' + models[currentModel].src,
                                    modelReady(`« ${currentModel} »`));

  lstm = lstms[currentModel];

  await lstm.feed(models[currentModel].seed);

  console.log('Switched to model', currentModel);

}

async function resetModel() {

  clearId('signature');
  showHideId('signature', 'none');

  clearId('result');

  if (!generating) {
    generated = false;
    showHideId('lstm-buttons', 'none');

    // Reset text input with seed
    let inputDiv = document
                    .getElementById('text-input');
    inputDiv.value = '';
    inputDiv.setAttribute('placeholder', models[currentModel].seed);

    // Reset result div
    modelReady(`« ${currentModel} »`);
  }

  if (finis) {

    finis = false;

    document
      .getElementById('generate')
      .innerHTML = 'Génère !';

    genBtn.mousePressed(predict);
  }

  lstmReset = true;
  seedIndex = 0;
}

// Prepare page for printing (adding signature, enabling print button)
async function printToggle() {

  if (finis) {

    finis = false;

    // Update buttons
    document
      .getElementById('finis')
      .innerHTML = 'Fini ?';

    document
      .getElementById('generate')
      .innerHTML = 'Génère !';

    showHideId('signature', 'none'); // make it vanish
    clearId('signature');

    genBtn.mousePressed(predict);

  } else {

    finis = true;

    // Stop generation if needed
    if (generating) {
      generating = false;
      genBtn.html('Génère !');
      await wait(50);
    }

    // Update button
    document
      .getElementById('finis')
      .innerHTML = 'Encore ?';

    // Grab adverb
    const currentAdv = adverbs[Math.floor(Math.random() * adverbs.length)];

    // Grab the model name from the dropdown menu
    const currentName = document
      .getElementById("model-select")
      .selectedOptions[0]
      .innerHTML;

    const currentNick = models[currentName].nick;

    // Add the signature
    showHideId('signature', 'block');

    document
      .getElementById('signature')
      .innerHTML = `${currentAdv}${currentNick}`;

    document
      .getElementById('generate')
      .innerHTML = 'Imprime !';

    genBtn.mousePressed(printLSTM);
  }

}

// Inspired by: https://stackoverflow.com/a/16895271
function printLSTM() {

  // Hide lstm controls and all buttons
  showHideId('lstm-controls', 'none');
  showHideId('lstm-generate', 'none');

  // Hide footer
  document
    .getElementsByClassName('page__meta')[0]
    .style.display = 'none';

  // Show breaks and signature
  showHideId('jcw-signature', 'block');
  showHideId('breaks', 'block');

  // --------------------------
  // Print
  window.print();
  // --------------------------

  // Hide breaks, signature, jcw signature
  showHideId('breaks', 'none');
  showHideId('jcw-signature', 'none');
  showHideId('signature', 'none');

  // Show lstm controls and all buttons
  showHideId('lstm-controls', 'grid');
  showHideId('lstm-generate', 'block');

  // Show footer
  document
    .getElementsByClassName('page__meta')[0]
    .style.display = 'block';

  // Update finis and generate button
  document
    .getElementById('finis')
    .innerHTML = 'Fini ?';

  document
    .getElementById('generate')
    .innerHTML = 'Génère !';

  genBtn.mousePressed(predict);

  finis = false;

}

// --------------------------
// Utils

function clearId(elementId) {
  document
    .getElementById(elementId)
    .innerHTML = '';
}

// Show/hide with 'none' or 'block'/'flex'/'grid
function showHideId(elementId, newState) {
  document
    .getElementById(elementId)
    .style.display = newState;
}

// Enable/disable buttons
function toggleId(elementId) {
   el = document
          .getElementById(elementId);
  if (el.disabled === true) {
    el.disabled = false;
  } else {
    el.disabled = true;
  }
}

function wait(delay) {
  return new Promise(r => setTimeout(r, delay));
}

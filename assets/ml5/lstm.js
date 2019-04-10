// Text generation using LSTMs with ML5js https://ml5js.org/

const models = {
  'Rabelais et Montaigne':
  {
  'seed': 'Oysiveté pleine de pantagrueliſme ',
  'nick': 'François & Michel',
  'src': 'rabelaisetmontaigne/'
  },
  'Jean-Jacques Rousseau':
  {
    'seed': 'Je forme une entreprise qui n’eut jamais d’exemple & dont l’exécution n’aura point d’imitateur. ',
    'nick': 'Jean-Jacques',
    'src': '/rousseau/'
  },
  'Kant avec Sade':
  {
    'seed': 'Nous tenons que le boudoir sadien s’égale à ces lieux dont les écoles de la philosophie antique prirent leur nom ',
    'nick': 'Donatien Alphonse François & Immanuel',
    'src': 'kantavecsade/'
  },
  'Marcel Proust':
  {
    'seed': 'Longtemps je me suis couché de bonne heure ',
    'nick': 'Marcel',
    'src': 'proust/',
  },
  'Louis-Ferdinand Céline':
  {
    'seed': 'Ça a débuté comme ça ',
    'nick': 'Louis-Ferdinand',
    'src': 'celine/',
  },
  'Jacques Lacan':
  {
    'seed': 'Sinthome : le mot existe dans les incunables ',
    'nick': 'Jacques',
    'src': 'lacan/',
  }
}

const initModel = 'Jean-Jacques Rousseau';
let currentModel = initModel;

let lstms = new Object();
let lstm = new Object();

let textInput;
let lengthSlider;
let tempSlider;
let button;

function setup() {
  noCanvas();

  populate();

  // Grab the DOM elements
  textInput = select('#text-input');
  lengthSlider = select('#length-slider');
  tempSlider = select('#temp-slider');
  button = select('#generate');
  modelSelect = select('#model-select');

  // DOM element events
  button.mousePressed(generate);
  lengthSlider.input(updateSliders);
  tempSlider.input(updateSliders);
  modelSelect.input(switchModel);

  // Update the slider values
  function updateSliders() {
    select('#length').html(lengthSlider.value());
    select('#temperature').html(tempSlider.value());
  }

  // Load the init model & initialize the current lstm
  lstms[initModel] = ml5.charRNN('/assets/ml5/models/' + models[initModel].src, modelReady(`« ${initModel} »`));

  // Assign the current lstm
  lstm = lstms[initModel];
}

function populate() {

  let drpd = document
              .getElementById('model-select');

  for (i in models) {
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
  document
    .getElementById('status')
    .innerHTML = `Réseau ${modelName} est prêt.`;
}

// Switch model
async function switchModel() {

  // Get rid of the current model
  delete lstms[currentModel];

  // Get the name of the selected model
  currentModel = document
              .getElementById('model-select')
              .selectedOptions[0]
              .innerHTML;

  // Update status
  document
    .getElementById('status')
    .innerHTML = 'Ça charge...';

  lstms[currentModel] = ml5.charRNN('/assets/ml5/models/' + models[currentModel].src, modelReady(`« ${currentModel} »`));

  lstm = lstms[currentModel];

  console.log('Switched to model', currentModel);

  // Remove previous content and hide print button & signature
  document
    .getElementById('result')
    .innerHTML = '';

  document
    .getElementById('signature')
    .innerHTML = '';

  document
    .getElementById('print-lstm')
    .style
    .display = 'none';

  document
    .getElementById('signature')
    .style
    .display = 'none';

  // Change placeholder text
  select('#text-input')
    .attribute('placeholder',
      models[currentModel].seed);

  // Reset length, temperature slider
  document
    .getElementById('length-slider')
    .value = 500;

  document
    .getElementById('length')
    .innerHTML = '500';

  document
    .getElementById('temp-slider')
    .value = 0.8;

  document
    .getElementById('temperature')
    .innerHTML = '0.8';

  select('#status')
    .html('Réseau « ' + currentModel + ' » prêt à générer...');
}


// Generate new text
function generate() {

  // Update the status log
  select('#status')
    .html('Patience ! Ça génère...');

  // Remove previous content and hide print button & signature
  document
    .getElementById('result')
    .innerHTML = '';

  document
    .getElementById('signature')
    .innerHTML = '';

  document
    .getElementById('print-lstm')
    .style.display = 'none';

  document
    .getElementById('signature')
    .style.display = 'none';

  // Grab the original text

  let txt = textInput.value();

  // If the user hasn't input something
  // use the default seed
  if (txt.length === 0) {
    let currentModel = document
                        .getElementById('model-select')
                        .selectedOptions[0]
                        .innerHTML;
    txt = models[currentModel].seed;
    console.log(`Using default seed: « ${txt} »`);

  } else {

    // Hack: if there is no space at the end, add one

    if (txt[txt.length-1] !== ' ') {
      txt = `${txt} `;
    }
  }

  let data = {
      seed: txt,
      temperature: tempSlider.value(),
      length: lengthSlider.value()
  };
  // Generate text with the lstm
  lstm.generate(data, gotData);

  // When it's done
  function gotData(err, result) {

    // Update the status log
    select('#status').html('Voilà :');

    lastIndex = result.sample.length - 1;
    lastChar = result.sample[lastIndex];

    regX = /[ ,;:]+/g;
    if (regX.test(lastChar)) {
      // implement regex
      lastMatch = result.sample.match(regX).pop();
      lastIndex = result.sample.lastIndexOf(lastMatch);
      result.sample = result.sample.slice(0,lastIndex)  + '...';
    } else if (lastChar !== '.'){
      result.sample += '...';
    }

    select('#result').html('« ' + txt + result.sample + ' »');

    // console.log(encode_utf8(result.sample));

    printReady();

  }
}

async function printReady() {

  // Adding an adverb
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
  const currentAdv = adverbs[Math.floor(Math.random() * adverbs.length)];

  // Grab the model name from the dropdown menu
  const currentName = document
    .getElementById("model-select")
    .selectedOptions[0]
    .innerHTML;

  const currentNick = models[currentName].nick;

  // Add the signature
  document
    .getElementById('signature')
    .style.display = 'block';

  document
    .getElementById('signature')
    .innerHTML += currentAdv + currentNick;

  // Display the print button
  document
    .getElementById('print-lstm')
    .style.display = 'block';
}

async function encode_utf8( s ) {
  return unescape( encodeURIComponent( s ) );
}

async function decode_utf8( s ) {
  return decodeURIComponent( escape( s ) );
}

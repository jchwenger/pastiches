// Create the LSTM Generator passing it the model directory
// const lstm = ml5.charRNN('models/lot-of-it', modelReady);
const models = {

  'Jean-Jacques Rousseau':
    {
      'seed': 'Je forme une entreprise qui n’eut jamais d’exemple & dont l’exécution n’aura point d’imitateur. ',
      'src': '/rousseau/'
    },
  // 'Kant avec Sade':
  //   {
  //     'seed': 'Nous tenons que le boudoir sadien s’égale à ces lieux dont les écoles de la philosophie antique prirent leur nom ',
  //     'src': 'kantavecsade/'
  //   },
  // 'Marcel Proust':
  //   {
  //     'seed': 'Longtemps je me suis couché de bonne heure ',
  //     'src': 'proust/',
  //   },
  //   'Marcel Proust 2':
  //   {
  //     'seed': 'Longtemps je me suis couché de bonne heure ',
  //     'src': 'proust2/',
  //   },
  // 'Jacques Lacan':
  //   {
  //     'seed': 'Sinthome : le mot existe dans les incunables ',
  //     'src': 'lacan2/',
  //   }
}

let lstms = new Object();

for (i in models) {
  lstms[i] = ml5.charRNN('/assets/ml5/models/' + models[i].src, modelReady);
}

const initModel = 'Jean-Jacques Rousseau';
let lstm = lstms[initModel];

let textInput;
let lengthSlider;
let tempSlider;
let button;

function setup() {
  noCanvas();

  populate();

  // Grab the DOM elements
  textInput = select('#textInput');
  lengthSlider = select('#lenSlider');
  tempSlider = select('#tempSlider');
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

}

function modelReady() {
  document.getElementById('status').innerHTML = 'Les modèles sont prêts.';
}

function populate() {

  let drpd = document.getElementById("model-select");

  for (i in models) {
    drpd.options[drpd.options.length] = new Option(i, i);
  }
  for (i of drpd) {
    if (i.value == initModel){
      i.setAttribute('selected', '');
    }
  }

  select('#textInput').attribute('placeholder', models[initModel].seed);
}

// Switch model
function switchModel() {
  let current = document
                 .getElementById("model-select")
                    .selectedOptions[0]
                      .innerHTML;

  lstm = lstms[current];

  console.log('Switched to model', current);

  select('#result')
      .html('');

  select('#textInput')
      .attribute('placeholder',
                  models[current].seed);

  select('#status').html('Réseau « ' + current + ' » prêt à générer...');
}


// Generate new text
function generate() {
  // Update the status log
  select('#status').html('Ça génère...');

  // Remove previous content and hide print button & signature
  document.getElementById('result').innerHTML = '';
  document.getElementById('signature').innerHTML = '';

  document.getElementById('print-lstm').style.display = 'none';
  document.getElementById('signature').style.display = 'none';

  // Grab the original text

  let txt = textInput.value();

  // If the user hasn't input something
  // use the default seed
  if (txt.length === 0) {
    let current = document
                   .getElementById("model-select")
                      .selectedOptions[0]
                        .innerHTML;
    txt = models[current].seed;
    console.log('Using default seed: « ' + txt + ' »');
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
  let adverbs = [
    'Algorithmiquement vôtre,<br>',
    'Artificiellement vôtre,<br>',
    'Robotiquement vôtre,<br>',
    'Neuralement vôtre,<br>',
    'Probabilistiquement vôtre,<br>',
  ];
  currentAdv = adverbs[Math.floor(Math.random() * adverbs.length)];

  // Grab the model name from the dropdown menu
  currentName = document
    .getElementById("model-select")
    .selectedOptions[0]
    .innerHTML;

  // Add the signature
  document.getElementById('signature').style.display = 'block';
  document.getElementById('signature').innerHTML += currentAdv + currentName;

  // Display the print button
  document.getElementById('print-lstm').style.display = 'block';
}

async function encode_utf8( s ) {
  return unescape( encodeURIComponent( s ) );
}

async function decode_utf8( s ) {
  return decodeURIComponent( escape( s ) );
}

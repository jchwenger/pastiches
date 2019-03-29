---
layout: single 
title: Pastiches & mélanges    
date: 2019-03-14 10:31:19.822187525 +0000
ml5: true
permalink: /pastiches/  
---

> Génération automatique de textes grâce au deep learning.

<!--more-->

<div id="jcw-signature" style="display: none; float: right;">
  <p>Jérémie C. Wenger, 2019</p>
</div>

<div class="example">
  <div id="lstm-controls" style="display: flex; flex-wrap: wrap;">
    <div style="margin-right: 15px;">
      <span>Entre un début ici :</span>
      <textarea id="textInput" style="width: 100%; height: 250px;" placeholder=""></textarea>
    </div>
    <div style="width: 40%">
      <span>Voix souhaitée :</span>
      <select id="model-select" style="width: 100%;"></select>
      <div style="padding-top: 15px;">
        Longueur désirée : <span id="length">500</span>
        <input id="lenSlider" type="range" min="0" max="1000" value="500"> 
        Température : <span id="temperature">0.8</span>
        <input id="tempSlider" type="range" min="0" max="1" step="0.01" value="0.8">
      </div>
    </div>
  </div>
  <div id="lstm-generate">
    <br/><button id="generate" style="width: 100%; height: 50px;">Génère !</button>
    <div style=" padding-top: 30px;">
      <p id="status">Ça charge...</p>
    </div>
    <hr>
  </div>
    <div> 
      <div id="breaks" style="display: none;">
        <br><br><br><br><br><br><br><br>
      </div>
      <p id="result">
      <span id="original"></span><span id="prediction"></span>
      </p>
      <i><span id="signature" style="display: none; float: right;"></span></i>
    </div>
    <br>
    <div>
      <button id="print-lstm" onclick="printLSTM('result')" value="print generated text" style="display: none; height: 50px;">Imprime</button>
    </div>
</div>

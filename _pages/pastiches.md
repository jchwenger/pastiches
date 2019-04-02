---
layout: single 
title: Pastiches & mélanges    
ml5: true
permalink: /pastiches/  
---

> Génération automatique de textes grâce au deep learning.

<!--more-->

<div id="jcw-signature">
  <p>Jérémie C. Wenger, 2019</p>
</div>

<div class="example">
  <div id="lstm-controls">
    <div>
      <span>Entre un début ici :</span>
      <textarea id="textInput" placeholder=""></textarea>
    </div>
    <div>
      <span>Voix souhaitée :</span>
      <select id="model-select"></select>
      <div id="lstm-sliders">
        Longueur désirée : <span id="length">500</span>
        <input id="lenSlider" type="range" min="1" max="1000" value="500"> 
        Température<sup>(*)</sup> : <span id="temperature">0.8</span>
        <input id="tempSlider" type="range" min="0.1" max="1.5" step="0.01" value="0.8">
      </div>
    </div>
  </div>
  <div id="temp-note"><sup>(*)</sup> Paramètre contrôlant la « créativité » du réseau : plus petit, et celui-ci est plus conservateur, voire répétitif ; plus grand, et il est plus audacieux, jusqu'à en devenir chaotique.</div>
  <div id="lstm-generate">
    <br/><button id="generate">Génère !</button>
    <div>
      <p id="status">Ça charge...</p>
    </div>
    <hr>
  </div>
    <div> 
      <div id="breaks">
        <br><br><br><br>
      </div>
      <p id="result">
      <span id="original"></span><span id="prediction"></span>
      </p>
      <i><span id="signature"></span></i>
    </div>
    <br>
    <div id="print-lstm-div">
      <button id="print-lstm" onclick="printLSTM('result')" value="print generated text">Imprime !</button>
    </div>
</div>

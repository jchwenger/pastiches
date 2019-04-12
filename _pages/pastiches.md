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

<div id="lstm-controls">
  <div>
    <span>Voix souhaitée :</span>
  </div>
  <div>
    <select id="model-select"></select>
  </div>
  <div>
    <span>Entre un début ici :</span>
  </div>
  <div>
    <textarea id="text-input" placeholder=""></textarea>
  </div>
  <div>
    Température<sup>(*)</sup> : <span id="temperature">0.8</span>
  </div>
  <div>
    <input id="temp-slider" type="range" min="0.1" max="1.5" step="0.01" value="0.8" />
  </div>
  <div id="temp-note"><sup>(*)</sup> Paramètre contrôlant la « créativité » du réseau : plus petit, et celui-ci est plus conservateur, voire répétitif ; plus grand, et il est plus audacieux, jusqu'à en devenir chaotique. Tentez de varier cette valeur pendant la génération pour en voir les effets !</div>
  <hr />
</div>

<div> 
  <div id="breaks">
    <br /><br /><br /><br />
  </div>
  <p id="result">
  <span id="original"></span><span id="prediction"></span>
  </p>
  <i><span id="signature"></span></i>
</div>

<div id="lstm-generate">
  <button id="generate">Génère !</button>
  <div id="lstm-buttons">
    <button id="tabula">Tabula rasa !</button>
    <button id="finis">Fini ?</button>
  </div>
</div>

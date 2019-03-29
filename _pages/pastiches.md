---
layout: single 
title: Pastiches & mélanges    
date: 2019-03-14 10:31:19.822187525 +0000
ml5: true
permalink: /pastiches/  
---

> Génération automatique de textes grâce au deep learning.

<!--more-->

<div class="example">
  <div style="display: flex;">
    <div style="margin-right: 15px;">
      <span>Entre un début ici :</span>
      <textarea id="textInput" style="width: 100%; height: 250px;" placeholder=""></textarea>
    </div>
    <div style="">
      <span>Voix souhaitée :</span>
      <select id="model-select" style="width: 100%;"></select>
      <div style="padding-top: 15px;">
        Longueur désirée : <span id="length">300</span>
        <input id="lenSlider" type="range" min="0" max="500" value="300"> 
        Température : <span id="temperature">0.8</span>
        <input id="tempSlider" type="range" min="0" max="1" step="0.01" value="0.8">
      </div>
    </div>
  </div>
  <div>
    <br/><button id="generate" style="width: 100%; height: 50px;">Génère !</button>
    <div style=" padding-top: 30px;">
      <p id="status">Ça charge...</p>
    </div>
    <hr>
    <div> 
      <p id="result">
      <span id="original"></span><span id="prediction"></span>
      </p>
    </div>
  </div>
</div>

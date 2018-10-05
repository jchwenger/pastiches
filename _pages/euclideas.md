--- 
layout: single 
title: Euclideas 
date: 2018-05-21 16:29:44.000000000 +0100
permalink: /euclideas/ 
---

This project comprises several small rhythmic pieces in the form of Max patches. They all function as 'perpetua mobilia', that can be turned on to produce a variable, but ultimately cyclical and indefinite stream of beats.   

Patches available [here](https://www.dropbox.com/sh/tugugmhjqgmj57s/AABf_81G9o3g8TptsaAb-NqEa?dl=0).  

{% include separators.html type='outer' %}  

### The Euclidean algorithm  

The core piece of code at the heart of this project is an implementation of concept of Euclidean rhythm, as studied by Godfried Toussaint, "The Euclidean Algorithm Generates Traditional Musical Rhythms", in *Proceedings of BRIDGES: Mathematical Connections in Art, Music and Science,* Banf, Alberta, Canada, July 31-August 3, 2005, pp. 47-56 (the [original paper](http://cgm.cs.mcgill.ca/~godfried/publications/banff.pdf) and its [extended version](http://citeseerx.ist.psu.edu/viewdoc/download?doi=10.1.1.72.1340&rep=rep1&type=pdf)).  

After having looked into a few past implementations in Max (see [here](http://registeringdomainnamesismorefunthandoingrealwork.com/2009/04/euclidean-algorithmic-beat-generator), [here](http://registeringdomainnamesismorefunthandoingrealwork.com/2009/06/euclidean-beat-generator-redux/), and [here](http://registeringdomainnamesismorefunthandoingrealwork.com/2011/03/euclidean-sequencer-max4live-version-now-here/), [this video](https://www.youtube.com/watch?v=14tw_DRev_4) and [this thread](https://cycling74.com/forums/euclidean-algorithm-to-generate-beats-paper-and-starting-patch)) or otherwise (the [XronoMorph app](http://www.dynamictonality.com/xronomorph.htm), its [corresponding paper](https://www.researchgate.net/publication/299850277_Computational_creation_and_morphing_of_multilevel_rhythms_by_control_of_evenness), and a [video](https://www.youtube.com/watch?v=K7leRTbgXzI)), I decided it would be more fruitful and interesting to devise my own implementation, especially since the versions found did not use recursion, and hence were limited to a certain rhythm length. The current algorithm, written in JavaScript, is general and works on any rhythm length, the only limitation being computer power.  

The method, as can be seen in the comments of the patch, is a step-by-step application of Toussaint's method. Take the following example: 8 beats (dividend), 5 stresses (divisor). The algorithm will first produce a prototype rhythm with 5 stresses (quotient) and 3 pauses (remainder):  


    \[1\] \[1\] \[1\] \[1\] \[1\] \[0\] \[0\] \[0\]


Then, recursion ensues, in which the former quotient and remainder become the new dividend and divisor: 5 as the new dividend and 3 as the divisor, leading to the following process:  


    \[1 0\] \[1 0\] \[1 0\] \[1\] \[1\]

    \[1 0 1\] \[1 0 1\] \[1 0\]


At this point, the remainder is of length 1, signalling the end of the process. The same process works when there are more pauses than stresses, which required some adjustment in the code. The process for 8 and 3 is as follows:  

    \[1\] \[1\] \[1\] \[0\] \[0\] \[0\] \[0\] \[0\]  

    \[1 0\] \[1 0\] \[1 0\] \[0\] \[0\]  

    \[1 0 0\] \[1 0 0\] \[1 0\]


One of the difficulties that had to be overcome was to manage the length of the various units (if the dividend or remainder are composed of units of two or more numbers, e.g. '1 0' '1 0' '1 0'). After making some attempts on raw strings with a system for calculating the length of the steps required (in the previous parenthesis, taking spots 0 then 1, then at the next iteration taking 2 and 3, etc.), I changed course and solved the technical issues linked with arrays instead, which mainly consisted in creating the appropriate new arrays at each level of the recursion, and accessing the data correctly. In the current system, the issue of the length of the steps and of the slices is automatically determined by the data itself, and not calculated in a systematic way.  

Once the process is complete, the rhythm is returned (in two list types, on the one hand only the rhythm as 1s and 0s, and on the other formatted for the matrixctl object, which takes additional numbers for rows and columns), so that it can be used in the program.  

The result of this method is a family of rhythm that have the property of distributing stresses as equally as possible among the beats, making them 'well-formed'. This property is somewhat trivial when the number of beats and stresses divide each other, such as 4 stresses in 8 beats, but more interesting when they don't, which has been our focus in this project.  

{% include separators.html type='outer' %}  

### Counters  


The next step is to make use of these rhythms to build a piece. A fairly straightforward system was chosen to harmonize tempo in the patch: a metro object and a counter, which allows for a division of beats into bars using the modulo operation (counter number % bar length) and a precise calculation of where one is in the beat at any given moment (the remainder of the modulo operation). We can then ask for the nth number in our rhythm (formatted as a list) using the zl.nth object.  

The counter object was used to construct two different process:  

1. A plain counter allows one to change the number of beats or stresses at each bar, and the palindrome function of this object makes the count oscillate between 1 and the bar length (although one could also prefer an ascending or descending count) -- this, one can notice, is not directly related to the Euclidean algorithm;  

2. A combination of two counters and gates was produced that embeds one count into another, the stresses into the beats, so that the stresses vary from 1 to the maximum and back to 1, at which point the number of beats change and the stresses go back to their cycle again, in a perpetual motion (the beats vary from 1 to an arbitrary maximum in the same palindromic manner).  

{% include separators.html type='outer' %}  

### Phase, Clicking Music  


Remembering Steve Reich, another cyclical process was explored: phase. Three attempts were made, two of which succeed at producing a phase cycle between two identical rhythms:  

1. A tempo variation through the metro object: a cosine wave is used to create a varying number which is subtracted from the number controlling a metro object. Another metro object, static time, controls the process. In a second version, the overarching metro controls two cosine waves going in opposite directions, leading to one rhythm accelerating when the other slows down. Unfortunately, in the current state, the phase is imperfect, and as the cycle closes, the two rhythms are separated by a small gap, or come together again only after a certain number of cycles. After thinking about the mathematical issue arising behind that, which seemed too intractable for my time resources and goals, and also noticing that this first foray was not in fact a phase issue, only the tempo speed being affected, I developed the two following ones:  

2. Using the pipe object to introduce a delay on the number passed to the sound producing objects, it was possible to produce a phase effect varying from identity to the length of the beats, and returning to the identity, using either a simple counter or a sine wave.  

3. Another one, a near-literal copy of Steve Reich's *Clapping Music*, and therefore called 'clicking music', uses the list containing the rhythm to produce a 'discrete phase', that is, a phase based on the beats themselves, taken as discrete steps. The patch performs a rotation of the list of numbers representing the rhythm, thus transitioning from one superposition to another without gap in between, and with the possibility of carrying on rotating in this way indefinitely.  

{% include separators.html type='outer' %}  

### Form, encapsulation, system  


As often happens in computational arts, quite a bit of time was spent in calculation or technical issues. Beyond the rather tedious process of getting familiar enough with various objects and functions to be able to forget them, it was the question of encapsulation and systemic thinking that came into focus: when should I create a reusable abstraction, which usually means more systematic work, to foresee various options and possibilities, and when a plain, singular approach, crafting simply one object for the task at hand, is enough, or, in fact, serving artistic goals more effectively? In retrospect, it seems that my tendency toward systematic thinking was often an impediment to artistic development, rather than a help, as the drive to produce ever more universally applicable objects draw me to produce tools, as it were, rather than parts of a personal art piece. It is also the main reason for what I consider two capital shortcomings of the project in its current form: the lack of a more detailed approach to sound making (where, unfortunately, I lacked the years of experimentation allowing the more practised composer to invoke past findings and intertwine the threads of past explorations); the static, undeveloped form of each of the 'pieces', which in the current states remain sketches, fragments, studies at best. It is as if despite interesting findings at a rhythmic levels, I had been unable to go beyond the abstract generality of 'Euclidean rhythms' and to use those for artistic ends, the musically bare results in turn not being inspiring enough for me to adopt one of the proposed approaches -- say, state-based composition, Markov chains, or any such approaches, be it systematic or random, which would only have made more apparent the flatness of each of their moments and added one layer of this compositional method to the piece. Instead, leaving each fragment separate has the merit of brevity, each mechanism being graspable, audible, in a very short time, which might, if not bring to listeners the aesthetic intricacies I had hoped for, at least spare them the burden of boredom.  


{% include separators.html type='outer' %}  

### Musical examples 

Looked up when studying [Godfried Toussaint's 'The Euclidean Algorithm Generates Traditional Musical Rhythm'](http://cgm.cs.mcgill.ca/~godfried/publications/banff.pdf) :  


{% include video id="6dFtlcqGW50" provider="youtube" %}

{% include video id="RFjRJmGYrCg" provider="youtube" %}

{% include video id="9pimlJxRwCY" provider="youtube" %}

{% include video id="-eHJ12Vhpyc" provider="youtube" %}

{% include video id="YwlwvKpzdXc" provider="youtube" %}

{% include video id="zNow1XilN0I" provider="youtube" %}

{% include video id="qLa9ck-ez7o" provider="youtube" %}

{% include video id="iINXA-k0asw" provider="youtube" %}

{% include video id="a0mwsBJToZI" provider="youtube" %}

{% include video id="SqnFytZfEw0" provider="youtube" %}

{% include video id="5xIWZs4o1oQ" provider="youtube" %}

{% include video id="aQodu8NSbLc" provider="youtube" %}

{% include video id="cp6GCw2JbnE" provider="youtube" %}

{% include video id="-BLny3JztNo" provider="youtube" %}

{% include video id="zOHBVv4p-O8" provider="youtube" %}

{% include video id="jMz6e-mRUVY" provider="youtube" %}

{% include video id="zO02H-R6IWo" provider="youtube" %}

<div class="responsive-video-container"> <iframe src="//www.dailymotion.com/embed/video/x31bnl1" frameborder="0" allowfullscreen nuan_newframe="true"></iframe> </div> 

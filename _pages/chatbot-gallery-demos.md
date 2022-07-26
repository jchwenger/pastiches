---
layout: splash
header:
  overlay_color: "#000"
  overlay_filter: "0.2"
  overlay_image: https://chatbot-manufacture.s3.eu-west-2.amazonaws.com/Fovanna-chatbot-2021-37.webp
excerpt: "Act and dialogue with a conversational agent-actor."
title: CHATBOT Gallery
date: 2021-12-04 13:11:45.097804320 +0000 
permalink: /chatbot-gallery-demos/


authors:
  - url: /assets/chatbot/icons/corneille.png
    image_path: /assets/chatbot/icons/corneille.png
    title: "Pierre Corneille, author of <i>Le Cid</i> (this portrait is also the favicon for the bot site)"
  - url: /assets/chatbot/icons/chekhov.png
    image_path: /assets/chatbot/icons/chekhov.png
    title: "Anton Chekhov, author of <i>The Cherry Orchard</i>"

icons:
  - url: /assets/chatbot/icons/01-nicolas-zlatoff.gif
    image_path: /assets/chatbot/icons/01-nicolas-zlatoff.gif
    title: Nicolas Zlatoff
  - url: /assets/chatbot/icons/02-guillaume-ceppi.gif
    image_path: /assets/chatbot/icons/02-guillaume-ceppi.gif
    title: Guillaume Ceppi
  - url: /assets/chatbot/icons/03-lucas-savioz.gif
    image_path: /assets/chatbot/icons/03-lucas-savioz.gif
    title: Lucas Savioz
  - url: /assets/chatbot/icons/04-bartek-sozanski.gif
    image_path: /assets/chatbot/icons/04-bartek-sozanski.gif
    title: Bartek Sozanski
  - url: /assets/chatbot/icons/05-elsa-thébault.gif
    image_path: /assets/chatbot/icons/05-elsa-thébault.gif
    title: Elsa Thébault
  - url: /assets/chatbot/icons/06-lisa-veyrier.gif
    image_path: /assets/chatbot/icons/06-lisa-veyrier.gif
    title: Lisa Veyrier
  - url: /assets/chatbot/icons/07-jérémie-wenger.gif
    image_path: /assets/chatbot/icons/07-jérémie-wenger.gif
    title: Jérémie Wenger

---

*photo montage: Ivo Fovanna*
{: .small .text-right}

[Main page]({{ site.baseurl }}{% link _pages/chatbot.md %})

## Interface

The basic interface comes in two flavours, a 'direct' chatroom, where all edits of non-bot participants are seen in real time, and one where the history of the chat so far is also visible.

![chatbot demo gif basic window chat](https://chatbot-2021-demos.s3.eu-west-2.amazonaws.com/chat-cid.gif)

![chatbot demo gif dual window chat](https://chatbot-2021-demos.s3.eu-west-2.amazonaws.com/dual-cid.gif)

The chatroom, built with websockets, is meant for a utilization by multiple humans and bots.

![chatbot demo gif chat two users](https://chatbot-2021-demos.s3.eu-west-2.amazonaws.com/chat-two-users.gif)

![chatbot demo gif chat two bots](https://chatbot-2021-demos.s3.eu-west-2.amazonaws.com/chat-cid-two-bots.gif)

There is also an `audience` page, which can switch between direct, history or both, and allows us to display the current session to non-participants.

![chatbot demo gif audience window](https://chatbot-2021-demos.s3.eu-west-2.amazonaws.com/audience-cid.gif)

---

### Mechanism

There is a `mechanism` window that attempts to make the inner workings of the bots more visible, showing for instance the bot generating batches, or sending tokens from the client to the main chat server (at the `tempo` rate, see below). More than one bot will be displayed if connected.

![chatbot demo gif mechanism one bot](https://chatbot-2021-demos.s3.eu-west-2.amazonaws.com/mechanism-cid.gif)

![chatbot demo gif mechanism two bots](https://chatbot-2021-demos.s3.eu-west-2.amazonaws.com/mechanism-autonomous-two-bots.gif)

---

### Master

One user (and one only, at any one time) can access a separate Master page containing various controls.

→ `reset`: one major functionality is to `reset` the session, wiping out all memory from connected bots.

![chatbot demo gif master reset](https://chatbot-2021-demos.s3.eu-west-2.amazonaws.com/dual-master-reset.gif)

→  `pause`: every time the bot has spoken, a random number between 0 and `pause` is generated, determining the length of time it will remain silent after (and won't react to any new messages).

![chatbot demo gif master pause](https://chatbot-2021-demos.s3.eu-west-2.amazonaws.com/chat-master-pause.gif)

→  `silence`: every time the bot is about to reply, a random number between 0 and 1 is generated: if it is greater than `silence`, the bot answers.

![chatbot demo gif master silence](https://chatbot-2021-demos.s3.eu-west-2.amazonaws.com/chat-master-silence.gif)

→  `temperature`, `top_k`, `top_p`: parameters all relating to how conservative (temperature: 'cold', down to pure repetition) to how wild (temperature: 'hot', up to pure madness), by making the distribution steeper ('cold', the likelier tokens are always picked) or flatter ('hot', less likely tokens have much more probability to get picked nevertheless). `top_k` limits the sampling to the top k most probable tokens, whilst `top_p` limits the overall probability mass of the most probable tokens, limiting that to a number between 0 and 1.

![chatbot demo gif master temperature](https://chatbot-2021-demos.s3.eu-west-2.amazonaws.com/chat-master-temperature.gif)

→  `tempo`: the speed at which tokens are sent to the chat (to simulate gradual writing); this can be changed literally as the bot is writing...

![chatbot demo gif master tempo](https://chatbot-2021-demos.s3.eu-west-2.amazonaws.com/chat-master-tempo.gif)

→  `wait`: the amount of time a reply remains blocked on the Master page before being sent to the chat. This is especially useful when working with multiple batches, as the Master can then take some time to choose which answer to pick... When the choices are present, it is possible to send before the end of the countdown, skip (discard) these answers, regenerate (discarding the current replies), or choose one by selecting it (clicking again will deselect). If nothing is selected, the backend sampling method is applied (see `batch size` above).

![chatbot demo gif master wait](https://chatbot-2021-demos.s3.eu-west-2.amazonaws.com/chat-master-wait.gif)

→ `mode`: The Master has a choice between two `modes` for the bot, `reactive` or `autonomous`: in the first instance, only an input from any participant (or other bot) will trigger a response (subjected to the random barrier above, `silence`, as well as `pause` after having spoken). In autonomous mode, the same limitations apply (`silence` and `pause`), but the bot will go on generating new replies on its own indefinitely. 

![chatbot demo gif master reactive autonomous](https://chatbot-2021-demos.s3.eu-west-2.amazonaws.com/chat-cid-reactive-autonomous.gif)

→ `batch size`: The Master can change the batch size, which takes some time (the mechanism page gives a notification when the process is complete). The bot will be fully unreactive during all this time. If the batch is greater than one, the Master can choose which reply to send to the chat, and if no external choice is given the bot does (several options exist in the backend, always taking into account the perplexity of the generated samples: always taking the min, always the max, or sampling using the perplexity as a weighing factor).

![chatbot demo gif master batch size](https://chatbot-2021-demos.s3.eu-west-2.amazonaws.com/chat-master-batch-size.gif)

→ `character`, `first words`: It is possible to constrain a bot to speak as one character. When the character is set, it is possible to require it to begin its next answer with determined words. If the character isn't set, however, the `first words` are still inserted into the bulk of the session (what the bot will see in its attention window), but will not appear in the public chat.

![chatbot demo gif master first words](https://chatbot-2021-demos.s3.eu-west-2.amazonaws.com/chat-master-character-first-words.gif)

→ `subtext`: this box allows you to insert text into what the bot reads when preparing its next reply. By giving substantial extracts to it you can almost certainly reorient it towards a particular style (here three examples of *Le Cid*, *Chekhov* and *Deleuze*).

![chatbot demo gif master subtext Le Cid](https://chatbot-2021-demos.s3.eu-west-2.amazonaws.com/chat-master-subtext-cid.gif)

![chatbot demo gif master subtext Chekhov](https://chatbot-2021-demos.s3.eu-west-2.amazonaws.com/chat-master-subtext-chekhov.gif)

![chatbot demo gif master subtext Deleuze](https://chatbot-2021-demos.s3.eu-west-2.amazonaws.com/chat-master-subtext-deleuze.gif)

Finally, the Master page allows you to export the current session as a JSON file.

![chatbot demo gif master session](https://chatbot-2021-demos.s3.eu-west-2.amazonaws.com/chat-master-session-deleuze.gif)

You can also browse all past sessions, check information about times & actors, and export everything as a JSON file.

![chatbot demo gif master archives](https://chatbot-2021-demos.s3.eu-west-2.amazonaws.com/chat-master-archives.gif)

---

### Text to Speech & Dataset preparations

There is also a "bots only" page, to display specifically what the bots are writing. This page has two main options: to select between the bots (or display them all), and to display their output continuously (the "fake" gradual writing, controlled by `tempo`) or directly (like in the chat history box). In the second case, a Text To Speech rendition is also added, which uses the free Google Translate api to render chunks of texts. This can be used to have the bot dictate its output to performers in real time.

Other videos show work on collecting and cleaning datasets.

<div class="responsive-video-container">
<iframe src="https://www.youtube.com/embed/?listType=playlist&list=PLlNDOBNFozLDlk3eGGFWOchRJ6B4ADset" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div>


## Memes

Two authors prominently feature in the show: Pierre Corneille, and Anton Chekhov. The idea of making a favicon out of Corneille came to me early, and opened the door to more meme-oriented fun.

{% include gallery id="authors" layout="half" %}

This led to the idea of having gifs in a similar style for the team.

{% include gallery id="icons" layout="fourth" caption="*photographs and memestry: Jérémie Wenger*" %}

## Three answers to [Oriza Hirata](https://en.wikipedia.org/wiki/Oriza_Hirata)

> **Qu'apporte l'utilisation d'un robot dans l'espace scénique ? S'agit-il d'une forme d'étrangeté – comparé aux acteurs ? […]**  

**Oriza Hirata :** L'utilisation d'un robot n'a pas beaucoup d'importance. Dans 20 ans, il sera normal de voir des robots sur scène, cela n'a donc pas de sens particulier. Aujourd'hui, s'il faut trouver un sens à cette utilisation, c'est parce que personne dans le monde entier ne l'a fait jusqu'à présent. C'est la seule raison pour laquelle j'utilise des robots sur scène. Cette raison est suffisante pour un artiste. Mais grâce à cela, je pense que les spectateurs devraient réfléchir à la question du théâtre et du comédien […]  
Il est vrai que plus la robotique se développe, plus elle écarte les êtres humains. Mais je pense qu'il n'est plus possible d'empêcher ce développement. C'est comme nous qui ne pouvons plus vivre sans ordinateur ni téléphone portable. Dans ce cas-là, il nous faut accepter cette absurdité́ et réfléchir à comment nous pouvons vivre avec.   
Je ne souhaite pas décrire « les gens qui sont remplacés par des machines » mais je voudrais montrer « les gens qui n'ont pas conscience d'être remplacés par des machines ».  
(Interview d'Ozira Hirata par le Festival d'Automne, à propos de sa pièce *Les Trois Sœurs (version androïde)*, 2012)


[Injectant cette citation avec Ozira Hirata en personnage, et sa citation en réplique, la fournée de réponses fut la suivante…]

**La Manufactrice** : Je pense que ça devrait être une des choses pratiques pour la scène en ce moment. Parce qu'il y a des responsabilités de la part de l'écran et des « gens qui sont remplacés par des machines », ce n'est pas la même chose et ça ne remplacera jamais la représentation des théâtres. Bonne nuit.

**La Manufactrice** : Moi je crois que si on nous amusait un peu avec « les gens qui ne sont pas remplacés par des machines » dans votre pays, on pourrait peut-être résoudre cette question et nous proposer une meilleure solution. Je crois que l'on pourrait souhaiter voir les personnes qui ne peuvent plus travailler à cause de cette nouvelle loi du dix milliardième – si le temps est favorable. Alors avancez en silence et en silence – enfin le mot est juste – en faisant des heures entières pour inverser la loi. Vous pourrez certainement les faire changer d'emploi.

**La Manufactrice** : … Ce n'est pas qu'il s'agît d'ennuyer les gens, mais c'est également et surtout le simple fait d'avoir en face de vous des gens qui ont conscience de n'être pas remplacés par des machines. Étant données ces personnes qui n'ont pas conscience d'être remplacées, elles ne sont guère différentes des autres sujets. Et c'est, sur le plan humain, ce qui importe pour les spectateurs. Le travail des machines peut beaucoup à nos yeux. Par exemple, elles se reproduisent beaucoup les machines-outils. Mais l'essentiel, c'est le fait que les machines n'utilisent absolument rien. Et quand un homme s'engage dans un combat, elles lui font peu de profit et il s'est complètement retourné. Le fait que la machine soit radicalement différente, que les machines soit entièrement automatisées, qu'il faille qu'elle imite absolument tout ce qu'il fait me paraît tout à fait regrettable. Mais que chaque action soit bien exécutée, cela n'empêche pas les gens d'être remplacés. Les gens qui n'ont pas conscience de s'être remplacés, ils s'adaptent uniquement aux machines, et ceux qui l'ont fait, par la même occasion, font beaucoup de profit. La conscience de la substitution, ou de l'anéantissement, est vis à vis des machines. Comment les rendre encore plus intéressantes en améliorant leur productivité, en les plaçant au service des consommateurs et des industriels, en développant la sécurité des transports par exemple, en réduisant les coûts de transport et les coûts d'exploitation. Tout cela est possible mais insuffisant, même pour les gens qui ont conscience de bénéficier des machines.

[Main page]({{ site.baseurl }}{% link _pages/chatbot.md %})


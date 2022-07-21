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

[Main page]({{ site.baseurl }}{% link _pages/chatbot.md %})


---
title: What did I learn while writing a Chrome and Firefox extension with React?
description: >-
  (Heads up: This might be a very long post to read. If you are interested, you
  shall continue despite my notification. ) Little Background about me: I was
  quite
pubDate: '2018-11-09'
categories:
  - Idea
  - inspiration
  - My Writings
  - Page of My Diary
  - Technology
tags: []
language: en
---

_(Heads up: This might be a very long post to read. If you are interested, you shall continue despite my notification. )_

### **Little Background about me:**

I was quite a bookworm when I did not had any computer. Actually I still am a worm but a ebook-worm, a web-worm(don’t confuse with computer virus please )now ? . The point is I used to read a lot and I still read a lot. I read late night till mornings, and under the desk in my Zoology/Botany/Chemistry classes of my graduation. That is how I learnt much about my computer programming and development that was my passion since I know about computer. If you are preparing for a competition you use [beta-alanine](https://www.carnosyn.com/beta-alanine/) to have more energy.

### The Problem:

So I started reading a lot of posts, articles and tutorials , and I end up closing too many tabs on my Chrome. About 70 to 100 tabs. And I don’t close any tab before thoroughly reading it. Sometimes I end up opening two more links before closing one tab.

As too many tabs started cluttering my browser and my computer view , it was hard to manage them, because at 70 to 100, the tab heads shrink almost to a level that you can either see the favicon or the close button when you hover over it. So it was also very difficult to jump to a specific tab when you can’t read its title. If some tab has started playing any music/sound , you never know which tab is making the sound.

> **If _some tab has started playing any music/sound , you never know which tab is making the sound._**

### **Excited Gem is coming…**

So that is when I thought of making something to solve above mentioned issues. I started learning about Chrome Extensions and how to make one. Previously I had no idea how Chrome Extensions are made and what they are consist of. I knew I could make one. How hard could it be? Even if it were a rocket science problem I would eventually solve it. So I came to know about [Chrome Extension API or JavaScript API](https://developer.chrome.com/extensions/api_index). This was the API extensions used to make Chrome extensions and almost behave like JavaScript. I started learning about it so I can start using it.

Before I started practicing Chrome API, I decided to look into other extensions that manage tabs in Chrome. I ended up looking into the source of [OneTab](https://chrome.google.com/webstore/detail/onetab/chphlpgkkbolifaimnlloiipkdnihall?hl=en) extension, but the code was obfuscated and I could not get much out of it. Then I watched few YouTube videos to make some basic extensions. Those were good but not good enough to fulfill my needs. I had to study the API thoroughly, and then I was on track ?.

![](https://cdn-images-1.medium.com/max/800/1*96LSMThSL0SWdrUm1V9P7g.jpeg)

Initial Trials and Implementation

### Simple things first: Listing tabs with jQuery

I started with showing all the tabs in a list format in new page just like [Twitter Bootstrap](https://getbootstrap.com/docs/3.3/)’s [List Group Component](https://getbootstrap.com/docs/3.3/components/#list-group). How it worked? I had to get data from Background script that uses Chrome API and send it toward content script or your extension page’s HTML. From there I used jQuery to list down the active tabs in list format with additional buttons/icons to manipulate the tabs. The experience was good but my code was getting clumsy and was getting out of hand. I had to try something else , something better. I decided React.js. Details will come later.

### Sassing my workflow

I started styling my design with CSS at start. As the code started getting complex I added SASS in my workflow. It was much relief and soothing to that I was making modules/components and easily handling front-end without much complications..

### Addition of Gulp in the workflow:

[Gulp.js](https://gulpjs.com/) was very famous task runner back then and leaving behind another famous task runners like Grunt. It was good to do a lot of automations that one should do for front-end workflows like minification, merging, copying files from directory to another and other optimizations things. It was a good move to get an optimized and organized output for production platform.

### Addition of Typescript and later Babel:

Javascript and jQuery were good and doing what expected, and I had already written much of my code including the background script and the extension page script. Now I wanted to include ES6 in my workflow. But then I also had learnt about [Typescript](https://www.typescriptlang.org/) that was a typed superscript over ES6. Typescript was good but at that time it game me so many warnings and errors that I had to abandon the idea of using the Typescript for now and move to ES6 with Babel.

### From Gulp to Webpack:

Things were good and I learnt much about Gulp at start and it helped me a lot for some time. But later things started getting slower with Gulp as more files were being included in the project. In those days I heard quite about Webpack and some other fancy terms like tree-shaking , code-splitting etc. I also had heard about the good performance of Webpack , so I decided to try Webpack. Initially it was very hard to implement as it was quite different from Gulp.js and I didn’t know much about Webpack. But after a lot of reading and messing around I started to understand Webpack and how it works. It was Webpack 3.0 the latest one at that time when I added it to my workflow.

![](https://cdn-images-1.medium.com/max/800/1*VNTnMNNxU-CO-tCQu4uXgQ.jpeg)

Evolution of Excited gem

![](https://cdn-images-1.medium.com/max/2000/1*DEXUjRl03kBi_r9nl1cgSw.png)

Present Design and Implementation

### Firefox Version

I had a plan to make this extension for Firefox too. I could make good use of Firefox’s Sidebar. But I was not sure when to start. Then I heard a news about Firefox Quantum and a competition for Addons, that is when I thought “ if not now then when? ”. There was not much to do to convert my same extension to Firefox Addon. Most of the time it was just replacing “chrome” with “browser” . So 2 months ago I had already published my addon on Firefox. Although I didn’t win the competition , but I did learn a lot in the process.

* * *

Currently my extension/addon can do following things.

1.  _List active tabs on current/all windows of Chrome/Firefox._
2.  _Show total numbers of tabs opened extension/addon icon._
3.  _It can sort tabs base on either URL or Title of the tab._
4.  _Focus , pin/unpin, mute/un-mute certain tab from list. You can also a checked selection and apply your desired action on selected tabs only._
5.  _Close tab. Before closing it confirms from you if you want to close requested tab._
6.  _Search/Filter from tabs. You can search from URLs or Titles or both. You can use Regular Expressions or Plain Text. Search can be either case sensitive or not._
7.  It shows discarded tabs as dull or half transparent. Same for tabs that are changing their state e.g. loading, moving to new URL etc.

Some dormant features are there too, which will be available soon after their thorough testing. These features are.

1.  _Keeping a log of sessions. So if you have accidentally closed he browser and tabs are not saved. You can revert from the last session._
2.  _Save desired session for later._
3.  _See a small popup window with a preview on a URL that you are hovering over before you click on it._
4.  _Search for DOM/HTML/Web elements on a webpage based on CSS selectors._

I am not a part of some group of developers. I am doing this own my own. And I still have limited knowledge . My work might be already prone to many mistakes , or security holes which I might not know. If someone of you can help me , or guide me I shall be very grateful. Any comment , suggestion or feedback is appreciated.

[Get Excited Gem for Firefox](https://addons.mozilla.org/en-US/firefox/addon/excited-gem/) _(Currently Firefox is more advanced than its Chrome counterpart. It has more features and better design)_

[Get Excited Gem for Chrome](https://chrome.google.com/webstore/detail/excited-gem/ndmfbpjadedofeohnpefljloeiekhcbc?hl)

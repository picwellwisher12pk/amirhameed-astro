---
title: 'LESS : The dynamic stylesheet language.'
description: LESS extends CSS with dynamic behavior such as variables, mixins, operations and functions. LESS runs on both the client-side (Chrome, Safari, Firefox) and serv
pubDate: '2014-06-23'
categories:
  - Technology
tags: []
language: en
---

> LESS extends CSS with dynamic behavior such as variables, mixins, operations and functions. LESS runs on both the client-side (Chrome, Safari, Firefox) and server-side, with Node.js and Rhino.

For some months , I have been hearing about LESS, LESS, LESS, LESS is more and blah blah. But last day when I studied about it in detail I came to know how beneficial it can be for front-end developers. It reduces your effort that you do on your CSS. Reducing 100's of lines to mere less than or even fewer lines. Watch different features of LESS which makes it worth using.

## Variables

These are pretty self-explanatory:

```
@nice-blue: #5B83AD; @light-blue: @nice-blue + #111; #header { color: @light-blue; } 
```

Outputs:

```
#header { color: #6c94be; } 
```

## Mixins

In LESS, it is possible to include a bunch of properties from one ruleset into another ruleset. So say we have the following class:

```
 .bordered { border-top: dotted 1px black; border-bottom: solid 2px black; } 
```

And we want to use these properties inside other rulesets. Well, we just have to drop in the name of the class in any ruleset we want to include its properties, like so:

```
#menu a {  color: #111; .bordered; } .post a { color: red; .bordered; }
```

The properties of the `.bordered` class will now appear in both `#menu a` and `.post a`:

```
#menu a { color: #111; border-top: dotted 1px black; border-bottom: solid 2px black; } .post a { color: red; border-top: dotted 1px black; border-bottom: solid 2px black; }
```

Any CSS _class_ or _id_ ruleset can be mixed-in that way.

## Parametric Mixins

LESS has a special type of ruleset which can be mixed in like classes, but accepts parameters. Here’s the canonical example:

```
.border-radius (@radius) { border-radius: @radius; -moz-border-radius: @radius; -webkit- border-radius: @radius; }
```

And here’s how we can mix it into various rulesets:

```
#header { .border-radius(4px); } .button { .border-radius(6px); }
```

Parametric mixins can also have default values for their parameters:

```
.border-radius (@radius: 5px) { border-radius: @radius; -moz-border-radius: @radius; -webkit-border-radius: @radius; }
```

We can invoke it like this now:

```
#header { .border-radius; }
```

There are alot more to know. Visit the official website.

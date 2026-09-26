---
title: Understanding OpCache
description: >-
  PHP in version 5.5 comes with a caching engine built-in – OpCache – which
  stores precompiled script bytecode in the memory. If you’re familiar with APC
  or Xcach
pubDate: '2014-07-30'
categories:
  - Technology
tags: []
language: en
---

PHP in version 5.5 comes with a caching engine built-in – OpCache – which stores precompiled script bytecode in the memory. If you’re familiar with APC or Xcache, you will already know how such engines work. As each PHP script is being compiled at runtime, a part of the execution time gets used for transforming the human readable code into code that can be understood by the machine. A bytecode cache engine like OpCache, APC or Xcache does it only once – during the first execution of a specific PHP file. Then the precompiled script is being stored in memory, which should lead to performance boosts in your PHP applications. Over the web you will easily find a lot of tutorials covering all the OpCache installation and configuration steps (it is enabled by default on 5.5, but can be installed as an extension on older versions). Read the article below to find the answers to some of the typical questions regarding different practical aspects of working with this particular cache engine. via [Understanding OpCache](http://www.sitepoint.com/understanding-opcache/?utm_content=buffera2c4e&utm_medium=social&utm_source=facebook.com&utm_campaign=buffer).

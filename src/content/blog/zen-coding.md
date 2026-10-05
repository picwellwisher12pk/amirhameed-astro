---
title: Zen Coding
description: Zen Coding is an editor plugin for high-speed HTML, XML, XSL (or any other structured code format) coding and editing. The core of this plugin is a powerful abb
pubDate: '2014-07-08'
categories:
  - My Writings
  - Technology
tags: []
language: en
---

Zen Coding is an editor plugin for high-speed HTML, XML, XSL (or any other structured code format) coding and editing. The core of this plugin is a powerful abbreviation engine which allows you to expand expressions—similar to CSS selectors—into HTML code. For example:

div#page>div.logo+ul#navigation>li\*5>a

...can be expanded into:

        

        <ul id="navigation">
            <li><a href=""></a></li>
            <li><a href=""></a></li>
            <li><a href=""></a></li>
            <li><a href=""></a></li>
            <li><a href=""></a></li>
         </ul> 
</div>

[Read more about current Zen Coding syntax](//code.google.com/p/zen-coding/wiki/ZenHTMLSelectorsEn\") Abbreviation engine has a modular structure which allows you to expand abbreviations into different languages. Zen Coding currently supports CSS, HTML, XML/XSL and HAML languages via [filters](//code.google.com/p/zen-coding/wiki/Filters\").

## Current features of abbreviation engine

*   ID and CLASS attributes: div#page.section.main.
*   Custom attributes: div, a, td[colspan=2].
*   Element multiplication: li\*5 will output <li> tag five times.
*   Item numbering with $ character: li.item$\*3 will output <li> tag three times, replacing $ character with item number.
*   Multiple '$' characters in a row are used as zero padding, i.e.: li.item$$$ → li.item001
*   Abbreviation groups with unlimited nesting: div#page>(div#header>ul#nav>li\*4>a)+(div#page>(h1>span)+p\*2)+div#footer. You can literally write a full document markup with just a single line.
*   [Filters](//code.google.com/p/zen-coding/wiki/Filters\") support
*   div tag name can be omitted when writing element starting from ID or CLASS: #content>.section is the same as div#content>div.section.
*   **(v0.7)** Text support: p>{Click }+a{here}+{ to continue}.

To better understand how Zen Coding works, watch [demo video](//vimeo.com/7405114\") and read [Smashing Magazine tutorial](//www.smashingmagazine.com/2009/11/21/zen-coding-a-new-way-to-write-html-code/\"). Zen Coding isn’t only a decent abbreviation engine, it also provides some very useful actions for HTML-coder’s every day needs, like: _Wrap with Abbreviation_, _Tag Balancing_, _Toggle Comment_, _Remove Tag_ etc. [Read more about available actions](//code.google.com/p/zen-coding/wiki/Actions\").  

## Officially supported editors

These plugins are developed by Zen Coding team and guarantee to have full support of all Zen Coding latest features.

*   **Aptana/Zend Studio/Eclipse** (crossplatform) [https://github.com/sergeche/eclipse-zencoding](//github.com/sergeche/eclipse-zencoding\")
*   **TextMate** (Mac). Available in two flavors: basic snippets (Zen HTML and Zen CSS) and full-featured plugin (ZenCoding for TextMate). Bundles > Zen Coding menu item
*   **Coda** (Mac) — [external download](//github.com/sergeche/tea-for-coda/downloads\"), via [TEA for Coda](//onecrayon.com/tea/\"). Plug-ins > TEA for Coda > Zen Coding menu item
*   **Espresso** (Mac) — [external download](//github.com/sergeche/tea-for-espresso/downloads\"), via [TEA for Espresso](//onecrayon.com/tea/\"). Zen Coding is bundled with Espresso by default, but you should upgrade ZC to latest version. Actions > HTML menu item
*   **Komodo Edit/IDE** (crossplatform) — [external download](//community.activestate.com/xpi/zen-coding\"). Tools > Zen Coding menu item
*   **Notepad++** (Windows). Zen Coding menu item Also a Python version of NPP plugin is available: [http://sourceforge.net/projects/npppythonscript/files/](//sourceforge.net/projects/npppythonscript/files/\")
*   **PSPad** (Windows). Scripts > Zen Coding menu item
*   **<textarea>** (browser-based). See [online demo](//zen-coding.ru/textarea/\").
*   **editArea** (browser-based). See [online demo](//zen-coding.ru/demo/\").
*   **CodeMirror** (browser-based). See [online demo](//zen-coding.ru/codemirror/\").
*   **CodeMirror2** (browser-based). See [online demo](//media.chikuyonok.ru/codemirror2/\").

## Third-party supported editors

These plugins are using official Zen Coding engine and developed by third-party developers. Thus, no guarantee that they support all latest ZC features.

*   **Dreamweaver** (Windows, Mac)
*   **Sublime Text** (Windows)
*   **Sublime Text 2** (crossplatform) — [install it from Package Control](//www.quora.com/Sublime-Text/How-do-I-install-Zen-Coding-for-Sublime-Text-2\")
*   **UltraEdit** (Windows)
*   **TopStyle** (Windows)
*   **GEdit** (crossplatform) — [Franck Marcia's plugin](//github.com/fmarcia/zen-coding-gedit\"), [Mike Crittenden's plugin](//github.com/mikecrittenden/zen-coding-gedit\")
*   **BBEdit/TextWrangler** (Mac) — [external download](//www.angelwatt.com/coding/zen-coding_bbedit.php\")
*   **Visual Studio** (Windows) — at [Visual Studio Gallery](//visualstudiogallery.msdn.microsoft.com/abd79254-b4f7-492d-95ae-d9fa38e0af48\")
*   **EmEditor** (Windows) — [external download](//www.emeditor.com/modules/mydownloads/singlefile.php?cid=18&lid=281\")
*   **Sakura Editor** (Windows) — [external download](//mwlab.net/zen-coding-for-sakuraeditor\")
*   **EditPlus** (windows) — [external download](//www.editplus.com\"), [release notes](//www.editplus.com/trouble.html\")
*   **NetBeans** (crossplatform) — [download](//github.com/lorenzos/ZenCodingNetBeansPlugin#readme\")
*   **Chrome Extension** — [external download](//chrome.google.com/extensions/detail/iodhcpffklplnfaihoolhfbejbinhcgn\")
*   **Userscript for Greasemonkey** — [external download](//userscripts.org/scripts/show/105015\")
*   **Geany** — [external download](//github.com/codebrainz/geany-zencoding\")
*   **RJ TextEd** — [built in since v7.50](//www.rj-texted.se/\")
*   **AkelPad** — [external download](//akelpad.sourceforge.net/forum/viewtopic.php?p=8084#8084\")
*   **[WIODE web-based IDE](//www.wiode.com/\")**
*   **[BlueFish](//bluefish.openoffice.nl/\")** — built-in in v2.2.1
*   **[Codelobster PHP Edition](//www.codelobster.com/\")** — built-in in v4.3
*   **[ShiftEdit](//shiftedit.net\")** — online IDE

## Unofficial implementations

These plugins are developed by third-party and has their own ZC engine implementation, which leads to different feature set and abbreviation syntax. Zen Coding team has no relation to this projects.

*   **IntelliJ IDEA/WebStorm/PHPStorm** (crossplatform) — built-in in latest versions
*   **Emacs** (crossplatform) — [external download](//www.emacswiki.org/emacs/ZenCoding\")
*   **Vim** (crossplatform) — [Sparkup](//github.com/rstacruz/sparkup\"), [Zen Coding for Vim](//www.vim.org/scripts/script.php?script_id=2981\")
*   [ReSharper plugin](//confluence.jetbrains.net/display/ReSharper/ZenCoding\") for **Visual Studio**

Find Zen Coding on Smashing Magazine: [button href=""http://coding.smashingmagazine.com/2009/11/21/zen-coding-a-new-way-to-write-html-code/" title="" target="blank" shape="square, rounded, pill" size="mini, small, regular, large, x-large, jumbo" block="false" circle="false" icon_only="true" info="popover, tooltip" info_place="top, right, bottom, left" info_trigger="hover, click, focus" info_content=""] Zen Coding at Smashing Magazine [/button] Go to the Source: 

[Go to Source](http://code.google.com/p/zen-coding/)

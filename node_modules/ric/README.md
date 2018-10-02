requestIdleCallback polyfill
============================

requestIdleCallback is a new browser API which allows to execute code when browser is idle.
This is crucial for creating smooth animations and user experiences allowing to avoid janks which basically happens when CPU become too overloaded to fit into frame budget which is 16 msec.

Article about RIC https://developers.google.com/web/updates/2015/08/27/using-requestidlecallback?hl=en by Paul Lewis

How polyfill works
------------------

Polyfill is built on principe that janks are most harmful to UX and have highest chance to happen when user is continously interacting with UI. Polyfill basically prevents operation from being executed while user performing some actions on interface. Currently this implies scrolls, taps, clicks, mouse and touch movements. The condition is pretty simple - if there were no interactions for 100 msec there is a huge chance that we are in idle.


Differnce between requestUserIdle and requestIdleCallback
---------------------------------------------------------

The difference is that requestUserIdle is always relying on polyfill logic even if requestIdleCallback is implemented natively in browser. This is handy if you just need to wait for UI idle since native requestIdleCallback have different behaviour and fires when main thread becomes idle, not UI.

NPM
---

Available via `npm install ric`

TO DO
-----

- Consider touchend, touchcancel, mouseup, touchleave for faster idle recognition
- Consider CSS transitions as blockers via listening to transitionstart, transitionend
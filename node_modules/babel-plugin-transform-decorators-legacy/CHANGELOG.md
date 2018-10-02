
# Changelog

## v1.3.4

* Properly support decorating class properties on subclasses.

## v1.3.3

* Fix same bug as fixed 1.3.1, except introduced for a different reason this time around.

## v1.3.2

* Fix a small bug which required the explicit deletion of `descriptor.value` when converting an initializer to an accessor.

## v1.3.1

* With the new split-out helpers in 1.3.0, Babel's `transform-runtime` was injecting the import statements too late. For now we avoid this by not allowing it to be rewritten by the transform.

## v1.3.0

* Class property support for descriptors where originally only the value was used
* Static class property support

## v1.2.0

* Support class properties with no initializer, e.g. @decorator a;
* Properly handle decorating properties/methods with string and numeric literal keys

## v1.1.0

* Support static class methods
* Display helpful errors when using unsupported syntax

## v1.0.0

* Initial release of decorator support

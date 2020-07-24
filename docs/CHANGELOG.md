# [2.0.0-rc.2](https://github.com/brainhubeu/react-carousel/compare/v2.0.0-rc.1...v2.0.0-rc.2) (2020-07-24)


### Bug Fixes

* setting offset breaks "centered" plugin [#394](https://github.com/brainhubeu/react-carousel/issues/394) ([#618](https://github.com/brainhubeu/react-carousel/issues/618)) ([cfae59f](https://github.com/brainhubeu/react-carousel/commit/cfae59f46609b26441ceba0d910b1ef02c1f1c5c))

# [2.0.0-rc.1](https://github.com/brainhubeu/react-carousel/compare/v1.0.1...v2.0.0-rc.1) (2020-07-24)


### Bug Fixes

* Adding 'rtl' to breakpoints prop-type shape ([6de56a9](https://github.com/brainhubeu/react-carousel/commit/6de56a90d7101f222c8c90bd2835b12b12f05832))
* carousel breaks when one of the carousel children is an array of nodes ([88a6e0f](https://github.com/brainhubeu/react-carousel/commit/88a6e0f8d61f25c61f5a43c2fe8ac22124e11817))
* creating npm package ([76e6e51](https://github.com/brainhubeu/react-carousel/commit/76e6e516b89380373649cba23b9466b61c210011))
* pass null instead of boolean to drag event listener if disabled ([2a884bf](https://github.com/brainhubeu/react-carousel/commit/2a884bf1b7165ad53e8a1f678e1931982c44482f))
* pkgRoot path ([1ce7ffd](https://github.com/brainhubeu/react-carousel/commit/1ce7ffd0360a942e98ed6a57532b777dadfe808f))
* Setting offset breaks "centered" ([#394](https://github.com/brainhubeu/react-carousel/issues/394)) ([5f69446](https://github.com/brainhubeu/react-carousel/commit/5f694466442587eb09ca1e17ba61406bb77e8960))
* **active thumbnail:** Active index fixed for thumbnails. Only the active element has the active style applied ([8c9a050](https://github.com/brainhubeu/react-carousel/commit/8c9a0501456dc3ead3a7a96bae71384fde170555))
* **arrow left right:** code review changes for calculating lastIndex in renderArrowRight function ([2223ae8](https://github.com/brainhubeu/react-carousel/commit/2223ae87957a26a516f9983288e2b0c14f785cb5))
* **arrow-left-right:** left and right arrows are disabled instead of being hidden. left arrow is disabled in the 0th index and right arrow is disabled in the nth - 1 index ([7ab5693](https://github.com/brainhubeu/react-carousel/commit/7ab5693719f329acffe64da6aa0abaeb729ba2f0))
* **carousel arrows:** left arrow isnt shown at 0 index and right arrow isnt shown on the last index ([f33a35c](https://github.com/brainhubeu/react-carousel/commit/f33a35c3bc515b4fa6925c1175f7056f13a35a1b))
* **carousel-arrows:** right arrow disabled on rendering last slide ([a2f6e80](https://github.com/brainhubeu/react-carousel/commit/a2f6e80a329f4179e31c83fd2e4d6bf2e4f49493))
* **dragging:** Pooled events to reuse inside setState. ([60729c6](https://github.com/brainhubeu/react-carousel/commit/60729c6d0a772a33897cbb2ea8f5c14e3639bcf2))
* disable scroll on carousel swipe ([6a1505b](https://github.com/brainhubeu/react-carousel/commit/6a1505bcdb543497bebc1b92f461e14f350861cd))
* Dots component does not account for large values in case of infinite carousel ([ae2ece4](https://github.com/brainhubeu/react-carousel/commit/ae2ece4f75d1f5299ae0a197260c823387de4573))


### Reverts

* Revert "Revert "fix: only add drag event listeners when dragging is enabled"" ([45e3d57](https://github.com/brainhubeu/react-carousel/commit/45e3d577cd1f21d764660a7b60e47e74b3e3f7fb))


### BREAKING CHANGES

* Introduce a new way of releasing react-carousel

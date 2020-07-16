# Decision log

### React (2 January 2018)
We love [React](https://github.com/facebook/react) so we'd like to focus on React only and in the nearest future, we don't plan to make this library working in another framework like [Vue.js](https://github.com/vuejs/vue).

### Renovate (18 February 2019)
We've decided that [Renovate](https://github.com/renovatebot/renovate) is better than [Greenkeeper](https://github.com/greenkeeperio/greenkeeper) because Renovate is very configurable and has a great support.

### IssueHunt (7 January 2020)
We've decided to use [IssueHunt](https://issuehunt.io/) to fund issues so we can get more contributors (more contributors, more popular a given project), assign a value to issues and reward active contributors.

### Testing environment deployment (31 January 2020)
We've decided to use http://beghp.github.io/ domain to deploy each branch there because in a version deployed to [Netlify](https://www.netlify.com/) we've noticed broken fonts so deploying to GitHub Pages gives an environment the most possibly similar to the [production version](https://brainhubeu.github.io/react-carousel/). `beghp` is an acronym from Brainhub.eu GitHub Pages and we use this organization in order to keep only real repos in the `brainhubeu` organization.

### Cypress (13 March 2020)
We've decided that [Cypress](https://github.com/cypress-io/cypress) is better than [Hermione](https://github.com/gemini-testing/hermione) (Hermione predecessor is [Gemini](https://github.com/gemini-testing/gemini)) because Hermione required setting a very large tolerance in order to pass both locally and in CI. Moreover, Cypress is much more popular.

### Recoil (14 July 2020)
We've decided that [recoil](https://recoiljs.org/) will be used for managing state of the react-carousel component because of its simplicity to set up and maintain.

### Plugins (14 July 2020)
We've decided to use plugins to make carousel easier to maintain and to allow users to extend carousel possibilities.

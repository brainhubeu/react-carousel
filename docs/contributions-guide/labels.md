# Labels

### Issue labels:
- issue type (mutually exclusive):
  - `bug`
  - `enhancement` - a feature request or a proposal to improve tests or to improve README or to improve anything beside fixing a bug
  - `question`
- answering labels (mutually exclusive):
  - `answering: reported by brainhubeu` if the issue is created by any member of the `brainhubeu` organization with no comments by external contributors
  - otherwise `answering: answered` if the last comment is by a `brainhubeu` member
  - otherwise `answering: not answered`
- severity (only for bugs, mutually exclusive):
  - `severity: blocked` - nothing is working
  - `severity: critical` - the most important features are often broken
  - `severity: major` - the most important features are sometimes broken or medium important features are often broken
  - `severity: medium` - medium important features are sometimes broken or less important features are often broken
  - `severity: minor` - less important features are sometimes broken
  - `severity: trivial` - it'd be nice to fix but we can live without fixing it
- used by third-party GitHub apps:
  - `💵 Funded on Issuehunt` - funded on IssueHunt so you can earn money, fixing the given issue
  - `🎁 Rewarded on Issuehunt` - already rewarded on IssueHunt
- other labels:
  - `duplicate` - if the given issue is a duplicate of another issue
  - `no reproduction details` - if we miss details needed to reproduce the given issue
  - `needs discussion` - if we need to discuss details of the given issue
  - `proposed issuehunt` if we consider the given issue to fund on IssueHunt
  - `hacktoberfest` - used in [Hacktoberfest](https://hacktoberfest.digitalocean.com/) during October, each year so you can obtain a T-shirt according to the Hacktoberfest rules

### PRs labels:
- testing  (mutually exclusive):
  - `tested & works` 
  - `tested & fails`
- used by third-party GitHub apps:
  - `renovate` for PRs opened by Renovate
  - `dependencies` for PRs opened by Dependabot
- other labels:
  - `wip` - Work in Progress so don't merge
  
### Labels used for both issues and PRs:
- `blocked` if a given issue or PR is blocked by another issue or PR

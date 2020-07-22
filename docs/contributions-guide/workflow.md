# Workflow

1. A contributor opens a PR.
1. A `brainhubeu` organization member creates a new branch from `master` with one of the following prefixes:
    - `fix/` for a bug fix
    - `feature/` for a new feature
    - `breaking/` for breaking changes
1. A `brainhubeu` organization member changes the PR base branch.
1. If there are no vulnerabilities, a `brainhubeu` organization member merges the PR to the created branch (other than `master`) in the main repo.
1. The CI deploys the PR to one of the testing environments.
1. A `brainhubeu` organization member tests the PR:
    - what to test?
      - whether the bug is really fixed or the newly implemented feature is working correctly
      - whether it doesn't break anything (doesn't cause any new bug)
    - where?
      - if a manual code analysis tells the PR doesn't affect the mobile and it's a simple change, only desktop (the newest Chrome in any OS)
      - otherwise both desktop and mobile (Safari for iOS or the newest Chrome for Android)
    - which examples?
      - all the examples from the docs
      - make sure to resize the screen for the `Responsive` example, desktop
      - add `rtl` to the `Autoplay & Animation speed` example
1. Other `brainhubeu` organization members (at least one person other than the one who has opened the PR) review the PR (and test if they want to).
1. If the problem is correctly resolved, no breaking changes, and the code approved, a `brainhubeu` organization member merges the PR to the `master` branch.
1. The CI publishes to NPM.
1. The CI deploys the production version of docs.
1. If the issue resolved by the merged PR is funded on IssueHunt, a `brainhubeu` organization member rewards it for the PR author.

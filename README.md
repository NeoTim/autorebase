[![build status](https://img.shields.io/circleci/project/github/tibdex/autorebase.svg)](https://circleci.com/gh/tibdex/autorebase)

<h1 align="center">
  <img src="packages/autorebase/assets/logo.svg" height="250" width="250"/>
  <p align="center">Autorebase</p>
  <p align="center" style="font-size: 0.5em">🐼 Automatically rebase and merge your pull requests</p>
</h1>

# Goal

Autorebase is a GitHub App to automatically rebase and merge pull requests.

It integrates especially well in repositories with branch protection set up to enforce up-to-date status checks.

# Usage

1.  🔌 Install the publicly hosted [Autorebase GitHub App](https://github.com/apps/autorebase) on your repository.
2.  🔐 _[recommended]_ Protect the branches on which pull requests will be made, such as `master`. In particular, it's best to [enable required status checks](https://help.github.com/articles/enabling-required-status-checks/) with the "Require branches to be up to date before merging" option.
3.  🏷 When you're ready to hand over a pull request to Autorebase, simply [add the "autorebase" label to it](https://help.github.com/articles/creating-a-label/).
4.  ✨ That's it! Pull requests with the "autorebase" label will then be rebased when their base branch moved forward (`mergeable_state === "behind"`) and "rebased and merged" once the required status checks are green and up-to-date (`mergeable_state === "clean"`).

# FAQ

## How does it work?

Autorebase relies on [`github-rebase`](packages/github-rebase/README.md) (which itself relies on [`github-cherry-pick`](packages/github-cherry-pick/README.md)) to perform all the required Git operations directly through the GitHub REST API instead of having to clone repositories on a server and executing Git CLI commands.

`github-rebase` is the 🗝 to being able to run Autorebase as a stateless, easy to maintain and cheap to operate, Azure Function/AWS Lambda!

## Which permissions & webhooks is Autorebase using?

### Permissions

- **Repository contents** _[read & write]_: because the rebasing process requires creating commits and manipulating branches.
- **Issues** _[read-only]_: to find pull requests with the "autorebase" label.
- **Pull requests** _[read & write]_: to merge pull requests.
- **Commit statuses** _[read-only]_: to know whether the status checks are green or not.

### Webhooks

- **Push**: to detect when a pull request base branch moved forward.
- **Pull request**: to detect when the "autorebase" label is added/removed.
- **Pull request review**: because it can change the mergeable state of pull requests.
- **Status**: to know when the status checks turn green.

## Why recommend up-to-date status checks?

To "keep `master` always green".

The goal is to never merge a pull request that could threaten the stability of the base branch test suite.

Green status checks are not enough to offer this guarantee. They must be up-to-date to ensure that the pull request was tested against the latest code on the base branch. Otherwise, you're exposed to ["semantic conflicts"](https://bors.tech/essay/2017/02/02/pitch/).

## Why rebasing instead of squashing/merging?

### Squashing

Good pull requests are made of multiple small and atomic commits. You loose some useful information when squashing them in a single big commit. Decreasing the granularity of commits on `master` also makes tools such as [`git blame`](https://git-scm.com/docs/git-blame) and [`git bisect`](https://git-scm.com/docs/git-bisect) less powerful.

### Merging

Merge commits are often seen as undesirable clutter:

- They make the Git graph much more complex and arguably harder to use.
- They are often poorly named, such as "Merge #1337 into master", repeating what's already obvious.

Besides, even when pull requests are "rebased and merged" (actually merged with the [`--ff-only`](https://git-scm.com/docs/git-merge#git-merge---ff-only) option), you can still, when looking at a commit on `master` in the GitHub UI, find out which pull request introduced it.

If you're convinced that rebasing is the best option, you can easily [enforce it as the only allowed method to merge pull requests on your repository](https://help.github.com/articles/configuring-commit-rebasing-for-pull-requests/).

## Why not clicking on the "update branch" button provided by GitHub instead?

Because it creates merge commits and thus exacerbates the issue explained just above.

## When not to use Autorebase?

Rebasing rewrites the Git history so it's best not to do it on pull requests where several developers are collaborating and pushing commits to the head branch.

## What are the alternatives?

- [Bors](https://github.com/apps/bors) for a more sophisticated rebasing strategy. Bors tries to batch pull requests together and see if the build is still passing on the "agglomerated pull request" before merging the corresponding pull requests. As opposed to Autorebase, Bors is stateful and will perform its required Git operations locally instead of leveraging the GitHub API. It requires storage and thus cannot run as an Azure Function/AWS Lambda: it has much higher operating costs. You also need to host it yourself to use it on private repositories.
- [automerge](https://github.com/apps/automerge) if you don't mind having merge commits in your Git history and either merging pull requests with stale status checks or having to rebase them manually.
- [Refined GitHub browser extension](https://github.com/sindresorhus/refined-github) and in particular its [option to wait for checks when merging a pull request](https://github.com/sindresorhus/refined-github#highlights) if you don't mind having to keep your browser tab opened waiting for the status checks to be green before merging your pull requests. Like automerge, it comes short when the "Require branches to be up to date before merging" option is enabled.
- [TravisCI](https://travis-ci.com/) goes halfway in the good direction: ["Rather than build the commits that have been pushed to the branch the pull request is from, we build the merge between the source branch and the upstream branch."](https://docs.travis-ci.com/user/pull-requests/#How-Pull-Requests-are-Built) but [they don't trigger a new build when the upstream/base branch move forward](https://github.com/travis-ci/travis-ci/issues/1620) so you still need to rebase your pull requests manually. Besides, it ties you to a specific CI provider as CircleCI, for instance, doesn't do the same "building the pull request from the merge commit provided by GitHub" trick.

## Why the 🐼 logo?

Because Autorebase loves eating branches 🎍!

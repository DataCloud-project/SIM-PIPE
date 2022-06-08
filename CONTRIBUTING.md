# Contributing to SIM-PIPE

We welcome contributions, but request that you follow these guidelines:

* [Bug reports](#bug-reports)
* [Feature requests](#feature-requests)
* [Pull requests](#pull-requests)
* [Code branches](#code-branches)
* [Coding standards](#coding-standards)

## Bug reports

Please report any bugs on the project's [issue tracker](https://github.com/DataCloud-project/SIM-PIPE/issues). 

* Be sure to search the list to see if your issue has already been raised.
* A good bug report is one that make it easy for us to understand what you were trying to do and what went wrong.
* Provide as much context as possible so we can try to recreate the issue.
* If possible, include screenshots depicting the bug.

## Feature requests

If you have any suggestions for new features, please raise them on the project's [issue tracker](https://github.com/DataCloud-project/SIM-PIPE/issues).

We cannot promise to incorporate your suggestions, but we will as minimum respond to the request and either plan it in a future release or make it available for other contributors to tackle.

## Pull requests

If you want to raise a pull request with a new feature, or a refactoring of existing code, please make sure that your code follows our [coding standards](#coding-standards) and adheres to our chosen open source software [LICENSE)(https://github.com/DataCloud-project/SIM-PIPE/blob/main/LICENSE), i.e., the [Apache License 2.0](https://www.apache.org/licenses/LICENSE-2.0).

Upon [pull requests](#pull-requests) we use [ESLint checker rules](https://github.com/DataCloud-project/SIM-PIPE/blob/main/.eslintrc.cjs) to automatically check that the code is properly formatted.

Please also make sure to provide a detailed description of your changes by adding a new section in the [CHANGELOG.md](https://github.com/DataCloud-project/SIM-PIPE/blob/main/CHANGLOG.md) file before requesting the pull request.

The pull request will be reviewed by at least one member of the [core development team](https://github.com/DataCloud-project/SIM-PIPE/blob/main/README.md#core-development-team).

## Code branches

At the moment we are using the following branch structure:

* [main](https://github.com/DataCloud-project/SIM-PIPE/tree/main) - This is the main branch for which we integrate new code and create releases. We use the [Semantic Versioning 2.0.0](https://semver.org/) guidelines for versioning the releases.
* `feature/patch` - We create separate branches for each new feature or patch that we are working on based on the latest `main` branch. After the code has been completed and tested, we integrate the work through a pull request. 

## Coding standards

We use the following coding standards:

* [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript)

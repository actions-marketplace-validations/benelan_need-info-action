# Need More Info

 A GitHub Action that requests more info when required content is not included in an issue. You can check out test runs [here](https://github.com/benelan/need-info-action/issues).

 ## Configuration
The Action has two properties that have defaults and are not required.
- __config-path__: Path to the config file, defaults to `.github/need-info.yml`
- __repo-token__: Token for the repository, defaults to  `${{ secrets.GITHUB_TOKEN }}`


### Example Workflow File
```yaml
# .github/workflows/verify-info.yml
name: 'Issue Info'
on:
  issues:
    types: [opened, edited, labeled] # can pick and choose types
    branches: [master]
  issue_comment:
    types: [created, edited]
    branches: [master]
jobs:
  verify:
    runs-on: ubuntu-latest
    steps:
      - uses: benelan/need-info-action@v1.0.0
        # the rest is not required if using the defaults
        with:
          github-token: 'super-duper-secret-token-sshhh'
          config-path: '.github/configs/not-default.yml'
```
The following properties can be set in the configuration file.

| Config Property            | Type           | Description                                          |
|----------------------------|----------------|------------------------------------------------------|
| requiredItems _(required)_ | RequiredItem[] | Items that an issue with a labelToCheck must include |
| labelsToCheck _(required)_ | string[]       | Labels that trigger a check for required information |
| labelToAdd _(required)_    | string         | Label added to issues with missing information       |
| commentHeader              | string         | Message above the missing content responses          |
| commentFooter              | string         | Message below the missing content responses          |



| Required Item Property  | Type     | Description                                                   |
|-------------------------|----------|---------------------------------------------------------------|
| content _(required)_    | string[] | A list of content that is required in an issue or comment     |
| response _(required)_   | string   | A response to comment on an issue if the content is missing   |
| requireAll _(required)_ | boolean  | Whether to require all of the content items or just one       |


### Example Config File
 ```yaml
 # .github/need-info.yml
labelToAdd: 'need more info'
labelsToCheck:
  - 'bug'
  - 'enhancement'
commentHeader: 'More information is required to proceed:'
requiredItems:
  -
    response: '- Use the appropriate format from the issue templates'
    requireAll: true
    content:
      - '## Actual Behavior'
      - '## Expected Behavior'
  -
    response: '- A sample that reproduces the issue'
    requireAll: false
    content:
      - 'jsbin.com'
      - 'codepen.io'
      - 'jsfiddle.net'
      - 'codesandbox.io'
commentFooter: 'This issue will be automatically closed in a week if the information is not provided. Thanks for your understanding.'
 ```

## How It Works
The appropriate method is determined depending on whether the Action is triggered by an issue or comment event.

### Issue Event Webhook
The `issues` event method can be run on `opened`, `edited` and/or `labeled` actions. 
- The Action checks if an issue has at least one of the `labelsToCheck`. If it does, it checks the issue body for the `requiredItems`.
  - If the issue satisfies all of the requirements then the Action ends.
  - If any requirement is not satisfied then `labelToAdd` is added to the issue. The Action comments on the issue with the `response` for all of the `requiredItems` that were not provided.
- If the issue does not have any `labelsToCheck` then the Action ends.

### Comment Event Webhook
The `issue_comment` event method can be run on `created` and/or `edited` actions.
- If there is a comment on an issue with the `labelToAdd` then the Action checks the comment for any `requiredItems`.
  - If the comment satisfies any ONE required item then the `labelToAdd` is removed from the issue.
  - If the comment does not have any `requiredItems` then the Action ends.
- If the commented issue does not have the  `labelToAdd`, or the commenter is not the original poster, then the Action ends.

> **Note:** If there were multiple `requiredItems` that the commenter needed and they only provided one, the maintainer can manually ask for the additional items and add back the `labelToAdd`.


## Closing Issues
This Action can be used in conjunction with [Close Stale Issues](https://github.com/marketplace/actions/close-stale-issues), which can be set up to close issues with the `labelToAdd` after a certain amount of time.

### Example
```yaml
# .github/workflows/close-issue.yml
name: 'Need Info'
on:
  schedule:
    - cron: '30 1 * * *'
jobs:
  close:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/stale@v3
        with:
          days-before-stale: -1 # do not automatically label issues
          days-before-close: 7
          remove-stale-when-updated: false # do not automatically remove label
          stale-issue-label: 'need more info'
          stale-pr-label: 'need more info'
          close-issue-message: 'This issue has been automatically closed due to missing information. We will reopen the issue if the information is provided.'
```

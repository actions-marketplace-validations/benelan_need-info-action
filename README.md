# Need More Info

 A GitHub Action that requests more info when required content is not included in an issue.

 ## How it Works

 ### Configuration
 The maintainer provides the following configuration:
 ```js
{
   requiredItems: [
     {
       content: ['first info', 'second info'],
       requireAll: true,
       response: 'More info is needed: Please provide both first and second.'
     },
     {
       content: ['third info', 'forth info'], # only one string is required
       response: 'More info is needed: Please provide either third or fourth.'
     },
     ...
   ],
   labelsToCheck: ['bug', 'enhancement'],
   labelToAdd: 'need more info'
}
 ```

 ### Open Issue Webhook
- The Action checks if a new issue has at least one of the `labelsToCheck`. If it does, it checks the issue body for the `requiredItems`.
  - If the issue satisfies all of the requirements then the Action ends.
  - If any requirement is not satisfied then `labelToAdd` is added to the issue. The Action comments on the issue with the `response` for all of the `requiredItems` that were not provided.
- If the issue does not have any `labelsToCheck` then the Action ends.

### Issue Comment Webhook
- If there is a comment on an issue with `labelToAdd`, then the Action checks the comment for any `requiredItems`.
  - If the comment satisfies any ONE required item then the `labelToAdd` is removed from the issue.
  - If the comment does not have any `requiredItems` then the Action ends.

> **Note:** If there were multiple `requiredItems` that the commenter needed and they only provided one, the maintainer can manually ask for the additional items and add back the `labelToAdd`.

### Add Label Webhook
- If one of the `labelsToCheck` is added to to an existing issue then the Action uses the same workflow as the *New Issue Webhook*.

### Closing Issues
- This Action can be used in conjunction with the [Close Stale Issues](https://github.com/marketplace/actions/close-stale-issues) Action which can be set up to delete issues with the `labelToAdd` after a certain amount of time.

# Security Spec

## Data Invariants
1. A user profile (`users/{userId}`) can only be created and updated by `{userId}`.
2. User collections (`favorites`, `shoppingList`, `planner`) can only be modified by the parent `{userId}`.
3. A `recipe` can be created by any authenticated user.
4. A `recipe` can only be updated by its `authorId`.
5. A `review` can only be created by the authenticated user matching `userId`, and `userId` cannot be spoofed. Update is blocked or restricted to owner.

## The Dirty Dozen Payloads
1. Unauthorized write to another user's profile.
2. Creating a recipe with no `authorId`.
3. Creating a recipe with an `authorId` spoofed to another user.
4. Creating a favorite with spoofed `request.time`.
5. Missing `name` on a shopping list item.
6. `amount` of type string on a shopping list item.
7. Spoofed `userId` on a review.
8. Modifying a recipe's `averageRating` manually.
9. Writing huge payloads to crash storage (exceeding string size).
10. Creating a favorite under another user's ID.
11. Reading another user's shopping list.
12. Fetching recipes without being authenticated (allowed if app supports public reads).

## Test Runner
Testing omitted for brevity in system prompt limitations.

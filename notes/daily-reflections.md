notepad index.html

\## Day 4, Block 1: Promises, fetch, and Promise.all



\### What I built

\- Practiced the three promise states (pending, fulfilled, rejected) with `setTimeout`, `await`, and `try/catch`.

\- Wrote `loadSuggestions` in `src/api.js` using `fetch`, checking `response.ok` before `response.json()`.

\- Added a Suggestions section that shows loading text, the suggestion list, an error message, and a Retry button.

\- Clicking a suggestion only fills the task title input. It never changes the local tasks array.

\- Wrote `loadBoardExtras`, which runs two requests at the same time with `Promise.all`.



\### Logic Challenge 13: Promise.all



\*\*When does Promise.all reject?\*\*

It rejects as soon as any one of the promises rejects. In my offline test both requests failed, so the whole call failed and I got `Failed to fetch`. If only one had failed, I would still have lost the result of the other one. `Promise.allSettled` is an alternative that keeps the successful results.



\*\*Why is it faster than running requests one after another?\*\*

The requests start together and wait at the same time, so the total time is about the time of the slower request. Running them one after another would take the sum of both times.



\*\*How I showed local tasks still work when remote data fails:\*\*

I set the DevTools Network dropdown to Offline and clicked Load suggestions. The error message and Retry button appeared, and I could still add tasks with the form. Then I set it back to No throttling, clicked Retry, and the suggestions loaded again.



\### Hardest bug

The page showed `Cannot use import statement outside a module`, then `Identifier 'taskList' has already been declared`. Modules don't load from `file://`, and `app.js` was loaded twice because of duplicate script tags in `index.html`. Some elements were also left below `</html>`. I fixed it by using plain script tags (`api.js` first, then `app.js`), and by removing the duplicate tag.



\### What I learned

\- `fetch` only rejects on network failure, so I have to check `response.ok` for HTTP errors.

\- `await` pauses only its own function, not the whole page.

\- A function that throws on failure lets the caller decide what to show, which lets me tell "no suggestions" apart from "request failed".

\- Always check the script tags first when a variable is "already declared".



\### Still to clean up

\- Remove the Step 49 practice code from `app.js`.

\- Move the `filters` div, task title input, and error paragraph from below `</html>` into `<main>`.



\## Day 4, Block 2 (so far): Async state and stale responses



\### What I built

\- Replaced the scattered page updates in the click handler with one state object, `suggestionState`, that has a `status` of `idle`, `loading`, `success`, or `error`, plus the loaded `items`.

\- Wrote one function, `renderSuggestions`, that draws the Suggestions section from that state. The click handler only changes the state and then calls render.

\- Added a guard at the top of `handleLoadSuggestions` so a second click is ignored while a request is already loading. The button is also disabled while loading.

\- Added a request counter, `latestRequestId`, so an old response cannot overwrite a newer one.



\### Step 53: Explicit state

Having one `status` value means the page can only be in one state at a time. Before, the button text, status message, and list were changed in different places, so they could get out of sync. Now `renderSuggestions` is the single place that decides what the page shows for each state.



\### Step 54: No duplicate fetches

If the status is already `loading`, the handler returns immediately. `renderSuggestions` also disables the button during loading and enables it again afterwards, whether the request succeeded or failed.



\### Step 55: Stale responses

\*\*What is a stale response?\*\*

A stale response is an answer from an older request that arrives after a newer request has started. If it were accepted, it could replace newer, correct data with old data.



\*\*How does the request counter stop it?\*\*

Each request gets the next number from `++latestRequestId`. After the `await`, the code compares its own `requestId` with `latestRequestId`. If they differ, a newer request exists, so the old response (or old error) is ignored and does not change the page.



\*\*How I tested it:\*\*

Normal clicks cannot create overlapping requests because of the guard, so I forced two calls from the console by resetting the status to `idle` between them. The page ended in a normal success state with five suggestions and no errors.



\### Bugs I hit

\- I had to make sure I deleted the whole old `handleLoadSuggestions` function, not only its first lines, and place `suggestionState` and `latestRequestId` above the function that uses them.



\### Still to do in this block

\- Step 56: test slow network, HTTP failure, malformed data, empty response, and retry.

### Logic Challenge 14: normalizeSuggestions

`normalizeSuggestions(data)` is a pure function. It takes anything and returns a clean array of at most five suggestions with the same shape every time: `id`, `title`, `completed`.

**Rules it follows**
- If the input is not an array (null, a string, an object), it returns `[]`.
- It keeps only objects with a non-empty string `title` (whitespace-only titles are dropped).
- It limits the result to five items.
- It trims titles and fills in missing `id` and `completed` values.

**Why not trust the response?**
A server can return an error page, a changed format, or missing fields. If the app used the data as is, one bad item could crash the rendering code. Cleaning the data in one place means the rest of the app can rely on a consistent shape.

**What I tested**
null, a string, an empty array, empty and whitespace titles, wrong types, a valid item, and eight items (only five returned).

### Logic Challenge 15: Undo delete

**How it works**
Before a task is deleted, the click handler saves `{ task, index }` in the variable `lastDeleted`. `restoreTask(tasks, deleted)` returns a new array with the task inserted back at its old index (capped at the list length, in case the list got shorter). The Undo button is shown only when `lastDeleted` is not null.

**State transitions**
- No undo available: `lastDeleted` is `null`, button hidden.
- Delete a task: `lastDeleted` is set, button shown.
- Delete another task: `lastDeleted` is overwritten, so only the newest delete can be undone.
- Click Undo: task restored, `lastDeleted` set back to `null`, button hidden.
- Reload: memory is cleared, so undo is no longer available.

**Tests**
Delete then undo (position and data kept), two deletes in a row (only the second is undoable), and reload (undo gone).

### Logic Challenge 16: JSON export and import

**Export**
`exportTasks` turns the tasks array into text with `JSON.stringify`, wraps it in a Blob, and downloads it through a temporary link. The status line reports how many tasks were exported.

**Import**
Choosing a file reads its text, parses it with `JSON.parse`, and passes it to `validateImportedTasks`. The validator checks that the data is a non-empty array, and that each task has a unique integer id, a title of 1 to 80 characters, a boolean `completed`, and a priority of low, medium, or high. Only after validation passes and the user confirms is `uiTasks` replaced, then saved and re-rendered. Any failure leaves the current tasks untouched.

**Tests**
- Valid exported file: confirm box, tasks replaced, "Imported 5 tasks."
- Cancel on the confirm box: nothing changed.
- Malformed file (`not json`): "not valid JSON" message, tasks unchanged.
- Empty file (`[]`): "File has no tasks."
- Structurally invalid file (`[{"title": 5}]`): "invalid id" message.


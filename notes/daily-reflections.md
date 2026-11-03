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


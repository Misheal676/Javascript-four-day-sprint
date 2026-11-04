\# Focus Board



A small task planner built with plain JavaScript, HTML, and CSS. It lets you create, edit, filter, and save tasks in the browser, with optional suggestions loaded from a remote API.



\## Features



\- Add tasks with a title and priority (blank, over 80 characters, and duplicate titles are rejected)

\- Mark tasks complete or open, edit titles, and delete tasks

\- Undo the most recent delete

\- Filter All, Open, or Completed, and search case-insensitively

\- Task counts and completion percentage

\- Tasks saved in localStorage, with safe recovery from corrupted data

\- Optional suggestions fetched from a remote API, with loading, error, and retry states

\- Export tasks to a JSON file and import them back, with validation and confirmation



\## Requirements and how to run



\- A modern browser (Chrome, Edge, or Firefox)

\- No installs, framework, or build step

\- No local server is needed



1\. Clone the repository.

2\. Open `index.html` in your browser (double-click it).



Suggestions need an internet connection. Everything else works offline.



\## Folder structure



```

javascript-four-day-sprint/

&#x20; README.md

&#x20; index.html

&#x20; styles.css

&#x20; src/

&#x20;   api.js     - fetch calls and normalizeSuggestions

&#x20;   app.js     - task logic, rendering, events, storage, import/export

&#x20; notes/

&#x20;   daily-reflections.md

&#x20;   acceptance-checks.md

```



`api.js` loads first and defines `loadSuggestions`, `loadBoardExtras`, and `normalizeSuggestions`. `app.js` holds the task functions (`addTask`, `toggleTask`, `deleteTask`, `renameTask`, `restoreTask`), the validators, the render functions, and the event handlers.



\## How to use



\- \*\*Create:\*\* type a title, choose a priority, click Add task.

\- \*\*Edit or delete:\*\* use the Edit and Delete buttons on a task.

\- \*\*Undo:\*\* after a delete, click Undo delete to restore the task.

\- \*\*Filter and search:\*\* use All, Open, Completed, and the search box.

\- \*\*Persistence:\*\* tasks are saved automatically and survive a reload.

\- \*\*Suggestions:\*\* click Load suggestions, then click one to copy it into the title box. It does not add a task until you submit the form.

\- \*\*Export and import:\*\* Export tasks downloads a JSON file. Import tasks validates a chosen file, asks for confirmation, then replaces your tasks.



\## Manual tests



| # | Steps | Expected result |

|---|-------|-----------------|

| 1 | Add a valid task, then reload | Task appears and is still there after reload |

| 2 | Add "Write tests", then " write tests " | Duplicate error is shown, no task added |

| 3 | Submit a blank title | Error is shown, no task added |

| 4 | Click Completed | Only completed tasks are shown; counts do not change |

| 5 | Search "WRITE" | Matching tasks appear regardless of case |

| 6 | Go offline in DevTools, click Load suggestions | Error and Retry appear; tasks still work |

| 7 | Delete a task, click Undo delete | Task returns at its old position |

| 8 | Export, then import the file and confirm | "Imported N tasks." and the list is unchanged |

| 9 | Import a file containing `not json` | "Not valid JSON" message; tasks unchanged |

| 10 | Click Edit and rename a task, then reload | New title is shown and saved |



\## Known limitations



\- Suggestions need an internet connection.

\- Editing uses the browser's `prompt` box.

\- Undo remembers only the most recent delete and is lost on reload.

\- Import replaces all current tasks (after confirmation).

\- Styling is minimal.



\## What I learned



(Write 3 or 4 sentences in your own words. For example: how async/await and fetch work, why `response.ok` must be checked, why the DOM should be drawn from one source of truth.)



\## Hardest bug



(Describe one bug from this sprint and how you fixed it. For example: the `taskList has already been declared` error caused by loading `app.js` twice, or the code that landed outside a function and caused "Illegal return statement".)



\## Next improvement



(One thing you would add next, such as a proper edit form instead of `prompt`.)


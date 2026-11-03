async function loadSuggestions() {
  const response = await fetch("https://jsonplaceholder.typicode.com/todos?_limit=5");
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const data = await response.json();
        return normalizeSuggestions(data);

}async function loadBoardExtras() {
  const [todosRes, usersRes] = await Promise.all([
    fetch("https://jsonplaceholder.typicode.com/todos?_limit=5"),
    fetch("https://jsonplaceholder.typicode.com/users?_limit=3"),
  ]);
  if (!todosRes.ok || !usersRes.ok) throw new Error("A request failed");
  const [todos, users] = await Promise.all([todosRes.json(), usersRes.json()]);
  return { todos, users };
}

function normalizeSuggestions(data) {
  if (!Array.isArray(data)) return [];

  return data
    .filter((item) =>
      item !== null &&
      typeof item === "object" &&
      typeof item.title === "string" &&
      item.title.trim() !== ""
    )
    .slice(0, 5)
    .map((item, index) => ({
      id: item.id ?? index + 1,
      title: item.title.trim(),
      completed: item.completed === true,
    }));
}

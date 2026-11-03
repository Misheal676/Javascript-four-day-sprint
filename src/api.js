async function loadBoardExtras() {
  const [todosRes, usersRes] = await Promise.all([
    fetch("https://jsonplaceholder.typicode.com/todos?_limit=5"),
    fetch("https://jsonplaceholder.typicode.com/users?_limit=3"),
  ]);
  if (!todosRes.ok || !usersRes.ok) throw new Error("A request failed");
  const [todos, users] = await Promise.all([todosRes.json(), usersRes.json()]);
  return { todos, users };
}
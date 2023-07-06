const todoContainer = document.getElementById('todos');
const filterDropdown = document.getElementById('filterDropdown');
const addTodoForm = document.getElementById('addTodoForm');
const userIdInput = document.getElementById('userIdInput');
const todoInput = document.getElementById('todoInput');
let todos = []; // Store the todos fetched from the API
// Fetch Todos
const getTodos = async () => {
  const response = await fetch('https://dummyjson.com/todos');
  const data = await response.json();
  todos = data.todos;
  return todos;
};
// Display Todos
const displayTodos = () => {
  todoContainer.innerHTML = ''; // Clear existing todos
  todos.forEach(item => {
    let div = document.createElement('div');
    let todo = document.createElement('h2');
    let completed = document.createElement('p');
    let checkbox = document.createElement('input');
    let deleteButton = document.createElement('button');
    todo.innerHTML = item.todo;
    completed.innerHTML = `Completed: ${item.completed}`;
    checkbox.type = 'checkbox';
    checkbox.checked = item.completed;
    deleteButton.textContent = 'Delete';
    // Add event listener to handle completion status change
    checkbox.addEventListener('change', async event => {
      const completed = event.target.checked;
      await updateTodoStatus(item.id, completed);
      completed ? (div.style.backgroundColor = 'green') : (div.style.backgroundColor = 'yellow');
      completed ? (completed.innerHTML = 'Completed: true') : (completed.innerHTML = 'Completed: false');
    });
    // Add event listener to handle todo deletion
    deleteButton.addEventListener('click', async () => {
      await deleteTodo(item.id);
      todoContainer.removeChild(div);
    });
    div.appendChild(todo);
    div.appendChild(completed);
    div.appendChild(checkbox);
    div.appendChild(deleteButton);
    div.setAttribute('key', item.id);
    div.setAttribute('class', 'todo');
    if (item.completed) {
      div.style.backgroundColor = 'green';
    } else {
      div.style.backgroundColor = 'yellow';
    }
    todoContainer.appendChild(div);
  });
};
// Filter Todos
const filterTodos = () => {
  const filterValue = filterDropdown.value;
  let filteredTodos = todos;
  if (filterValue === 'completed') {
    filteredTodos = todos.filter(item => item.completed);
  } else if (filterValue === 'incomplete') {
    filteredTodos = todos.filter(item => !item.completed);
  }
  todoContainer.innerHTML = ''; // Clear existing todos
  filteredTodos.forEach(item => {
    let div = document.createElement('div');
    let todo = document.createElement('h2');
    let completed = document.createElement('p');
    let checkbox = document.createElement('input');
    let deleteButton = document.createElement('button');
    todo.innerHTML = item.todo;
    completed.innerHTML = `Completed: ${item.completed}`;
    checkbox.type = 'checkbox';
    checkbox.checked = item.completed;
    deleteButton.textContent = 'Delete';
    // Add event listener to handle completion status change
    checkbox.addEventListener('change', async event => {
      const completed = event.target.checked;
      await updateTodoStatus(item.id, completed);
      completed ? (div.style.backgroundColor = 'green') : (div.style.backgroundColor = 'yellow');
      completed ? (completed.innerHTML = 'Completed: true') : (completed.innerHTML = 'Completed: false');
    });
    // Add event listener to handle todo deletion
    deleteButton.addEventListener('click', async () => {
      await deleteTodo(item.id);
      todoContainer.removeChild(div);
    });
    div.appendChild(todo);
    div.appendChild(completed);
    div.appendChild(checkbox);
    div.appendChild(deleteButton);
    div.setAttribute('key', item.id);
    div.setAttribute('class', 'todo');
    if (item.completed) {
      div.style.backgroundColor = 'green';
    } else {
      div.style.backgroundColor = 'yellow';
    }
    todoContainer.appendChild(div);
  });
};
// Add Todo
const addTodo = async (userId, todo) => {
  const newTodo = {
    userId,
    todo,
    completed: false,
  };
  const response = await fetch('https://dummyjson.com/todos/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newTodo),
  });
  const data = await response.json();
  todos.push(data);
  displayTodos();
};
// Update Todo Status
const updateTodoStatus = async (todoId, completed) => {
  const updatedTodo = todos.find(item => item.id === todoId);
  if (updatedTodo) {
    updatedTodo.completed = completed;
    const response = await fetch(`https://dummyjson.com/todos/1`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedTodo),
    });
    const data = await response.json();
    const updatedIndex = todos.findIndex(item => item.id === todoId);
    todos[updatedIndex] = data;
  }
};
// Delete Todo
const deleteTodo = async (todoId) => {
  await fetch(`https://dummyjson.com/todos/1`, {
    method: 'DELETE',
  });
  todos = todos.filter(item => item.id !== todoId);
};
// Function to handle the completion status change
const handleCompletionChange = (event, todoId) => {
  const completed = event.target.checked;
  updateTodoStatus(todoId, completed);
  // Update the label text
  const label = event.target.parentNode.querySelector('p');
  label.textContent = `Completed: ${completed}`;
};
// Event listener for dropdown change
filterDropdown.addEventListener('change', filterTodos);
// Event listener for form submission
addTodoForm.addEventListener('submit', async event => {
  event.preventDefault(); // Prevent form submission
  const userId = userIdInput.value;
  const todo = todoInput.value;
  if (userId && todo) {
    await addTodo(userId, todo);
    // Clear input fields
    userIdInput.value = '';
    todoInput.value = '';
  }
});
// Fetch and display initial todos
getTodos().then(displayTodos);
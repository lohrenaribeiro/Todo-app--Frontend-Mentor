const input = document.querySelector("input");
const todoList = document.querySelector(".todo-list");
const buttons = document.querySelectorAll(".btns");
const theme = document.querySelector(".theme");

const isElementTrue = true;

const getLocalStorage = () => JSON.parse(localStorage.getItem("keyTodo")) ?? [];

const setLocalStorage = (arr) =>
  localStorage.setItem("keyTodo", JSON.stringify(arr));

const changeTheme = (event) => {
  const img = event.target;
  let targetTheme;
  let currentTheme = document.documentElement.getAttribute("data-theme");

  if (img.tagName === "IMG" && currentTheme === "light") {
    img.src = "/images/icon-sun.svg";
    targetTheme = "dark";
  } else {
    img.src = "/images/icon-moon.svg";
    targetTheme = "light";
  }
  transition();
  document.documentElement.setAttribute("data-theme", targetTheme);
};

let transition = () => {
  document.documentElement.classList.add("theme-transition");
  window.setTimeout(() => {
    document.documentElement.classList.remove("theme-transition");
  }, 1000);
};

const getInputText = (event) => {
  const key = event.key;
  const inputValue = event.target.value;
  const todoListArr = getLocalStorage();

  if (key === "Enter" && inputValue !== "") {
    todoListArr.push({
      key: inputValue,
      checked: false,
    });
    setLocalStorage(todoListArr);
    event.target.value = "";

    displayTodoList();
  }
};

const displayTodoList = () => {
  const todoListArr = getLocalStorage();
  const todoList = document.querySelector(".todo-list");
  const buttons = document.querySelector(".btns");
  todoList.innerHTML = "";
  todoListArr.forEach((todoList, index, arr) => {
    createTodoList({
      item: todoList,
      status: todoList,
      index: index,
      array: arr,
    });
  });
  
  buttons.classList.add("active");

  if (Array.isArray(todoListArr) && !todoListArr.length) {
    buttons.classList.remove("active")
    buttons.classList.add("remove")
  }
  checkAllbuttons();
};

const createTodoList = ({ item, status, index, array }) => {
  const totalItems = document.querySelector(".btns span");

  todoList.innerHTML += ` 
        <div class="list ${status.checked}" data-todo="${index}" draggable="true">
          <div class="remove" data-todo="${index}"></div>
          <h2>${item.key}</h2>
        </div>  
      `;
  totalItems.textContent = `${array.length} items left`;
};

const deleteTodoList = (element, arr) => {
  if (element.classList.contains("remove")) {
    const index = element.dataset.todo;
    arr.splice(index, 1);
    setLocalStorage(arr);
    arr.length - 1;
    displayTodoList();
  }
};

const activeState = (element) => {
  const index = element.dataset.todo;
  const todoListArr = getLocalStorage();
  const todoListIndex = todoListArr[index];

  if (
    element.classList.contains("list") &&
    todoListIndex.checked !== isElementTrue
  ) {
    todoListIndex.checked = isElementTrue;
    element.classList.add("true");
    element.dataset.active = todoListArr[index].checked;

    setLocalStorage(todoListArr);
  } else if (
    element.classList.contains("list") &&
    todoListIndex.checked === isElementTrue
  ) {
    element.classList.remove("true");
    todoListIndex.checked = false;
    setLocalStorage(todoListArr);
  }
  checkAllbuttons();
};

const checkList = (event) => {
  const removeBtn = event.target;
  const todoArr = getLocalStorage();

  activeState(removeBtn);
  deleteTodoList(removeBtn, todoArr);
};

const clearCompletedList = (arr, status) => {
  const arrays = arr.filter((element) => element.checked !== status);
  setLocalStorage(arrays);
};

const activeList = (array, status) => {
  todoList.innerHTML = "";
  array.forEach((todoList, index, arr) => {
    if (todoList.checked !== status) {
      createTodoList({
        item: todoList,
        status: todoList,
        index: index,
        array: arr,
      });
    }
  });
};

const completedList = (array, status) => {
  todoList.innerHTML = "";
  array.forEach((todoList, index, arr) => {
    if (todoList.checked === status) {
      createTodoList({
        item: todoList,
        status: todoList,
        index: index,
        array: arr,
      });
    }
  });
};

const allTodoList = (array) => {
  todoList.innerHTML = "";
  array.forEach((todoList, index, arr) => {
    createTodoList({
      item: todoList,
      status: todoList,
      index: index,
      array: arr,
    });
  });
};

const checkAllbuttons = () => {
  const todoArr = getLocalStorage();

  buttons.forEach(button => {
    button.addEventListener("click", (event) => {
      const elementBtn = event.target.classList.value;

      switch (elementBtn) {
        case "clear":
          clearCompletedList(todoArr, isElementTrue);
          displayTodoList();
          break;
        case "active-btn":
          activeList(todoArr, isElementTrue);
          break;
        case "completed":
          completedList(todoArr, isElementTrue);
          break;
        default:
          allTodoList(todoArr);
          break;
      }
    });
  });
};

theme.addEventListener("click", changeTheme);
input.addEventListener("keydown", getInputText);
todoList.addEventListener("click", checkList);

displayTodoList();

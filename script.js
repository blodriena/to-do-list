(() => {
  let todos = JSON.parse(localStorage.getItem("todos") || "[]");
  let filter = "all"; // "all" | "active" | "done"
  let nextId = todos.length ? Math.max(...todos.map((t) => t.id)) + 1 : 1;
 
  const form        = document.querySelector(".todo-form");
  const input       = document.getElementById("todo-input");
  const list        = document.querySelector(".todo-list");
  const footer      = document.querySelector(".todo-footer");
  const countSpan   = footer.querySelector("span");
  const clearBtn    = footer.querySelector("button");
  const filterBtns  = document.querySelectorAll(".todo-actions button");
 
  function save() {
    localStorage.setItem("todos", JSON.stringify(todos));
  }
 
  function render() {
    const visible = todos.filter((t) => {
      if (filter === "active") return !t.done;
      if (filter === "done")   return  t.done;
      return true;
    });
    list.innerHTML = "";
    if (visible.length === 0) {
      const empty = document.createElement("li");
      empty.style.cssText =
        "text-align:center;padding:24px 0;color:var(--text-soft);font-size:14px;";
      empty.textContent =
        filter === "done"
          ? "Hali bajarilgan vazifa yo'q."
          : filter === "active"
          ? "Barcha vazifalar bajarilgan!"
          : "Vazifalar ro'yxati bo'sh.";
      list.appendChild(empty);
    } else {
      visible.forEach((todo) => {
        const li = buildItem(todo);
        list.appendChild(li);
      });
    }
 
    const activeCount = todos.filter((t) => !t.done).length;
    countSpan.textContent =
      activeCount === 0
        ? "Barcha vazifalar bajarildi 🎉"
        : `${activeCount} ta vazifa qoldi`;
 
    filterBtns.forEach((btn) => {
      const map = { Barchasi: "all", Faol: "active", Bajarilgan: "done" };
      btn.classList.toggle("active", map[btn.textContent] === filter);
    });
  }
 
  function buildItem(todo) {
    const li = document.createElement("li");
    li.className = "todo-item" + (todo.done ? " done" : "");
    li.dataset.id = todo.id;
 
    const label = document.createElement("label");
 
    const checkbox = document.createElement("input");
    checkbox.type    = "checkbox";
    checkbox.checked = todo.done;
    checkbox.setAttribute("aria-label", todo.text);
 
    const span = document.createElement("span");
    span.textContent = todo.text;
 
    label.append(checkbox, span);
 
    const delBtn = document.createElement("button");
    delBtn.type      = "button";
    delBtn.textContent = "✕";
    delBtn.setAttribute("aria-label", "O'chirish");
 
    li.append(label, delBtn);
    return li;
  }
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) return;
 
    todos.unshift({ id: nextId++, text, done: false });
    input.value = "";
    save();
    render();
 
    const first = list.firstElementChild;
    if (first) {
      first.style.transition = "box-shadow 0.3s ease";
      first.style.boxShadow  = "0 0 0 2px var(--accent)";
      setTimeout(() => (first.style.boxShadow = ""), 600);
    }
  });
 
  list.addEventListener("change", (e) => {
    if (e.target.type !== "checkbox") return;
    const id   = Number(e.target.closest(".todo-item").dataset.id);
    const todo = todos.find((t) => t.id === id);
    if (todo) {
      todo.done = e.target.checked;
      save();
      render();
    }
  });
 
  list.addEventListener("click", (e) => {
    const delBtn = e.target.closest(".todo-item > button");
    if (!delBtn) return;
    const id = Number(delBtn.closest(".todo-item").dataset.id);
 
    const li = delBtn.closest(".todo-item");
    li.style.transition = "opacity 0.2s ease, transform 0.2s ease";
    li.style.opacity    = "0";
    li.style.transform  = "translateX(12px)";
 
    setTimeout(() => {
      todos = todos.filter((t) => t.id !== id);
      save();
      render();
    }, 200);
  });
 
  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const map = { Barchasi: "all", Faol: "active", Bajarilgan: "done" };
      filter = map[btn.textContent] ?? "all";
      render();
    });
  });
 
  clearBtn.addEventListener("click", () => {
    todos = todos.filter((t) => !t.done);
    save();
    render();
  });
 
  render();
})();
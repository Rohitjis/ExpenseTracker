// Select DOM elements
const form = document.getElementById("expenseForm");
const amountInput = document.getElementById("amount");
const descriptionInput = document.getElementById("description");
const categoryInput = document.getElementById("category");
const totalAmount = document.getElementById("totalAmount");
const themeSelector = document.getElementById("theme");
const filterCategory = document.getElementById("filterCategory");
const expensesByDate = document.getElementById("expensesByDate");
const toggleViewBtn = document.getElementById("toggleViewBtn");

// Initialize expenses array (Grouped by date)
let expenses = JSON.parse(localStorage.getItem("expenses")) || {};

// Save expense and update total
function saveExpense(event) {
  event.preventDefault();

  const amount = parseFloat(amountInput.value);
  const description = descriptionInput.value;
  const category = categoryInput.value;
  const date = new Date().toLocaleDateString();

  if (!amount || !description || !category) {
    alert("Please fill out all fields.");
    return;
  }

  const expense = { amount, description, category };

  if (!expenses[date]) {
    expenses[date] = [];
  }

  expenses[date].push(expense);
  localStorage.setItem("expenses", JSON.stringify(expenses));

  form.reset();
  updateTotal(date);
  renderExpenses(date);
  alert("Expense added successfully!");
}

// Update total amount for the given date
function updateTotal(date) {
  const total = expenses[date]?.reduce((sum, expense) => sum + expense.amount, 0) || 0;
  totalAmount.textContent = `Total for ${date}: ₹${total}`;
}

// Toggle between the form view and expense list view
function toggleView() {
  const formView = document.getElementById("formView");
  const viewList = document.getElementById("viewList");

  formView.style.display = formView.style.display === "none" ? "block" : "none";
  viewList.style.display = viewList.style.display === "none" ? "block" : "none";
  
  const isView = formView.style.display === "none";
  toggleViewBtn.textContent = isView ? "Switch to Add Expense" : "Switch to View Expenses";
}

// Render expenses for a given date
function renderExpenses(date) {
  expensesByDate.innerHTML = `<h3>Expenses on ${date}</h3>`;

  if (expenses[date]?.length === 0) {
    expensesByDate.innerHTML += `<p>No expenses for today</p>`;
    return;
  }

  expenses[date].forEach((expense, index) => {
    const expenseDiv = document.createElement("div");
    expenseDiv.classList.add("expense-item");
    expenseDiv.innerHTML = `
      <p>${expense.category} - ₹${expense.amount} - ${expense.description}</p>
      <button class="delete-btn" onclick="deleteExpense('${date}', ${index})">Delete</button>
    `;
    expensesByDate.appendChild(expenseDiv);
  });

  updateTotal(date);
}

// Delete expense
function deleteExpense(date, index) {
  if (expenses[date] && expenses[date][index]) {
    expenses[date].splice(index, 1);
    localStorage.setItem("expenses", JSON.stringify(expenses));
    renderExpenses(date); // Re-render the list after deletion
  }
}

// Theme toggle
function toggleTheme(event) {
  const selectedTheme = event.target.value;
  document.body.className = selectedTheme;
  localStorage.setItem("theme", selectedTheme);
}

// Load saved theme on page load
function loadTheme() {
  const savedTheme = localStorage.getItem("theme") || "light";
  document.body.className = savedTheme;
  themeSelector.value = savedTheme;
}

// Filter expenses by category
filterCategory.addEventListener("change", (event) => {
  const filter = event.target.value;
  const today = new Date().toLocaleDateString();
  renderExpenses(today, filter);
});

// Event listeners
form.addEventListener("submit", saveExpense);
toggleViewBtn.addEventListener("click", toggleView);
themeSelector.addEventListener("change", toggleTheme);

// Initialize on page load
loadTheme();

// By default, show today's expenses
const today = new Date().toLocaleDateString();
renderExpenses(today);
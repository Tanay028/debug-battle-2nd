const balance = document.getElementById('total-balance');
const income = document.getElementById('total-income');
const expense = document.getElementById('total-expense');
const list = document.getElementById('transaction-list');
const form = document.getElementById('transaction-form');
const text = document.getElementById('text');
const amount = document.getElementById('amount');
const modal = document.getElementById('modal');
const openBtn = document.getElementById('openModal');
const closeBtn = document.getElementById('close-btn');
const search = document.getElementById('search');
const filterBtns = document.querySelectorAll('.filter-btn');

let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
let currentFilter = 'all';

function updateLocalStorage() {
  localStorage.setItem('transactions', JSON.stringify(transactions));
}

function addTransaction(e) {
  e.preventDefault();

  const type = document.querySelector('input[name="type"]:checked').value;

  const transaction = {
    id: Date.now(),
    text: text.value,
    amount: parseFloat(amount.value),
    type,
    date: new Date().toLocaleDateString()
  };

  transactions.push(transaction);
  updateLocalStorage();
  render();

  form.reset();
  modal.classList.remove('active');
}

function removeTransaction(id) {
  transactions = transactions.filter(t => t.id !== id);
  updateLocalStorage();
  render();
}

function render() {
  list.innerHTML = '';

  let filtered = transactions;

  if (search.value) {
    filtered = filtered.filter(t =>
      t.text.toLowerCase().includes(search.value.toLowerCase())
    );
  }

  if (currentFilter !== 'all') {
    filtered = filtered.filter(t => t.type === currentFilter);
  }

  let total = 0;
  let inc = 0;
  let exp = 0;

  filtered.forEach(t => {

    const li = document.createElement('li');

    li.innerHTML = `
      <div class="item-left">
        <p>${t.text}</p>
        <small>${t.date}</small>
      </div>

      <div class="item-right">
        <span class="amount ${t.type}">
          ${t.type === 'expense' ? '-' : '+'}$${t.amount.toFixed(2)}
        </span>
        <button class="delete-btn" onclick="removeTransaction(${t.id})">🗑</button>
      </div>
    `;

    list.appendChild(li);

    if (t.type === 'income') {
      total += t.amount;
      inc += t.amount;
    } else {
      total -= t.amount;
      exp += t.amount;
    }
  });

  balance.textContent = `$${total.toFixed(2)}`;
  income.textContent = `$${inc.toFixed(2)}`;
  expense.textContent = `$${exp.toFixed(2)}`;
}

form.addEventListener('submit', addTransaction);
openBtn.addEventListener('click', () => modal.classList.add('active'));
closeBtn.addEventListener('click', () => modal.classList.remove('active'));

search.addEventListener('input', render);

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentFilter = btn.dataset.filter;
    render();
  });
});

render();
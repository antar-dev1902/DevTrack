// Data Models
let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
let budgetData = JSON.parse(localStorage.getItem('budgetData')) || { monthly: 0, categories: {}, savings: { name: '', target: 0, saved: 0 } };
let eventsData = JSON.parse(localStorage.getItem('eventsData')) || {};
let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
let users = JSON.parse(localStorage.getItem('users')) || [];

// Utils
const saveTransactions = () => localStorage.setItem('transactions', JSON.stringify(transactions));
const saveBudget = () => localStorage.setItem('budgetData', JSON.stringify(budgetData));
const saveEvents = () => localStorage.setItem('eventsData', JSON.stringify(eventsData));
const saveUsers = () => localStorage.setItem('users', JSON.stringify(users));
const saveCurrentUser = () => localStorage.setItem('currentUser', JSON.stringify(currentUser));

const formatMoney = (amount) => '₹' + Math.abs(amount).toLocaleString();

// Authentication / Navigation UI Updates
document.addEventListener('DOMContentLoaded', () => {
    // Update Auth link in navbar
    const authLinks = document.querySelectorAll('a[href="signup.html"], a[href="login.html"]');
    if (currentUser) {
        authLinks.forEach(link => {
            link.textContent = '🔓 Log Out';
            link.href = '#';
            link.addEventListener('click', (e) => {
                e.preventDefault();
                currentUser = null;
                saveCurrentUser();
                window.location.href = 'login.html';
            });
        });
    }

    // --- HOME PAGE ---
    if (document.getElementById('home-tx-list')) {
        updateHome();
        
        document.getElementById('btn-quick-add').addEventListener('click', () => {
            const desc = document.getElementById('quick-desc').value;
            const amount = parseFloat(document.getElementById('quick-amount').value);
            if (!desc || isNaN(amount)) return alert('Please enter description and valid amount');
            
            const type = amount >= 0 ? 'income' : 'expense';
            const cat = amount >= 0 ? 'Income' : 'Miscellaneous';

            transactions.push({ id: Date.now(), desc, amount: Math.abs(amount), type, category: cat, date: new Date().toISOString() });
            saveTransactions();
            document.getElementById('quick-desc').value = '';
            document.getElementById('quick-amount').value = '';
            updateHome();
        });
    }

    // --- TRANSACTIONS PAGE ---
    if (document.getElementById('tx-page-list')) {
        updateTransactionsPage();

        document.getElementById('btn-add-tx').addEventListener('click', () => {
            const desc = document.getElementById('add-tx-desc').value;
            const amountStr = document.getElementById('add-tx-amount').value;
            let amount = parseFloat(amountStr);
            const category = document.getElementById('add-tx-cat').value || 'Miscellaneous';
            let date = document.getElementById('add-tx-date').value || new Date().toISOString();
            
            if (!desc || isNaN(amount)) return alert('Please enter description and amount');

            let type = amount >= 0 ? 'income' : 'expense';
            
            if (amount > 0) {
                const text = (desc + ' ' + category).toLowerCase();
                if (text.includes('salary') || text.includes('freelance') || text.includes('gift') || text.includes('income') || text.includes('profit')) {
                    type = 'income';
                } else {
                    type = 'expense';
                }
            } else {
                type = 'expense';
                amount = Math.abs(amount);
            }

            transactions.push({ id: Date.now(), desc, amount, type, category, date: new Date(date).toISOString() || new Date().toISOString() });
            saveTransactions();
            updateTransactionsPage();
            
            document.getElementById('add-tx-desc').value = '';
            document.getElementById('add-tx-amount').value = '';
            document.getElementById('add-tx-cat').value = '';
            document.getElementById('add-tx-date').value = '';
        });

        document.getElementById('search-tx').addEventListener('input', () => updateTransactionsPage(window.activeFilter || 'all'));
        
        window.activeFilter = 'all';
        document.getElementById('btn-filter-income').addEventListener('click', () => { window.activeFilter = 'income'; updateTransactionsPage('income'); });
        document.getElementById('btn-filter-expense').addEventListener('click', () => { window.activeFilter = 'expense'; updateTransactionsPage('expense'); });
        document.getElementById('btn-filter-all').addEventListener('click', () => { window.activeFilter = 'all'; updateTransactionsPage('all'); });
    }

    // --- INSIGHTS PAGE ---
    if (document.getElementById('expenseChart')) {
        updateInsightsPage();
    }

    // --- BUDGET PAGE ---
    if (document.getElementById('bg-monthly-income')) {
        updateBudgetPage();

        document.getElementById('btn-save-budget').addEventListener('click', () => {
            const val = parseFloat(document.getElementById('input-monthly-budget').value);
            if (!isNaN(val)) {
                budgetData.monthly = val;
                saveBudget();
                updateBudgetPage();
            }
        });

        document.getElementById('btn-add-cat-budget').addEventListener('click', () => {
            const name = document.getElementById('input-cat-name').value;
            const limit = parseFloat(document.getElementById('input-cat-limit').value);
            if (name && !isNaN(limit)) {
                budgetData.categories[name] = limit;
                saveBudget();
                updateBudgetPage();
            }
        });

        document.getElementById('btn-save-goal').addEventListener('click', () => {
            const name = document.getElementById('input-goal-name').value;
            const target = parseFloat(document.getElementById('input-goal-target').value);
            const saved = parseFloat(document.getElementById('input-goal-saved').value);
            if (name && !isNaN(target) && !isNaN(saved)) {
                budgetData.savings = { name, target, saved };
                saveBudget();
                updateBudgetPage();
            }
        });
    }

    // --- CALENDAR PAGE ---
    if (document.getElementById('active-loans-list')) {
        initCalendarPage();
    }

    // --- AUTHENTICATION ---
    if (document.getElementById('btn-signup')) {
        document.getElementById('btn-signup').addEventListener('click', () => {
            const fullname = document.getElementById('fullname').value;
            const email = document.getElementById('email').value;
            const pwd = document.getElementById('password').value;
            const conf = document.getElementById('confirm').value;
            if (!fullname || !email || !pwd) return alert("Fill all fields");
            if (pwd !== conf) return alert("Passwords do not match");

            if (users.find(u => u.email === email)) return alert("Email already exists");

            const newUser = { fullname, email, pwd };
            users.push(newUser);
            saveUsers();
            currentUser = newUser;
            saveCurrentUser();
            window.location.href = 'index.html';
        });
    }

    if (document.getElementById('btn-login')) {
        document.getElementById('btn-login').addEventListener('click', () => {
            const email = document.getElementById('login-email').value;
            const pwd = document.getElementById('login-password').value;
            const user = users.find(u => u.email === email && u.pwd === pwd);
            if (user) {
                currentUser = user;
                saveCurrentUser();
                window.location.href = 'index.html';
            } else {
                alert('Invalid credentials');
            }
        });
    }

});

// --- HELPER FUNCTIONS ---
function getTotals() {
    return transactions.reduce((acc, tx) => {
        if (tx.type === 'income') acc.income += tx.amount;
        else acc.expense += tx.amount;
        return acc;
    }, { income: 0, expense: 0 });
}

function updateHome() {
    const { income, expense } = getTotals();
    const balance = income - expense;
    
    document.getElementById('home-total-income').textContent = formatMoney(income);
    document.getElementById('home-total-expense').textContent = formatMoney(expense);
    document.getElementById('home-balance').textContent = formatMoney(balance);
    document.getElementById('home-balance').style.color = balance < 0 ? '#ff4d4d' : '#fff';

    const ul = document.getElementById('home-tx-list');
    ul.innerHTML = '';
    
    transactions.slice().reverse().slice(0, 5).forEach(tx => {
        const li = document.createElement('li');
        li.className = tx.type === 'income' ? 'plus' : 'minus';
        
        const sign = tx.type === 'income' ? '+' : '−';
        const amtClass = tx.type === 'income' ? 'amount-plus' : 'amount-minus';

        li.innerHTML = `
            <span>${tx.desc}</span>
            <span class="${amtClass}">${sign}${formatMoney(tx.amount)}</span>
        `;
        ul.appendChild(li);
    });
}

function updateTransactionsPage(filter = 'all') {
    const { income, expense } = getTotals();
    const balance = income - expense;

    document.getElementById('tx-total-income').textContent = formatMoney(income);
    document.getElementById('tx-total-expense').textContent = formatMoney(expense);
    document.getElementById('tx-balance').textContent = formatMoney(balance);
    document.getElementById('tx-balance').style.color = balance < 0 ? '#ff4d4d' : '#fff';

    const ul = document.getElementById('tx-page-list');
    ul.innerHTML = '';

    const searchQuery = (document.getElementById('search-tx').value || '').toLowerCase();

    const filtered = transactions.slice().reverse().filter(tx => {
        const matchType = filter === 'all' || tx.type === filter;
        const matchSearch = tx.desc.toLowerCase().includes(searchQuery) || (tx.category || '').toLowerCase().includes(searchQuery);
        return matchType && matchSearch;
    });

    filtered.forEach(tx => {
        const li = document.createElement('li');
        li.className = tx.type === 'income' ? 'plus' : 'minus';
        
        const sign = tx.type === 'income' ? '+' : '−';
        const amtClass = tx.type === 'income' ? 'amount-plus' : 'amount-minus';
        const catLabel = tx.category ? ` — ${tx.category}` : '';

        li.innerHTML = `
            <span>${tx.desc}${catLabel}</span>
            <span class="${amtClass}">${sign}${formatMoney(tx.amount)}</span>
        `;
        ul.appendChild(li);
    });
}

function updateInsightsPage() {
    const expenses = transactions.filter(t => t.type === 'expense');
    
    const catMap = {};
    expenses.forEach(t => {
        const cat = t.category || 'Miscellaneous';
        catMap[cat] = (catMap[cat] || 0) + t.amount;
    });

    const categories = Object.keys(catMap);
    const amounts = Object.values(catMap);

    if (categories.length > 0) {
        const maxCat = categories.reduce((a, b) => catMap[a] > catMap[b] ? a : b);
        const minCat = categories.reduce((a, b) => catMap[a] < catMap[b] ? a : b);
        
        const freqMap = {};
        expenses.forEach(t => {
            const cat = t.category || 'Miscellaneous';
            freqMap[cat] = (freqMap[cat] || 0) + 1;
        });
        const freqCat = Object.keys(freqMap).reduce((a, b) => freqMap[a] > freqMap[b] ? a : b);

        document.getElementById('insight-highest').textContent = maxCat;
        document.getElementById('insight-highest-val').textContent = formatMoney(catMap[maxCat]);

        document.getElementById('insight-lowest').textContent = minCat;
        document.getElementById('insight-lowest-val').textContent = formatMoney(catMap[minCat]);

        document.getElementById('insight-frequent').textContent = freqCat;
        document.getElementById('insight-frequent-val').textContent = `${freqMap[freqCat]}× this month`;
    } else {
        document.getElementById('insight-highest').textContent = '-';
        document.getElementById('insight-highest-val').textContent = '-';
        document.getElementById('insight-lowest').textContent = '-';
        document.getElementById('insight-lowest-val').textContent = '-';
        document.getElementById('insight-frequent').textContent = '-';
        document.getElementById('insight-frequent-val').textContent = '-';
    }

    const breakdownEl = document.getElementById('category-breakdown');
    breakdownEl.innerHTML = '';
    const totalExpense = amounts.reduce((sum, a) => sum + a, 0);

    const colors = ['#ff9800', '#e91e63', '#4caf50', '#2196f3', '#ff00cc'];

    categories.forEach((cat, idx) => {
        const amt = catMap[cat];
        const pct = totalExpense ? ((amt / totalExpense) * 100).toFixed(1) : 0;
        
        const div = document.createElement('div');
        div.className = 'break-box';
        div.innerHTML = `
            <h4>${cat}</h4>
            <p>${formatMoney(amt)}</p>
            <p style="font-size:12px; color:rgba(255,255,255,0.45); margin-top:4px;">${pct}% of expenses</p>
        `;
        breakdownEl.appendChild(div);
    });

    const ctx = document.getElementById('expenseChart').getContext('2d');
    if (window.myExpenseChart) window.myExpenseChart.destroy();
    
    window.myExpenseChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: categories,
            datasets: [{
                label: 'Spending by Category',
                data: amounts,
                backgroundColor: colors,
                borderWidth: 0,
                borderRadius: 5
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: { beginAtZero: true, grid: { color: 'rgba(255,255,255,0.1)' }, ticks: { color: 'rgba(255,255,255,0.6)' } },
                x: { grid: { display: false }, ticks: { color: 'rgba(255,255,255,0.6)' } }
            },
            plugins: {
                legend: { display: false }
            }
        }
    });
}

function updateBudgetPage() {
    const { income, expense } = getTotals();
    document.getElementById('bg-monthly-income').textContent = formatMoney(income);
    document.getElementById('bg-total-spent').textContent = formatMoney(expense);
    const rem = income - expense;
    document.getElementById('bg-remaining').textContent = formatMoney(rem);
    document.getElementById('bg-remaining').style.color = rem < 0 ? '#ff4d4d' : '#fff';

    const monthlyLimit = budgetData.monthly || 0;
    const monthlyPct = monthlyLimit ? Math.min((expense / monthlyLimit) * 100, 100) : 0;
    
    document.getElementById('bg-overall-label').innerHTML = `<span>Used: ${formatMoney(expense)}</span><span>Budget: ${formatMoney(monthlyLimit)}</span>`;
    const progressEl = document.getElementById('bg-overall-progress');
    progressEl.style.width = monthlyPct + '%';
    
    const isOver = expense > monthlyLimit && monthlyLimit > 0;
    if (isOver) {
        progressEl.className = 'progress-bar danger';
        document.getElementById('bg-overall-text').innerHTML = `⚠️ Over budget by ${formatMoney(expense - monthlyLimit)}`;
        document.getElementById('bg-overall-text').style.color = '#ff4d4d';
        document.getElementById('bg-overall-alert').style.display = 'block';
    } else {
        progressEl.className = 'progress-bar';
        progressEl.style.background = 'linear-gradient(90deg,#ff00cc,#3333ff)';
        document.getElementById('bg-overall-text').innerHTML = `${monthlyPct.toFixed(1)}% used`;
        document.getElementById('bg-overall-text').style.color = 'rgba(255,255,255,0.45)';
        document.getElementById('bg-overall-alert').style.display = 'none';
    }

    const catListEl = document.getElementById('budget-category-list');
    catListEl.innerHTML = '';
    
    Object.keys(budgetData.categories).forEach(cat => {
        const limit = budgetData.categories[cat];
        const spent = transactions.filter(t => t.type === 'expense' && (t.category || 'Miscellaneous').toLowerCase() === cat.toLowerCase()).reduce((s, t) => s + t.amount, 0);
        const pct = limit ? Math.min((spent / limit) * 100, 100) : 0;
        const over = spent > limit;

        const div = document.createElement('div');
        div.className = 'budget-item';
        div.innerHTML = `
            <div class="budget-item-header">
                <span>📂 ${cat}</span>
                <span>${formatMoney(spent)} / ${formatMoney(limit)}</span>
            </div>
            <div class="progress">
                <div class="progress-bar ${over ? 'danger' : ''}" style="width: ${pct}%; background: ${over ? '' : 'linear-gradient(90deg,#2196f3,#00f2fe);'}"></div>
            </div>
            <p style="font-size:12px; color:${over ? '#ff4d4d' : 'rgba(255,255,255,0.4)'}; margin-top:6px;">
                ${over ? `⚠️ Over limit by ${formatMoney(spent - limit)}` : `${pct.toFixed(0)}% used — ${formatMoney(limit - spent)} left`}
            </p>
        `;
        catListEl.appendChild(div);
    });

    if (budgetData.savings) {
        const { name, target, saved } = budgetData.savings;
        const pct = target ? Math.min((saved / target) * 100, 100) : 0;
        
        document.getElementById('goal-label').innerHTML = `<span>Saved: ${formatMoney(saved)}</span><span>Goal: ${formatMoney(target)}</span>`;
        document.getElementById('goal-progress').style.width = pct + '%';
        document.getElementById('goal-text').textContent = name ? `${pct.toFixed(1)}% achieved for ${name} — ${formatMoney(target - saved)} remaining` : '';
    }
}

function initCalendarPage() {
    let loans = eventsData.loans || [];

    document.getElementById('btn-add-loan').addEventListener('click', () => {
        const person = document.getElementById('loan-person').value;
        const amount = parseFloat(document.getElementById('loan-amount').value);
        const date = document.getElementById('loan-date').value || new Date().toISOString().split('T')[0];
        const due = document.getElementById('loan-due').value;
        const type = document.getElementById('loan-type').value.toLowerCase().includes('taken') ? 'taken' : 'given';
        const notes = document.getElementById('loan-notes').value;

        if (!person || isNaN(amount)) return alert('Fill required fields');

        loans.push({ id: Date.now(), person, amount, date, due, type, notes, status: 'active' });
        eventsData.loans = loans;
        saveEvents();

        transactions.push({
            id: Date.now(),
            desc: `Loan ${type === 'given' ? 'to' : 'from'} ${person}`,
            amount: amount,
            type: type === 'given' ? 'expense' : 'income',
            category: 'Loan',
            date: new Date(date).toISOString() || new Date().toISOString()
        });
        saveTransactions();
        
        updateCalendarUI();
        renderCalendarWidget();

        document.getElementById('loan-person').value = '';
        document.getElementById('loan-amount').value = '';
        document.getElementById('loan-date').value = '';
        document.getElementById('loan-due').value = '';
        document.getElementById('loan-type').value = '';
        document.getElementById('loan-notes').value = '';
    });

    updateCalendarUI();
    renderCalendarWidget();

    const popupEl = document.getElementById('loanPopup');
    if (popupEl) {
        const today = new Date();
        const outstandingLoans = loans.filter(l => l.status === 'active' && l.type === 'given');
        const outstandingTotal = outstandingLoans.reduce((s, l) => s + l.amount, 0);
        
        if (outstandingTotal > 0 && today.getDate() === 1) {
            popupEl.style.display = 'flex';
            document.getElementById('popup-total-outstanding').textContent = formatMoney(outstandingTotal);
            const listEl = document.getElementById('popup-loan-list');
            listEl.innerHTML = '';
            outstandingLoans.forEach(l => {
                listEl.innerHTML += `
                    <div class="popup-loan-item">
                        <span class="lname">📌 ${l.person}</span>
                        <span class="lamt">${formatMoney(l.amount)}</span>
                        <span class="ldate">Due: ${l.due || 'N/A'}</span>
                    </div>
                `;
            });
        } else {
            popupEl.style.display = 'none';
        }

        window.closePopup = () => { popupEl.style.display = 'none'; };
    }
}

function updateCalendarUI() {
    let loans = eventsData.loans || [];
    const listEl = document.getElementById('active-loans-list');
    listEl.innerHTML = '';

    let toReceive = 0, toRepay = 0, overdue = 0;

    loans.forEach(l => {
        if (l.status === 'active') {
            if (l.type === 'given') toReceive += l.amount;
            else toRepay += l.amount;

            let isOverdue = false;
            if (l.due && !isNaN(new Date(l.due).getTime()) && new Date(l.due) < new Date()) {
                isOverdue = true;
                if (l.type === 'given') overdue += l.amount;
            }

            const div = document.createElement('div');
            div.className = `loan-card ${isOverdue ? 'overdue' : ''}`;
            div.innerHTML = `
                <div class="loan-info">
                    <h4>${l.type === 'given' ? '📌' : '🏦'} ${l.person}</h4>
                    <p>Loan ${l.type} • Due: ${l.due || 'N/A'} ${isOverdue ? '<span style="color:#ff4d4d;">• Overdue!</span>' : ''}</p>
                </div>
                <div style="text-align:right;">
                    <p style="font-size:18px; font-weight:700; color:${isOverdue ? '#ff4d4d' : '#ffaa00'};">${formatMoney(l.amount)}</p>
                    <span class="loan-badge ${isOverdue ? 'badge-overdue' : 'badge-active'}">${isOverdue ? 'Overdue' : 'Active'}</span>
                    <button class="mark-repaid" data-id="${l.id}" style="display:block; margin-top:6px; padding: 4px 8px; font-size:11px; background:transparent; border:1px solid #00ffcc; color:#00ffcc; border-radius:10px; cursor:pointer;">Mark Repaid</button>
                </div>
            `;
            listEl.appendChild(div);
        } else {
            const div = document.createElement('div');
            div.className = `loan-card repaid`;
            div.innerHTML = `
                <div class="loan-info">
                    <h4>📌 ${l.person}</h4>
                    <p>Loan ${l.type} • Repaid</p>
                </div>
                <div style="text-align:right;">
                    <p style="font-size:18px; font-weight:700; color:#00ffcc;">${formatMoney(l.amount)}</p>
                    <span class="loan-badge badge-repaid">Repaid</span>
                </div>
            `;
            listEl.appendChild(div);
        }
    });

    document.querySelectorAll('.mark-repaid').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = parseInt(e.target.getAttribute('data-id'));
            const loan = loans.find(l => l.id === id);
            if (loan) {
                loan.status = 'repaid';
                eventsData.loans = loans;
                saveEvents();

                transactions.push({
                    id: Date.now(),
                    desc: `Repayment from ${loan.person}`,
                    amount: loan.amount,
                    type: loan.type === 'given' ? 'income' : 'expense',
                    category: 'Loan Repayment',
                    date: new Date().toISOString()
                });
                saveTransactions();

                updateCalendarUI();
                renderCalendarWidget();
            }
        });
    });

    document.getElementById('loan-to-receive').textContent = formatMoney(toReceive);
    document.getElementById('loan-to-repay').textContent = formatMoney(toRepay);
    document.getElementById('loan-overdue').textContent = formatMoney(overdue);
}

let calCurMonth = new Date().getMonth();
let calCurYear = new Date().getFullYear();

function renderCalendarWidget() {
    const titleEl = document.getElementById('calTitle');
    const gridEl = document.getElementById('calGrid');
    if (!titleEl || !gridEl) return;

    const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    const DAYS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

    titleEl.textContent = `${MONTHS[calCurMonth]} ${calCurYear}`;
    gridEl.innerHTML = '';

    DAYS.forEach(d => {
        const lbl = document.createElement('div');
        lbl.className = 'cal-day-label';
        lbl.textContent = d;
        gridEl.appendChild(lbl);
    });

    const firstDay = new Date(calCurYear, calCurMonth, 1).getDay();
    const daysInMonth = new Date(calCurYear, calCurMonth + 1, 0).getDate();

    for (let i = 0; i < firstDay; i++) {
        const empty = document.createElement('div');
        empty.className = 'cal-cell empty';
        gridEl.appendChild(empty);
    }

    const evMap = {};
    const addEv = (dateStr, type, label) => {
        if (!dateStr) return;
        const d = new Date(dateStr);
        if (isNaN(d.getTime())) return;
        const k = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
        if (!evMap[k]) evMap[k] = [];
        evMap[k].push({ type, label });
    };

    transactions.forEach(t => addEv(t.date, t.type, `${t.desc} ${formatMoney(t.amount)}`));
    (eventsData.loans || []).forEach(l => {
        addEv(l.date, 'loan', `Loan to ${l.person}`);
        if (l.due) addEv(l.due, 'repayment', `Due: ${l.person}`);
    });

    const today = new Date();

    for (let d = 1; d <= daysInMonth; d++) {
        const cell = document.createElement('div');
        const k = `${calCurYear}-${calCurMonth}-${d}`;
        const evs = evMap[k] || [];

        const isToday = (d === today.getDate() && calCurMonth === today.getMonth() && calCurYear === today.getFullYear());
        const hasLoan = evs.some(e => e.type === 'loan');
        const hasRepayment = evs.some(e => e.type === 'repayment');

        cell.className = `cal-cell ${isToday ? 'today' : ''} ${hasLoan ? 'has-loan' : ''} ${hasRepayment ? 'has-repayment' : ''}`;
        
        const dateSpan = document.createElement('span');
        dateSpan.className = 'cal-date';
        dateSpan.textContent = d;
        cell.appendChild(dateSpan);

        evs.forEach(ev => {
            const dot = document.createElement('span');
            dot.className = `cal-dot dot-${ev.type}`;
            cell.appendChild(dot);
        });

        cell.addEventListener('click', () => {
            const panel = document.getElementById('dayPanel');
            document.getElementById('dayTitle').textContent = `📅 Events on ${d} ${MONTHS[calCurMonth]} ${calCurYear}`;
            const evArea = document.getElementById('dayEvents');
            
            if (evs.length === 0) {
                evArea.innerHTML = '<p class="no-events">No events on this day.</p>';
            } else {
                evArea.innerHTML = evs.map(ev => {
                    const icons = { loan: '🟡', repayment: '🔴', income: '🟢', expense: '🔵' };
                    return `
                        <div class="day-event">
                            <span>${icons[ev.type] || '⚪'} ${ev.label}</span>
                            <span class="tag-pill tag-${ev.type === 'income' ? 'income' : 'expense'}">${ev.type}</span>
                        </div>
                    `;
                }).join('');
            }
            panel.style.display = 'block';
            panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        });

        gridEl.appendChild(cell);
    }
}

window.changeMonth = (dir) => {
    calCurMonth += dir;
    if (calCurMonth > 11) { calCurMonth = 0; calCurYear++; }
    if (calCurMonth < 0) { calCurMonth = 11; calCurYear--; }
    const p = document.getElementById('dayPanel');
    if(p) p.style.display = 'none';
    renderCalendarWidget();
};

document.addEventListener('DOMContentLoaded', function() {
    const descriptionInput = document.getElementById('description');
    const amountInput = document.getElementById('amount');
    const addButton = document.getElementById('addButton');
    const transactionList = document.getElementById('transaction-list');
    const checkButton = document.getElementById('checkButton');
    const resultContainer = document.getElementById('resultContainer');
    const resultMessage = document.getElementById('resultMessage');
    const rec1 = document.getElementById('rec1');
    const rec2 = document.getElementById('rec2');
    const rec3 = document.getElementById('rec3');
    
    // Add focus to description input on page load
    descriptionInput.focus();
    // Add focus to input on page load
    amountInput.focus();
    // Add click event to button
    addButton.addEventListener('click', addTransaction);
    checkButton.addEventListener('click', checkTransaction);
    // Allow Enter key to trigger adding transaction
    // Allow Enter key to trigger checking
    amountInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            addTransaction();
            checkTransaction();
        }
    });
    
    // Function to add a new transaction
    function addTransaction() {
        // Get input values
        const description = descriptionInput.value.trim();
    // Main function to check transactions
    function checkTransaction() {
        // Clear previous results first
        clearResults();
        
        // Get the input value
        const amount = parseFloat(amountInput.value);
        
        // Validate inputs
        if (description === "" || isNaN(amount)) {
            // Show alert with animation
            showAlert('Please enter a valid description and amount.');
            return;
        }
        // Clear any previous result animation
        resultMessage.classList.remove('show');
        
        // Create table row for the new transaction
        const newRow = document.createElement('tr');
        newRow.className = 'transaction-row';
        
        // Format the cells
        const descriptionCell = document.createElement('td');
        descriptionCell.textContent = description;
        descriptionCell.className = 'transaction-description';
        
        const amountCell = document.createElement('td');
        amountCell.textContent = formatAmount(amount);
        amountCell.className = amount >= 0 ? 'transaction-amount positive' : 'transaction-amount negative';
        
        // Add cells to row
        newRow.appendChild(descriptionCell);
        newRow.appendChild(amountCell);
        
        // Add row with animation
        newRow.style.opacity = '0';
        transactionList.appendChild(newRow);
        
        // Trigger reflow for animation
        newRow.offsetHeight;
        
        // Fade in the new row
        newRow.style.transition = 'opacity 0.5s ease';
        newRow.style.opacity = '1';
        
        // Clear inputs
        descriptionInput.value = '';
        amountInput.value = '';
        descriptionInput.focus();
        
        // Wait a tiny bit for animation to reset
        setTimeout(() => {
            // Validate input
            if (isNaN(amount) || amount <= 0) {
                showResult('danger', '<i class="fas fa-exclamation-triangle"></i> Invalid input. Please enter a positive number.');
                amountInput.focus();
                return;
            }
            const threshold = 1000;
            // Check amount against rules
            if (amount > threshold) {
                showResult('warning', '<i class="fas fa-exclamation-circle"></i> Transaction amount is above the threshold. Potential review needed.');
                
                // Show recommendations with staggered animation
                showRecommendation(rec1, "Consider additional verification steps.", 100);
                showRecommendation(rec2, "Check user's transaction history.", 300);
                showRecommendation(rec3, "Contact the user to confirm the transaction.", 500);
            } else {
                showResult('success', '<i class="fas fa-check-circle"></i> Transaction amount is within acceptable limits.');
                
                // Show just one recommendation
                showRecommendation(rec1, "Transaction processed successfully.", 100);
            }
        }, 50);
        // Add pulse animation to the card
        const card = document.querySelector('.transaction-card');
        card.classList.add('pulse');

            card.classList.remove('pulse');
        }, 1500);
        
        // Save to localStorage (for persistence)
        saveTransactions();
        // Log the transaction to localStorage for history (optional feature)
        logTransaction(amount);
    }
    
    // Function to show an alert
    // Helper function to clear all results
    function clearResults() {
        resultMessage.className = 'result-message';
        resultMessage.innerHTML = '';
        
        // Clear and hide recommendations
        const recommendations = [rec1, rec2, rec3];
        recommendations.forEach(rec => {
            rec.textContent = '';
            rec.className = 'recommendation-item';
        });
    }
    
    // Helper function to show the result with appropriate styling
    function showResult(type, message) {
        resultMessage.classList.add(`result-${type}`);
        resultMessage.innerHTML = message;
        resultMessage.classList.add('show');
    }
    
    // Helper function to show a recommendation with animation
    function showRecommendation(element, text, delay) {
        if (!text) return; // Don't show empty recommendations
        
        setTimeout(() => {
            element.textContent = text;
            element.classList.add('show');
        }, delay);
    }
    
    // Optional: Log transactions to localStorage for history
    function logTransaction(amount) {
        const transactions = JSON.parse(localStorage.getItem('transactionHistory') || '[]');
        transactions.push({
            amount: amount,
            timestamp: new Date().toISOString(),
            status: amount > 1000 ? 'review' : 'approved'
        });
        
        // Keep only the last 50 transactions
        if (transactions.length > 50) {
            transactions.shift();
        }
        
        localStorage.setItem('transactionHistory', JSON.stringify(transactions));
    }
    
    // Helper function to show an alert
    function showAlert(message) {
        // Create alert element
        const alertDiv = document.createElement('div');

        }, 3000);
    }
    
    // Format amount with currency symbol and 2 decimal places
    function formatAmount(amount) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    }
    
    // Save transactions to localStorage
    function saveTransactions() {
        const transactions = [];
        const rows = transactionList.querySelectorAll('tr');
        
        rows.forEach(row => {
            const description = row.querySelector('.transaction-description').textContent;
            const amountText = row.querySelector('.transaction-amount').textContent;
            // Remove currency symbol and convert to number
            const amount = parseFloat(amountText.replace(/[^0-9.-]+/g, ''));
            
            transactions.push({ description, amount });
        });
        
        localStorage.setItem('transactions', JSON.stringify(transactions));
    }
    
    // Load transactions from localStorage
    function loadTransactions() {
        const savedTransactions = localStorage.getItem('transactions');
        
        if (savedTransactions) {
            const transactions = JSON.parse(savedTransactions);
            
            transactions.forEach(transaction => {
                const { description, amount } = transaction;
                
                const newRow = document.createElement('tr');
                newRow.className = 'transaction-row';
                
                const descriptionCell = document.createElement('td');
                descriptionCell.textContent = description;
                descriptionCell.className = 'transaction-description';
                
                const amountCell = document.createElement('td');
                amountCell.textContent = formatAmount(amount);
                amountCell.className = amount >= 0 ? 'transaction-amount positive' : 'transaction-amount negative';
                
                newRow.appendChild(descriptionCell);
                newRow.appendChild(amountCell);
                transactionList.appendChild(newRow);
            });
        }
    }
    
    // Initialize floating labels (Bootstrap 5)
    const floatingInputs = document.querySelectorAll('.form-floating input');
    floatingInputs.forEach(input => {

            }
        });
    });
    
    // Load saved transactions on page load
    loadTransactions();
});

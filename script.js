// Denominations and totals
const denominations = [1, 2, 5, 10, 20, 50, 100, 500];
let currentDate = new Date().toLocaleDateString('en-IN');

// Initialize date display
document.getElementById('currentDate').textContent = `Date: ${currentDate}`;

// Generate cash table
function generateCashTable() {
    const table = document.getElementById('cashTable');
    table.innerHTML = `
        <tr><th>Note</th><th>Count</th><th>Total</th></tr>
        ${denominations.map(denom => `
            <tr>
                <td>₹${denom}</td>
                <td><input type="number" class="denom" data-value="${denom}" min="0"></td>
                <td class="denom-total">0</td>
            </tr>
        `).join('')}
    `;

    // Add event listeners for cash calculations
    document.querySelectorAll('.denom').forEach(input => {
        input.addEventListener('input', updateTotals);
    });

    // Add event listeners for shipment calculations
    document.getElementById('doneShipments').addEventListener('input', updateShipments);
    document.getElementById('totalOFD').addEventListener('input', updateShipments);
}

// Update cash totals
function updateTotals() {
    let grandTotal = 0;
    document.querySelectorAll('.denom').forEach(input => {
        const denom = parseInt(input.dataset.value);
        const count = parseInt(input.value) || 0;
        const total = denom * count;
        input.parentElement.nextElementSibling.textContent = total;
        grandTotal += total;
    });
    document.getElementById('grandTotal').textContent = grandTotal;
}

// Update shipment calculations
function updateShipments() {
    const totalOFD = parseInt(document.getElementById('totalOFD').value) || 0;
    const done = parseInt(document.getElementById('doneShipments').value) || 0;
    
    // Calculate pending shipments
    const pending = totalOFD - done;
    document.getElementById('pendingShipments').value = pending >= 0 ? pending : 0;
    
    // Calculate completion percentage
    const percent = totalOFD > 0 ? ((done / totalOFD) * 100).toFixed(2) : 0;
    document.getElementById('completionPercent').value = `${percent}%`;
}

// Generate WhatsApp Report
function generateReport() {
    const reportData = {
        name: document.getElementById('deliveryBoyName').value,
        mobile: document.getElementById('mobile').value,
        route: document.getElementById('route').value,
        totalOFD: document.getElementById('totalOFD').value,
        done: document.getElementById('doneShipments').value,
        pending: document.getElementById('pendingShipments').value,
        completion: document.getElementById('completionPercent').value,
        cash: document.getElementById('grandTotal').textContent,
        online: document.getElementById('onlineCash').value || 0,
        date: currentDate
    };

    // Validate required fields
    if (!reportData.name || !reportData.mobile || !reportData.route || !reportData.totalOFD || !reportData.done) {
        alert("Please fill all required fields!");
        return;
    }

    // Extract Cash Collection Table Data
    const cashTable = document.getElementById('cashTable');
    let cashTableData = "💵 *Cash Collection Details*\n";
    cashTableData += "| Note | Count | Total |\n";
    cashTableData += "|------|-------|-------|\n";

    cashTable.querySelectorAll('tr').forEach((row, index) => {
        if (index === 0) return; // Skip header row
        const cells = row.querySelectorAll('td');
        const note = cells[0].textContent;
        const count = cells[1].querySelector('input').value || 0;
        const total = cells[2].textContent;
        cashTableData += `| ${note} | ${count} | ₹${total} |\n`;
    });

    // Create WhatsApp message template
    const message = `*DAILY DELIVERY REPORT*\n\n
🚚 *Delivery Executive*: ${reportData.name}
📱 *Mobile*: ${reportData.mobile}\n
📅 *Date*: ${reportData.date}
📍 *Route*: ${reportData.route}

📦 *Shipment Details*
Total OFD: ${reportData.totalOFD}
Completed: ${reportData.done} (${reportData.completion})
Pending: ${reportData.pending}

${cashTableData}

💸 *Payment Collection*
Cash: ₹${reportData.cash}
Online: ₹${reportData.online}
*Total Collection*: ₹${parseInt(reportData.cash) + parseInt(reportData.online)}`;

    // WhatsApp sharing URL
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    
    // Clear form after submission
    document.querySelectorAll('input').forEach(input => input.value = '');
    document.getElementById('grandTotal').textContent = '0';
}

// Initialize cash table and date
document.addEventListener('DOMContentLoaded', generateCashTable);
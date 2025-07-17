function calculateFicoScore() {
    // 1. Gather facts from the user interface [cite: 34]
    const numLatePayments = parseInt(document.getElementById('numLatePayments').value);
    const hasRecentLatePayments = document.getElementById('hasRecentLatePayments').checked;
    const totalCreditLimit = parseFloat(document.getElementById('totalCreditLimit').value);
    const totalBalance = parseFloat(document.getElementById('totalBalance').value);
    const lengthOfCreditHistory = parseInt(document.getElementById('lengthOfCreditHistory').value);
    const numNewInquiries = parseInt(document.getElementById('numNewInquiries').value);
    const hasMixedCredit = document.getElementById('hasMixedCredit').checked;

    let paymentHistoryPoints = 0;
    let amountsOwedPoints = 0;
    let lengthOfHistoryPoints = 0;
    let newCreditPoints = 0;
    let creditMixPoints = 0;

    // 2. Apply rules from the knowledge base (inference engine logic) [cite: 6]

    // Payment History (Max 200 points - 35% weight) [cite: 13, 14, 15, 59, 60]
    // Guideline: Perfect history = full points. One old late payment = significant deduction. Recent/multiple late payments = severe deduction. [cite: 61]
    if (numLatePayments === 0 && !hasRecentLatePayments) {
        paymentHistoryPoints = 200; // Perfect history
    } else if (numLatePayments > 0 && !hasRecentLatePayments) { // One old late payment (assuming it's not recent)
        paymentHistoryPoints = 120; // Significant deduction (based on Rohan's example)
    } else if (hasRecentLatePayments || numLatePayments > 1) {
        paymentHistoryPoints = 40; // Severe deduction (based on Sunita's example)
    }

    // Amounts Owed (Max 170 points - 30% weight) [cite: 16, 17, 18, 62, 63]
    // Guideline: Utilization <10% = full points. ~50% = half points. >70% = very few points. [cite: 64]
    const utilization = (totalCreditLimit > 0) ? (totalBalance / totalCreditLimit) * 100 : 0;
    if (utilization < 10) {
        amountsOwedPoints = 170; // Full points (Priya's example)
    } else if (utilization >= 40 && utilization <= 60) { // ~50%
        amountsOwedPoints = 85; // Half points (Sunita's example)
    } else if (utilization > 70) {
        amountsOwedPoints = 15; // Very few points (Rohan's example)
    } else if (utilization >= 10 && utilization < 40) { // Between <10% and ~50%
        amountsOwedPoints = 120; // Estimated
    } else if (utilization > 60 && utilization <= 70) { // Between ~50% and >70%
        amountsOwedPoints = 50; // Estimated
    }

    // Length of Credit History (Max 85 points - 15% weight) [cite: 19, 20, 21, 65, 66]
    // Guideline: 20+ years = full points. 10 years = ~60 points. <5 years = very few points. [cite: 67]
    if (lengthOfCreditHistory >= 20) {
        lengthOfHistoryPoints = 85; // Full points (Rohan's example)
    } else if (lengthOfCreditHistory >= 10) {
        lengthOfHistoryPoints = 65; // ~60 points (Sunita's example)
    } else if (lengthOfCreditHistory >= 5 && lengthOfCreditHistory < 10) {
        lengthOfHistoryPoints = 40; // Estimated between <5 and 10
    } else { // <5 years
        lengthOfHistoryPoints = 20; // Very few points (Priya's example)
    }

    // New Credit (Max 55 points - 10% weight) [cite: 22, 23, 24, 68, 69]
    // Guideline: 0 recent inquiries = full points. 1-2 inquiries = minor deduction. 3+ recent inquiries = major deduction. [cite: 70]
    if (numNewInquiries === 0) {
        newCreditPoints = 55; // Full points (Priya's example)
    } else if (numNewInquiries >= 1 && numNewInquiries <= 2) {
        newCreditPoints = 35; // Minor deduction (Rohan's example)
    } else if (numNewInquiries >= 3) {
        newCreditPoints = 10; // Major deduction (Sunita's example)
    }

    // Credit Mix (Max 55 points - 10% weight) [cite: 25, 26, 27, 71, 72]
    // Guideline: Has both revolving (cards) and installment (loans) credit = full points. Only has one type of credit = fewer points. [cite: 73, 74]
    if (hasMixedCredit) {
        creditMixPoints = 55; // Full points (Rohan & Sunita's example implicitly as they have loans)
    } else {
        creditMixPoints = 30; // Fewer points (Priya's example)
    }

    // 3. Calculate total score [cite: 84]
    const subtotal = paymentHistoryPoints + amountsOwedPoints + lengthOfHistoryPoints + newCreditPoints + creditMixPoints; [cite: 75, 76]
    const baseScore = 300; [cite: 77, 78, 79, 80, 81]
    const finalScore = subtotal + baseScore; [cite: 82]

    // 4. Display results
    document.getElementById('ficoScoreDisplay').textContent = finalScore;
    document.getElementById('paymentHistoryPts').textContent = `+${paymentHistoryPoints} pts`;
    document.getElementById('amountsOwedPts').textContent = `+${amountsOwedPoints} pts`;
    document.getElementById('lengthOfHistoryPts').textContent = `+${lengthOfHistoryPoints} pts`;
    document.getElementById('newCreditPts').textContent = `+${newCreditPoints} pts`;
    document.getElementById('creditMixPts').textContent = `+${creditMixPoints} pts`;

    let scoreSummary = "";
    if (finalScore >= 740) {
        scoreSummary = "Very Good";
        document.getElementById('ficoScoreDisplay').style.color = '#28a745'; // Green
    } else if (finalScore >= 670) {
        scoreSummary = "Good";
        document.getElementById('ficoScoreDisplay').style.color = '#17a2b8'; // Light blue
    } else if (finalScore >= 580) {
        scoreSummary = "Fair";
        document.getElementById('ficoScoreDisplay').style.color = '#ffc107'; // Orange/Yellow
    } else {
        scoreSummary = "Poor";
        document.getElementById('ficoScoreDisplay').style.color = '#dc3545'; // Red
    }
    document.getElementById('scoreSummary').textContent = scoreSummary;

    // Show the results section
    document.getElementById('resultsSection').style.display = 'block';
}
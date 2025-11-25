// Mappa delle proporzioni in base alla compagnia
const RATIOS = {
    Gnv: { sbarco: 25, carico: 19 },
    Grimaldi: { sbarco: 22, carico: 16 },
    Autovetture: 40
};

const BONUS_RULES = {
    LIMIT_LOW_RATE: 18,
    RATE_LOW: 5,
    RATE_HIGH: 10
};

function calculate() {
    const company = document.getElementById('company').value;
    const piecesSbarco = parseFloat(document.getElementById('piecesSbarco').value) || 0;
    const piecesCarico = parseFloat(document.getElementById('piecesCarico').value) || 0;
    const piecesAuto = parseFloat(document.getElementById('piecesAuto').value) || 0;
    const totalStaffAvailable = parseFloat(document.getElementById('totalStaffAvailable').value) || 0;

    if (!company) {
        updateResults(0, 0, 0, 0);
        return;
    }

    const { sbarco, carico } = RATIOS[company];
    const autoRatio = RATIOS.Autovetture;

    const staffRequiredSbarco = piecesSbarco / sbarco;
    const staffRequiredAuto = piecesAuto / autoRatio;
    const staffRequiredCarico = piecesCarico / carico;
    const staffTotalRequired = staffRequiredSbarco + staffRequiredCarico + staffRequiredAuto;

    const staffDeficit = totalStaffAvailable - staffTotalRequired;

    let piecesExtra = 0;
    if (totalStaffAvailable > 0) {
        const staffAvailableForCarico = totalStaffAvailable - staffRequiredSbarco - staffRequiredAuto;
        const piecesTheoreticalCarico = Math.max(0, staffAvailableForCarico) * carico;
        piecesExtra = piecesCarico - piecesTheoreticalCarico;
    }

    let totalBonusAmount = 0;
    let bonusPerEmployee = 0;

    if (piecesExtra > 0) {
        const piecesRounded = Math.floor(piecesExtra);
        if (piecesRounded <= BONUS_RULES.LIMIT_LOW_RATE) {
            totalBonusAmount = piecesRounded * BONUS_RULES.RATE_LOW;
        } else {
            totalBonusAmount =
                (BONUS_RULES.LIMIT_LOW_RATE * BONUS_RULES.RATE_LOW) +
                ((piecesRounded - BONUS_RULES.LIMIT_LOW_RATE) * BONUS_RULES.RATE_HIGH);
        }
    }

    if (totalStaffAvailable > 0) {
        bonusPerEmployee = totalBonusAmount / totalStaffAvailable;
    }

    updateResults(staffTotalRequired, staffDeficit, piecesExtra, bonusPerEmployee);
}

function updateResults(required, deficit, extra, bonus) {
    const personnelRequired = document.getElementById('resultPersonnelRequired');
    const staffDeficitEl = document.getElementById('resultStaffDeficit');
    const containerStaffDeficit = document.getElementById('containerStaffDeficit');
    const labelStaffDeficit = document.getElementById('labelStaffDeficit');
    const piecesExtraEl = document.getElementById('resultPiecesExtra');
    const bonusPerEmployeeEl = document.getElementById('resultBonusPerEmployee');

    personnelRequired.textContent = required.toFixed(2);
    piecesExtraEl.textContent = extra.toFixed(2);
    bonusPerEmployeeEl.textContent = bonus.toFixed(2) + ' €';

    staffDeficitEl.textContent = Math.abs(deficit).toFixed(2);

    if (deficit < 0) {
        containerStaffDeficit.className = "result-box bg-red-100";
        labelStaffDeficit.textContent = "Personale IN MENO (Deficit)";
        staffDeficitEl.className = "text-2xl mt-1 text-red-700";
    } else {
        containerStaffDeficit.className = "result-box bg-green-100";
        labelStaffDeficit.textContent = deficit === 0 
            ? "Personale Teorico (Zero Deficit)" 
            : "Personale IN PIÙ (Surplus)";
        staffDeficitEl.className = "text-2xl mt-1 text-green-700";
    }
}

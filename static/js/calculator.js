/**
 * Mortgage Calculator Module
 */
class MortgageCalculator {
  constructor(initialPrice = 1528950) {
    this.price = initialPrice;
    this.downPaymentPercent = 20;
    this.interestRate = 6.5;
    this.loanTermYears = 30;
    this.propertyTaxRate = 0.85; // annual %
    this.annualInsurance = 2400; // $ / yr

    this.initElements();
    if (this.calcForm) {
      this.bindEvents();
      this.calculateAndRender();
    }
  }

  initElements() {
    this.calcForm = document.getElementById("mortgage-calculator");
    this.priceInput = document.getElementById("calc-price");
    this.priceSlider = document.getElementById("calc-price-slider");
    this.downPaymentInput = document.getElementById("calc-down-payment");
    this.downPaymentSlider = document.getElementById(
      "calc-down-payment-slider",
    );
    this.downPaymentPercentDisplay =
      document.getElementById("calc-down-percent");
    this.interestInput = document.getElementById("calc-interest");
    this.interestSlider = document.getElementById("calc-interest-slider");
    this.termInputs = document.querySelectorAll('input[name="calc-term"]');

    // Outputs
    this.monthlyTotalDisplay = document.getElementById("calc-monthly-total");
    this.piDisplay = document.getElementById("calc-breakdown-pi");
    this.taxDisplay = document.getElementById("calc-breakdown-tax");
    this.insDisplay = document.getElementById("calc-breakdown-insurance");
    this.loanAmountDisplay = document.getElementById("calc-loan-amount");

    // Visual bars
    this.barPi = document.getElementById("calc-bar-pi");
    this.barTax = document.getElementById("calc-bar-tax");
    this.barIns = document.getElementById("calc-bar-insurance");
  }

  bindEvents() {
    // Price sync
    if (this.priceSlider && this.priceInput) {
      this.priceSlider.addEventListener("input", (e) => {
        this.price = parseFloat(e.target.value) || 0;
        this.priceInput.value = this.formatCurrency(this.price, false);
        this.updateDownPaymentAmount();
        this.calculateAndRender();
      });

      this.priceInput.addEventListener("change", (e) => {
        const val = parseFloat(e.target.value.replace(/[^0-9.]/g, "")) || 0;
        this.price = val;
        this.priceSlider.value = val;
        this.updateDownPaymentAmount();
        this.calculateAndRender();
      });
    }

    // Down payment sync
    if (this.downPaymentSlider && this.downPaymentInput) {
      this.downPaymentSlider.addEventListener("input", (e) => {
        this.downPaymentPercent = parseFloat(e.target.value) || 0;
        if (this.downPaymentPercentDisplay) {
          this.downPaymentPercentDisplay.textContent = `${this.downPaymentPercent}%`;
        }
        this.updateDownPaymentAmount();
        this.calculateAndRender();
      });

      this.downPaymentInput.addEventListener("change", (e) => {
        const val = parseFloat(e.target.value.replace(/[^0-9.]/g, "")) || 0;
        if (this.price > 0) {
          this.downPaymentPercent = Math.min(
            100,
            Math.max(0, Math.round((val / this.price) * 100)),
          );
          this.downPaymentSlider.value = this.downPaymentPercent;
          if (this.downPaymentPercentDisplay) {
            this.downPaymentPercentDisplay.textContent = `${this.downPaymentPercent}%`;
          }
        }
        this.calculateAndRender();
      });
    }

    // Interest rate sync
    if (this.interestSlider && this.interestInput) {
      this.interestSlider.addEventListener("input", (e) => {
        this.interestRate = parseFloat(e.target.value) || 0;
        this.interestInput.value = this.interestRate.toFixed(2);
        this.calculateAndRender();
      });

      this.interestInput.addEventListener("change", (e) => {
        const val = parseFloat(e.target.value) || 0;
        this.interestRate = val;
        this.interestSlider.value = val;
        this.calculateAndRender();
      });
    }

    // Term radio switches
    this.termInputs.forEach((radio) => {
      radio.addEventListener("change", (e) => {
        if (e.target.checked) {
          this.loanTermYears = parseInt(e.target.value, 10);
          this.calculateAndRender();
        }
      });
    });
  }

  updateDownPaymentAmount() {
    const downPaymentDollars = (this.price * this.downPaymentPercent) / 100;
    if (this.downPaymentInput) {
      this.downPaymentInput.value = this.formatCurrency(
        downPaymentDollars,
        false,
      );
    }
  }

  calculateAndRender() {
    const downPaymentDollars = (this.price * this.downPaymentPercent) / 100;
    const principal = Math.max(0, this.price - downPaymentDollars);
    const monthlyRate = this.interestRate / 100 / 12;
    const totalMonths = this.loanTermYears * 12;

    let monthlyPI = 0;
    if (principal > 0 && monthlyRate > 0) {
      monthlyPI =
        (principal * (monthlyRate * Math.pow(1 + monthlyRate, totalMonths))) /
        (Math.pow(1 + monthlyRate, totalMonths) - 1);
    } else if (principal > 0) {
      monthlyPI = principal / totalMonths;
    }

    const monthlyTax = (this.price * (this.propertyTaxRate / 100)) / 12;
    const monthlyIns = this.annualInsurance / 12;
    const monthlyTotal = monthlyPI + monthlyTax + monthlyIns;

    // Update DOM
    if (this.monthlyTotalDisplay) {
      this.monthlyTotalDisplay.textContent = this.formatCurrency(
        Math.round(monthlyTotal),
      );
    }
    if (this.piDisplay) {
      this.piDisplay.textContent = this.formatCurrency(Math.round(monthlyPI));
    }
    if (this.taxDisplay) {
      this.taxDisplay.textContent = this.formatCurrency(Math.round(monthlyTax));
    }
    if (this.insDisplay) {
      this.insDisplay.textContent = this.formatCurrency(Math.round(monthlyIns));
    }
    if (this.loanAmountDisplay) {
      this.loanAmountDisplay.textContent = this.formatCurrency(
        Math.round(principal),
      );
    }

    // Update visual percentage bar
    if (monthlyTotal > 0) {
      const piPercent = (monthlyPI / monthlyTotal) * 100;
      const taxPercent = (monthlyTax / monthlyTotal) * 100;
      const insPercent = (monthlyIns / monthlyTotal) * 100;

      if (this.barPi) this.barPi.style.width = `${piPercent}%`;
      if (this.barTax) this.barTax.style.width = `${taxPercent}%`;
      if (this.barIns) this.barIns.style.width = `${insPercent}%`;
    }
  }

  formatCurrency(num, includeDollar = true) {
    const formatted = new Intl.NumberFormat("en-US", {
      maximumFractionDigits: 0,
    }).format(num);
    return includeDollar ? `$${formatted}` : formatted;
  }
}

// Global initialization
window.addEventListener("DOMContentLoaded", () => {
  const currentPriceEl = document.getElementById("property-price-raw");
  const basePrice = currentPriceEl
    ? parseFloat(currentPriceEl.dataset.price)
    : 1528950;
  window.mortgageCalculator = new MortgageCalculator(basePrice);
});

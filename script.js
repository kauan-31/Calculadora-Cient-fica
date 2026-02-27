class ProfessionalCalculator {
    constructor() {
        this.currentOperand = '0';
        this.previousOperand = '';
        this.operation = null;
        this.expression = '';
        this.memory = 0;
        this.lastResult = null;
        this.isScientific = false;
        this.waitingForSecondOperand = false;
        this.newNumber = true;
        this.lastButtonWasOperator = false;
        this.canStartWithNegative = true; // Permite começar com número negativo
        
        this.initializeElements();
        this.attachEvents();
        this.updateDisplay();
    }

    initializeElements() {
        this.calculator = document.getElementById('calculator');
        this.modeToggle = document.getElementById('modeToggle');
        this.expressionElement = document.getElementById('expression');
        this.resultElement = document.getElementById('result');
        this.keypad = document.getElementById('keypad');
        this.memoryIndicator = document.getElementById('memoryIndicator');
        
        this.modeToggle.addEventListener('click', () => this.toggleMode());
    }

    attachEvents() {
        this.keypad.addEventListener('click', (e) => {
            const button = e.target.closest('button');
            if (!button) return;
            
            const action = button.dataset.action;
            const value = button.dataset.value;
            
            try {
                this.handleButton(action, value);
            } catch (error) {
                this.showError('Erro na operação');
                console.error(error);
            }
        });

        // Suporte a teclado
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));
    }

    handleButton(action, value) {
        switch(action) {
            case 'number':
                this.appendNumber(value);
                this.lastButtonWasOperator = false;
                this.canStartWithNegative = false;
                break;
            case 'decimal':
                this.appendDecimal();
                this.lastButtonWasOperator = false;
                this.canStartWithNegative = false;
                break;
            case 'clear':
                this.clear();
                break;
            case 'backspace':
                this.backspace();
                break;
            case 'add':
                this.setOperation('+');
                break;
            case 'subtract':
                this.handleSubtract(); // Método especial para subtração
                break;
            case 'multiply':
                this.setOperation('×');
                break;
            case 'divide':
                this.setOperation('÷');
                break;
            case 'percent':
                this.calculatePercentage();
                this.lastButtonWasOperator = false;
                break;
            case 'equals':
                this.calculate();
                this.lastButtonWasOperator = false;
                break;
            case 'sin':
            case 'cos':
            case 'tan':
                this.calculateTrig(action);
                this.lastButtonWasOperator = false;
                break;
            case 'sqrt':
                this.calculateSqrt();
                this.lastButtonWasOperator = false;
                break;
            case 'power':
                this.setOperation('^');
                break;
            case 'factorial':
                this.calculateFactorial();
                this.lastButtonWasOperator = false;
                break;
            case 'pi':
                this.appendPI();
                this.lastButtonWasOperator = false;
                break;
            case 'log':
                this.calculateLog();
                this.lastButtonWasOperator = false;
                break;
            case 'ln':
                this.calculateLn();
                this.lastButtonWasOperator = false;
                break;
            case 'exp':
                this.appendE();
                this.lastButtonWasOperator = false;
                break;
            case 'inverse':
                this.calculateInverse();
                this.lastButtonWasOperator = false;
                break;
        }
        
        this.updateDisplay();
        this.updateMemoryIndicator();
    }

    handleKeyboard(e) {
        const key = e.key;
        
        if (key >= '0' && key <= '9') {
            this.appendNumber(key);
            this.lastButtonWasOperator = false;
            this.canStartWithNegative = false;
            e.preventDefault();
        } else if (key === '.') {
            this.appendDecimal();
            this.lastButtonWasOperator = false;
            this.canStartWithNegative = false;
            e.preventDefault();
        } else if (key === '+') {
            this.setOperation('+');
            e.preventDefault();
        } else if (key === '-') {
            this.handleSubtract(); // Usa o mesmo método para teclado
            e.preventDefault();
        } else if (key === '*') {
            this.setOperation('×');
            e.preventDefault();
        } else if (key === '/') {
            this.setOperation('÷');
            e.preventDefault();
        } else if (key === '=' || key === 'Enter') {
            this.calculate();
            this.lastButtonWasOperator = false;
            e.preventDefault();
        } else if (key === 'Escape') {
            this.clear();
            e.preventDefault();
        } else if (key === 'Backspace') {
            this.backspace();
            e.preventDefault();
        } else if (key === '%') {
            this.calculatePercentage();
            this.lastButtonWasOperator = false;
            e.preventDefault();
        }
        
        this.updateDisplay();
    }

    // NOVO MÉTODO: Trata a subtração de forma especial
    handleSubtract() {
        // Caso 1: Primeiro caractere - permite número negativo
        if (this.canStartWithNegative && this.currentOperand === '0' && this.newNumber) {
            this.currentOperand = '-';
            this.newNumber = false;
            this.lastButtonWasOperator = false;
            return;
        }
        
        // Caso 2: Depois de um operador - permite próximo número negativo
        if (this.lastButtonWasOperator) {
            this.currentOperand = '-';
            this.newNumber = false;
            this.lastButtonWasOperator = false;
            return;
        }
        
        // Caso 3: Uso normal como operador de subtração
        this.setOperation('-');
    }

    appendNumber(number) {
        // Se currentOperand é apenas '-', adiciona o número depois
        if (this.currentOperand === '-') {
            this.currentOperand = '-' + number;
            this.newNumber = false;
            return;
        }
        
        if (this.newNumber) {
            this.currentOperand = number.toString();
            this.newNumber = false;
        } else {
            if (this.currentOperand === '0') {
                this.currentOperand = number.toString();
            } else {
                this.currentOperand += number.toString();
            }
        }
    }

    appendDecimal() {
        // Se currentOperand é apenas '-', adiciona '0.'
        if (this.currentOperand === '-') {
            this.currentOperand = '-0.';
            this.newNumber = false;
            return;
        }
        
        if (this.newNumber) {
            this.currentOperand = '0.';
            this.newNumber = false;
            return;
        }
        
        if (!this.currentOperand.includes('.')) {
            this.currentOperand += '.';
        }
    }

    appendPI() {
        this.currentOperand = Math.PI.toString();
        this.newNumber = false;
        this.canStartWithNegative = false;
    }

    appendE() {
        this.currentOperand = Math.E.toString();
        this.newNumber = false;
        this.canStartWithNegative = false;
    }

    setOperation(operation) {
        // Se o último botão foi operador, substitui a operação
        if (this.lastButtonWasOperator) {
            this.operation = operation;
            this.lastButtonWasOperator = true;
            return;
        }
        
        // Se há uma operação pendente e não é novo número, calcula
        if (this.operation !== null && !this.newNumber) {
            this.calculate();
        }
        
        this.operation = operation;
        this.previousOperand = this.currentOperand;
        this.newNumber = true;
        this.waitingForSecondOperand = true;
        this.lastButtonWasOperator = true;
        this.canStartWithNegative = true; // Permite próximo número negativo
    }

    calculate() {
        if (this.operation === null) return;
        
        // Se está esperando segundo operando e currentOperand é '-', ignora
        if (this.waitingForSecondOperand && this.currentOperand === '-') return;
        
        const prev = parseFloat(this.previousOperand);
        const current = parseFloat(this.currentOperand);
        
        if (isNaN(prev) || isNaN(current)) return;
        
        let result;
        
        switch(this.operation) {
            case '+':
                result = prev + current;
                break;
            case '-':
                result = prev - current;
                break;
            case '×':
                result = prev * current;
                break;
            case '÷':
                if (current === 0) {
                    this.showError('Divisão por zero');
                    return;
                }
                result = prev / current;
                break;
            case '^':
                result = Math.pow(prev, current);
                break;
            default:
                return;
        }
        
        this.currentOperand = this.formatResult(result);
        this.operation = null;
        this.previousOperand = '';
        this.newNumber = true;
        this.waitingForSecondOperand = false;
        this.lastButtonWasOperator = false;
        this.canStartWithNegative = true; // Permite começar novo número negativo
        this.lastResult = result;
    }

    calculatePercentage() {
        const currentValue = parseFloat(this.currentOperand);
        
        if (isNaN(currentValue)) return;
        
        // Se não há operação pendente, apenas converte para decimal
        if (!this.operation || !this.previousOperand) {
            this.currentOperand = (currentValue / 100).toString();
            this.newNumber = true;
            return;
        }
        
        // Se há uma operação pendente, calcula a porcentagem corretamente
        const prevValue = parseFloat(this.previousOperand);
        
        if (isNaN(prevValue)) return;
        
        let percentValue;
        
        switch(this.operation) {
            case '+':
            case '-':
                percentValue = (prevValue * currentValue) / 100;
                this.currentOperand = percentValue.toString();
                break;
                
            case '×':
            case '÷':
                percentValue = currentValue / 100;
                this.currentOperand = percentValue.toString();
                break;
                
            default:
                this.currentOperand = (currentValue / 100).toString();
        }
    }

    calculateTrig(func) {
        const value = parseFloat(this.currentOperand);
        
        if (isNaN(value)) return;
        
        // Converter para radianos
        const radians = value * (Math.PI / 180);
        let result;
        
        switch(func) {
            case 'sin':
                result = Math.sin(radians);
                break;
            case 'cos':
                result = Math.cos(radians);
                break;
            case 'tan':
                result = Math.tan(radians);
                if (Math.abs(result) > 1e10) {
                    this.showError('Tangente indefinida');
                    return;
                }
                break;
        }
        
        this.currentOperand = this.formatResult(result);
        this.newNumber = true;
        this.canStartWithNegative = true;
    }

    calculateSqrt() {
        const value = parseFloat(this.currentOperand);
        
        if (isNaN(value)) return;
        
        if (value < 0) {
            this.showError('Raiz de número negativo');
            return;
        }
        
        this.currentOperand = this.formatResult(Math.sqrt(value));
        this.newNumber = true;
        this.canStartWithNegative = true;
    }

    calculateFactorial() {
        const value = parseFloat(this.currentOperand);
        
        if (isNaN(value)) return;
        
        if (value < 0 || !Number.isInteger(value)) {
            this.showError('Fatorial inválido');
            return;
        }
        
        if (value > 170) {
            this.showError('Número muito grande');
            return;
        }
        
        let result = 1;
        for (let i = 2; i <= value; i++) {
            result *= i;
        }
        
        this.currentOperand = this.formatResult(result);
        this.newNumber = true;
        this.canStartWithNegative = true;
    }

    calculateLog() {
        const value = parseFloat(this.currentOperand);
        
        if (isNaN(value)) return;
        
        if (value <= 0) {
            this.showError('Logaritmo inválido');
            return;
        }
        
        this.currentOperand = this.formatResult(Math.log10(value));
        this.newNumber = true;
        this.canStartWithNegative = true;
    }

    calculateLn() {
        const value = parseFloat(this.currentOperand);
        
        if (isNaN(value)) return;
        
        if (value <= 0) {
            this.showError('Logaritmo natural inválido');
            return;
        }
        
        this.currentOperand = this.formatResult(Math.log(value));
        this.newNumber = true;
        this.canStartWithNegative = true;
    }

    calculateInverse() {
        const value = parseFloat(this.currentOperand);
        
        if (isNaN(value)) return;
        
        if (value === 0) {
            this.showError('Divisão por zero');
            return;
        }
        
        this.currentOperand = this.formatResult(1 / value);
        this.newNumber = true;
        this.canStartWithNegative = true;
    }

    clear() {
        this.currentOperand = '0';
        this.previousOperand = '';
        this.operation = null;
        this.newNumber = true;
        this.waitingForSecondOperand = false;
        this.expression = '';
        this.lastButtonWasOperator = false;
        this.canStartWithNegative = true;
    }

    backspace() {
        if (this.newNumber) return;
        
        if (this.currentOperand.length > 1) {
            this.currentOperand = this.currentOperand.slice(0, -1);
        } else {
            this.currentOperand = '0';
            this.newNumber = true;
            this.canStartWithNegative = true;
        }
    }

    formatResult(value) {
        if (isNaN(value) || !isFinite(value)) {
            return 'Erro';
        }
        
        let result = parseFloat(value.toFixed(10)).toString();
        
        if (result.includes('.') && result.split('.')[1].length === 1 && result.endsWith('0')) {
            result = result.split('.')[0];
        }
        
        return result;
    }

    showError(message) {
        this.resultElement.textContent = 'Erro';
        this.expressionElement.textContent = message;
        
        setTimeout(() => {
            this.clear();
            this.updateDisplay();
        }, 1500);
    }

    updateDisplay() {
        this.resultElement.textContent = this.currentOperand;
        
        // Construir expressão
        let expr = '';
        if (this.previousOperand) {
            expr += this.previousOperand;
            
            if (this.operation) {
                expr += ' ' + this.operation + ' ';
                
                if (!this.newNumber && this.currentOperand !== '0') {
                    expr += this.currentOperand;
                }
            }
        }
        
        this.expressionElement.textContent = expr;
    }

    updateMemoryIndicator() {
        if (this.memory !== 0) {
            this.memoryIndicator.classList.add('active');
        } else {
            this.memoryIndicator.classList.remove('active');
        }
    }

    toggleMode() {
        this.isScientific = !this.isScientific;
        
        if (this.isScientific) {
            this.calculator.classList.remove('simple-mode');
            this.calculator.classList.add('scientific-mode');
            this.modeToggle.classList.add('scientific');
        } else {
            this.calculator.classList.remove('scientific-mode');
            this.calculator.classList.add('simple-mode');
            this.modeToggle.classList.remove('scientific');
        }
        
        this.clear();
    }
}

// Inicializar a calculadora quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    new ProfessionalCalculator();
});
class TextProcessor {
    constructor() {
        this.encryptionMap = {
            'a': 'ai', 'e': 'enter', 'i': 'imes', 'o': 'ober', 'u': 'ufat'
        };
        this.decryptionMap = Object.fromEntries(
            Object.entries(this.encryptionMap).map(([key, value]) => [value, key])
        );
    }

    validateInput(text) {
        return /^[a-z\s]*$/.test(text);
    }

    encrypt(text) {
        if (!this.validateInput(text)) {
            throw new Error("Texto inválido. Use solo letras minúsculas sin acentos.");
        }
        return text.replace(/[aeiou]/g, match => this.encryptionMap[match]);
    }

    decrypt(text) {
        if (!this.validateInput(text)) {
            throw new Error("Texto inválido. Use solo letras minúsculas sin acentos.");
        }
        const pattern = new RegExp(Object.keys(this.decryptionMap).join('|'), 'g');
        return text.replace(pattern, match => this.decryptionMap[match]);
    }
}

class UIHandler {
    constructor() {
        this.processor = new TextProcessor();
        this.inputElement = document.querySelector(".entrada-texto");
        this.outputElement = document.querySelector(".salida-texto");
        this.text1Element = document.querySelector(".texto1");
        this.text2Element = document.querySelector(".texto2");
        this.copyButton = document.querySelector(".copiar");
        this.encryptButton = document.querySelector(".encriptar");
        this.decryptButton = document.querySelector(".desencriptar");
        
        this.setupEventListeners();
    }

    setupEventListeners() {
        this.encryptButton.addEventListener("click", () => this.handleEncryptDecrypt('encrypt'));
        this.decryptButton.addEventListener("click", () => this.handleEncryptDecrypt('decrypt'));
        this.copyButton.addEventListener("click", () => this.copyText());
    }

    handleEncryptDecrypt(action) {
        try {
            const inputText = this.inputElement.value.trim();
            if (!inputText) {
                throw new Error("Por favor, ingrese un texto para procesar.");
            }
            const result = action === 'encrypt' 
                ? this.processor.encrypt(inputText)
                : this.processor.decrypt(inputText);
            this.updateOutput(result);
        } catch (error) {
            this.showError(error.message);
        }
    }

    updateOutput(text) {
        this.outputElement.value = text;
        this.outputElement.style.background = "white";
        this.text1Element.style.display = "none";
        this.text2Element.style.display = "none";
        this.copyButton.style.display = "block";
    }

    copyText() {
        const textToCopy = this.outputElement.value;
        if (textToCopy) {
            navigator.clipboard.writeText(textToCopy)
                .then(() => this.showNotification("Texto copiado al portapapeles"))
                .catch(err => this.showError("Error al copiar: " + err));
        } else {
            this.showError("No hay texto para copiar");
        }
    }

    showError(message) {
        alert(message);
    }

    showNotification(message) {
        const notification = document.createElement('div');
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            background-color: #333;
            color: white;
            padding: 10px 20px;
            border-radius: 5px;
            opacity: 0;
            transition: opacity 0.3s ease-in-out;
        `;
        document.body.appendChild(notification);
        setTimeout(() => notification.style.opacity = '1', 10);
        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => notification.remove(), 300);
        }, 2000);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new UIHandler();
});

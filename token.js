// ==UserScript==
// @name         LMSYS Token Maximizer
// @namespace    https://github.com/seu-usuario/lmsys-token-maximizer
// @version      2.1.1
// @description  Enhanced token and temperature control for LMSYS Chat with a beautiful interface
// @author       BrunexCoder
// @match        *://lmarena.ai/*
// @match        *://arena.lmsys.org/*
// @match        *://chat.lmsys.org/*
// @match        https://lmarena.ai/
// @icon         https://chat.lmsys.org/favicon.ico
// @grant        none
// @license      MIT
// ==/UserScript==

(function() {
    'use strict';

    // Configurações globais
    const CONFIG = {
        defaultTokens: 4096,
        defaultTemp: 0.7,
        panelId: 'token-maximizer-controls',
        firstRunKey: 'tokenMaximizer_firstRun_v2',
        styles: {
            colors: {
                primary: '#3b82f6',
                background: 'var(--background-fill-primary)',
                secondaryBg: 'var(--background-fill-secondary)',
                border: 'var(--border-color-primary)',
                text: 'var(--body-text-color)',
                accent: 'var(--link-text-color)',
                slider: {
                    track: '#e2e8f0',
                    thumb: '#3b82f6',
                    progress: '#3b82f6'
                },
                tutorial: {
                    arrow: '#3b82f6',
                    background: '#3b82f6',
                    text: '#ffffff'
                }
            },
            fontSize: {
                small: '12px',
                medium: '13px',
                large: '14px'
            },
            tutorial: {
                arrow: '#3b82f6',
                background: '#3b82f6',
                text: '#ffffff'
            }
        }
    };

    // Classe principal do Token Maximizer
    class TokenMaximizer {
        constructor() {
            this.initialized = false;
            this.debugMode = this.isMobileDevice();
            this.logMessages = [];
            
            this.log('Constructor iniciado', 'init');
            this.log(`User Agent: ${navigator.userAgent}`, 'device');
            this.log(`É móvel: ${this.debugMode}`, 'device');
        }

        isMobileDevice() {
            const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
            const isMobile = mobileRegex.test(navigator.userAgent) || 
                            (window.innerWidth <= 800 && window.innerHeight <= 900);
            return true; // Força logs para todos os dispositivos durante testes
        }

        log(message, type = 'info') {
            const timestamp = new Date().toLocaleTimeString();
            const logMessage = `[${timestamp}][${type}] ${message}`;
            this.logMessages.push(logMessage);
            console.log(logMessage);

            try {
                if (this.debugMode) {
                    const logElement = document.createElement('div');
                    logElement.style.cssText = `
                        position: fixed;
                        top: ${10 + (document.querySelectorAll('.debug-log').length * 30)}px;
                        left: 10px;
                        background: rgba(0,0,0,0.9);
                        color: #00ff00;
                        padding: 8px 12px;
                        border-radius: 5px;
                        z-index: 99999;
                        font-size: 14px;
                        font-family: monospace;
                        max-width: 90vw;
                        word-break: break-all;
                        box-shadow: 0 2px 5px rgba(0,0,0,0.2);
                        border: 1px solid #00ff00;
                    `;
                    logElement.className = 'debug-log';
                    logElement.textContent = logMessage;
                    document.body.appendChild(logElement);

                    // Remove logs antigos se houver muitos
                    const logs = document.querySelectorAll('.debug-log');
                    if (logs.length > 5) {
                        logs[0].remove();
                    }

                    // Remove o log após 10 segundos
                    setTimeout(() => logElement.remove(), 10000);
                }
            } catch (error) {
                console.error('Erro ao criar log visual:', error);
            }
        }

        static async waitForElement(selector, timeout = 10000) {
            const startTime = Date.now();
            
            while (Date.now() - startTime < timeout) {
                const element = document.querySelector(selector);
                if (element) return element;
                await new Promise(resolve => setTimeout(resolve, 100));
            }
            return null;
        }

        async init() {
            this.log('Tentando inicializar...', 'init');
            
            if (this.initialized) {
                this.log('Já inicializado, retornando...', 'init');
                return;
            }

            try {
                this.initialized = true;
                this.log('Inicialização começou', 'init');
                
                // Aguarda o carregamento do elemento principal
                const directChatTab = await TokenMaximizer.waitForElement('#component-107');
                this.log(`Direct Chat Tab encontrado: ${!!directChatTab}`, 'check');
                
                if (!directChatTab) {
                    this.log('Timeout ao aguardar elemento principal', 'error');
                    return;
                }

                const directChatContainer = directChatTab?.querySelector('#component-111') || 
                                          directChatTab?.querySelector('.gr-group');
                this.log(`Direct Chat Container encontrado: ${!!directChatContainer}`, 'check');

                // Executa cada função em uma try/catch separada
                try {
                    await this.setupInitialLoad();
                    this.log('setupInitialLoad executado com sucesso', 'init');
                } catch (e) {
                    this.log(`Erro em setupInitialLoad: ${e.message}`, 'error');
                }

                try {
                    this.setupMutationObserver();
                    this.log('setupMutationObserver executado com sucesso', 'init');
                } catch (e) {
                    this.log(`Erro em setupMutationObserver: ${e.message}`, 'error');
                }

                try {
                    this.showCredits();
                    this.log('showCredits executado com sucesso', 'init');
                } catch (e) {
                    this.log(`Erro em showCredits: ${e.message}`, 'error');
                }
                
                this.log('Inicialização completa', 'init');
            } catch (error) {
                this.log(`Erro na inicialização: ${error.message}`, 'error');
                console.error(error);
            }
        }

        async setupInitialLoad() {
            this.log('Iniciando setupInitialLoad', 'setup');
            const attempts = [0, 500, 1000, 2000, 3000, 4000]; // Aumentei o número de tentativas
            
            for (const delay of attempts) {
                await new Promise(resolve => setTimeout(resolve, delay));
                
                this.log(`Tentativa de carregamento após ${delay}ms`, 'setup');
                const directChatTab = document.querySelector('#component-107');
                const directChatContainer = directChatTab?.querySelector('#component-111') || 
                                          directChatTab?.querySelector('.gr-group');
                
                if (directChatContainer) {
                    this.log('Container encontrado, inserindo controles', 'setup');
                    this.insertControls(directChatContainer);
                    break; // Sai do loop se encontrou o container
                } else {
                    this.log('Container não encontrado nesta tentativa', 'setup');
                }
            }
        }

        insertControls(targetElement) {
            const existingControls = document.getElementById(CONFIG.panelId);
            if (existingControls) existingControls.remove();

            const controlsContainer = document.createElement('div');
            controlsContainer.id = CONFIG.panelId;
            controlsContainer.style.cssText = `
                display: flex;
                align-items: center;
                gap: 16px;
                padding: 16px;
                margin: 8px 0;
                border-radius: 12px;
                background: ${CONFIG.styles.colors.background};
                border: 1px solid ${CONFIG.styles.colors.border};
                box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
            `;

            // Título com ícone e estilo do site
            const titleContainer = document.createElement('div');
            titleContainer.style.cssText = `
                display: flex;
                align-items: center;
                gap: 8px;
                padding-right: 16px;
                border-right: 1px solid ${CONFIG.styles.colors.border};
            `;

            const titleIcon = document.createElement('span');
            titleIcon.textContent = '🔧';
            titleIcon.style.fontSize = '16px';

            const titleText = document.createElement('span');
            titleText.textContent = 'Token Controls';
            titleText.style.cssText = `
                font-size: ${CONFIG.styles.fontSize.medium};
                font-weight: 600;
                color: ${CONFIG.styles.colors.text};
            `;

            titleContainer.append(titleIcon, titleText);

            // Container para os controles
            const controlsWrapper = document.createElement('div');
            controlsWrapper.style.cssText = `
                display: flex;
                align-items: center;
                gap: 16px;
                flex-grow: 1;
            `;

            // Criar controles com novo estilo
            const tokenControl = this.createCompactControl(
                'Max Tokens',
                'range',
                {min: 1024, max: 8192, value: CONFIG.defaultTokens, step: 1024},
                this.modifyInputs.bind(this)
            );

            const tempControl = this.createCompactControl(
                'Temperature',
                'range',
                {min: 0, max: 1, value: CONFIG.defaultTemp, step: 0.1},
                this.modifyTemperature.bind(this)
            );

            controlsWrapper.append(tokenControl, tempControl);
            controlsContainer.append(titleContainer, controlsWrapper);
            targetElement.insertBefore(controlsContainer, targetElement.firstChild);
        }

        createCompactControl(label, type, options, onChange) {
            const container = document.createElement('div');
            container.style.cssText = `
                display: flex;
                align-items: center;
                gap: 12px;
                padding: 8px 12px;
                background: ${CONFIG.styles.colors.secondaryBg};
                border-radius: 8px;
                flex: 1;
            `;

            const labelElement = document.createElement('label');
            labelElement.textContent = label;
            labelElement.style.cssText = `
                font-size: ${CONFIG.styles.fontSize.small};
                color: ${CONFIG.styles.colors.text};
                font-weight: 500;
                min-width: 80px;
            `;

            const inputWrapper = document.createElement('div');
            inputWrapper.style.cssText = `
                position: relative;
                flex: 1;
                display: flex;
                align-items: center;
                gap: 8px;
            `;

            const input = document.createElement('input');
            input.type = type;
            Object.assign(input, options);
            input.style.cssText = `
                width: 100%;
                height: 4px;
                -webkit-appearance: none;
                background: ${CONFIG.styles.colors.border};
                border-radius: 4px;
                cursor: pointer;
                transition: all 0.3s ease;
                
                &::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    width: 16px;
                    height: 16px;
                    border-radius: 50%;
                    background: #3b82f6;
                    border: 2px solid white;
                    cursor: pointer;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    box-shadow: 0 2px 4px rgba(59, 130, 246, 0.3);
                }
                
                &::-webkit-slider-thumb:hover {
                    transform: scale(1.2);
                    box-shadow: 0 4px 8px rgba(59, 130, 246, 0.4);
                }
                
                &::-webkit-slider-thumb:active {
                    transform: scale(0.95);
                    box-shadow: 0 1px 2px rgba(59, 130, 246, 0.4);
                }

                &::-webkit-slider-runnable-track {
                    width: 100%;
                    height: 4px;
                    background: linear-gradient(to right, #3b82f6 var(--value-percent, 50%), rgba(59, 130, 246, 0.1) var(--value-percent, 50%));
                    border-radius: 4px;
                    transition: background 0.3s ease;
                }

                &:focus {
                    outline: none;
                }
                
                &:hover::-webkit-slider-runnable-track {
                    background: linear-gradient(to right, #3b82f6 var(--value-percent, 50%), rgba(59, 130, 246, 0.2) var(--value-percent, 50%));
                }
            `;

            // Adiciona efeito de brilho ao passar o mouse
            input.addEventListener('mouseover', () => {
                input.style.filter = 'brightness(1.1)';
            });

            input.addEventListener('mouseout', () => {
                input.style.filter = 'brightness(1)';
            });

            input.addEventListener('input', (e) => {
                const min = parseFloat(e.target.min);
                const max = parseFloat(e.target.max);
                const val = parseFloat(e.target.value);
                const percent = ((val - min) * 100) / (max - min);
                e.target.style.setProperty('--value-percent', `${percent}%`);
                
                // Adiciona efeito de pulso ao mover o slider
                e.target.style.transform = 'scale(1.02)';
                setTimeout(() => {
                    e.target.style.transform = 'scale(1)';
                }, 100);
            });

            const initialPercent = ((options.value - options.min) * 100) / (options.max - options.min);
            input.style.setProperty('--value-percent', `${initialPercent}%`);

            const valueLabel = document.createElement('span');
            valueLabel.style.cssText = `
                font-size: ${CONFIG.styles.fontSize.small};
                color: ${CONFIG.styles.colors.text};
                font-family: var(--font-mono);
                min-width: 45px;
                text-align: right;
                transition: all 0.3s ease;
            `;
            valueLabel.textContent = options.value;

            input.addEventListener('input', (e) => {
                const value = parseFloat(e.target.value);
                valueLabel.textContent = type === 'range' && label === 'Max Tokens' 
                    ? Math.round(value).toLocaleString()
                    : value.toFixed(1);
                
                // Anima o valor ao mudar
                valueLabel.style.transform = 'scale(1.1)';
                valueLabel.style.color = '#3b82f6';
                setTimeout(() => {
                    valueLabel.style.transform = 'scale(1)';
                    valueLabel.style.color = CONFIG.styles.colors.text;
                }, 200);
                
                onChange(value);
            });

            inputWrapper.append(input, valueLabel);
            container.append(labelElement, inputWrapper);
            return container;
        }

        // Modifica os inputs de token
        modifyInputs(targetValue) {
            const inputs = document.querySelectorAll('input[aria-label*="Max output tokens"]');
            inputs.forEach(input => {
                if (input.max < targetValue) input.max = targetValue;
                if (parseInt(input.value) !== targetValue) {
                    input.value = targetValue;
                    if (input.type === 'range') {
                        input.style.backgroundSize = '100% 100%';
                    }
                    input.dispatchEvent(new Event('input', { bubbles: true }));
                    input.dispatchEvent(new Event('change', { bubbles: true }));
                }
            });
        }

        // Modifica a temperatura
        modifyTemperature(value) {
            const inputs = document.querySelectorAll('input[aria-label*="Temperature"]');
            inputs.forEach(input => {
                input.value = value;
                if (input.type === 'range') {
                    input.style.backgroundSize = `${value * 100}% 100%`;
                }
                input.dispatchEvent(new Event('input', { bubbles: true }));
                input.dispatchEvent(new Event('change', { bubbles: true }));
            });
        }

        // Encontra e clica em botões
        findAndClickButton(action) {
            const buttonTexts = {
                regenerate: ['regenerate', 'retry', 'reset'],
                clear: ['clear', 'new chat']
            };

            const texts = buttonTexts[action] || [];
            const buttons = Array.from(document.querySelectorAll('button'));

            const button = buttons.find(btn => {
                const btnText = btn.textContent.toLowerCase();
                return texts.some(text => btnText.includes(text));
            });

            if (button) {
                button.click();
                return true;
            }
            return false;
        }

        showCredits() {
            const credits = document.createElement('div');
            credits.textContent = 'Token Maximizer developed by BrunexCoder';
            
            // Adiciona um container para o efeito de borda
            const creditsContainer = document.createElement('div');
            creditsContainer.style.cssText = `
                position: fixed;
                bottom: 20px;
                right: 20px;
                padding: 2px; /* Espaço para a borda RGB */
                border-radius: 10px;
                background: linear-gradient(90deg, #ff0000, #00ff00, #0000ff, #ff0000);
                background-size: 400% 400%;
                animation: gradientBorder 3s ease infinite;
                z-index: 9999;
                box-shadow: 0 2px 10px rgba(0,0,0,0.3);
            `;

            credits.style.cssText = `
                background: ${CONFIG.styles.colors.background};
                color: ${CONFIG.styles.colors.text};
                padding: 10px 15px;
                border-radius: 8px;
                font-size: ${CONFIG.styles.fontSize.small};
                font-weight: bold;
                text-align: center;
            `;

            // Adiciona a animação do gradiente
            const style = document.createElement('style');
            style.textContent = `
                @keyframes gradientBorder {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }
            `;
            document.head.appendChild(style);

            creditsContainer.appendChild(credits);
            document.body.appendChild(creditsContainer);

            setTimeout(() => {
                creditsContainer.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                creditsContainer.style.opacity = '0';
                creditsContainer.style.transform = 'translateY(20px)';
                setTimeout(() => creditsContainer.remove(), 500);
            }, 5000);
        }

        showTutorialArrow() {
            // Verifica se é a primeira execução desta versão
            if (localStorage.getItem(CONFIG.firstRunKey)) return;
            
            // Observa cliques no botão Direct Chat
            const directChatButton = document.querySelector('button[aria-controls="component-107"]');
            if (!directChatButton) return;

            directChatButton.addEventListener('click', () => {
                setTimeout(() => {
                    // Encontra o texto "Token Controls"
                    const tokenControlsText = Array.from(document.querySelectorAll('span')).find(
                        span => span.textContent === 'Token Controls'
                    );
                    
                    if (!tokenControlsText) return;
                    
                    const textRect = tokenControlsText.getBoundingClientRect();
                    const messageWidth = 220;
                    
                    const arrowContainer = document.createElement('div');
                    arrowContainer.style.cssText = `
                        position: fixed;
                        top: ${textRect.top - 18}px;
                        left: ${textRect.left - messageWidth + 60}px;
                        transform: translateY(-50%);
                        z-index: 9999;
                        display: flex;
                        align-items: center;
                        gap: 12px;
                        animation: bounceArrow 2s infinite;
                        pointer-events: none;
                    `;

                    // Atualiza o estilo da mensagem
                    const message = document.createElement('div');
                    message.style.cssText = `
                        background: ${CONFIG.styles.colors.tutorial.background};
                        color: ${CONFIG.styles.colors.tutorial.text};
                        padding: 12px 16px;
                        border-radius: 8px;
                        font-size: ${CONFIG.styles.fontSize.medium};
                        font-weight: 500;
                        box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
                        max-width: ${messageWidth}px;
                        line-height: 1.4;
                        text-align: right;
                        letter-spacing: 0.3px;
                        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
                    `;
                    message.textContent = '🎉 Os controles de token foram movidos para cá! Agora você pode ajustar facilmente os tokens e temperatura.';

                    // Atualiza a seta
                    const arrow = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
                    arrow.setAttribute('width', '40');
                    arrow.setAttribute('height', '40');
                    arrow.setAttribute('viewBox', '0 0 24 24');
                    arrow.style.cssText = `
                        fill: none;
                        stroke: #ffffff;
                        stroke-width: 2.5;
                        stroke-linecap: round;
                        stroke-linejoin: round;
                        filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1));
                    `;

                    const arrowPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                    arrowPath.setAttribute('d', 'M5 12h14m-7-7l7 7-7 7');
                    arrow.appendChild(arrowPath);

                    // Atualiza a animação
                    const style = document.createElement('style');
                    style.textContent = `
                        @keyframes bounceArrow {
                            0%, 100% { transform: translateX(0); }
                            50% { transform: translateX(10px); }
                        }
                        
                        
                        @keyframes fadeOut {
                            from { opacity: 1; transform: translateY(0); }
                            to { opacity: 0; transform: translateY(-10px); }
                        }
                    `;
                    document.head.appendChild(style);

                    arrowContainer.append(message, arrow);
                    document.body.appendChild(arrowContainer);

                    // Remove o tutorial após 10 segundos
                    setTimeout(() => {
                        arrowContainer.style.animation = 'fadeOut 0.5s ease forwards';
                        setTimeout(() => arrowContainer.remove(), 500);
                    }, 10000);

                    // Marca como já exibido
                    localStorage.setItem(CONFIG.firstRunKey, 'true');
                }, 500); // Delay para garantir que os elementos estejam carregados
            }, { once: true }); // Garante que o evento só seja disparado uma vez
        }

        resetTutorial() {
            localStorage.removeItem(CONFIG.firstRunKey);
            this.log('Tutorial reset realizado com sucesso');
        }

        showAllLogs() {
            console.log('=== Todos os Logs ===');
            this.logMessages.forEach(msg => console.log(msg));
            console.log('===================');
        }

        setupMutationObserver() {
            this.log('Configurando MutationObserver', 'setup');
            try {
                let timeoutId;
                let lastUpdate = 0;
                const debounceTime = 1000; // 1 segundo entre atualizações

                const observer = new MutationObserver((mutations) => {
                    // Verifica se as mutações são relevantes
                    const relevantMutation = mutations.some(mutation => {
                        // Verifica apenas mudanças específicas
                        if (mutation.type === 'childList') {
                            return Array.from(mutation.addedNodes).some(node => 
                                node.nodeType === 1 && // Elemento DOM
                                (node.id === 'component-107' || 
                                 node.id === 'component-111' ||
                                 node.classList.contains('gr-group'))
                            );
                        }
                        if (mutation.type === 'attributes') {
                            return mutation.attributeName === 'aria-selected' ||
                                   mutation.attributeName === 'style';
                        }
                        return false;
                    });

                    if (!relevantMutation) return;

                    // Implementa debounce
                    const now = Date.now();
                    if (now - lastUpdate < debounceTime) {
                        clearTimeout(timeoutId);
                    }

                    timeoutId = setTimeout(() => {
                        const directChatTab = document.querySelector('#component-107');
                        const directChatContainer = directChatTab?.querySelector('#component-111') || 
                                                  directChatTab?.querySelector('.gr-group');
                        
                        if (directChatContainer && !document.getElementById(CONFIG.panelId)) {
                            this.log('Container encontrado após mudança, inserindo controles', 'observer');
                            this.insertControls(directChatContainer);
                        }
                        lastUpdate = now;
                    }, debounceTime);
                });

                // Configura o observer com opções mais específicas
                observer.observe(document.body, {
                    childList: true,
                    subtree: true,
                    attributes: true,
                    attributeFilter: ['aria-selected', 'style'],
                    characterData: false
                });
                
                this.log('MutationObserver configurado com sucesso', 'setup');
            } catch (error) {
                this.log(`Erro ao configurar MutationObserver: ${error.message}`, 'error');
            }
        }
    }

    // Modifique a inicialização para ser mais robusta
    (function() {
        let maxAttempts = 10;
        let currentAttempt = 0;
        
        function tryInitialize() {
            if (document.readyState === 'complete') {
                const tokenMaximizer = new TokenMaximizer();
                tokenMaximizer.init().catch(error => {
                    console.error('Erro ao inicializar:', error);
                    tokenMaximizer.log(`Erro na tentativa ${currentAttempt + 1}: ${error.message}`, 'error');
                });
            } else if (currentAttempt < maxAttempts) {
                currentAttempt++;
                setTimeout(tryInitialize, 1000);
            }
        }

        // Tenta inicializar quando o DOM estiver pronto
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', tryInitialize);
        } else {
            tryInitialize();
        }
    })();
})();
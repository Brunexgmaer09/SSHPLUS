// ==UserScript==
// @name         LMSYS Token Maximizer
// @namespace    https://github.com/seu-usuario/lmsys-token-maximizer
// @version      1.0.0
// @description  Enhanced token and temperature control for LMSYS Chat with a beautiful interface
// @author       BrunexCoder
// @match        *://lmarena.ai/*
// @match        *://arena.lmsys.org/*
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
        panelId: 'token-maximizer-panel',
        styles: {
            colors: {
                primary: '#539bf5',
                background: '#0b0f19',
                border: '#2d333b',
                text: '#e6edf3',
                buttonHover: '#444c56'
            },
            fontSize: {
                small: '13px',
                medium: '14px'
            }
        }
    };

    // Classe principal do Token Maximizer
    class TokenMaximizer {
        constructor() {
            this.initialized = false;
            this.panel = null;
        }

        // Inicializa o Token Maximizer
        init() {
            if (this.initialized) return;
            this.initialized = true;

            console.log('🚀 Iniciando Token Maximizer...');
            this.setupInitialLoad();
            this.setupMutationObserver();
        }

        // Configura o carregamento inicial
        setupInitialLoad() {
            const attempts = [0, 500, 1000, 2000];
            attempts.forEach(delay => setTimeout(() => this.insertPanel(), delay));
        }

        // Configura o observer para mudanças na página
        setupMutationObserver() {
            const observer = new MutationObserver(() => {
                if (!document.getElementById(CONFIG.panelId)) {
                    setTimeout(() => this.insertPanel(), 100);
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true,
                attributes: true,
                attributeFilter: ['aria-selected', 'style']
            });
        }

        // Cria e insere o painel na página
        insertPanel() {
            const existingPanel = document.getElementById(CONFIG.panelId);
            if (existingPanel) existingPanel.remove();

            const directChatContent = document.querySelector('#component-107');
            if (!directChatContent?.firstElementChild) return;

            this.panel = this.createPanel();
            this.panel.style.cssText += `
                position: absolute;
                top: 10px;
                right: 10px;
                z-index: 1000;
                background-color: ${CONFIG.styles.colors.background};
                box-shadow: 0 2px 5px rgba(0,0,0,0.1);
            `;

            directChatContent.insertBefore(this.panel, directChatContent.firstElementChild);
            this.panel.appendChild(this.createTooltip());
        }

        // Cria o painel de controle
        createPanel() {
            const panel = document.createElement('div');
            panel.id = CONFIG.panelId;
            panel.style.cssText = this.getPanelStyles();

            const title = this.createTitle('🤖 Token Maximizer');
            const controls = this.createControls();
            const buttons = this.createButtons();

            panel.append(title, controls, buttons);
            return panel;
        }

        // Estilos do painel
        getPanelStyles() {
            return `
                display: inline-block;
                margin-left: 10px;
                padding: 12px 16px;
                border: 1px solid ${CONFIG.styles.colors.border};
                border-radius: 8px;
                color: ${CONFIG.styles.colors.text};
                font-weight: 500;
                background-color: ${CONFIG.styles.colors.background};
                box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            `;
        }

        // Cria o título do painel
        createTitle(text) {
            const title = document.createElement('div');
            title.textContent = text;
            title.style.cssText = `
                margin-bottom: 10px;
                font-size: ${CONFIG.styles.fontSize.medium};
                font-weight: 600;
                color: ${CONFIG.styles.colors.primary};
            `;
            return title;
        }

        // Cria os controles do painel
        createControls() {
            const controls = document.createElement('div');
            controls.style.cssText = `
                display: flex;
                flex-direction: column;
                gap: 5px;
                font-size: 0.9em;
            `;

            const tokenControl = this.createControl(
                'Max Tokens:',
                'range',
                {min: 1024, max: 8192, value: CONFIG.defaultTokens, step: 1024},
                this.modifyInputs.bind(this)
            );

            const tempControl = this.createControl(
                'Temperature:',
                'range',
                {min: 0, max: 1, value: CONFIG.defaultTemp, step: 0.1},
                this.modifyTemperature.bind(this)
            );

            controls.append(tokenControl, tempControl);
            return controls;
        }

        // Cria um controle individual
        createControl(label, type, options, onChange) {
            const container = document.createElement('div');
            container.style.cssText = `
                display: flex;
                align-items: center;
                gap: 8px;
                margin-bottom: 8px;
            `;

            const labelElement = document.createElement('label');
            labelElement.textContent = label;
            labelElement.style.cssText = `
                min-width: 100px;
                color: ${CONFIG.styles.colors.text};
                font-size: ${CONFIG.styles.fontSize.small};
            `;

            const input = document.createElement('input');
            input.type = type;
            Object.assign(input, options);
            input.style.cssText = `
                width: 120px;
                margin: 0 5px;
                accent-color: ${CONFIG.styles.colors.primary};
            `;

            const valueLabel = document.createElement('span');
            valueLabel.textContent = options.value;
            
            input.addEventListener('input', (e) => {
                const value = parseFloat(e.target.value);
                valueLabel.textContent = type === 'range' && label === 'Max Tokens:' 
                    ? `${value} tokens` 
                    : value.toFixed(1);
                onChange(value);
            });

            container.append(labelElement, input, valueLabel);
            return container;
        }

        // Cria os botões do painel
        createButtons() {
            const container = document.createElement('div');
            container.style.cssText = `
                display: flex;
                gap: 5px;
                margin-top: 5px;
            `;

            const regenerateBtn = this.createButton('🔄 Regenerate', () => this.findAndClickButton('regenerate'));
            const clearBtn = this.createButton('🗑️ Clear', () => this.findAndClickButton('clear'));

            container.append(regenerateBtn, clearBtn);
            return container;
        }

        // Cria um botão individual
        createButton(text, onClick) {
            const button = document.createElement('button');
            button.textContent = text;
            button.style.cssText = `
                padding: 4px 12px;
                border: 1px solid ${CONFIG.styles.colors.border};
                border-radius: 6px;
                background: ${CONFIG.styles.colors.border};
                color: ${CONFIG.styles.colors.text};
                cursor: pointer;
                font-size: ${CONFIG.styles.fontSize.small};
                transition: all 0.2s ease;
            `;

            button.addEventListener('mouseover', () => {
                button.style.background = CONFIG.styles.colors.buttonHover;
                button.style.borderColor = CONFIG.styles.colors.primary;
            });

            button.addEventListener('mouseout', () => {
                button.style.background = CONFIG.styles.colors.border;
                button.style.borderColor = CONFIG.styles.colors.border;
            });

            button.addEventListener('click', onClick);
            return button;
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
            
            console.log(`Não foi possível encontrar o botão de ${action}`);
            return false;
        }

        createTooltip() {
            const tooltip = document.createElement('div');
            tooltip.textContent = 'Token Maximizer made By Brunex';
            tooltip.style.cssText = `
                position: absolute;
                bottom: -40px;
                right: 0;
                background: ${CONFIG.styles.colors.background};
                color: ${CONFIG.styles.colors.text};
                padding: 8px 12px;
                border-radius: 6px;
                border: 1px solid ${CONFIG.styles.colors.border};
                font-size: ${CONFIG.styles.fontSize.small};
                white-space: nowrap;
                opacity: 0;
                transition: opacity 0.3s ease;
                z-index: 1001;
            `;

            // Animação de fade in/out
            setTimeout(() => {
                tooltip.style.opacity = '1';
                setTimeout(() => {
                    tooltip.style.opacity = '0';
                    setTimeout(() => tooltip.remove(), 300);
                }, 3000);
            }, 100);

            return tooltip;
        }
    }

    // Inicializa o Token Maximizer quando a página carregar
    if (document.readyState === 'loading') {
        console.log('📝 Aguardando carregamento da página...');
        window.addEventListener('load', () => new TokenMaximizer().init());
    } else {
        console.log('📝 Página já carregada, iniciando...');
        new TokenMaximizer().init();
    }
})();

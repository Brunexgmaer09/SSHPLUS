// ==UserScript==
// @name         LMSYS Token Maximizer
// @namespace    https://github.com/seu-usuario/lmsys-token-maximizer
// @version      1.0.0
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
        },
        mobile: {
            breakpoint: 768, // Breakpoint para dispositivos móveis
            fontSize: {
                small: '11px',
                medium: '12px',
                large: '13px'
            },
            spacing: {
                small: '6px',
                medium: '8px',
                large: '12px'
            }
        }
    };

    // Classe principal do Token Maximizer
    class TokenMaximizer {
        constructor() {
            this.initialized = false;
        }

        // Inicializa o Token Maximizer
        init() {
            if (this.initialized) return;
            this.initialized = true;

            this.setupInitialLoad();
            this.setupMutationObserver();
            this.showCredits();
            
            setTimeout(() => this.showTutorialArrow(), 2000);
        }

        // Configura o carregamento inicial
        setupInitialLoad() {
            const attempts = [0, 500, 1000, 2000];
            attempts.forEach(delay => setTimeout(() => {
                // Procura especificamente pelo container do Direct Chat
                const directChatTab = document.querySelector('#component-107');
                const directChatContainer = directChatTab?.querySelector('#component-111') || 
                                          directChatTab?.querySelector('.gr-group');
                
                if (directChatContainer) {
                    this.insertControls(directChatContainer);
                }
            }, delay));
        }

        // Configura o observer para mudanças na página
        setupMutationObserver() {
            const observer = new MutationObserver(() => {
                const directChatTab = document.querySelector('#component-107');
                const directChatContainer = directChatTab?.querySelector('#component-111') || 
                                          directChatTab?.querySelector('.gr-group');
                
                if (directChatContainer && !document.getElementById(CONFIG.panelId)) {
                    setTimeout(() => this.insertControls(directChatContainer), 100);
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true,
                attributes: true,
                attributeFilter: ['aria-selected', 'style']
            });
        }

        insertControls(targetElement) {
            const existingControls = document.getElementById(CONFIG.panelId);
            if (existingControls) existingControls.remove();

            const isMobile = window.innerWidth <= CONFIG.mobile.breakpoint;

            const controlsContainer = document.createElement('div');
            controlsContainer.id = CONFIG.panelId;
            controlsContainer.style.cssText = `
                display: flex;
                align-items: center;
                gap: ${isMobile ? '8px' : '16px'};
                padding: ${isMobile ? '12px' : '16px'};
                margin: 8px 0;
                border-radius: 12px;
                background: ${CONFIG.styles.colors.background};
                border: 1px solid ${CONFIG.styles.colors.border};
                box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
                ${isMobile ? 'flex-direction: column; width: 100%;' : ''}
            `;

            // Título com ícone e estilo do site
            const titleContainer = document.createElement('div');
            titleContainer.style.cssText = `
                display: flex;
                align-items: center;
                gap: 8px;
                ${isMobile ? 'margin-bottom: 8px; width: 100%;' : 'padding-right: 16px; border-right: 1px solid ' + CONFIG.styles.colors.border}
            `;

            const titleIcon = document.createElement('span');
            titleIcon.textContent = '🔧';
            titleIcon.style.fontSize = isMobile ? '14px' : '16px';

            const titleText = document.createElement('span');
            titleText.textContent = 'Token Controls';
            titleText.style.cssText = `
                font-size: ${isMobile ? CONFIG.mobile.fontSize.medium : CONFIG.styles.fontSize.medium};
                font-weight: 600;
                color: ${CONFIG.styles.colors.text};
            `;

            titleContainer.append(titleIcon, titleText);

            // Container para os controles
            const controlsWrapper = document.createElement('div');
            controlsWrapper.style.cssText = `
                display: flex;
                align-items: center;
                gap: ${isMobile ? '8px' : '16px'};
                flex-grow: 1;
                ${isMobile ? 'flex-direction: column; width: 100%;' : ''}
            `;

            // Criar controles adaptados para mobile
            const tokenControl = this.createCompactControl(
                'Max Tokens',
                'range',
                {min: 1024, max: 8192, value: CONFIG.defaultTokens, step: 1024},
                this.modifyInputs.bind(this),
                isMobile
            );

            const tempControl = this.createCompactControl(
                'Temperature',
                'range',
                {min: 0, max: 1, value: CONFIG.defaultTemp, step: 0.1},
                this.modifyTemperature.bind(this),
                isMobile
            );

            controlsWrapper.append(tokenControl, tempControl);
            controlsContainer.append(titleContainer, controlsWrapper);
            targetElement.insertBefore(controlsContainer, targetElement.firstChild);

            // Adiciona listener para redimensionamento
            window.addEventListener('resize', () => {
                const newIsMobile = window.innerWidth <= CONFIG.mobile.breakpoint;
                if (newIsMobile !== isMobile) {
                    this.insertControls(targetElement);
                }
            });
        }

        createCompactControl(label, type, options, onChange, isMobile) {
            const container = document.createElement('div');
            container.style.cssText = `
                display: flex;
                align-items: center;
                gap: ${isMobile ? '8px' : '12px'};
                padding: ${isMobile ? '6px 8px' : '8px 12px'};
                background: ${CONFIG.styles.colors.secondaryBg};
                border-radius: 8px;
                ${isMobile ? 'width: 100%;' : 'flex: 1;'}
            `;

            const labelElement = document.createElement('label');
            labelElement.textContent = label;
            labelElement.style.cssText = `
                font-size: ${isMobile ? CONFIG.mobile.fontSize.small : CONFIG.styles.fontSize.small};
                color: ${CONFIG.styles.colors.text};
                font-weight: 500;
                min-width: ${isMobile ? '70px' : '80px'};
            `;

            const inputWrapper = document.createElement('div');
            inputWrapper.style.cssText = `
                position: relative;
                flex: 1;
                display: flex;
                align-items: center;
                gap: ${isMobile ? '6px' : '8px'};
            `;

            const input = document.createElement('input');
            input.type = type;
            Object.assign(input, options);
            input.style.cssText = `
                width: 100%;
                height: ${isMobile ? '3px' : '4px'};
                -webkit-appearance: none;
                background: ${CONFIG.styles.colors.border};
                border-radius: 4px;
                cursor: pointer;
                touch-action: none;
                
                &::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    width: ${isMobile ? '14px' : '16px'};
                    height: ${isMobile ? '14px' : '16px'};
                    border-radius: 50%;
                    background: #3b82f6;
                    border: 2px solid white;
                    cursor: pointer;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    box-shadow: 0 2px 4px rgba(59, 130, 246, 0.3);
                }
                
                /* Estilos específicos para touch */
                @media (pointer: coarse) {
                    &::-webkit-slider-thumb {
                        width: 20px;
                        height: 20px;
                    }
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
                font-size: ${isMobile ? CONFIG.mobile.fontSize.small : CONFIG.styles.fontSize.small};
                color: ${CONFIG.styles.colors.text};
                font-family: var(--font-mono);
                min-width: ${isMobile ? '40px' : '45px'};
                text-align: right;
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
            credits.style.cssText = `
                position: fixed;
                bottom: 20px;
                right: 20px;
                background: ${CONFIG.styles.colors.background};
                color: ${CONFIG.styles.colors.text};
                padding: 12px 20px;
                border-radius: 8px;
                font-size: ${CONFIG.styles.fontSize.small};
                z-index: 9999;
                box-shadow: 0 2px 10px rgba(0,0,0,0.3);
                position: relative;
                overflow: hidden;
                width: fit-content;
            `;

            // Adiciona dois efeitos de borda RGB
            const borderEffect1 = document.createElement('div');
            borderEffect1.style.cssText = `
                position: absolute;
                inset: 0;
                padding: 2px;
                background: linear-gradient(
                    90deg,
                    #ff0000 0%,
                    #00ff00 33%,
                    #0000ff 66%,
                    #ff0000 100%
                );
                background-size: 300% 100%;
                border-radius: 8px;
                opacity: 0.7;
                -webkit-mask: 
                    linear-gradient(#fff 0 0) content-box,
                    linear-gradient(#fff 0 0);
                -webkit-mask-composite: xor;
                mask-composite: exclude;
                animation: borderAnimationRight 3s linear infinite;
            `;

            const borderEffect2 = document.createElement('div');
            borderEffect2.style.cssText = `
                position: absolute;
                inset: 0;
                padding: 2px;
                background: linear-gradient(
                    90deg,
                    #0000ff 0%,
                    #ff0000 33%,
                    #00ff00 66%,
                    #0000ff 100%
                );
                background-size: 300% 100%;
                border-radius: 8px;
                opacity: 0.5;
                -webkit-mask: 
                    linear-gradient(#fff 0 0) content-box,
                    linear-gradient(#fff 0 0);
                -webkit-mask-composite: xor;
                mask-composite: exclude;
                animation: borderAnimationLeft 4s linear infinite;
            `;

            // Adiciona as animações
            const style = document.createElement('style');
            style.textContent = `
                @keyframes borderAnimationRight {
                    0% { background-position: 0% 0; }
                    100% { background-position: 150% 0; }
                }
                @keyframes borderAnimationLeft {
                    0% { background-position: 150% 0; }
                    100% { background-position: 0% 0; }
                }
            `;
            document.head.appendChild(style);

            credits.appendChild(borderEffect1);
            credits.appendChild(borderEffect2);
            document.body.appendChild(credits);

            setTimeout(() => {
                credits.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                credits.style.opacity = '0';
                credits.style.transform = 'translateY(20px)';
                setTimeout(() => credits.remove(), 500);
            }, 5000);
        }

        showTutorialArrow() {
            if (localStorage.getItem(CONFIG.firstRunKey)) return;
            
            const checkAndShowTutorial = () => {
                const tokenControlsText = Array.from(document.querySelectorAll('span')).find(
                    span => span.textContent === 'Token Controls'
                );
                
                if (!tokenControlsText) {
                    setTimeout(checkAndShowTutorial, 500);
                    return;
                }
                
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
                    ${isMobile ? `
                        font-size: ${CONFIG.mobile.fontSize.small};
                        max-width: 180px;
                        padding: 8px 12px;
                    ` : ''}
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

                // Marca como já exibido apenas se a mensagem foi realmente mostrada
                localStorage.setItem(CONFIG.firstRunKey, 'true');
            };

            // Observa cliques no botão Direct Chat
            const directChatButton = document.querySelector('button[aria-controls="component-107"]');
            if (directChatButton) {
                directChatButton.addEventListener('click', () => {
                    setTimeout(checkAndShowTutorial, 500);
                }, { once: true });
            } else {
                // Se não encontrar o botão, tenta mostrar o tutorial mesmo assim
                setTimeout(checkAndShowTutorial, 1000);
            }
        }
    }

    // Inicializa o Token Maximizer quando a página carregar
    if (document.readyState === 'loading') {
        window.addEventListener('load', () => new TokenMaximizer().init());
    } else {
        new TokenMaximizer().init();
    }
})();

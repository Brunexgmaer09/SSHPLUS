// ==UserScript==
// @name         Token Control Android
// @namespace    http://seu-namespace.com
// @version      1.0
// @description  Controle simples de tokens para Android
// @author       BrunexCoder
// @match        *://chat.lmsys.org/*
// @match        *://lmarena.ai/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    class TokenControlAndroid {
        constructor() {
            this.maxTokens = 4096;
            this.init();
        }

        async init() {
            // Aguarda o carregamento da página
            await this.esperarElemento('#component-107');
            this.criarControleToken();
        }

        async esperarElemento(selector) {
            while (!document.querySelector(selector)) {
                await new Promise(resolve => setTimeout(resolve, 500));
            }
            return document.querySelector(selector);
        }

        criarControleToken() {
            // Cria o container principal
            const container = document.createElement('div');
            container.style.cssText = `
                position: fixed;
                bottom: 80px;
                left: 10px;
                right: 10px;
                background: #ffffff;
                padding: 15px;
                border-radius: 10px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.2);
                z-index: 9999;
                display: flex;
                flex-direction: column;
                gap: 10px;
            `;

            // Cria o título
            const titulo = document.createElement('div');
            titulo.textContent = 'Limite de Tokens';
            titulo.style.cssText = `
                font-size: 16px;
                font-weight: bold;
                text-align: center;
            `;

            // Cria o slider
            const slider = document.createElement('input');
            slider.type = 'range';
            slider.min = '1024';
            slider.max = '8192';
            slider.step = '1024';
            slider.value = this.maxTokens;
            slider.style.cssText = `
                width: 100%;
                height: 40px;
                -webkit-appearance: none;
                background: #f0f0f0;
                border-radius: 20px;
                outline: none;
                
                &::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    width: 30px;
                    height: 30px;
                    background: #3b82f6;
                    border-radius: 50%;
                    cursor: pointer;
                }
            `;

            // Cria o label para mostrar o valor
            const valorLabel = document.createElement('div');
            valorLabel.textContent = `${this.maxTokens} tokens`;
            valorLabel.style.cssText = `
                text-align: center;
                font-size: 14px;
                font-weight: bold;
            `;

            // Atualiza os tokens quando o slider muda
            slider.addEventListener('input', (e) => {
                const valor = parseInt(e.target.value);
                valorLabel.textContent = `${valor} tokens`;
                this.atualizarTokens(valor);
            });

            // Monta o controle
            container.appendChild(titulo);
            container.appendChild(slider);
            container.appendChild(valorLabel);
            document.body.appendChild(container);
        }

        atualizarTokens(valor) {
            const inputs = document.querySelectorAll('input[aria-label*="Max output tokens"]');
            inputs.forEach(input => {
                if (input.max < valor) input.max = valor;
                input.value = valor;
                input.dispatchEvent(new Event('input', { bubbles: true }));
                input.dispatchEvent(new Event('change', { bubbles: true }));
            });
        }
    }

    // Inicia o controle quando a página carregar
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => new TokenControlAndroid());
    } else {
        new TokenControlAndroid();
    }
})();

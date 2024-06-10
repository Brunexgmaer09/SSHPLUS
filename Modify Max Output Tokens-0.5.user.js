// ==UserScript==
// @name         Modify Max Output Tokens
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Modifica os elementos Max Output Tokens no site chat.lmsys.org
// @author       Seu Nome
// @match        https://chat.lmsys.org/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Configurações de notificação
    const notificationConfig = {
        duration: 3000, // Duração em milissegundos
        backgroundColor: 'rgba(11, 14, 27, 0.95)',
        textColor: 'white',
        borderRadius: '10px',
        padding: '15px 20px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)',
        fontFamily: 'Arial, sans-serif',
        fontSize: '14px',
        iconSuccess: '✅',
        iconError: '❌'
    };

    let attempts = 0;
    const maxAttempts = 10;
    const initialDelay = 1000; // 1 segundo
    const maxDelay = 10000; // 10 segundos

    /**
     * Calcula o tempo de espera exponencial para a próxima tentativa.
     * @param {number} attempt - Número da tentativa atual.
     * @returns {number} - Tempo de espera em milissegundos.
     */
    function getDelay(attempt) {
        return Math.min(maxDelay, initialDelay * Math.pow(2, attempt));
    }

    /**
     * Exibe uma notificação personalizada na tela.
     * @param {string} message - Mensagem a ser exibida na notificação.
     * @param {boolean} isSuccess - Indica se é uma notificação de sucesso ou erro.
     */
    function showNotification(message, isSuccess = true) {
        const notification = document.createElement('div');
        notification.textContent = `${isSuccess ? notificationConfig.iconSuccess : notificationConfig.iconError} ${message}`;
        notification.style.position = 'fixed';
        notification.style.bottom = '20px';
        notification.style.right = '20px';
        notification.style.backgroundColor = notificationConfig.backgroundColor;
        notification.style.color = notificationConfig.textColor;
        notification.style.padding = notificationConfig.padding;
        notification.style.borderRadius = notificationConfig.borderRadius;
        notification.style.boxShadow = notificationConfig.boxShadow;
        notification.style.zIndex = '9999';
        notification.style.fontFamily = notificationConfig.fontFamily;
        notification.style.fontSize = notificationConfig.fontSize;
        notification.style.transition = 'opacity 0.5s';

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => document.body.removeChild(notification), 500);
        }, notificationConfig.duration);
    }

    /**
     * Modifica os elementos "Max Output Tokens" no site.
     */
    function modifyElements() {
        console.log('Tentando modificar os elementos...');

        // Clica no botão "Direct Chat"
        let directChatButton = document.querySelector('button[role="tab"][aria-controls="component-81"]');
        if (directChatButton) {
            console.log('Clicando no botão Direct Chat...');
            directChatButton.click();
        }

        // Clica na seta para expandir os parâmetros
        setTimeout(function() {
            let expandIcon = document.querySelector('span.icon.svelte-s1r2yt[style*="transform: rotate(0deg)"]');
            if (expandIcon) {
                console.log('Clicando para expandir os parâmetros...');
                expandIcon.click();
            }

            // Aguarda um breve período para garantir que os elementos estejam visíveis
            setTimeout(function() {
                let numberInput = document.querySelector('input[data-testid="number-input"][aria-label="number input for Max output tokens"]');
                let rangeInput = document.getElementById('range_id_11');

                if (numberInput && rangeInput) {
                    console.log('Modificando os elementos...');
                    numberInput.max = 4096;
                    numberInput.value = 4096; // Atualize se necessário
                    numberInput.dispatchEvent(new Event('input', { bubbles: true }));

                    rangeInput.max = 4096;
                    rangeInput.style.backgroundSize = '98.8235% 100%'; // Atualize conforme o valor do input
                    rangeInput.value = 4096; // Atualize se necessário
                    rangeInput.dispatchEvent(new Event('input', { bubbles: true }));

                    console.log('Modificações aplicadas!');
                    showNotification('Modificações aplicadas com sucesso!');
                    return true; // Modificação bem-sucedida
                } else {
                    console.log('Elementos não encontrados, tentando novamente...');
                    retryModifyElements();
                }
            }, 2000); // Aumenta o delay para garantir que os elementos estejam carregados
        }, 2000);
    }

    /**
     * Tenta modificar os elementos novamente com um atraso exponencial.
     */
    function retryModifyElements() {
        if (attempts < maxAttempts) {
            attempts++;
            const delay = getDelay(attempts);
            console.log(`Tentativa ${attempts}, tentando novamente em ${delay / 1000}s...`);
            setTimeout(modifyElements, delay);
        } else {
            console.error('Número máximo de tentativas alcançado. Modificação falhou.');
            showNotification('Número máximo de tentativas alcançado. Modificação falhou.', false);
        }
    }

    /**
     * Observador de mudanças no DOM para reexecutar a modificação se necessário.
     */
    const observer = new MutationObserver(function(mutations, obs) {
        if (document.querySelector('button[role="tab"][aria-controls="component-81"]')) {
            attempts = 0; // Reinicia a contagem de tentativas
            modifyElements();
        }
    });

    // Inicia a modificação após o carregamento da página
    window.addEventListener('load', modifyElements);

    // Observa mudanças no DOM
    observer.observe(document.body, { childList: true, subtree: true });
})();

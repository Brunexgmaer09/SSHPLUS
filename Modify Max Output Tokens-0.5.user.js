// ==UserScript==
// @name         Modify Max Output Tokens
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Modifica os elementos Max Output Tokens no site chat.lmsys.org
// @author       Seu Nome
// @match        https://chat.lmsys.org/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    function modifyElements() {
        // Clica no botão "Direct Chat"
        let directChatButton = document.querySelector('button[role="tab"][aria-controls="component-81"]');
        if (directChatButton) {
            directChatButton.click();
        }

        // Clica na seta para expandir os parâmetros
        setTimeout(function() {
            let expandIcon = document.querySelector('span.icon.svelte-s1r2yt[style*="transform: rotate(0deg)"]');
            if (expandIcon) {
                expandIcon.click();
            }

            // Aguarda um breve período para garantir que os elementos estejam visíveis
            setTimeout(function() {
                let numberInput = document.querySelector('input[data-testid="number-input"][aria-label="number input for Max output tokens"]');
                let rangeInput = document.getElementById('range_id_8');

                if (numberInput) {
                    numberInput.max = 4096;
                    numberInput.value = 4096;
                    numberInput.dispatchEvent(new Event('input', { bubbles: true }));
                }

                if (rangeInput) {
                    rangeInput.max = 4096;
                    rangeInput.style.backgroundSize = '100% 100%';
                    rangeInput.value = 4096;
                    rangeInput.dispatchEvent(new Event('input', { bubbles: true }));
                }
            }, 1500); // increased delay to ensure elements are fully loaded
        }, 500);
    }

    // Executa a função modifyElements após o carregamento da página
    window.addEventListener('load', modifyElements);

    // Observa mudanças no DOM e executa a função modifyElements novamente se necessário
    const observer = new MutationObserver(function(mutations, obs) {
        if (document.querySelector('button[role="tab"][aria-controls="component-81"]')) {
            modifyElements();
            obs.disconnect(); // Stop observing after successful modification to avoid loops
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });
})();
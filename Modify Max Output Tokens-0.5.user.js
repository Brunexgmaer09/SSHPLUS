// ==UserScript==
// @name         lmsys chat only
// @namespace    Apache-2.0
// @version      1.4.3
// @description  When you open the site https://(arena/chat).lmsys.org/ goes to the "Direct Chat" tab makes the model selection blocks, the chat window and the query input block fixed above all other elements.
// @author       Tony 0tis
// @license      Apache-2.0
// @match        *://chat.lmsys.org
// @match        *://arena.lmsys.org
// @icon         https://chat.lmsys.org/favicon.ico
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Ensure the script does not conflict with page's own scripts
    if (localStorage.alertShown) {
        const originalAlert = window.alert;
        window.alert = () => {};
        setTimeout(() => {
            window.alert = originalAlert;
        }, 1000);
    }
    localStorage.alertShown = true;

    class lmsysChat {
        constructor() {
            this.button = null;
            this.tab = null;
            this.mode = null;
            this.timeouts = {};
            this.rangeModified = false;
            this.numberModified = false;

            console.log('start check');
            this.setCss();
            this.setMeta();
            this.setObserver();
            this.setManifest('https://gist.githubusercontent.com/tony-0tis/8cbd21c32e59676078a0394d3b6107db/raw/b3287d6fd5020980fe7ae3fc08cc65ff82aa1b45/manifest.json');
        }

        setMeta() {
            const meta = document.createElement('meta');
            meta.name = 'viewport';
            meta.content = 'width=device-width, initial-scale=1';
            document.head.appendChild(meta);
        }

        setObserver() {
            const observer = new MutationObserver((mutationsList, observer) => {
                for (const mutation of mutationsList) {
                    for (const node of mutation.addedNodes) {
                        if (node.nodeName === 'BUTTON' && node.innerText.includes('Direct Chat')) {
                            console.log('select chat');
                            this.riseChat(node);
                        }
                    }
                }
            });
            observer.observe(document, { attributes: false, childList: true, characterData: false, subtree: true });
            document.addEventListener('beforeunload', () => {
                observer.disconnect();
            });
        }

        async riseChat(button) {
            if (this.mode === 'tabs') {
                return;
            }

            if (!button.classList.contains('selected')) {
                this.button = button;
                button.dispatchEvent(new Event('click'));
                await this._timeout(200);
            }

            const tab = this._find(document, '.tabitem', el => el.style.display === 'block');
            if (!tab) return;
            this.tab = tab;
            this.mode = 'chat';

            if (tab.classList.contains('directChat')) return;
            tab.classList.add('directChat');

            // Continuously try to modify inputs
            this.continuouslyModifyInputs();

            const inputComponent = this._find(tab, '[id="input_box"]', el => el, true);
            if (inputComponent && !inputComponent.classList.contains('directChatInput')) {
                inputComponent.classList.add('directChatInput');
                const button = inputComponent.querySelector('button');
                if (button && !button.classList.contains('directChatSend')) {
                    button.classList.add('directChatSend');
                }
            }

            const descriptionsComponent = this._find(tab, 'button', el => el.innerText.includes('Expand to see the'), true);
            if (descriptionsComponent && !descriptionsComponent.classList.contains('directChatDescriptions')) {
                descriptionsComponent.classList.add('directChatDescriptions');
            }

            const upvoteComponent = this._find(tab, 'button', el => el.innerText.includes('Upvote'), true);
            if (upvoteComponent && !upvoteComponent.classList.contains('directChatVotes')) {
                upvoteComponent.classList.add('directChatVotes');
            }

            const maxTokensComponent = this._find(tab, 'span', el => el.innerText.includes('Max output tokens'), true);
            if (maxTokensComponent) {
                [...maxTokensComponent.querySelectorAll('input')].forEach(el => {
                    el.value = el.max || 1096;
                });
            }

            const parametrs = this._find(tab, 'span', el => el.innerText.includes('Parameters'));
            if (parametrs) {
                parametrs.innerText += ' (Fine tuning)';
            }

            const selector = tab.querySelector('[role="listbox"]');
            if (selector && !tab.querySelector('.chatModeSwitcher')) {
                const button = document.createElement('button');
                button.classList.add('chatModeSwitcher');
                button.addEventListener('click', e => this._switchChatMode(e));
                button.innerHTML = '🪟';
                button.title = 'Switch fullscreen/tabs';
                selector.parentNode.insertBefore(button, selector);

                while (!tab.querySelector('.progress-text')) {
                    await this._timeout(null, 'progress');
                }

                while (tab.querySelector('.progress-text')) {
                    await this._timeout(null, 'progress');
                }

                let model = localStorage.getItem('lmsysChatModel');
                if (model) {
                    this.model = model;
                    if (model !== selector.value) {
                        selector.dispatchEvent(new Event('focus'));
                        await this._timeout(50, 'progress');

                        const select = tab.querySelector(`[aria-label="${model}"]`);
                        if (select) {
                            console.log('change selected model to', select.innerText);
                            select.dispatchEvent(new Event('mousedown', { bubbles: true }));
                        }
                    }
                }
                setInterval(() => this._changeModel(selector), 500);
            }
        }

        _switchChatMode(e) {
            if (!this.tab) return;
            if (this.tab.classList.contains('directChat')) {
                this.mode = 'tabs';
                this.tab.classList.remove('directChat');
                document.querySelector('html').style.overflow = 'auto';
            } else {
                this.mode = 'chat';
                this.tab.classList.add('directChat');
                document.querySelector('html').style.overflow = 'hidden';
            }
        }

        _changeModel(selector) {
            if (!this.tab) return;
            if (selector.value === this.model) return;
            this.model = selector.value;
            localStorage.setItem('lmsysChatModel', selector.value);
            console.log('save selected model to:', selector.value);
        }

        _find(doc, where, filter, findParentComponent) {
            let el = [...doc.querySelectorAll(where)].filter(filter)[0];

            if (findParentComponent) {
                let s = el.parentNode;
                while (s) {
                    if (s.id?.includes('component')) {
                        break;
                    }
                    s = s.parentNode;
                }
                if (s) {
                    el = s;
                }
            }
            return el;
        }

        _timeout(timeout = 200, name = 'default') {
            clearTimeout(this.timeouts[name]);

            return new Promise(resolve => {
                this.timeouts[name] = setTimeout(resolve, timeout);
            });
        }

        setManifest(manifestUrl) {
            const manifest = document.createElement('link');
            manifest.rel = 'manifest';
            manifest.href = manifestUrl;
            document.head.appendChild(manifest);
        }

        setCss() {
            const css = document.createElement('style');
            css.innerHTML = `
html{
    overflow: hidden;
}
.directChat{
    position: fixed !important;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
    z-index: 1000;
    padding: 5px !important;
    background: var(--body-background-fill);
}
.directChat>div{
    gap: 7px !important;
    height: 100%;
    max-width: 900px;
    margin: 0 auto;
}
.directChat #share-region-named, .directChat #share-region-named>div{
    height: 100%;
}
.directChat #notice_markdown, .directChat #ack_markdown{
    display: none;
}
.directChat .directChatSend{
    min-width: 90px !important;
}
.directChat .options{
    max-height: calc(100vh - 150px) !important;
}
.directChat .directChatDescriptions{
    display: none;
}
.directChat .directChatVotes{
    gap: 5px;
}
.directChat .directChatVotes>button{
    min-width: auto;
    padding: 5px;
    line-height: 1;
}
.directChat .directChatInput{
    gap: 5px;
}
.directChat #chatbot{
    height: 100% !important;
}
.directChat #input_box{
    padding: 0;
}
.chatModeSwitcher {
    padding: 8px !important;
    border-radius: 3px !important;
    background: #f36812 !important;
    margin: -6px 0 !important;
    margin-left: -12px !important;
    width: 55px !important;
    margin-right: 10px !important;
}
.chatModeSwitcher:hover{
    opacity: 0.8;
}
`;
            document.head.appendChild(css);
        }

        continuouslyModifyInputs() {
            const simulateHumanInput = (input, value) => {
                input.focus();
                input.value = '';
                const valueStr = value.toString();
                for (const char of valueStr) {
                    input.value += char;
                    input.dispatchEvent(new Event('input', { bubbles: true }));
                    input.dispatchEvent(new Event('change', { bubbles: true }));
                }
                input.blur();
            };

            const modifyInputs = () => {
                const rangeInput = document.getElementById('range_id_8');
                if (rangeInput && rangeInput.max != 4048) {
                    rangeInput.max = 4048;
                    rangeInput.style.backgroundSize = '98.8235% 100%';
                    this.rangeModified = true;
                    console.log('Range input modified:', rangeInput);
                }

                const numberInput = document.querySelector('input[type="number"][aria-label="number input for Max output tokens"]');
                if (numberInput && numberInput.max != 4048) {
                    simulateHumanInput(numberInput, 4048);
                    this.numberModified = true;
                    console.log('Number input modified:', numberInput);
                }

                if (!this.rangeModified || !this.numberModified) {
                    requestAnimationFrame(modifyInputs);
                }
            };

            modifyInputs();
        }
    }

    new lmsysChat();
})();

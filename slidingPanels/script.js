// Define a new custom element
class slidingPanels extends HTMLElement {
    constructor() {
        super();

        // Attach a shadow DOM tree to this element
        const shadow = this.attachShadow({ mode: 'open' });

        // Create the container
        const panelContainer = document.createElement('div');
        panelContainer.setAttribute('class', 'panel-container');

        // Create panels
        const panels = [];
        const panelData = [
            { id: 1, color: '#6a00f4', isActive: false },
            { id: 2, color: '#a100f2', isActive: true },
            { id: 3, color: '#d100d1', isActive: false },
            { id: 4, color: '#f20089', isActive: false }
        ];

        // Create all panels
        panelData.forEach(data => {
            const panel = document.createElement('div');
            panel.setAttribute('class', data.isActive ? 'panel active' : 'panel minimized');
            panel.setAttribute('data-panel', data.id);
            panel.style.backgroundColor = data.color;

            // Set initial fixed widths instead of using flex
            panel.style.width = data.isActive ? 'calc(100% - 120px)' : '40px';
            panel.style.transition = 'width 0.5s ease-in-out';

            const panelContent = document.createElement('div');
            panelContent.setAttribute('class', 'panel-content');
            panelContent.innerHTML = `<slot name="panel${data.id}-content">Content ${data.id}</slot>`;

            const panelLabel = document.createElement('div');
            panelLabel.setAttribute('class', 'panel-label');
            panelLabel.innerHTML = `<slot name="panelLabel${data.id}-content">Label ${data.id}</slot>`;

            panel.appendChild(panelContent);
            panel.appendChild(panelLabel);
            panelContainer.appendChild(panel);
            panels.push(panel);
        });

        // Style element
        const style = document.createElement('style');
        style.textContent = `
            :host {
                display: block;
                width: 100%;
            }
            
            .panel-container {
                display: flex;
                width: 100%;
                height: 40vh;
                overflow: hidden;
                gap: 0.2em;
                padding: 0.2em;
            }
            
            .panel {
                position: relative;
                height: 100%;
                border-radius: 2em;
                overflow: hidden;
                cursor: pointer;
            }
            
            .panel-content {
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-size: 24px;
                font-weight: bold;
                opacity: 0;
                transition: opacity 0.3s ease-in-out;
                box-sizing: border-box;
                overflow: hidden;
                white-space: nowrap; /* Prevent text from wrapping */
                text-overflow: ellipsis; /* Add ellipsis for overflowing text */
            }
            
            .panel.active .panel-content {
                opacity: 1;
                white-space: normal; /* Allow text to wrap when panel is active */
            }
            
            .panel-label {
                cursor: default;
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                /* writing-mode: vertical-rl;
                text-orientation: mixed;
                transform: rotate(180deg); */
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-weight: 600;
                opacity: 0;
                transition: opacity 0.2s ease-in-out;
                box-sizing: border-box;
            }
            
            .panel.minimized .panel-label {
                opacity: 1;
                cursor: pointer;
            }
            
            /* Add a container for slots to better control content */
            ::slotted(*) {
                max-width: 100%;
                transition: all 0.5s ease-in-out;
                overflow: hidden;
            }
            
            .panel.minimized .panel-content ::slotted(*) {
                transform: scale(0.5);
                opacity: 0;
                transform-origin: center;
            }
        `;

        // Append to shadow DOM
        shadow.appendChild(style);
        shadow.appendChild(panelContainer);

        // Save for later
        this.panels = panels;
        this.panelContainer = panelContainer;
    }

    // This method is called when the element is added to the DOM
    connectedCallback() {
        this.panels.forEach(panel => {
            panel.addEventListener('click', () => {
                // Don't do anything if the panel is already active
                if (panel.classList.contains('active')) return;

                // Get current active panel
                const activePanel = this.shadowRoot.querySelector('.panel.active');

                // Calculate widths
                const containerWidth = this.panelContainer.offsetWidth;
                const newActiveWidth = containerWidth - ((this.panels.length - 1) * 40) - ((this.panels.length - 1) * 4); // 40px for each minimized panel, 4px for gaps

                // Update classes first, before changing widths
                activePanel.classList.remove('active');
                activePanel.classList.add('minimizing'); // Special class for transition

                panel.classList.remove('minimized');
                panel.classList.add('activating'); // Special class for transition

                // Add a small delay to allow the content transition to start first
                setTimeout(() => {
                    // Set widths explicitly - this avoids the layout jump
                    activePanel.style.width = '40px';
                    panel.style.width = `${newActiveWidth}px`;

                    // After the width transition is done, update the final classes
                    setTimeout(() => {
                        activePanel.classList.remove('minimizing');
                        activePanel.classList.add('minimized');

                        panel.classList.remove('activating');
                        panel.classList.add('active');
                    }, 500); // Match transition duration
                }, 10);
            });
        });

        // Make sure the initial state is correct
        this.updatePanelWidths();

        // Handle window resize
        window.addEventListener('resize', () => {
            this.updatePanelWidths();
        });
    }

    updatePanelWidths() {
        const containerWidth = this.panelContainer.offsetWidth;
        const activeWidth = containerWidth - ((this.panels.length - 1) * 40) - ((this.panels.length - 1) * 4);

        this.panels.forEach(panel => {
            if (panel.classList.contains('active')) {
                panel.style.width = `${activeWidth}px`;
            } else {
                panel.style.width = '40px';
            }
        });
    }
}

// Register the new element with the browser
customElements.define('sliding-panels', slidingPanels);
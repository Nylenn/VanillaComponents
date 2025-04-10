// Define a new custom element
class lightDarkMode extends HTMLElement {
    constructor() {
        super();

        // Attach a shadow DOM tree to this element
        const shadow = this.attachShadow({ mode: 'open' });

        const width = this.getAttribute('width') || '5em';
        const height = this.getAttribute('height') || '2em';

        shadow.host.style.setProperty('--width', width);
        shadow.host.style.setProperty('--height', height);

        // Create elements inside the shadow DOM
        const wrapper = document.createElement('div');
        wrapper.setAttribute('class', 'wrapper');

        const ball = document.createElement('div');
        ball.setAttribute('class', 'ball');

        const style = document.createElement('style');
        style.textContent = `
            @import url('lightDarkMode.css');
      `;

        wrapper.addEventListener('click', () => {
            wrapper.classList.toggle('toggled');
        });


        // Attach elements to the shadow DOM
        shadow.appendChild(style);
        shadow.appendChild(wrapper);
        wrapper.appendChild(ball);

    }
}

// Register the new element with the browser
customElements.define('light-dark-mode-switch', lightDarkMode);
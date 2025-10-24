/*
 * REAL-TIME ANNOUNCEMENT BAR (Vytvořeno v čistém JavaScriptu)
 * Tento skript dynamicky vytvoří banner, CSS styly a pravidelně kontroluje
 * Google Tabulky pro aktualizace zprávy.
 */

(function() {
    // =================================================================================
    // 1. NASTAVENÍ
    // =================================================================================

    // Váš CSV odkaz na Google Tabulku (musí být PŘESNĚ ten, který končí na output=csv)
    const GOOGLE_SHEET_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vR5BgXmq_BcwoUWr7eV5f6rr3E8VfxCVXMpCbdFwVY8wfuEf2JU6qOjfwA26AHSLqYh8vLucERyYb2r/pub?gid=0&single=true&output=csv';
    
    // Interval kontroly Tabulky v milisekundách (10000ms = 10 sekund)
    const CHECK_INTERVAL = 10000; 

    // Čas, po kterém banner automaticky zmizí (10000ms = 10 sekund)
    const DISPLAY_DURATION = 10000; 

    // =================================================================================
    // 2. STYLOVÁNÍ (CSS)
    // =================================================================================

    const STYLE_ID = 'announcement-bar-style';
    if (!document.getElementById(STYLE_ID)) {
        const style = document.createElement('style');
        style.id = STYLE_ID;
        style.innerHTML = `
            #realtime-announcement-bar {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                background-color: #007bff;
                color: white;
                text-align: center;
                padding: 10px 20px;
                z-index: 99999;
                font-family: Arial, sans-serif;
                font-size: 16px;
                font-weight: bold;
                display: none;
                opacity: 0;
                transition: opacity 0.5s ease-in-out;
                box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
                cursor: default; /* Změněno z 'pointer' na 'default' */
            }
            #realtime-announcement-bar strong {
                color: #ffc107;
                margin-right: 5px;
            }
        `;
        document.head.appendChild(style);
    }

    // =================================================================================
    // 3. GENERACE HTML A LOGIKA
    // =================================================================================

    // Vytvoří HTML element banneru
    const messageBar = document.createElement('div');
    messageBar.id = 'realtime-announcement-bar';
    document.body.appendChild(messageBar);
    
    let hideTimeoutId;
    let currentMessage = '';

    function hideMessage() {
        messageBar.style.opacity = '0';
        clearTimeout(hideTimeoutId);
        // Počkejte na dokončení CSS přechodu (0.5s)
        setTimeout(() => {
            messageBar.style.display = 'none';
        }, 500); 
    }

    function showMessage(text) {
        // Vytvoří finální text zprávy s prefixem "Smilos:"
        messageBar.innerHTML = `<strong>Smilos:</strong> ${text}`;
        
        // Zobrazí a zprůhlední banner
        messageBar.style.display = 'block';
        setTimeout(() => {
            messageBar.style.opacity = '1';
        }, 10);
        
        // Zruší předchozí časovač a nastaví nový na 10 sekund
        clearTimeout(hideTimeoutId);
        hideTimeoutId = setTimeout(hideMessage, DISPLAY_DURATION);
    }

    async function checkNewMessage() {
        try {
            // Používá cache: 'no-store', aby vždy stáhl nejnovější data z Google Sheets
            const response = await fetch(GOOGLE_SHEET_URL, { cache: 'no-store' }); 
            if (!response.ok) throw new Error('Chyba při stahování CSV.');
            
            const csvText = await response.text();

            // Extrakce textu z první buňky (A1)
            const newMessage = csvText.split('\n')[0].trim().replace(/"/g, '');

            if (newMessage && newMessage !== currentMessage) {
                // Nová zpráva byla nalezena
                currentMessage = newMessage;
                showMessage(currentMessage);

            } else if (!newMessage && currentMessage) {
                // Zpráva v Tabulkách byla smazána/vyprázdněna
                currentMessage = '';
                hideMessage();
            }

        } catch (error) {
            console.error('Chyba při kontrole oznámení (možná CORS).', error);
            // Při chybě se banner skryje, aby nezůstala viset stará zpráva
            if (currentMessage) hideMessage();
        }
    }

    // Spustí kontrolu okamžitě při načtení stránky a pak v nastaveném intervalu
    checkNewMessage();
    setInterval(checkNewMessage, CHECK_INTERVAL);
})();

// --- KÓD KE SPUŠTĚNÍ VE ZNAČCE <script> ---

(function() {
    // ----------------------------------------------------------------------
    // HLAVNÍ NASTAVENÍ: ŘÍZENÍ KÓDEM
    // Změňte 'true' pro aktivaci disco efektu a hudby.
    // Změňte 'false' pro úplnou neaktivitu.
    const IS_ENABLED = true; 
    
    // Nastavení rychlosti
    const COLOR_CHANGE_INTERVAL = 500; // Mění barvu každých 500 ms (0.5 sekundy)
    const TRANSITION_DURATION = '1s';  // CSS přechod trvá 1 sekundu (zjemňuje změnu)
    // ----------------------------------------------------------------------

    // Pokud je IS_ENABLED nastaveno na false, kód se okamžitě ukončí.
    if (!IS_ENABLED) {
        return; 
    }

    // 1. ZÁKLADNÍ NASTAVENÍ
    const body = document.body;

    // Nastaví plynulý přechod, aby změna barvy nebyla ostrá
    body.style.transition = `background-color ${TRANSITION_DURATION} ease-in-out`;
    
    // --- Hudební část ---
    // POZNÁMKA: Nahraďte 'music_url.mp3' funkční URL k vašemu hudebnímu souboru.
    const audioUrl = 'https://spamsmilosakrfgd55.github.io/files/hravka/music/crabs.mp3'; // ZMĚŇTE NA VAŠI HUDBU!
    const discoMusic = document.createElement('audio');
    discoMusic.id = 'discoMusic';
    discoMusic.loop = true;
    const source = document.createElement('source');
    source.src = audioUrl;
    source.type = 'audio/mpeg';
    discoMusic.appendChild(source);
    body.appendChild(discoMusic);
    
    // 2. LOGIKA DISCO EFEKTU (Měnění pozadí)
    let discoInterval = null;

    function getRandomColor() {
        const r = Math.floor(Math.random() * 256);
        const g = Math.floor(Math.random() * 256);
        const b = Math.floor(Math.random() * 256);
        // Barva s plnou sytostí pro maximální disco efekt
        return `rgb(${r}, ${g}, ${b})`; 
    }

    function startDiscoEffect() {
        if (discoInterval) return;

        // Spustí měnění barvy pozadí s nastaveným intervalem
        discoInterval = setInterval(() => {
            body.style.backgroundColor = getRandomColor();
        }, COLOR_CHANGE_INTERVAL); 
    }

    // 3. LOGIKA HUDBY
    function playMusic() {
        discoMusic.volume = 0.5;
        const playPromise = discoMusic.play();
        if (playPromise !== undefined) {
            playPromise.catch(error => {
                console.log("err");
            });
        }
    }

    // 4. INICIALIZACE
    
    // Spuštění disco efektu
    startDiscoEffect();
    
    // Pokus o spuštění hudby
    playMusic();
    
    // Přidání posluchače, který se pokusí spustit hudbu při první interakci
    // (pro překonání omezení automatického přehrávání).
    document.addEventListener('click', function attemptPlay() {
        if (discoMusic.paused) {
            playMusic();
            // Po úspěšném spuštění (nebo pokusu) posluchače odebereme
            document.removeEventListener('click', attemptPlay);
        }
    }, { once: true });

})();

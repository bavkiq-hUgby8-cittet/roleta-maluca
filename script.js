/**
 * Roleta Maluca - Edição Carnaval
 * Script principal para gerenciar a aplicação
 */

// Configuração do Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBQ5czr0wUqNxyqU9X_WHO3DrHOYEAPf7M",
    authDomain: "opoderdodedo.firebaseapp.com",
    databaseURL: "https://opoderdodedo-default-rtdb.firebaseio.com",
    projectId: "opoderdodedo",
    storageBucket: "opoderdodedo.appspot.com",
    messagingSenderId: "931089125837",
    appId: "1:931089125837:web:fa22ae36bd206f28cf7484",
    measurementId: "G-6YE1KQ0VQC"
};

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();
const storage = firebase.storage();

// ===== Estado e Dados do Jogo =====
const APP = {
    // Estado do jogo
    state: {
        currentRoom: null,
        currentPlayer: null,
        playersQueue: [],
        spinDuration: 5, // segundos
        playMode: "organizer", // "organizer" ou "player"
        isSpinning: false,
        selectedOption: null,
        selectedAnswer: null,
        photoTaken: false
    },
    
    // Dados dos desafios e perguntas
    gameData: {
        options: [
            // Opções de Bebida (10 faces)
            { type: "bebida", text: "Beber uma dose.", color: "#f44336", icon: "glass-whiskey" },
            { type: "bebida", text: "Escolher alguém para beber uma dose.", color: "#e91e63", icon: "hand-point-right" },
            { type: "bebida", text: "Beber duas doses.", color: "#9c27b0", icon: "glass-cheers" },
            { type: "bebida", text: "Escolher duas pessoas para beberem uma dose.", color: "#673ab7", icon: "users" },
            { type: "bebida", text: "Brindar com alguém e ambos bebem uma dose.", color: "#3f51b5", icon: "wine-glass" },
            { type: "bebida", text: "Beber uma dose de olhos fechados.", color: "#2196f3", icon: "eye-slash" },
            { type: "bebida", text: "Beber uma dose sem fazer careta.", color: "#03a9f4", icon: "smile-beam" },
            { type: "bebida", text: "Beber uma dose de um gole só.", color: "#00bcd4", icon: "tint" },
            { type: "bebida", text: "Dê uma dose para alguém que ainda não bebeu.", color: "#009688", icon: "search" },
            { type: "bebida", text: "Beber se errar a próxima pergunta.", color: "#4caf50", icon: "question-circle" },

            // Perguntas de Conhecimento (10 faces)
            { 
                type: "pergunta", 
                text: "Qual é a capital do Japão?", 
                options: ["Pequim", "Tóquio", "Seul", "Bangkok"], 
                answer: 1, 
                color: "#8bc34a", 
                icon: "globe-asia" 
            },
            { 
                type: "pergunta", 
                text: "Qual é o maior oceano do mundo?", 
                options: ["Oceano Índico", "Oceano Atlântico", "Oceano Pacífico", "Oceano Ártico"], 
                answer: 2, 
                color: "#cddc39", 
                icon: "water" 
            },
            { 
                type: "pergunta", 
                text: "Qual é o símbolo químico do ouro?", 
                options: ["Au", "Ag", "Fe", "Hg"], 
                answer: 0, 
                color: "#ffeb3b", 
                icon: "atom" 
            },
            { 
                type: "pergunta", 
                text: "Qual é o maior planeta do sistema solar?", 
                options: ["Marte", "Júpiter", "Saturno", "Netuno"], 
                answer: 1, 
                color: "#ffc107", 
                icon: "planet-ringed" 
            },
            { 
                type: "pergunta", 
                text: "Quem pintou a Mona Lisa?", 
                options: ["Pablo Picasso", "Leonardo da Vinci", "Michelangelo", "Salvador Dalí"], 
                answer: 1, 
                color: "#ff9800", 
                icon: "palette" 
            },
            { 
                type: "pergunta", 
                text: "Qual é o símbolo químico da água?", 
                options: ["H2O", "CO2", "O2", "NH3"], 
                answer: 0, 
                color: "#ff5722", 
                icon: "tint" 
            },
            { 
                type: "pergunta", 
                text: "Qual é o animal mais rápido do mundo?", 
                options: ["Guepardo", "Falcão-peregrino", "Tubarão-mako", "Cavalo árabe"], 
                answer: 0, 
                color: "#795548", 
                icon: "running" 
            },
            { 
                type: "pergunta", 
                text: "Qual é o menor país do mundo?", 
                options: ["Mônaco", "Malta", "Vaticano", "Liechtenstein"], 
                answer: 2, 
                color: "#9e9e9e", 
                icon: "flag" 
            },
            { 
                type: "pergunta", 
                text: "Quanto é 25 + 37 ÷ 2?", 
                options: ["31", "44.5", "50", "35"], 
                answer: 1, 
                color: "#607d8b", 
                icon: "calculator" 
            },
            { 
                type: "pergunta", 
                text: "Qual é a velocidade da luz?", 
                options: ["300.000 km/s", "150.000 km/s", "500.000 km/s", "100.000 km/s"], 
                answer: 0, 
                color: "#795548", 
                icon: "bolt" 
            },

            // Desafios e Prendas (10 faces)
            { type: "desafio", text: "Fazer uma pose de yoga.", color: "#e91e63", icon: "spa" },
            { type: "desafio", text: "Fazer uma dança engraçada por 30 segundos.", color: "#9c27b0", icon: "music" },
            { type: "desafio", text: "Imitar um animal.", color: "#673ab7", icon: "paw" },
            { type: "desafio", text: "Fazer uma pose de modelo.", color: "#3f51b5", icon: "camera" },
            { type: "desafio", text: "Imitar um robô.", color: "#2196f3", icon: "robot" },
            { type: "desafio", text: "Cantar um trecho de uma música.", color: "#03a9f4", icon: "microphone" },
            { type: "desafio", text: "Fazer um elogio para alguém da festa usando o microfone.", color: "#00bcd4", icon: "heart" },
            { type: "desafio", text: "Pular de um pé só por 15 segundos.", color: "#009688", icon: "shoe-prints" },
            { type: "desafio", text: "Fazer uma saudação engraçada.", color: "#4caf50", icon: "hand-spock" },
            { type: "desafio", text: "Fazer uma pose de super-herói.", color: "#8bc34a", icon: "mask" }
        ]
    },
    
    // Elementos do DOM
    elements: {
        // Telas
        preloader: document.getElementById("preloader"),
        welcomeScreen: document.getElementById("welcome-screen"),
        organizerScreen: document.getElementById("organizer-screen"),
        playerScreen: document.getElementById("player-screen"),
        
        // Botões de boas-vindas
        createRoomBtn: document.getElementById("create-room-btn"),
        joinRoomBtn: document.getElementById("join-room-btn"),
        
        // Informações da sala
        roomCode: document.getElementById("room-code"),
        copyRoomCodeBtn: document.getElementById("copy-room-code"),
        qrcodeContainer: document.getElementById("qrcode-container"),
        playerRoomCode: document.getElementById("player-room-code"),
        
        // Roleta e controles
        wheel: document.getElementById("wheel"),
        spinBtn: document.getElementById("spin-btn"),
        playerSpinBtn: document.getElementById("player-spin-btn"),
        spinDurationInput: document.getElementById("spin-duration"),
        spinDurationValue: document.getElementById("spin-duration-value"),
        
        // Controles de modo
        organizerModeBtn: document.getElementById("organizer-mode"),
        playerModeBtn: document.getElementById("player-mode"),
        
        // Controles de jogadores
        nextPlayerBtn: document.getElementById("next-player-btn"),
        skipPlayerBtn: document.getElementById("skip-player-btn"),
        seePhotosBtn: document.getElementById("see-photos-btn"),
        
        // Contagem de jogadores
        playersCount: document.getElementById("players-count"),
        
        // Animação do jogador
        playerAnimation: document.getElementById("player-animation"),
        currentPlayerPhoto: document.getElementById("current-player-photo"),
        currentPlayerName: document.getElementById("current-player-name"),
        playerStatus: document.getElementById("player-status"),
        
        // Fila de jogadores
        playersQueue: document.getElementById("players-queue"),
        
        // Resultado
        resultDisplay: document.getElementById("result-display"),
        resultTitle: document.getElementById("result-title"),
        resultText: document.getElementById("result-text"),
        clearResultBtn: document.getElementById("clear-result-btn"),
        
        // Formulário de cadastro
        playerName: document.getElementById("player-name"),
        webcam: document.getElementById("webcam"),
        canvas: document.getElementById("canvas"),
        captureBtn: document.getElementById("capture-btn"),
        recaptureBtn: document.getElementById("recapture-btn"),
        joinQueueBtn: document.getElementById("join-queue-btn"),
        
        // Telas de espera e vez de jogar
        playerRegistrationForm: document.getElementById("player-registration-form"),
        playerWaiting: document.getElementById("player-waiting"),
        playerTurn: document.getElementById("player-turn"),
        queuePosition: document.getElementById("queue-position"),
        
        // Tela de resultado do jogador
        playerResult: document.getElementById("player-result"),
        playerResultTitle: document.getElementById("player-result-title"),
        playerResultContent: document.getElementById("player-result-content"),
        playerCompleteBtn: document.getElementById("player-complete-btn"),
        
        // Modais
        challengeModal: document.getElementById("challenge-modal"),
        photosModal: document.getElementById("photos-modal"),
        roomEntryModal: document.getElementById("room-entry-modal"),
        resetConfirmationModal: document.getElementById("reset-confirmation-modal"),
        
        // Conteúdo do modal de desafio
        challengeType: document.getElementById("challenge-type"),
        challengeText: document.getElementById("challenge-text"),
        questionOptions: document.getElementById("question-options"),
        completeChallenge: document.getElementById("complete-challenge-btn"),
        
        // Galeria de fotos
        photosGallery: document.getElementById("photos-gallery"),
        refreshGalleryBtn: document.getElementById("refresh-gallery-btn"),
        downloadGalleryBtn: document.getElementById("download-gallery-btn"),
        
        // Modal de entrada na sala
        roomCodeInput: document.getElementById("room-code-input"),
        enterRoomBtn: document.getElementById("enter-room-btn"),
        startScannerBtn: document.getElementById("start-scanner-btn"),
        qrScanner: document.getElementById("qr-scanner"),
        
        // Modal de reinício
        confirmResetBtn: document.getElementById("confirm-reset-btn"),
        cancelResetBtn: document.getElementById("cancel-reset-btn"),
        
        // Botões de fechar modais
        closeModal: document.getElementById("close-modal"),
        closePhotosModal: document.getElementById("close-photos-modal"),
        closeRoomEntryModal: document.getElementById("close-room-entry-modal"),
        closeResetModal: document.getElementById("close-reset-modal"),
        
        // Container de notificações
        toastContainer: document.getElementById("toast-container"),
        
        // Elementos decorativos
        confettiContainer: document.querySelector(".confetti-container")
    }
};

// ===== Inicialização da Aplicação =====
document.addEventListener("DOMContentLoaded", () => {
    // Criar animação de confete
    createConfetti();
    
    // Inicializar após pequena espera (para dar tempo de carregar os recursos)
    setTimeout(() => {
        // Esconder preloader
        APP.elements.preloader.style.opacity = "0";
        setTimeout(() => {
            APP.elements.preloader.classList.add("hidden");
        }, 500);
        
        // Configurar eventos
        setupEventListeners();
        
        // Criar seções da roleta
        createWheelSections();
        
        // Verificar parâmetros da URL
        checkUrlParams();
    }, 1000);
});

// ===== Configuração de Animações =====

// Criar a animação de confetti
function createConfetti() {
    const colors = [
        "#9933ff", // Roxo
        "#ff3399", // Rosa
        "#ffcc00", // Amarelo
        "#33ccff", // Azul
        "#ff6600", // Laranja
        "#00cc99"  // Verde
    ];
    
    const confettiCount = 50;
    const confettiContainer = APP.elements.confettiContainer;
    
    // Limpar container
    confettiContainer.innerHTML = "";
    
    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement("div");
        confetti.className = "confetti";
        
        // Propriedades aleatórias
        const size = Math.random() * 10 + 5; // Entre 5 e 15 pixels
        const color = colors[Math.floor(Math.random() * colors.length)];
        const left = Math.random() * 100; // Posição horizontal aleatória (%)
        
        // Duração da animação entre 3 e 8 segundos
        const fallDuration = Math.random() * 5 + 3;
        const shakeDuration = Math.random() * 3 + 2;
        
        // Delay aleatório para iniciar a animação (para não começarem todas ao mesmo tempo)
        const delay = Math.random() * 5;
        
        // Aplicar estilos
        confetti.style.width = `${size}px`;
        confetti.style.height = `${size}px`;
        confetti.style.backgroundColor = color;
        confetti.style.left = `${left}%`;
        confetti.style.animationDuration = `${fallDuration}s, ${shakeDuration}s`;
        confetti.style.animationDelay = `${delay}s`;
        
        // Formas diferentes
        const shapes = ["50%", "0%", "50% 0 50% 50%"]; // Círculo, quadrado, triângulo
        confetti.style.borderRadius = shapes[Math.floor(Math.random() * shapes.length)];
        
        confettiContainer.appendChild(confetti);
    }
}

// Criar seções da roleta
function createWheelSections() {
    // Limpar a roleta
    APP.elements.wheel.innerHTML = "";
    
    const totalSections = APP.gameData.options.length;
    const degreePerSection = 360 / totalSections;
    
    for (let i = 0; i < totalSections; i++) {
        const option = APP.gameData.options[i];
        const section = document.createElement("div");
        section.className = "wheel-section";
        section.style.transform = `rotate(${i * degreePerSection}deg)`;
        
        const inner = document.createElement("div");
        inner.className = "wheel-section-inner";
        inner.style.transform = `rotate(${degreePerSection}deg)`;
        inner.style.backgroundColor = option.color;
        
        const content = document.createElement("div");
        content.className = "wheel-section-content";
        
        // Conteúdo diferente para cada tipo
        let contentHTML = "";
        if (option.type === "bebida") {
            contentHTML = `<i class="fas fa-${option.icon}"></i><br>${option.text}`;
        } else if (option.type === "pergunta") {
            contentHTML = `<i class="fas fa-${option.icon}"></i><br>Pergunta`;
        } else {
            contentHTML = `<i class="fas fa-${option.icon}"></i><br>${option.text}`;
        }
        
        content.innerHTML = contentHTML;
        
        inner.appendChild(content);
        section.appendChild(inner);
        APP.elements.wheel.appendChild(section);
    }
}

// ===== Configurar Eventos =====
function setupEventListeners() {
    // === Botões de navegação ===
    
    // Boas-vindas
    APP.elements.createRoomBtn.addEventListener("click", createRoom);
    APP.elements.joinRoomBtn.addEventListener("click", showRoomEntryModal);
    
    // Cópia do código da sala
    APP.elements.copyRoomCodeBtn.addEventListener("click", copyRoomCode);
    
    // === Controles do Jogo ===
    
    // Girar roleta
    APP.elements.spinBtn.addEventListener("click", spinWheel);
    APP.elements.playerSpinBtn.addEventListener("click", () => spinWheel("player"));
    
    // Controle de duração do giro
    APP.elements.spinDurationInput.addEventListener("input", updateSpinDuration);
    
    // Modo de jogo
    APP.elements.organizerModeBtn.addEventListener("click", () => setPlayMode("organizer"));
    APP.elements.playerModeBtn.addEventListener("click", () => setPlayMode("player"));
    
    // Controle de jogadores
    APP.elements.nextPlayerBtn.addEventListener("click", nextPlayer);
    APP.elements.skipPlayerBtn.addEventListener("click", skipPlayer);
    
    // Galeria de fotos
    APP.elements.seePhotosBtn.addEventListener("click", showPhotosGallery);
    APP.elements.refreshGalleryBtn.addEventListener("click", refreshPhotosGallery);
    APP.elements.downloadGalleryBtn.addEventListener("click", downloadGallery);
    
    // Resultado
    APP.elements.clearResultBtn.addEventListener("click", hideResult);
    
    // === Controles do Jogador ===
    
    // Captura de foto
    APP.elements.captureBtn.addEventListener("click", capturePhoto);
    APP.elements.recaptureBtn.addEventListener("click", setupWebcam);
    
    // Entrar na fila
    APP.elements.joinQueueBtn.addEventListener("click", joinQueue);
    
    // Completar desafio (jogador)
    APP.elements.playerCompleteBtn.addEventListener("click", completePlayerChallenge);
    
    // === Modais ===
    
    // Entrada na sala
    APP.elements.enterRoomBtn.addEventListener("click", joinRoom);
    APP.elements.startScannerBtn.addEventListener("click", startQRCodeScanner);
    APP.elements.closeRoomEntryModal.addEventListener("click", () => hideModal("roomEntry"));
    
    // Desafio
    APP.elements.completeChallenge.addEventListener("click", completeChallenge);
    APP.elements.closeModal.addEventListener("click", () => hideModal("challenge"));
    
    // Fotos
    APP.elements.closePhotosModal.addEventListener("click", () => hideModal("photos"));
    
    // Modal de reinício
    APP.elements.resetGameBtn = document.getElementById("reset-game-btn");
    APP.elements.resetGameBtn.addEventListener("click", () => showModal("resetConfirmation"));
    
    APP.elements.confirmResetBtn.addEventListener("click", () => {
        resetGame();
        hideModal("resetConfirmation");
    });
    
    APP.elements.cancelResetBtn.addEventListener("click", () => hideModal("resetConfirmation"));
    APP.elements.closeResetModal.addEventListener("click", () => hideModal("resetConfirmation"));
}

// ===== Funções de Navegação entre Telas =====
function showScreen(screen) {
    // Esconder todas as telas
    APP.elements.welcomeScreen.classList.add("hidden");
    APP.elements.organizerScreen.classList.add("hidden");
    APP.elements.playerScreen.classList.add("hidden");
    
    // Mostrar tela selecionada
    if (screen === "welcome") {
        APP.elements.welcomeScreen.classList.remove("hidden");
    } else if (screen === "organizer") {
        APP.elements.organizerScreen.classList.remove("hidden");
    } else if (screen === "player") {
        APP.elements.playerScreen.classList.remove("hidden");
    }
}

// ===== Funções de Modal =====
function showModal(modal) {
    let modalElement;
    
    if (modal === "challenge") {
        modalElement = APP.elements.challengeModal;
    } else if (modal === "photos") {
        modalElement = APP.elements.photosModal;
    } else if (modal === "roomEntry") {
        modalElement = APP.elements.roomEntryModal;
    } else if (modal === "resetConfirmation") {
        modalElement = APP.elements.resetConfirmationModal;
    }
    
    if (modalElement) {
        modalElement.classList.remove("hidden");
        setTimeout(() => {
            modalElement.classList.add("visible");
        }, 10);
    }
}

function hideModal(modal) {
    let modalElement;
    
    if (modal === "challenge") {
        modalElement = APP.elements.challengeModal;
    } else if (modal === "photos") {
        modalElement = APP.elements.photosModal;
    } else if (modal === "roomEntry") {
        modalElement = APP.elements.roomEntryModal;
    } else if (modal === "resetConfirmation") {
        modalElement = APP.elements.resetConfirmationModal;
    }
    
    if (modalElement) {
        modalElement.classList.remove("visible");
        setTimeout(() => {
            modalElement.classList.add("hidden");
        }, 300);
    }
}

// ===== Funções de Notificação =====
function showToast(message, type = "info", title = "") {
    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    
    let icon = "info-circle";
    if (type === "success") icon = "check-circle";
    if (type === "warning") icon = "exclamation-triangle";
    if (type === "error") icon = "times-circle";
    
    // Se não houver título, usar um padrão com base no tipo
    if (!title) {
        if (type === "success") title = "Sucesso!";
        if (type === "warning") title = "Atenção!";
        if (type === "error") title = "Erro!";
        if (type === "info") title = "Informação";
    }
    
    toast.innerHTML = `
        <div class="toast-icon">
            <i class="fas fa-${icon}"></i>
        </div>
        <div class="toast-content">
            <div class="toast-title">${title}</div>
            <div class="toast-message">${message}</div>
        </div>
    `;
    
    APP.elements.toastContainer.appendChild(toast);
    
    // Remover após a animação
    setTimeout(() => {
        if (toast.parentNode === APP.elements.toastContainer) {
            APP.elements.toastContainer.removeChild(toast);
        }
    }, 5000);
}

// ===== Funções de Jogo =====

// Criar uma nova sala
function createRoom() {
    // Gerar código aleatório para a sala
    const roomCode = generateRoomCode();
    APP.state.currentRoom = roomCode;
    
    // Atualizar interface
    APP.elements.roomCode.textContent = roomCode;
    
    // Gerar QR Code
    generateQRCode(roomCode);
    
    // Criar a sala no Firebase
    createRoomInDatabase(roomCode)
        .then(() => {
            // Mostrar a tela do organizador
            showScreen("organizer");
            
            // Notificar usuário
            showToast("Sala criada com sucesso!", "success", "Pronto para a festa!");
        })
        .catch(error => {
            console.error("Erro ao criar sala:", error);
            showToast("Erro ao criar sala. Tente novamente.", "error");
        });
}

// Gerar código aleatório para a sala
function generateRoomCode() {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
}

// Copiar código da sala para a área de transferência
function copyRoomCode() {
    const roomCode = APP.elements.roomCode.textContent;
    
    navigator.clipboard.writeText(roomCode)
        .then(() => {
            showToast("Código copiado para a área de transferência!", "success");
        })
        .catch(err => {
            console.error("Não foi possível copiar o código:", err);
            showToast("Não foi possível copiar o código", "error");
        });
}

// Gerar QR Code para a sala
function generateQRCode(roomCode) {
    // Limpar o container
    APP.elements.qrcodeContainer.innerHTML = "";
    
    // URL do jogo com código da sala
    const roomUrl = `${window.location.origin}${window.location.pathname}?sala=${roomCode}`;
    
    // Criar QR Code
    new QRCode(APP.elements.qrcodeContainer, {
        text: roomUrl,
        width: 128,
        height: 128,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H
    });
}

// Criar sala no banco de dados
function createRoomInDatabase(roomCode) {
    return database.ref(`rooms/${roomCode}`).set({
        created: firebase.database.ServerValue.TIMESTAMP,
        active: true,
        playMode: APP.state.playMode,
        players: {},
        history: {}
    })
    .then(() => {
        // Escutar por mudanças na fila de jogadores
        listenToPlayersQueue(roomCode);
        return Promise.resolve();
    });
}

// Mostrar modal de entrada na sala
function showRoomEntryModal() {
    showModal("roomEntry");
}

// Entrar em uma sala existente
function joinRoom() {
    const roomCode = APP.elements.roomCodeInput.value.trim().toUpperCase();
    
    if (!roomCode) {
        showToast("Por favor, digite o código da sala.", "warning");
        return;
    }
    
    // Verificar se a sala existe
    database.ref(`rooms/${roomCode}`).once("value")
        .then((snapshot) => {
            if (snapshot.exists() && snapshot.val().active) {
                APP.state.currentRoom = roomCode;
                
                // Atualizar código de sala na interface
                APP.elements.playerRoomCode.textContent = roomCode;
                
                // Fechar o modal
                hideModal("roomEntry");
                
                // Mostrar a tela do jogador
                showScreen("player");
                
                // Inicializar a webcam
                setupWebcam();
                
                // Notificar usuário
                showToast("Você entrou na sala com sucesso!", "success", "Bem-vindo!");
            } else {
                showToast("Sala não encontrada ou inativa.", "error");
            }
        })
        .catch(error => {
            console.error("Erro ao entrar na sala:", error);
            showToast("Erro ao verificar a sala. Tente novamente.", "error");
        });
}

// Iniciar scanner de QR Code
function startQRCodeScanner() {
    // Aqui você poderia implementar a leitura real de QR code
    // Como é uma versão simulada, mostramos apenas um alerta
    showToast("Funcionalidade de escaneamento será implementada em breve!", "info");
}

// Configurar webcam
function setupWebcam() {
    // Reiniciar estado da captura
    APP.elements.canvas.classList.add("hidden");
    APP.elements.webcam.classList.remove("hidden");
    APP.elements.captureBtn.classList.remove("hidden");
    APP.elements.recaptureBtn.classList.add("hidden");
    APP.state.photoTaken = false;
    
    // Solicitar permissão de câmera
    navigator.mediaDevices.getUserMedia({ video: true })
        .then((stream) => {
            APP.elements.webcam.srcObject = stream;
        })
        .catch((error) => {
            console.error("Erro ao acessar webcam:", error);
            showToast("Não foi possível acessar a webcam. Verifique as permissões do navegador.", "error");
        });
}

// Capturar foto
function capturePhoto() {
    const cameraFlash = document.querySelector(".camera-flash");
    
    // Animação de flash
    cameraFlash.classList.add("flash-animation");
    
    // Esperar um pouco para que o flash seja visível antes de capturar
    setTimeout(() => {
        const context = APP.elements.canvas.getContext("2d");
        
        // Capturar frame da webcam
        context.drawImage(APP.elements.webcam, 0, 0, APP.elements.canvas.width, APP.elements.canvas.height);
        
        // Exibir a foto capturada
        APP.elements.canvas.classList.remove("hidden");
        APP.elements.webcam.classList.add("hidden");
        
        // Atualizar botões
        APP.elements.captureBtn.classList.add("hidden");
        APP.elements.recaptureBtn.classList.remove("hidden");
        
        // Marcar que a foto foi tirada
        APP.state.photoTaken = true;
        
        // Parar stream da webcam
        const stream = APP.elements.webcam.srcObject;
        if (stream) {
            const tracks = stream.getTracks();
            tracks.forEach(track => track.stop());
        }
        
        // Remover classe de animação
        setTimeout(() => {
            cameraFlash.classList.remove("flash-animation");
        }, 500);
    }, 100);
}

// Entrar na fila
function joinQueue() {
    const playerName = APP.elements.playerName.value.trim();
    
    if (!playerName) {
        showToast("Por favor, digite seu nome.", "warning");
        return;
    }
    
    // Verificar se a foto foi capturada
    if (!APP.state.photoTaken) {
        showToast("Por favor, capture sua foto.", "warning");
        return;
    }
    
    // Obter a foto como base64
    const photoData = APP.elements.canvas.toDataURL("image/jpeg");
    
    // Gerar ID único para o jogador
    const playerId = Date.now().toString();
    
    // Mostrar notificação de carregamento
    showToast("Enviando foto... Por favor, aguarde.", "info");
    
    // Adicionar jogador à fila no Firebase
    const playerRef = database.ref(`rooms/${APP.state.currentRoom}/players/${playerId}`);
    
    // Fazer upload da foto para o Storage
    uploadPhoto(playerId, photoData)
        .then((photoURL) => {
            // Adicionar jogador com URL da foto
            return playerRef.set({
                name: playerName,
                photoURL: photoURL,
                status: "waiting",
                joinedAt: firebase.database.ServerValue.TIMESTAMP
            });
        })
        .then(() => {
            // Salvar ID do jogador atual
            APP.state.currentPlayer = playerId;
            
            // Mostrar tela de espera
            APP.elements.playerRegistrationForm.classList.add("hidden");
            APP.elements.playerWaiting.classList.remove("hidden");
            
            // Atualizar posição na fila
            listenToQueuePosition(playerId);
            
            // Notificar usuário
            showToast("Você entrou na fila com sucesso!", "success", "Na fila!");
        })
        .catch((error) => {
            console.error("Erro ao entrar na fila:", error);
            showToast("Ocorreu um erro ao entrar na fila. Tente novamente.", "error");
        });
}

// Upload da foto para o Firebase Storage
function uploadPhoto(playerId, photoData) {
    return new Promise((resolve, reject) => {
        // Converter base64 para blob
        const byteString = atob(photoData.split(',')[1]);
        const mimeString = photoData.split(',')[0].split(':')[1].split(';')[0];
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        
        for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }
        
        const blob = new Blob([ab], { type: mimeString });
        
        // Referência para o arquivo no Storage
        const photoRef = storage.ref(`players/${APP.state.currentRoom}/${playerId}.jpg`);
        
        // Fazer upload
        const uploadTask = photoRef.put(blob);
        
        uploadTask.on('state_changed', 
            (snapshot) => {
                // Progresso do upload
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log('Upload: ' + progress + '%');
            }, 
            (error) => {
                // Erro no upload
                reject(error);
            }, 
            () => {
                // Upload completo
                uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
                    resolve(downloadURL);
                });
            }
        );
    });
}

// Escutar por mudanças na fila de jogadores
function listenToPlayersQueue(roomCode) {
    database.ref(`rooms/${roomCode}/players`).on("value", (snapshot) => {
        const playersData = snapshot.val() || {};
        
        // Ordenar jogadores por tempo de entrada
        const players = Object.entries(playersData)
            .map(([id, data]) => ({ id, ...data }))
            .sort((a, b) => a.joinedAt - b.joinedAt);
        
        // Atualizar dados locais
        APP.state.playersQueue = players;
        
        // Atualizar contagem de jogadores
        APP.elements.playersCount.textContent = players.length;
        
        // Atualizar interface
        updatePlayersQueueUI(players);
    });
}

// Atualizar UI da fila de jogadores
function updatePlayersQueueUI(players) {
    // Limpar container
    APP.elements.playersQueue.innerHTML = "";
    
    if (players.length === 0) {
        // Mostrar mensagem de fila vazia
        APP.elements.playersQueue.innerHTML = `
            <div class="empty-queue-message">
                <i class="fas fa-user-plus"></i>
                <p>Aguardando jogadores...</p>
            </div>
        `;
        return;
    }
    
    // Adicionar cada jogador à fila
    players.forEach((player) => {
        const playerCard = document.createElement("div");
        playerCard.className = "player-card";
        playerCard.dataset.playerId = player.id;
        
        if (APP.state.currentPlayer === player.id) {
            playerCard.classList.add("active");
        }
        
        // Adicionar classe de status
        if (player.status === "playing") {
            playerCard.classList.add("playing");
        } else if (player.status === "completed") {
            playerCard.classList.add("completed");
        }
        
        playerCard.innerHTML = `
            <div class="player-photo" style="background-image: url('${player.photoURL}')"></div>
            <div class="player-info">
                <div class="player-name">${player.name}</div>
                <div class="player-status">${getStatusText(player.status)}</div>
            </div>
        `;
        
        // Adicionar evento de clique para selecionar jogador
        playerCard.addEventListener("click", () => {
            selectPlayer(player.id);
        });
        
        APP.elements.playersQueue.appendChild(playerCard);
    });
}

// Obter texto do status
function getStatusText(status) {
    switch (status) {
        case "waiting":
            return "Aguardando";
        case "playing":
            return "Jogando";
        case "completed":
            return "Concluído";
        default:
            return "Desconhecido";
    }
}

// Escutar por mudanças na posição da fila
function listenToQueuePosition(playerId) {
    database.ref(`rooms/${APP.state.currentRoom}/players`).on("value", (snapshot) => {
        const playersData = snapshot.val() || {};
        
        // Ordenar jogadores por tempo de entrada
        const players = Object.entries(playersData)
            .map(([id, data]) => ({ id, ...data }))
            .sort((a, b) => a.joinedAt - b.joinedAt);
        
        // Encontrar posição do jogador atual
        const position = players.findIndex(player => player.id === playerId) + 1;
        
        // Atualizar posição na interface
        if (position > 0) {
            APP.elements.queuePosition.textContent = position;
        } else {
            APP.elements.queuePosition.textContent = "não encontrada";
        }
        
        // Verificar se é a vez do jogador
        const currentPlayer = players.find(player => player.status === "playing");
        
        if (currentPlayer && currentPlayer.id === playerId) {
            // É a vez do jogador
            APP.elements.playerWaiting.classList.add("hidden");
            APP.elements.playerTurn.classList.remove("hidden");
            
            // Notificar o jogador
            showToast("É a sua vez de jogar!", "success", "Sua vez!");
        } else {
            // Ainda não é a vez
            APP.elements.playerWaiting.classList.remove("hidden");
            APP.elements.playerTurn.classList.add("hidden");
        }
    });
}

// Selecionar jogador
function selectPlayer(playerId) {
    // Verificar modo de jogo
    if (APP.state.playMode !== "organizer") {
        return;
    }
    
    // Buscar dados do jogador
    const player = APP.state.playersQueue.find(p => p.id === playerId);
    
    if (!player) {
        console.error("Jogador não encontrado:", playerId);
        return;
    }
    
    // Se o jogador já completou, não fazer nada
    if (player.status === "completed") {
        showToast("Este jogador já completou seu desafio.", "info");
        return;
    }
    
    // Atualizar status do jogador para "playing"
    database.ref(`rooms/${APP.state.currentRoom}/players/${playerId}/status`).set("playing")
        .then(() => {
            // Atualizar jogador atual na interface
            APP.elements.currentPlayerPhoto.style.backgroundImage = `url('${player.photoURL}')`;
            APP.elements.currentPlayerName.textContent = player.name;
            APP.elements.playerStatus.textContent = "Pronto para girar!";
            
            // Atualizar jogador atual nos dados
            APP.state.currentPlayer = playerId;
            
            // Notificar
            showToast(`${player.name} selecionado e pronto para jogar!`, "success");
        })
        .catch(error => {
            console.error("Erro ao selecionar jogador:", error);
            showToast("Erro ao selecionar jogador. Tente novamente.", "error");
        });
}

// Próximo jogador
function nextPlayer() {
    // Encontrar próximo jogador na fila
    const waitingPlayers = APP.state.playersQueue.filter(player => player.status === "waiting");
    
    if (waitingPlayers.length > 0) {
        // Selecionar o primeiro jogador da fila
        selectPlayer(waitingPlayers[0].id);
    } else {
        showToast("Não há mais jogadores na fila.", "warning");
    }
}

// Pular jogador
function skipPlayer() {
    // Verificar se há um jogador selecionado
    if (!APP.state.currentPlayer) {
        showToast("Nenhum jogador selecionado.", "warning");
        return;
    }
    
    // Buscar dados do jogador
    const player = APP.state.playersQueue.find(p => p.id === APP.state.currentPlayer);
    
    if (!player) {
        console.error("Jogador atual não encontrado");
        return;
    }
    
    // Atualizar status do jogador para "waiting" (volta para a fila)
    database.ref(`rooms/${APP.state.currentRoom}/players/${APP.state.currentPlayer}/status`).set("waiting")
        .then(() => {
            // Notificar
            showToast(`${player.name} voltou para a fila.`, "info");
            
            // Chamar próximo jogador
            nextPlayer();
        })
        .catch(error => {
            console.error("Erro ao pular jogador:", error);
            showToast("Erro ao pular jogador. Tente novamente.", "error");
        });
}

// Atualizar duração do giro
function updateSpinDuration() {
    const duration = APP.elements.spinDurationInput.value;
    APP.state.spinDuration = duration;
    APP.elements.spinDurationValue.textContent = `${duration}s`;
}

// Definir modo de jogo
function setPlayMode(mode) {
    APP.state.playMode = mode;
    
    // Atualizar botões
    APP.elements.organizerModeBtn.classList.toggle("active", mode === "organizer");
    APP.elements.playerModeBtn.classList.toggle("active", mode === "player");
    
    // Atualizar no Firebase
    database.ref(`rooms/${APP.state.currentRoom}/playMode`).set(mode)
        .then(() => {
            // Notificar
            showToast(`Modo de jogo alterado para: ${mode === "organizer" ? "Organizador" : "Jogador"}`, "success");
        })
        .catch(error => {
            console.error("Erro ao atualizar modo de jogo:", error);
        });
}

// Girar a roleta
function spinWheel(mode = "organizer") {
    // Verificar se já está girando
    if (APP.state.isSpinning) {
        return;
    }
    
    // Verificar se há um jogador selecionado
    if (!APP.state.currentPlayer) {
        showToast("Nenhum jogador selecionado.", "warning");
        return;
    }
    
    // Marcar como girando
    APP.state.isSpinning = true;
    
    // Número aleatório de rotações (entre 2 e 5)
    const rotations = 2 + Math.random() * 3;
    
    // Ângulo aleatório adicional (entre 0 e 360 graus)
    const extraAngle = Math.floor(Math.random() * 360);
    
    // Ângulo total
    const totalAngle = rotations * 360 + extraAngle;
    
    // Aplicar animação do jogador
    APP.elements.playerAnimation.classList.add("spin-animation");
    
    // Aplicar rotação à roleta
    APP.elements.wheel.style.transition = `transform ${APP.state.spinDuration}s cubic-bezier(0.2, 0.8, 0.2, 1)`;
    APP.elements.wheel.style.transform = `rotate(${totalAngle}deg)`;
    
    // Desabilitar botão durante o giro
    if (mode === "organizer") {
        APP.elements.spinBtn.disabled = true;
        APP.elements.spinBtn.innerHTML = '<span class="spin-text">GIRANDO...</span><span class="spin-icon"><i class="fas fa-sync-alt fa-spin"></i></span>';
    } else {
        APP.elements.playerSpinBtn.disabled = true;
        APP.elements.playerSpinBtn.innerHTML = '<span class="spin-text">GIRANDO...</span><span class="spin-icon"><i class="fas fa-sync-alt fa-spin"></i></span>';
    }
    
    // Atualizar status do jogador atual
    APP.elements.playerStatus.textContent = "Girando a roleta...";
    
    // Calcular resultado após a animação
    setTimeout(() => {
        // Remover animação
        APP.elements.playerAnimation.classList.remove("spin-animation");
        
        // Calcular em qual seção a roleta parou
        const finalAngle = totalAngle % 360;
        const sectionAngle = 360 / APP.gameData.options.length;
        const selectedIndex = Math.floor(finalAngle / sectionAngle);
        
        // Índice invertido (sentido horário vs anti-horário)
        const invertedIndex = (APP.gameData.options.length - selectedIndex) % APP.gameData.options.length;
        
        // Opção selecionada
        APP.state.selectedOption = APP.gameData.options[invertedIndex];
        
        // Destacar a seção selecionada
        highlightWheelSection(invertedIndex);
        
        // Mostrar desafio/pergunta
        setTimeout(() => {
            if (mode === "organizer") {
                showChallenge(APP.state.selectedOption);
            } else {
                showPlayerChallenge(APP.state.selectedOption);
            }
            
            // Resetar botão de giro
            if (mode === "organizer") {
                APP.elements.spinBtn.disabled = false;
                APP.elements.spinBtn.innerHTML = '<span class="spin-text">GIRAR</span><span class="spin-icon"><i class="fas fa-sync-alt"></i></span>';
            } else {
                APP.elements.playerSpinBtn.disabled = false;
                APP.elements.playerSpinBtn.innerHTML = '<span class="spin-text">GIRAR AGORA</span><span class="spin-icon"><i class="fas fa-sync-alt"></i></span>';
            }
            
            // Atualizar status
            APP.elements.playerStatus.textContent = "Desafio sorteado!";
            
            // Resetar estado de giro
            APP.state.isSpinning = false;
        }, 500);
    }, APP.state.spinDuration * 1000);
}

// Destacar seção selecionada na roleta
function highlightWheelSection(index) {
    // Remover destaque de todas as seções
    const sections = APP.elements.wheel.querySelectorAll(".wheel-section");
    sections.forEach(section => {
        section.classList.remove("highlight");
    });
    
    // Adicionar destaque à seção selecionada
    if (sections[index]) {
        sections[index].classList.add("highlight");
    }
}

// Mostrar desafio ou pergunta (versão do organizador)
function showChallenge(option) {
    // Definir tipo
    let typeText = "";
    let typeIcon = "";
    
    if (option.type === "bebida") {
        typeText = "🍹 Hora de Beber";
        typeIcon = "glass-whiskey";
    } else if (option.type === "pergunta") {
        typeText = "❓ Pergunta";
        typeIcon = "question-circle";
    } else {
        typeText = "🎭 Desafio";
        typeIcon = option.icon;
    }
    
    APP.elements.challengeType.innerHTML = `<i class="fas fa-${typeIcon}"></i> ${typeText}`;
    
    // Definir texto
    APP.elements.challengeText.textContent = option.text;
    
    // Configurar opções para perguntas
    if (option.type === "pergunta") {
        APP.elements.questionOptions.innerHTML = "";
        APP.elements.questionOptions.classList.remove("hidden");
        
        // Criar botões para cada opção
        option.options.forEach((text, index) => {
            const optionBtn = document.createElement("button");
            optionBtn.className = "option-btn";
            optionBtn.textContent = `${String.fromCharCode(65 + index)}) ${text}`;
            optionBtn.dataset.index = index;
            
            // Adicionar evento de clique
            optionBtn.addEventListener("click", () => {
                // Remover classe selecionada de todos os botões
                document.querySelectorAll(".option-btn").forEach(btn => {
                    btn.classList.remove("selected");
                });
                
                // Adicionar classe selecionada ao botão clicado
                optionBtn.classList.add("selected");
                
                // Salvar resposta selecionada
                APP.state.selectedAnswer = index;
            });
            
            APP.elements.questionOptions.appendChild(optionBtn);
        });
    } else {
        APP.elements.questionOptions.classList.add("hidden");
    }
    
    // Mostrar modal
    showModal("challenge");
}

// Mostrar desafio ou pergunta (versão do jogador)
function showPlayerChallenge(option) {
    // Mostrar o resultado na tela do jogador
    APP.elements.playerTurn.classList.add("hidden");
    APP.elements.playerResult.classList.remove("hidden");
    
    // Definir tipo
    let typeText = "";
    let typeIcon = "";
    
    if (option.type === "bebida") {
        typeText = "🍹 Hora de Beber";
        typeIcon = "glass-whiskey";
    } else if (option.type === "pergunta") {
        typeText = "❓ Pergunta";
        typeIcon = "question-circle";
    } else {
        typeText = "🎭 Desafio";
        typeIcon = option.icon;
    }
    
    APP.elements.playerResultTitle.innerHTML = `<i class="fas fa-${typeIcon}"></i> ${typeText}`;
    
    // Conteúdo do resultado
    let contentHTML = `<p class="challenge-text">${option.text}</p>`;
    
    // Adicionar opções para perguntas
    if (option.type === "pergunta") {
        contentHTML += `<div class="question-options">`;
        option.options.forEach((text, index) => {
            contentHTML += `
                <button class="option-btn" data-index="${index}">
                    ${String.fromCharCode(65 + index)}) ${text}
                </button>
            `;
        });
        contentHTML += `</div>`;
    }
    
    APP.elements.playerResultContent.innerHTML = contentHTML;
    
    // Adicionar eventos para opções de perguntas
    if (option.type === "pergunta") {
        const optionBtns = document.querySelectorAll(".player-result .option-btn");
        optionBtns.forEach(btn => {
            btn.addEventListener("click", () => {
                // Remover classe selecionada de todos os botões
                optionBtns.forEach(b => {
                    b.classList.remove("selected");
                });
                
                // Adicionar classe selecionada ao botão clicado
                btn.classList.add("selected");
                
                // Salvar resposta selecionada
                APP.state.selectedAnswer = parseInt(btn.dataset.index);
            });
        });
    }
}

// Completar desafio/pergunta (versão do organizador)
function completeChallenge() {
    // Verificar tipo de desafio
    if (APP.state.selectedOption.type === "pergunta") {
        // Verificar se uma resposta foi selecionada
        if (APP.state.selectedAnswer === null) {
            showToast("Por favor, selecione uma resposta.", "warning");
            return;
        }
        
        // Verificar se a resposta está correta
        const isCorrect = APP.state.selectedAnswer === APP.state.selectedOption.answer;
        
        // Destacar resposta correta/incorreta
        document.querySelectorAll(".option-btn").forEach(btn => {
            const index = parseInt(btn.dataset.index);
            
            if (index === APP.state.selectedOption.answer) {
                btn.classList.add("correct");
            } else if (index === APP.state.selectedAnswer && !isCorrect) {
                btn.classList.add("incorrect");
            }
        });
        
        // Esperar um pouco para mostrar a resposta correta
        setTimeout(() => {
            // Mostrar resultado
            showResult(isCorrect);
            
            // Fechar modal
            hideModal("challenge");
            
            // Atualizar status do jogador
            database.ref(`rooms/${APP.state.currentRoom}/players/${APP.state.currentPlayer}/status`).set("completed");
            
            // Registrar resultado no histórico
            saveResult(isCorrect);
            
            // Resetar seleções
            APP.state.selectedOption = null;
            APP.state.selectedAnswer = null;
            
            // Ir para o próximo jogador automaticamente após um tempo
            setTimeout(() => {
                // Verificar se ainda há jogadores na fila
                const waitingPlayers = APP.state.playersQueue.filter(player => player.status === "waiting");
                if (waitingPlayers.length > 0) {
                    // Pode-se implementar um alerta perguntando se quer chamar o próximo
                    // Mas neste caso, será feito automaticamente
                    nextPlayer();
                }
            }, 3000);
        }, 2000);
    } else {
        // Mostrar resultado positivo para desafios e bebidas
        showResult(true);
        
        // Fechar modal
        hideModal("challenge");
        
        // Atualizar status do jogador
        database.ref(`rooms/${APP.state.currentRoom}/players/${APP.state.currentPlayer}/status`).set("completed");
        
        // Registrar resultado no histórico
        saveResult(true);
        
        // Resetar seleções
        APP.state.selectedOption = null;
        APP.state.selectedAnswer = null;
        
        // Ir para o próximo jogador automaticamente após um tempo
        setTimeout(() => {
            // Verificar se ainda há jogadores na fila
            const waitingPlayers = APP.state.playersQueue.filter(player => player.status === "waiting");
            if (waitingPlayers.length > 0) {
                // Pode-se implementar um alerta perguntando se quer chamar o próximo
                // Mas neste caso, será feito automaticamente
                nextPlayer();
            }
        }, 3000);
    }
}

// Completar desafio/pergunta (versão do jogador)
function completePlayerChallenge() {
    // Verificar tipo de desafio
    if (APP.state.selectedOption.type === "pergunta") {
        // Verificar se uma resposta foi selecionada
        if (APP.state.selectedAnswer === null) {
            showToast("Por favor, selecione uma resposta.", "warning");
            return;
        }
        
        // Verificar se a resposta está correta
        const isCorrect = APP.state.selectedAnswer === APP.state.selectedOption.answer;
        
        // Destacar resposta correta/incorreta
        document.querySelectorAll(".player-result .option-btn").forEach(btn => {
            const index = parseInt(btn.dataset.index);
            
            if (index === APP.state.selectedOption.answer) {
                btn.classList.add("correct");
            } else if (index === APP.state.selectedAnswer && !isCorrect) {
                btn.classList.add("incorrect");
            }
        });
        
        // Esperar um pouco para mostrar a resposta correta
        setTimeout(() => {
            // Atualizar status do jogador
            database.ref(`rooms/${APP.state.currentRoom}/players/${APP.state.currentPlayer}/status`).set("completed")
                .then(() => {
                    // Voltar para tela de espera
                    APP.elements.playerResult.classList.add("hidden");
                    APP.elements.playerWaiting.classList.remove("hidden");
                    
                    // Notificar usuário
                    showToast(isCorrect ? "Resposta correta! Desafio completado." : "Resposta incorreta. Beba uma dose!", 
                        isCorrect ? "success" : "warning");
                    
                    // Registrar resultado no histórico
                    saveResult(isCorrect);
                    
                    // Resetar seleções
                    APP.state.selectedOption = null;
                    APP.state.selectedAnswer = null;
                })
                .catch(error => {
                    console.error("Erro ao completar desafio:", error);
                    showToast("Erro ao completar desafio. Tente novamente.", "error");
                });
        }, 2000);
    } else {
        // Atualizar status do jogador
        database.ref(`rooms/${APP.state.currentRoom}/players/${APP.state.currentPlayer}/status`).set("completed")
            .then(() => {
                // Voltar para tela de espera
                APP.elements.playerResult.classList.add("hidden");
                APP.elements.playerWaiting.classList.remove("hidden");
                
                // Notificar usuário
                showToast("Desafio completado com sucesso!", "success");
                
                // Registrar resultado no histórico
                saveResult(true);
                
                // Resetar seleções
                APP.state.selectedOption = null;
                APP.state.selectedAnswer = null;
            })
            .catch(error => {
                console.error("Erro ao completar desafio:", error);
                showToast("Erro ao completar desafio. Tente novamente.", "error");
            });
    }
}

// Mostrar resultado na tela do organizador
function showResult(success) {
    // Buscar dados do jogador
    const player = APP.state.playersQueue.find(p => p.id === APP.state.currentPlayer);
    
    if (!player) {
        return;
    }
    
    // Definir título e texto do resultado
    let title = "";
    let text = "";
    
    if (APP.state.selectedOption.type === "pergunta") {
        title = success ? "✅ Resposta Correta!" : "❌ Resposta Incorreta!";
        text = success ? 
            `${player.name} acertou a pergunta! Escapou de beber desta vez.` : 
            `${player.name} errou a pergunta! Hora de beber uma dose.`;
    } else if (APP.state.selectedOption.type === "bebida") {
        title = "🍹 Bebida!";
        text = `${player.name} completou o desafio de bebida: ${APP.state.selectedOption.text}`;
    } else {
        title = "🎭 Desafio Completo!";
        text = `${player.name} completou o desafio: ${APP.state.selectedOption.text}`;
    }
    
    // Atualizar e mostrar o resultado
    APP.elements.resultTitle.textContent = title;
    APP.elements.resultText.textContent = text;
    APP.elements.resultDisplay.classList.remove("hidden");
}

// Esconder resultado
function hideResult() {
    APP.elements.resultDisplay.classList.add("hidden");
}

// Salvar resultado no histórico
function saveResult(success) {
    // Encontrar jogador atual
    const player = APP.state.playersQueue.find(p => p.id === APP.state.currentPlayer);
    
    if (!player) {
        return;
    }
    
    // Criar entrada no histórico
    const historyRef = database.ref(`rooms/${APP.state.currentRoom}/history/${APP.state.currentPlayer}`);
    historyRef.set({
        name: player.name,
        photoURL: player.photoURL,
        challengeType: APP.state.selectedOption.type,
        challengeText: APP.state.selectedOption.text,
        success: success,
        timestamp: firebase.database.ServerValue.TIMESTAMP
    });
}

// Mostrar galeria de fotos
function showPhotosGallery() {
    // Carregar galeria
    refreshPhotosGallery();
    
    // Mostrar modal
    showModal("photos");
}

// Atualizar galeria de fotos
function refreshPhotosGallery() {
    // Limpar galeria
    APP.elements.photosGallery.innerHTML = "";
    
    if (APP.state.playersQueue.length === 0) {
        // Mostrar mensagem de galeria vazia
        APP.elements.photosGallery.innerHTML = `
            <div class="empty-gallery-message">
                <i class="fas fa-camera"></i>
                <p>Nenhuma foto ainda. Os jogadores aparecerão aqui!</p>
            </div>
        `;
        return;
    }
    
    // Adicionar foto de cada jogador
    APP.state.playersQueue.forEach((player) => {
        const photoItem = document.createElement("div");
        photoItem.className = "photo-item";
        
        photoItem.innerHTML = `
            <img src="${player.photoURL}" alt="${player.name}" class="photo-img">
            <div class="photo-info">
                <div class="photo-name">${player.name}</div>
            </div>
        `;
        
        APP.elements.photosGallery.appendChild(photoItem);
    });
}

// Função para baixar a galeria (simulada)
function downloadGallery() {
    showToast("Função de download será implementada em breve!", "info");
}

// Reiniciar o jogo
function resetGame() {
    // Confirmar reinício
    if (APP.state.currentRoom) {
        // Desativar a sala atual
        database.ref(`rooms/${APP.state.currentRoom}/active`).set(false)
            .then(() => {
                // Criar uma nova sala
                createRoom();
                
                // Notificar usuário
                showToast("Jogo reiniciado com sucesso!", "success", "Nova Sala Criada");
            })
            .catch(error => {
                console.error("Erro ao reiniciar jogo:", error);
                showToast("Erro ao reiniciar jogo. Tente novamente.", "error");
            });
    } else {
        showToast("Nenhuma sala ativa para reiniciar.", "warning");
    }
}

// Verificar parâmetros da URL ao carregar a página
function checkUrlParams() {
    const params = new URLSearchParams(window.location.search);
    const roomCode = params.get("sala");
    
    if (roomCode) {
        // Preencher campo de código da sala
        APP.elements.roomCodeInput.value = roomCode;
        
        // Mostrar modal de entrada
        setTimeout(() => {
            showModal("roomEntry");
        }, 500);
    }
}

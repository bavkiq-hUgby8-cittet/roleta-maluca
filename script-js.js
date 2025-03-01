// Inicialização do Firebase
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

// Dados do jogo
const gameData = {
    options: [
        // Opções de Bebida (10 faces)
        { type: "bebida", text: "Beber uma dose.", color: "#f44336" },
        { type: "bebida", text: "Escolher alguém para beber uma dose.", color: "#e91e63" },
        { type: "bebida", text: "Beber duas doses.", color: "#9c27b0" },
        { type: "bebida", text: "Escolher duas pessoas para beberem uma dose.", color: "#673ab7" },
        { type: "bebida", text: "Brindar com alguém e ambos bebem uma dose.", color: "#3f51b5" },
        { type: "bebida", text: "Beber uma dose de olhos fechados.", color: "#2196f3" },
        { type: "bebida", text: "Beber uma dose sem fazer careta.", color: "#03a9f4" },
        { type: "bebida", text: "Beber uma dose de um gole só.", color: "#00bcd4" },
        { type: "bebida", text: "Dê uma dose para alguém que ainda não bebeu.", color: "#009688" },
        { type: "bebida", text: "Beber se errar a próxima pergunta.", color: "#4caf50" },

        // Perguntas de Conhecimento (10 faces)
        { 
            type: "pergunta", 
            text: "Qual é a capital do Japão?", 
            options: ["Pequim", "Tóquio", "Seul", "Bangkok"], 
            answer: 1, 
            color: "#8bc34a" 
        },
        { 
            type: "pergunta", 
            text: "Qual é o maior oceano do mundo?", 
            options: ["Oceano Índico", "Oceano Atlântico", "Oceano Pacífico", "Oceano Ártico"], 
            answer: 2, 
            color: "#cddc39" 
        },
        { 
            type: "pergunta", 
            text: "Qual é o símbolo químico do ouro?", 
            options: ["Au", "Ag", "Fe", "Hg"], 
            answer: 0, 
            color: "#ffeb3b" 
        },
        { 
            type: "pergunta", 
            text: "Qual é o maior planeta do sistema solar?", 
            options: ["Marte", "Júpiter", "Saturno", "Netuno"], 
            answer: 1, 
            color: "#ffc107" 
        },
        { 
            type: "pergunta", 
            text: "Quem pintou a Mona Lisa?", 
            options: ["Pablo Picasso", "Leonardo da Vinci", "Michelangelo", "Salvador Dalí"], 
            answer: 1, 
            color: "#ff9800" 
        },
        { 
            type: "pergunta", 
            text: "Qual é o símbolo químico da água?", 
            options: ["H2O", "CO2", "O2", "NH3"], 
            answer: 0, 
            color: "#ff5722" 
        },
        { 
            type: "pergunta", 
            text: "Qual é o animal mais rápido do mundo?", 
            options: ["Guepardo", "Falcão-peregrino", "Tubarão-mako", "Cavalo árabe"], 
            answer: 0, 
            color: "#795548" 
        },
        { 
            type: "pergunta", 
            text: "Qual é o menor país do mundo?", 
            options: ["Mônaco", "Malta", "Vaticano", "Liechtenstein"], 
            answer: 2, 
            color: "#9e9e9e" 
        },
        { 
            type: "pergunta", 
            text: "Quanto é 25 + 37 ÷ 2?", 
            options: ["31", "44.5", "50", "35"], 
            answer: 1, 
            color: "#607d8b" 
        },
        { 
            type: "pergunta", 
            text: "Qual é a velocidade da luz?", 
            options: ["300.000 km/s", "150.000 km/s", "500.000 km/s", "100.000 km/s"], 
            answer: 0, 
            color: "#795548" 
        },

        // Desafios e Prendas (10 faces)
        { type: "desafio", text: "Fazer uma pose de yoga.", color: "#e91e63" },
        { type: "desafio", text: "Fazer uma dança engraçada por 30 segundos.", color: "#9c27b0" },
        { type: "desafio", text: "Imitar um animal.", color: "#673ab7" },
        { type: "desafio", text: "Fazer uma pose de modelo.", color: "#3f51b5" },
        { type: "desafio", text: "Imitar um robô.", color: "#2196f3" },
        { type: "desafio", text: "Cantar um trecho de uma música.", color: "#03a9f4" },
        { type: "desafio", text: "Fazer um elogio para alguém da festa usando o microfone.", color: "#00bcd4" },
        { type: "desafio", text: "Pular de um pé só por 15 segundos.", color: "#009688" },
        { type: "desafio", text: "Fazer uma saudação engraçada.", color: "#4caf50" },
        { type: "desafio", text: "Fazer uma pose de super-herói.", color: "#8bc34a" }
    ],
    currentRoom: null,
    currentPlayer: null,
    playersQueue: [],
    spinDuration: 5, // segundos
    playMode: "organizer", // "organizer" ou "player"
    isSpinning: false,
    selectedOption: null,
    selectedAnswer: null
};

// Elementos DOM
const elements = {
    // Telas
    welcomeScreen: document.getElementById("welcome-screen"),
    organizerScreen: document.getElementById("organizer-screen"),
    playerScreen: document.getElementById("player-screen"),
    
    // Botões de boas-vindas
    createRoomBtn: document.getElementById("create-room-btn"),
    joinRoomBtn: document.getElementById("join-room-btn"),
    
    // Informações da sala
    roomCode: document.getElementById("room-code"),
    qrcodeContainer: document.getElementById("qrcode-container"),
    
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
    
    // Animação do jogador
    playerAnimation: document.getElementById("player-animation"),
    currentPlayerPhoto: document.getElementById("current-player-photo"),
    currentPlayerName: document.getElementById("current-player-name"),
    
    // Fila de jogadores
    playersQueue: document.getElementById("players-queue"),
    
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
    
    // Modais
    challengeModal: document.getElementById("challenge-modal"),
    photosModal: document.getElementById("photos-modal"),
    roomEntryModal: document.getElementById("room-entry-modal"),
    
    // Conteúdo do modal de desafio
    challengeType: document.getElementById("challenge-type"),
    challengeText: document.getElementById("challenge-text"),
    questionOptions: document.getElementById("question-options"),
    completeChallenge: document.getElementById("complete-challenge-btn"),
    
    // Galeria de fotos
    photosGallery: document.getElementById("photos-gallery"),
    
    // Modal de entrada na sala
    roomCodeInput: document.getElementById("room-code-input"),
    enterRoomBtn: document.getElementById("enter-room-btn"),
    
    // Botões de fechar modais
    closeModal: document.getElementById("close-modal"),
    closePhotosModal: document.getElementById("close-photos-modal"),
    closeRoomEntryModal: document.getElementById("close-room-entry-modal")
};

// Inicialização
document.addEventListener("DOMContentLoaded", () => {
    // Criar seções da roleta
    createWheelSections();
    
    // Configurar eventos
    setupEventListeners();
});

// Criar seções da roleta
function createWheelSections() {
    const totalSections = gameData.options.length;
    const degreePerSection = 360 / totalSections;
    
    for (let i = 0; i < totalSections; i++) {
        const option = gameData.options[i];
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
        let contentText = "";
        if (option.type === "bebida") {
            contentText = "🍹 " + option.text;
        } else if (option.type === "pergunta") {
            contentText = "❓ Pergunta";
        } else {
            contentText = "🎭 " + option.text;
        }
        
        content.textContent = contentText;
        
        inner.appendChild(content);
        section.appendChild(inner);
        elements.wheel.appendChild(section);
    }
}

// Configurar ouvintes de eventos
function setupEventListeners() {
    // Botões de boas-vindas
    elements.createRoomBtn.addEventListener("click", createRoom);
    elements.joinRoomBtn.addEventListener("click", showRoomEntryModal);
    
    // Botões de controle
    elements.spinBtn.addEventListener("click", spinWheel);
    elements.playerSpinBtn.addEventListener("click", spinWheel);
    elements.nextPlayerBtn.addEventListener("click", nextPlayer);
    elements.skipPlayerBtn.addEventListener("click", skipPlayer);
    elements.seePhotosBtn.addEventListener("click", showPhotosGallery);
    
    // Botões de modo
    elements.organizerModeBtn.addEventListener("click", () => setPlayMode("organizer"));
    elements.playerModeBtn.addEventListener("click", () => setPlayMode("player"));
    
    // Controle de duração do giro
    elements.spinDurationInput.addEventListener("input", updateSpinDuration);
    
    // Webcam e captura
    elements.captureBtn.addEventListener("click", capturePhoto);
    elements.recaptureBtn.addEventListener("click", setupWebcam);
    
    // Entrada na fila
    elements.joinQueueBtn.addEventListener("click", joinQueue);
    
    // Botões de modal
    elements.closeModal.addEventListener("click", closeChallenge);
    elements.closePhotosModal.addEventListener("click", closePhotosGallery);
    elements.closeRoomEntryModal.addEventListener("click", closeRoomEntryModal);
    elements.enterRoomBtn.addEventListener("click", joinRoom);
    
    // Completar desafio
    elements.completeChallenge.addEventListener("click", completeChallenge);
}

// Criar uma nova sala
function createRoom() {
    // Gerar código aleatório para a sala
    const roomCode = generateRoomCode();
    gameData.currentRoom = roomCode;
    
    // Atualizar interface
    elements.roomCode.textContent = roomCode;
    
    // Gerar QR Code
    generateQRCode(roomCode);
    
    // Criar a sala no Firebase
    createRoomInDatabase(roomCode);
    
    // Mostrar a tela do organizador
    showScreen("organizer");
}

// Gerar código aleatório para a sala
function generateRoomCode() {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
}

// Gerar QR Code para a sala
function generateQRCode(roomCode) {
    // Limpar o container
    elements.qrcodeContainer.innerHTML = "";
    
    // URL do jogo com código da sala
    const roomUrl = `${window.location.origin}${window.location.pathname}?sala=${roomCode}`;
    
    // Criar QR Code
    new QRCode(elements.qrcodeContainer, {
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
    database.ref(`rooms/${roomCode}`).set({
        created: firebase.database.ServerValue.TIMESTAMP,
        active: true,
        playMode: gameData.playMode,
        players: {},
        history: {}
    });
    
    // Escutar por mudanças na fila de jogadores
    listenToPlayersQueue(roomCode);
}

// Mostrar modal de entrada na sala
function showRoomEntryModal() {
    elements.roomEntryModal.classList.remove("hidden");
    setTimeout(() => {
        elements.roomEntryModal.classList.add("visible");
    }, 10);
}

// Fechar modal de entrada na sala
function closeRoomEntryModal() {
    elements.roomEntryModal.classList.remove("visible");
    setTimeout(() => {
        elements.roomEntryModal.classList.add("hidden");
    }, 300);
}

// Entrar em uma sala existente
function joinRoom() {
    const roomCode = elements.roomCodeInput.value.trim().toUpperCase();
    
    if (!roomCode) {
        alert("Por favor, digite o código da sala.");
        return;
    }
    
    // Verificar se a sala existe
    database.ref(`rooms/${roomCode}`).once("value", (snapshot) => {
        if (snapshot.exists() && snapshot.val().active) {
            gameData.currentRoom = roomCode;
            
            // Fechar o modal
            closeRoomEntryModal();
            
            // Mostrar a tela do jogador
            showScreen("player");
            
            // Inicializar a webcam
            setupWebcam();
        } else {
            alert("Sala não encontrada ou inativa.");
        }
    });
}

// Configurar webcam
function setupWebcam() {
    // Reiniciar estado da captura
    elements.canvas.classList.add("hidden");
    elements.webcam.classList.remove("hidden");
    elements.captureBtn.classList.remove("hidden");
    elements.recaptureBtn.classList.add("hidden");
    
    // Solicitar permissão de câmera
    navigator.mediaDevices.getUserMedia({ video: true })
        .then((stream) => {
            elements.webcam.srcObject = stream;
        })
        .catch((error) => {
            console.error("Erro ao acessar webcam:", error);
            alert("Não foi possível acessar a webcam. Verifique as permissões do navegador.");
        });
}

// Capturar foto
function capturePhoto() {
    const context = elements.canvas.getContext("2d");
    
    // Capturar frame da webcam
    context.drawImage(elements.webcam, 0, 0, elements.canvas.width, elements.canvas.height);
    
    // Exibir a foto capturada
    elements.canvas.classList.remove("hidden");
    elements.webcam.classList.add("hidden");
    
    // Atualizar botões
    elements.captureBtn.classList.add("hidden");
    elements.recaptureBtn.classList.remove("hidden");
    
    // Parar stream da webcam
    const stream = elements.webcam.srcObject;
    if (stream) {
        const tracks = stream.getTracks();
        tracks.forEach(track => track.stop());
    }
}

// Entrar na fila
function joinQueue() {
    const playerName = elements.playerName.value.trim();
    
    if (!playerName) {
        alert("Por favor, digite seu nome.");
        return;
    }
    
    // Verificar se a foto foi capturada
    if (elements.canvas.classList.contains("hidden")) {
        alert("Por favor, capture sua foto.");
        return;
    }
    
    // Obter a foto como base64
    const photoData = elements.canvas.toDataURL("image/jpeg");
    
    // Gerar ID único para o jogador
    const playerId = Date.now().toString();
    
    // Adicionar jogador à fila no Firebase
    const playerRef = database.ref(`rooms/${gameData.currentRoom}/players/${playerId}`);
    
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
            gameData.currentPlayer = playerId;
            
            // Mostrar tela de espera
            elements.playerRegistrationForm.classList.add("hidden");
            elements.playerWaiting.classList.remove("hidden");
            
            // Atualizar posição na fila
            listenToQueuePosition(playerId);
        })
        .catch((error) => {
            console.error("Erro ao entrar na fila:", error);
            alert("Ocorreu um erro ao entrar na fila. Tente novamente.");
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
        const photoRef = storage.ref(`players/${gameData.currentRoom}/${playerId}.jpg`);
        
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
        gameData.playersQueue = players;
        
        // Atualizar interface
        updatePlayersQueueUI(players);
    });
}

// Atualizar UI da fila de jogadores
function updatePlayersQueueUI(players) {
    // Limpar container
    elements.playersQueue.innerHTML = "";
    
    // Adicionar cada jogador à fila
    players.forEach((player) => {
        const playerCard = document.createElement("div");
        playerCard.className = "player-card";
        playerCard.dataset.playerId = player.id;
        
        if (gameData.currentPlayer === player.id) {
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
        
        elements.playersQueue.appendChild(playerCard);
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
    database.ref(`rooms/${gameData.currentRoom}/players`).on("value", (snapshot) => {
        const playersData = snapshot.val() || {};
        
        // Ordenar jogadores por tempo de entrada
        const players = Object.entries(playersData)
            .map(([id, data]) => ({ id, ...data }))
            .sort((a, b) => a.joinedAt - b.joinedAt);
        
        // Encontrar posição do jogador atual
        const position = players.findIndex(player => player.id === playerId) + 1;
        
        // Atualizar posição na interface
        if (position > 0) {
            elements.queuePosition.textContent = position;
        } else {
            elements.queuePosition.textContent = "não encontrada";
        }
        
        // Verificar se é a vez do jogador
        const currentPlayer = players.find(player => player.status === "playing");
        
        if (currentPlayer && currentPlayer.id === playerId) {
            // É a vez do jogador
            elements.playerWaiting.classList.add("hidden");
            elements.playerTurn.classList.remove("hidden");
        } else {
            // Ainda não é a vez
            elements.playerWaiting.classList.remove("hidden");
            elements.playerTurn.classList.add("hidden");
        }
    });
}

// Selecionar jogador
function selectPlayer(playerId) {
    // Verificar modo de jogo
    if (gameData.playMode !== "organizer") {
        return;
    }
    
    // Buscar dados do jogador
    const player = gameData.playersQueue.find(p => p.id === playerId);
    
    if (!player) {
        console.error("Jogador não encontrado:", playerId);
        return;
    }
    
    // Se o jogador já completou, não fazer nada
    if (player.status === "completed") {
        return;
    }
    
    // Atualizar status do jogador para "playing"
    database.ref(`rooms/${gameData.currentRoom}/players/${playerId}/status`).set("playing");
    
    // Atualizar jogador atual na interface
    elements.currentPlayerPhoto.style.backgroundImage = `url('${player.photoURL}')`;
    elements.currentPlayerName.textContent = player.name;
    
    // Atualizar jogador atual nos dados
    gameData.currentPlayer = playerId;
}

// Próximo jogador
function nextPlayer() {
    // Encontrar próximo jogador na fila
    const waitingPlayers = gameData.playersQueue.filter(player => player.status === "waiting");
    
    if (waitingPlayers.length > 0) {
        // Selecionar o primeiro jogador da fila
        selectPlayer(waitingPlayers[0].id);
    } else {
        alert("Não há mais jogadores na fila.");
    }
}

// Pular jogador
function skipPlayer() {
    // Verificar se há um jogador selecionado
    if (!gameData.currentPlayer) {
        alert("Nenhum jogador selecionado.");
        return;
    }
    
    // Atualizar status do jogador para "waiting" (volta para a fila)
    database.ref(`rooms/${gameData.currentRoom}/players/${gameData.currentPlayer}/status`).set("waiting");
    
    // Chamar próximo jogador
    nextPlayer();
}

// Atualizar duração do giro
function updateSpinDuration() {
    const duration = elements.spinDurationInput.value;
    gameData.spinDuration = duration;
    elements.spinDurationValue.textContent = `${duration}s`;
}

// Definir modo de jogo
function setPlayMode(mode) {
    gameData.playMode = mode;
    
    // Atualizar botões
    elements.organizerModeBtn.classList.toggle("active", mode === "organizer");
    elements.playerModeBtn.classList.toggle("active", mode === "player");
    
    // Atualizar no Firebase
    database.ref(`rooms/${gameData.currentRoom}/playMode`).set(mode);
}

// Girar a roleta
function spinWheel() {
    // Verificar se já está girando
    if (gameData.isSpinning) {
        return;
    }
    
    // Verificar se há um jogador selecionado
    if (!gameData.currentPlayer) {
        alert("Nenhum jogador selecionado.");
        return;
    }
    
    // Marcar como girando
    gameData.isSpinning = true;
    
    // Número aleatório de rotações (entre 2 e 5)
    const rotations = 2 + Math.random() * 3;
    
    // Ângulo aleatório adicional (entre 0 e 360 graus)
    const extraAngle = Math.floor(Math.random() * 360);
    
    // Ângulo total
    const totalAngle = rotations * 360 + extraAngle;
    
    // Aplicar animação do jogador
    elements.playerAnimation.classList.add("spin-animation");
    
    // Aplicar rotação à roleta
    elements.wheel.style.transition = `transform ${gameData.spinDuration}s cubic-bezier(0.2, 0.8, 0.2, 1)`;
    elements.wheel.style.transform = `rotate(${totalAngle}deg)`;
    
    // Calcular resultado após a animação
    setTimeout(() => {
        // Remover animação
        elements.playerAnimation.classList.remove("spin-animation");
        
        // Calcular em qual seção a roleta parou
        const finalAngle = totalAngle % 360;
        const sectionAngle = 360 / gameData.options.length;
        const selectedIndex = Math.floor(finalAngle / sectionAngle);
        
        // Índice invertido (sentido horário vs anti-horário)
        const invertedIndex = (gameData.options.length - selectedIndex) % gameData.options.length;
        
        // Opção selecionada
        gameData.selectedOption = gameData.options[invertedIndex];
        
        // Mostrar desafio/pergunta
        showChallenge(gameData.selectedOption);
        
        // Resetar estado de giro
        gameData.isSpinning = false;
    }, gameData.spinDuration * 1000);
}

// Mostrar desafio ou pergunta
function showChallenge(option) {
    // Definir tipo
    let typeText = "";
    
    if (option.type === "bebida") {
        typeText = "🍹 Hora de Beber";
    } else if (option.type === "pergunta") {
        typeText = "❓ Pergunta";
    } else {
        typeText = "🎭 Desafio";
    }
    
    elements.challengeType.textContent = typeText;
    
    // Definir texto
    elements.challengeText.textContent = option.text;
    
    // Configurar opções para perguntas
    if (option.type === "pergunta") {
        elements.questionOptions.innerHTML = "";
        elements.questionOptions.classList.remove("hidden");
        
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
                gameData.selectedAnswer = index;
            });
            
            elements.questionOptions.appendChild(optionBtn);
        });
    } else {
        elements.questionOptions.classList.add("hidden");
    }
    
    // Mostrar modal
    elements.challengeModal.classList.remove("hidden");
    setTimeout(() => {
        elements.challengeModal.classList.add("visible");
    }, 10);
}

// Fechar modal de desafio
function closeChallenge() {
    elements.challengeModal.classList.remove("visible");
    setTimeout(() => {
        elements.challengeModal.classList.add("hidden");
    }, 300);
}

// Completar desafio/pergunta
function completeChallenge() {
    // Verificar tipo de desafio
    if (gameData.selectedOption.type === "pergunta") {
        // Verificar se uma resposta foi selecionada
        if (gameData.selectedAnswer === null) {
            alert("Por favor, selecione uma resposta.");
            return;
        }
        
        // Verificar se a resposta está correta
        const isCorrect = gameData.selectedAnswer === gameData.selectedOption.answer;
        
        // Destacar resposta correta/incorreta
        document.querySelectorAll(".option-btn").forEach(btn => {
            const index = parseInt(btn.dataset.index);
            
            if (index === gameData.selectedOption.answer) {
                btn.classList.add("correct");
            } else if (index === gameData.selectedAnswer && !isCorrect) {
                btn.classList.add("incorrect");
            }
        });
        
        // Esperar um pouco para mostrar a resposta correta
        setTimeout(() => {
            // Fechar modal
            closeChallenge();
            
            // Atualizar status do jogador
            database.ref(`rooms/${gameData.currentRoom}/players/${gameData.currentPlayer}/status`).set("completed");
            
            // Registrar resultado no histórico
            saveResult(isCorrect);
            
            // Resetar seleções
            gameData.selectedOption = null;
            gameData.selectedAnswer = null;
        }, 2000);
    } else {
        // Fechar modal
        closeChallenge();
        
        // Atualizar status do jogador
        database.ref(`rooms/${gameData.currentRoom}/players/${gameData.currentPlayer}/status`).set("completed");
        
        // Registrar resultado no histórico
        saveResult(true);
        
        // Resetar seleções
        gameData.selectedOption = null;
        gameData.selectedAnswer = null;
    }
}

// Salvar resultado no histórico
function saveResult(success) {
    // Encontrar jogador atual
    const player = gameData.playersQueue.find(p => p.id === gameData.currentPlayer);
    
    if (!player) {
        return;
    }
    
    // Criar entrada no histórico
    const historyRef = database.ref(`rooms/${gameData.currentRoom}/history/${gameData.currentPlayer}`);
    historyRef.set({
        name: player.name,
        photoURL: player.photoURL,
        challengeType: gameData.selectedOption.type,
        challengeText: gameData.selectedOption.text,
        success: success,
        timestamp: firebase.database.ServerValue.TIMESTAMP
    });
}

// Mostrar galeria de fotos
function showPhotosGallery() {
    // Limpar galeria
    elements.photosGallery.innerHTML = "";
    
    // Adicionar foto de cada jogador
    gameData.playersQueue.forEach((player) => {
        const photoItem = document.createElement("div");
        photoItem.className = "photo-item";
        
        photoItem.innerHTML = `
            <img src="${player.photoURL}" alt="${player.name}" class="photo-img">
            <div class="photo-info">
                <div class="photo-name">${player.name}</div>
            </div>
        `;
        
        elements.photosGallery.appendChild(photoItem);
    });
    
    // Mostrar modal
    elements.photosModal.classList.remove("hidden");
    setTimeout(() => {
        elements.photosModal.classList.add("visible");
    }, 10);
}

// Fechar galeria de fotos
function closePhotosGallery() {
    elements.photosModal.classList.remove("visible");
    setTimeout(() => {
        elements.photosModal.classList.add("hidden");
    }, 300);
}

// Mostrar tela específica
function showScreen(screen) {
    // Esconder todas as telas
    elements.welcomeScreen.classList.add("hidden");
    elements.organizerScreen.classList.add("hidden");
    elements.playerScreen.classList.add("hidden");
    
    // Mostrar tela selecionada
    if (screen === "welcome") {
        elements.welcomeScreen.classList.remove("hidden");
    } else if (screen === "organizer") {
        elements.organizerScreen.classList.remove("hidden");
    } else if (screen === "player") {
        elements.playerScreen.classList.remove("hidden");
    }
}

// Verificar parâmetros da URL ao carregar a página
(function checkUrlParams() {
    const params = new URLSearchParams(window.location.search);
    const roomCode = params.get("sala");
    
    if (roomCode) {
        // Preencher campo de código da sala
        elements.roomCodeInput.value = roomCode;
        
        // Mostrar modal de entrada
        setTimeout(showRoomEntryModal, 500);
    }
})();

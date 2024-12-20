let ingredients = [];
let order = [];
let score = 0;
let timeRemaining = 60;
let timerInterval;

// Daftar kemungkinan pesanan acak
const orders = [
    ['nasi', 'sayuran'],
    ['nasi', 'sayuran', 'telur'],
    ['nasi', 'sayuran', 'ayam'],
    ['nasi', 'sayuran', 'seafood'],
    ['nasi', 'sayuran', 'telur', 'ayam', 'seafood']
];

// Fungsi untuk memulai permainan setelah nama dimasukkan
function startGame() {
    const playerName = document.getElementById('playerName').value;
    if (playerName.trim() === '') {
        alert('Nama tidak boleh kosong!');
        return;
    }

    document.getElementById('welcomeMessage').textContent = `Selamat datang, ${playerName}!`;
    document.getElementById('nameSection').style.display = 'none';
    document.getElementById('gameSection').style.display = 'block';
    
    // Mengganti video background saat permainan dimulai
    document.getElementById('backgroundVideo').src = "images/background2.mp4";
    
    // Putar musik latar (jika ada)
    const backgroundMusic = document.getElementById('backgroundMusic');
    if (backgroundMusic) {
        backgroundMusic.play();
    }

    // Menghasilkan pesanan secara acak
    generateRandomOrder();
}

// Fungsi hitung mundur sebelum game dimulai
function startCountdown() {
    document.getElementById('readySection').style.display = 'none'; // Sembunyikan tombol Siap
    countdown(3); // Mulai hitung mundur dari 3
}

function countdown(seconds) {
    if (seconds > 0) {
        alert(seconds); // Tampilkan detik yang tersisa
        setTimeout(() => countdown(seconds - 1), 1000);
    } else {
        startGame(); // Mulai permainan setelah hitung mundur selesai
        startTimer(); // Mulai timer setelah hitungan mundur selesai
    }
}

// Fungsi untuk mengacak pesanan nasi goreng
function generateRandomOrder() {
    order = orders[Math.floor(Math.random() * orders.length)];
    const orderMessage = order.map(item => item.charAt(0).toUpperCase() + item.slice(1)).join(' + ');
    document.getElementById('orderMessage').textContent = `Pesanan: ${orderMessage}`;
}

// Fungsi untuk menangani elemen yang di-drag
function drag(event) {
    if (event.type === "touchstart") {
        const touch = event.touches[0];
        event.dataTransfer = {
            setData: function(type, id) {
                this.id = id;
            },
            getData: function() {
                return this.id;
            },
            id: event.target.id
        };
    }
    event.dataTransfer.setData("text", event.target.id);
}

// Fungsi untuk mengizinkan drop
function allowDrop(event) {
    event.preventDefault();
    document.getElementById('dropZone').classList.add('dragging');
}

// Fungsi untuk menangani elemen yang di-drop
function drop(event) {
    event.preventDefault();
    const ingredientId = event.dataTransfer ? event.dataTransfer.getData("text") : event.target.id;
    addIngredient(ingredientId);
    document.getElementById('dropZone').classList.remove('dragging');
}

// Tambahkan event listener untuk perangkat sentuh di setiap elemen bahan
document.querySelectorAll('.ingredient').forEach(ingredient => {
    ingredient.addEventListener('touchstart', drag);
    ingredient.addEventListener('touchmove', allowDrop);
    ingredient.addEventListener('touchend', drop);
});

// Fungsi untuk menambah bahan
function addIngredient(ingredient) {
    const placeholderText = document.getElementById('placeholderText');
    const resultImage = document.getElementById('resultImage');
    const selectedIngredientsContainer = document.getElementById('selectedIngredientsContainer');

    // Jika ini adalah bahan pertama yang ditambahkan, sembunyikan teks placeholder dan tampilkan gambar
    if (ingredients.length === 0) {
        placeholderText.style.display = 'none';  // Sembunyikan placeholder
        resultImage.style.display = 'block';     // Tampilkan gambar hasil
    }

    ingredients.push(ingredient);
    
    // Buat elemen untuk menampilkan bahan yang dipilih
    const ingredientElement = document.createElement('img');
    ingredientElement.src = document.getElementById(ingredient).src; // Ambil src dari bahan
    ingredientElement.style.width = '50px';
    ingredientElement.style.height = '50px';
    ingredientElement.style.margin = '5px';

    // Tambahkan bahan yang dipilih ke drop zone
    selectedIngredientsContainer.appendChild(ingredientElement);
    resultImage.alt = ''; // Menghapus teks alternatif gambar

    updateResult();
}

// Fungsi untuk memperbarui hasil
function updateResult() {
    const resultImage = document.getElementById('resultImage');
    const validationMessage = document.getElementById('validationMessage');
    let resultText = '';

    // Efek animasi gambar mengecil saat ada bahan baru
    resultImage.classList.add('shrink');

    if (ingredients.length === order.length && ingredients.every((val, index) => val === order[index])) {
        resultText = 'Benar!';
        score++;
        validationMessage.style.color = 'green';

        // Tentukan gambar sesuai pesanan yang benar
        if (order.length === 2 && order.includes('nasi') && order.includes('sayuran')) {
            resultImage.src = 'images/nasi_goreng_sayuran.png';
        } else if (order.includes('nasi') && order.includes('sayuran') && order.includes('telur')) {
            resultImage.src = 'images/nasi_goreng_telur.png';
        } else if (order.includes('nasi') && order.includes('sayuran') && order.includes('ayam')) {
            resultImage.src = 'images/nasi_goreng_ayam.png';
        } else if (order.includes('nasi') && order.includes('sayuran') && order.includes('seafood')) {
            resultImage.src = 'images/nasi_goreng_seafood.png';
        } 
        if (order.length === 5 && order.includes('nasi') && order.includes('sayuran') && order.includes('telur') && order.includes('ayam') && order.includes('seafood')) {
            resultImage.src = 'images/nasi_goreng_komplit.png';
        }

        // Reset game setelah 2 detik jika pesanan benar
        setTimeout(() => {
            resetGame(); // Reset game
        }, 2000);

    } else if (ingredients.length === order.length && !ingredients.every((val, index) => val === order[index])) {
        resultText = 'Salah!';
        validationMessage.style.color = 'red';

        // Reset game setelah 2 detik jika pesanan salah
        setTimeout(() => {
            resetGame(); // Reset game
        }, 2000);
    }

    validationMessage.textContent = resultText;
    document.getElementById('score').textContent = score;
}

// Fungsi untuk mereset game
function resetGame() {
    ingredients = [];
    const selectedIngredientsContainer = document.getElementById('selectedIngredientsContainer');
    selectedIngredientsContainer.innerHTML = ''; // Kosongkan preview bahan
    document.getElementById('resultImage').src = ''; // Kosongkan gambar hasil
    document.getElementById('placeholderText').style.display = 'block'; // Tampilkan teks placeholder
    document.getElementById('resultImage').style.display = 'none'; // Sembunyikan gambar hasil
    document.getElementById('validationMessage').textContent = ''; // Kosongkan pesan validasi
    generateRandomOrder(); // Hasilkan pesanan baru
}

// Fungsi untuk memulai timer
function startTimer() {
    timerInterval = setInterval(() => {
        timeRemaining--;
        document.getElementById('timer').textContent = timeRemaining;

        if (timeRemaining <= 0) {
            clearInterval(timerInterval);
            endGame();
        }
    }, 1000);
}

// Fungsi untuk mengakhiri permainan
function endGame() {
    alert('Waktu Habis! Skor Anda: ' + score);
    location.reload();
}

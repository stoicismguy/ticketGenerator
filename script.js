const qrText = `Лраырарыдфлаврдывапрщыиаловлырвимж`;
document.getElementById('qrcode').innerHTML = ''; // Очищаем предыдущий QR-код
new QRCode(document.getElementById('qrcode'), {
    text: qrText,
    width: 374,
    height: 374,
    colorDark: "#000000",
    colorLight: "#f5f2e9"
});


const toggleHeader = () => {
    const main = document.getElementById('main');
    const inputForm = document.getElementById('inputForm');
    main.classList.toggle('hidden');
    inputForm.classList.toggle('hidden');
}

const diffUpdater = () => {
    genTime = Number.parseInt(localStorage.getItem('generationTime'));
    now = new Date();
    const diffSeconds = Math.floor((now.getTime() - genTime) / 1000);

    const minutes = Math.floor(diffSeconds / 60).toString().padStart(2, '0');
    const seconds = (diffSeconds % 60).toString().padStart(2, '0');
    document.getElementById('diff').textContent = `${minutes}:${seconds}`;
}

const updateData = () => {
    genTime = Number.parseInt(localStorage.getItem('generationTime'));
    now = new Date();

    const timegen = new Date(genTime);
    const formattedDateTime = timegen.toLocaleString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }).replace(',', '');
    document.getElementById('date').textContent = formattedDateTime;

    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0'); // +1, так как месяцы с 0
    const day = now.getDate().toString().padStart(2, '0');
    
    const numeros = `${year}${month}${day}074922290`;
    document.getElementById('numeros').textContent = numeros;

    type = localStorage.getItem('type');
    number = localStorage.getItem('number');
    ts = localStorage.getItem('ts');
    document.getElementById('type').textContent = type;
    document.getElementById('number').textContent = number;
    document.getElementById('ts_out').textContent = ts;

    diffUpdater();
    setInterval(diffUpdater, 1000);
}


const GenerateFullTicket = () => {
    now = new Date();
    localStorage.setItem('generationTime', now.getTime());
    localStorage.setItem('type', document.getElementById('transportType').value);
    localStorage.setItem('number', document.getElementById('tramNumber').value);
    localStorage.setItem('ts', document.getElementById('ts').value);

    updateData();
    toggleHeader();
}

updateData();
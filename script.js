let html5QrCode = null;

// Запуск сканера
const openScanner = () => {
    const modal = document.getElementById('scannerModal');
    modal.classList.remove('hidden');

    // Небольшая задержка, чтобы браузер успел отрисовать окно и рассчитать размеры #reader
    setTimeout(() => {
        if (html5QrCode) {
            html5QrCode.clear();
        }

        html5QrCode = new Html5Qrcode('reader');

        const config = {
            fps: 10, // 10 кадров в секунду вполне достаточно
            // Убираем жесткий qrbox, чтобы библиотека искала QR-код по всему кадру
            experimentalFeatures: {
                useBarCodeDetectorIfSupported: true, // Включает аппаратное ускорение в Chrome/Android
            },
        };

        html5QrCode
            .start(
                { facingMode: 'environment' }, // Задняя камера
                config,
                onScanSuccess,
                onScanFailure,
            )
            .catch((err) => {
                console.error('Ошибка камеры:', err);
                alert('Ошибка доступа к камере: ' + err);
                closeScanner();
            });
    }, 100);
};

// Закрытие и остановка камеры
const closeScanner = () => {
    const modal = document.getElementById('scannerModal');
    if (html5QrCode && html5QrCode.isScanning) {
        html5QrCode
            .stop()
            .then(() => {
                html5QrCode.clear();
                modal.classList.add('hidden');
            })
            .catch((err) => {
                console.error('Ошибка при остановке сканера:', err);
                modal.classList.add('hidden');
            });
    } else {
        modal.classList.add('hidden');
    }
};

// Обработка успешного сканирования
const onScanSuccess = async (decodedText, decodedResult) => {
    closeScanner();

    let qrUrl = decodedText.trim();

    // Вытаскиваем payTagId из QR-кода
    let payTagId = '';
    const match = qrUrl.match(/pay[Tt]ag[Ii]d=([^&]+)/);
    if (match) {
        payTagId = match[1];
    } else {
        // Если считан просто номер
        payTagId = qrUrl;
    }

    // ТВОЯ ПУБЛИЧНАЯ ССЫЛКА ИЗ ЯНДЕКСА
    const yandexProxyUrl = `https://functions.yandexcloud.net/d4e8unfdkhl507rbed2s?payTagId=${payTagId}&s=qr&m=t&secret=Zalupa123`;

    try {
        console.log('Идем в Яндекс...', yandexProxyUrl);

        const response = await fetch(yandexProxyUrl);
        if (!response.ok) throw new Error('Ошибка сети');

        const data = await response.json();
        console.log('Данные от НСПК получены:', data);

        if (data.error) throw new Error(data.error);

        // Дальше твой код разбора JSON (как мы делали изначально)
        // В data придет чистый JSON ответ от НСПК!

        // Например, цена: data.ticketPrice или как там она в API называется
        // ...
    } catch (error) {
        console.error('Ошибка:', error);
        alert('Не удалось получить данные о билете.');
    }
};

const onScanFailure = (error) => {
    // Поиск QR-кода происходит каждые пару миллисекунд, ошибки игнорируем
};

const generateQRCode = () => {
    const qrText = `ЛраырарыдфлаврдывапрщыиаловлырвимжЛраырарыдфлаврдывапрщыиаловлырвимж`;
    const qrContainer = document.getElementById('tsinfo');
    const qrPosition = document.getElementById('qrcode');

    if (!qrPosition || !qrContainer) return;
    qrPosition.innerHTML = '';

    const containerWidth = qrContainer.offsetWidth;

    new QRCode(qrPosition, {
        text: qrText,
        width: containerWidth,
        height: containerWidth,
        colorDark: '#000000',
        colorLight: '#f5f2e9',
        correctLevel: QRCode.CorrectLevel.M,
    });
};

generateQRCode();

const toggleHeader = () => {
    const main = document.getElementById('main');
    const inputForm = document.getElementById('inputForm');
    main.classList.toggle('hidden');
    inputForm.classList.toggle('hidden');
};

let timerInterval = null;

const diffUpdater = () => {
    const genTimeStr = localStorage.getItem('generationTime');
    if (!genTimeStr) return;

    const genTime = Number.parseInt(genTimeStr);
    const now = new Date();
    const diffSeconds = Math.max(
        0,
        Math.floor((now.getTime() - genTime) / 1000),
    );

    const minutes = Math.floor(diffSeconds / 60)
        .toString()
        .padStart(2, '0');
    const seconds = (diffSeconds % 60).toString().padStart(2, '0');

    const diffElem = document.getElementById('diff');
    if (diffElem) diffElem.textContent = `${minutes}:${seconds}`;
};

const updateData = () => {
    const genTimeStr = localStorage.getItem('generationTime');
    if (!genTimeStr) return;

    const genTime = Number.parseInt(genTimeStr);
    const now = new Date();

    const timegen = new Date(genTime);
    const formattedDateTime = timegen
        .toLocaleString('ru-RU', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        })
        .replace(',', '');

    const dateElem = document.getElementById('date');
    if (dateElem) dateElem.textContent = formattedDateTime;

    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');

    const numeros = `${year}${month}${day}074922290`;
    const numElem = document.getElementById('numeros');
    if (numElem) numElem.textContent = numeros;

    const type = localStorage.getItem('type') || '';
    const number = localStorage.getItem('number') || '';
    const ts = localStorage.getItem('ts') || '';

    const typeElem = document.getElementById('type');
    const numberElem = document.getElementById('number');
    const tsOutElem = document.getElementById('ts_out');

    if (typeElem) typeElem.textContent = type;
    if (numberElem) numberElem.textContent = number;
    if (tsOutElem) tsOutElem.textContent = ts;

    diffUpdater();
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(diffUpdater, 1000);
};

const GenerateFullTicket = () => {
    const now = new Date();
    localStorage.setItem('generationTime', now.getTime());
    localStorage.setItem(
        'type',
        document.getElementById('transportType').value,
    );
    localStorage.setItem('number', document.getElementById('tramNumber').value);
    localStorage.setItem('ts', document.getElementById('ts').value);

    updateData();
    toggleHeader();
};

updateData();

const tg = window.Telegram.WebApp;
tg.expand(); // Раскрыть на весь экран

// Список званий точно как в твоем файле + названия
const RANKS = [
    {id: 1, name: "Bronze I", img: "bronze1.png"},
    {id: 2, name: "Bronze II", img: "bronze2.png"},
    {id: 3, name: "Bronze III", img: "bronze3.png"},
    {id: 4, name: "Bronze IV", img: "bronze4.png"},
    {id: 5, name: "Silver I", img: "silver1.png"},
    {id: 6, name: "Silver II", img: "silver2.png"},
    {id: 7, name: "Silver III", img: "silver3.png"},
    {id: 8, name: "Silver IV", img: "silver4.png"},
    {id: 9, name: "Gold I", img: "gold1.png"},
    {id: 10, name: "Gold II", img: "gold2.png"},
    {id: 11, name: "Gold III", img: "gold3.png"},
    {id: 12, name: "Gold IV", img: "gold4.png"},
    {id: 13, name: "Phoenix", img: "phoenix.png"},
    {id: 14, name: "Ranger", img: "ranger.png"},
    {id: 15, name: "Champion", img: "champion.png"},
    {id: 16, name: "Master", img: "master.png"},
    {id: 17, name: "Elite", img: "elite.png"},
    {id: 18, name: "The Legend", img: "legend.png"}
];

let order = {
    mode: null,
    currentRankId: null,
    targetRankId: null,
    price: 0
};

// 1. Выбор режима
function selectMode(mode) {
    order.mode = mode;
    document.getElementById('step-mode').classList.add('completed');
    document.getElementById('step-current').classList.remove('hidden');
    renderRanks('current'); // Рисуем звания для выбора текущего
}

// 2. Рендер сетки званий
function renderRanks(type) {
    const container = document.getElementById(type + '-ranks-grid');
    container.innerHTML = '';

    RANKS.forEach(rank => {
        // Если выбираем ЦЕЛЬ, то нельзя выбрать звание меньше или равное текущему
        if (type === 'target' && rank.id <= order.currentRankId) return;

        const card = document.createElement('div');
        card.className = 'rank-card';
        card.onclick = () => handleRankSelect(type, rank);

        const img = document.createElement('img');
        img.src = "img/" + rank.img; // Предполагается папка img
        
        const name = document.createElement('p');
        name.innerText = rank.name;

        card.appendChild(img);
        card.appendChild(name);
        container.appendChild(card);
    });
}

// 3. Обработка клика по званию
function handleRankSelect(type, rank) {
    if (type === 'current') {
        order.currentRankId = rank.id;
        order.currentRankName = rank.name;
        
        document.getElementById('step-current').classList.add('hidden'); // Скрываем или сворачиваем
        document.getElementById('step-target').classList.remove('hidden');
        renderRanks('target'); // Рисуем следующие звания
    } else {
        order.targetRankId = rank.id;
        order.targetRankName = rank.name;
        
        // Считаем цену (простая формула)
        const steps = order.targetRankId - order.currentRankId;
        order.price = steps * 100; // 100р за шаг, поменяешь как надо

        // Показываем главную кнопку Telegram
        tg.MainButton.text = `Оплатить ${order.price}₽`;
        tg.MainButton.show();
    }
}

// 4. Отправка данных боту
tg.MainButton.onClick(() => {
    const dataToSend = {
        mode: order.mode,
        current: order.currentRankName,
        target: order.targetRankName,
        price: order.price
    };
    tg.sendData(JSON.stringify(dataToSend));
});

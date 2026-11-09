const sourceJson = `{
  "event": {
    "title": "Ночь в музее",
    "date": "15 ноября, 18:30",
    "place": "Музей космонавтики, проспект Мира, 111",
    "description": "Вечерняя программа с выставкой и экскурсиями",
    "meeting": "Сбор: 18:30. Начало: 19:00."
  },
  "services": [
    { "id": "guide", "title": "  Экскурсия с гидом  ", "price": 500 },
    { "id": "audio", "title": "Аудиогид", "price": 350 },
    { "id": "catalog", "title": "Каталог выставки", "price": 250 }
  ]
}`;

const programButton = document.querySelector('#show-program');
const program = document.querySelector('#program');
const serviceForm = document.querySelector('#service-form');
const guide = document.querySelector('#guide');
const audio = document.querySelector('#audio');
const catalog = document.querySelector('#catalog');
const choiceError = document.querySelector('#choice-error');
const dataError = document.querySelector('#data-error');
const result = document.querySelector('#result');
const reportJsonOutput = document.querySelector('#report-json');

let data;

function buildReport(services, guideChecked, audioChecked, catalogChecked) {
    const checkedById = {
        guide: guideChecked,
        audio: audioChecked,
        catalog: catalogChecked
    };

    const items = services
        .filter(service => checkedById[service.id] === true)
        .map(service => {
            const { title, price } = service;
            return { title: title.trim(), price };
        });

    const total = items.reduce((sum, item) => sum + item.price, 0);

    return { count: items.length, total, items };
}

function showProgram() {
    program.innerHTML = data.event.meeting;
    program.hidden = false;
}

function handleServiceSubmit(event) {
    event.preventDefault();

    const report = buildReport(data.services, guide.checked, audio.checked, catalog.checked);

    if (report.count === 0) {
        choiceError.textContent = 'Выберите хотя бы одну услугу.';
        choiceError.hidden = false;
        result.hidden = true;
        reportJsonOutput.hidden = true;
        return;
    }

    const reportJson = JSON.stringify(report);
    JSON.parse(reportJson);

    result.innerHTML = [
        `Выбрано услуг: ${report.count}`,
        `Итого: ${report.total} руб.`,
        ...report.items.map(item => item.title)
    ].join('<br>');
    reportJsonOutput.textContent = reportJson;

    choiceError.hidden = true;
    result.hidden = false;
    reportJsonOutput.hidden = false;
}

function init() {
    try {
        data = JSON.parse(sourceJson);
    } catch {
        dataError.textContent = 'Ошибка данных.';
        dataError.hidden = false;
        return;
    }

    programButton.addEventListener('click', showProgram);
    serviceForm.addEventListener('submit', handleServiceSubmit);
    serviceForm.hidden = false;
}

init();
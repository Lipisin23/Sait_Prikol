const API_URL = 'https://weth-esp.matvejkotenko87.workers.dev/api/data';

async function fetchData() {
  try {
    // Показываем состояние загрузки
    document.getElementById('data').classList.add('updating');
    
    const response = await fetch(API_URL);
    const data = await response.json();
    
    updateDisplay(data);
  } catch (error) {
    console.error('Ошибка:', error);
    document.getElementById('updated').textContent = 'Ошибка при обновлении';
    document.getElementById('updated').style.color = 'var(--error-color)';
  } finally {
    document.getElementById('data').classList.remove('updating');
  }
}

function updateDisplay(data) {
  const tempElem = document.getElementById('temp');
  const humElem = document.getElementById('hum');
  const presElem = document.getElementById('pres');
  const updatedElem = document.getElementById('updated');
  
  if (data.temperature !== null) {
    tempElem.textContent = data.temperature.toFixed(1);
    tempElem.className = 'data-value temperature-value';
  } else {
    tempElem.textContent = '--';
    tempElem.className = 'data-value';
  }
  
  if (data.humidity !== null) {
    humElem.textContent = data.humidity.toFixed(1);
    humElem.className = 'data-value humidity-value';
  } else {
    humElem.textContent = '--';
    humElem.className = 'data-value';
  }
  
  if (data.pressure !== null) {
    presElem.textContent = data.pressure.toFixed(1);
    presElem.className = 'data-value pressure-value';
  } else {
    presElem.textContent = '--';
    presElem.className = 'data-value';
  }
  
  if (data.lastUpdated) {
    const date = new Date(data.lastUpdated);
    updatedElem.textContent = date.toLocaleString();
    updatedElem.style.color = 'var(--success-color)';
  } else {
    updatedElem.textContent = 'Данные не получены';
    updatedElem.style.color = 'var(--text-light)';
  }
}

// Первый запрос сразу
fetchData();

// Затем каждые 10 секунд
setInterval(fetchData, 10000);

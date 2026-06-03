// Configuration - fetch from local JSON instead of Google Sheets
const jsonUrl = './data.json';

let allData = [];
let filteredData = [];
let cards = [];

console.log('Fetching from:', jsonUrl);

// Fetch data from local JSON file
fetch(jsonUrl)
  .then(response => {
    console.log('Response status:', response.status);
    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
    console.log('Data received:', data);
    console.log('Number of items:', data.length);
    
    allData = data;
    filteredData = [...allData];
    renderGallery();
    setupSearch();
    updateStats();
  })
  .catch(error => {
    console.error('Error fetching JSON:', error);
    const gallery = document.getElementById('gallery');
    gallery.innerHTML = `<div class="no-data">Error loading data: ${error.message}</div>`;
  });

function renderGallery() {
  const gallery = document.getElementById('gallery');
  gallery.innerHTML = '';
  cards = [];

  if (!filteredData || filteredData.length === 0) {
    gallery.innerHTML = '<div class="no-data">No data found</div>';
    return;
  }

  filteredData.forEach((item, index) => {
    const card = document.createElement('div');
    card.className = 'card collapsed';
    
    const header = document.createElement('div');
    header.className = 'card-header';
    header.onclick = () => toggleCard(index);
    
    const title = document.createElement('div');
    title.className = 'card-title';
    title.textContent = `Match #${allData.indexOf(item) + 1}: ${item['Shared Words'] || 'N/A'}`;
    
    const meta = document.createElement('div');
    meta.className = 'card-meta';
    meta.innerHTML = `<strong>${item['Match Tier'] || 'N/A'}</strong> | Score: ${item['Match Score'] || 'N/A'}`;
    
    const toggle = document.createElement('div');
    toggle.className = 'toggle-icon';
    toggle.textContent = '▶';
    
    header.appendChild(title);
    header.appendChild(meta);
    header.appendChild(toggle);
    
    const content = document.createElement('div');
    content.className = 'card-content';
    
    // Dd Paragraph Preview
    const ddSection = document.createElement('div');
    ddSection.className = 'card-section';
    ddSection.innerHTML = `
      <div class="section-label">Dd Paragraph Preview:</div>
      <div class="section-content">${item['Dd Paragraph Preview'] || 'N/A'}</div>
    `;
    
    // PY Paragraph Preview
    const pySection = document.createElement('div');
    pySection.className = 'card-section';
    pySection.innerHTML = `
      <div class="section-label">PY Paragraph Preview:</div>
      <div class="section-content">${item['PY Paragraph Preview'] || 'N/A'}</div>
    `;
    
    // Shared Words
    const sharedSection = document.createElement('div');
    sharedSection.className = 'card-section';
    sharedSection.innerHTML = `
      <div class="section-label">Shared Words:</div>
      <div class="section-content">${item['Shared Words'] || 'N/A'}</div>
    `;
    
    // Additional metadata
    const metaSection = document.createElement('div');
    metaSection.className = 'card-section';
    metaSection.innerHTML = `
      <div class="section-label">Details:</div>
      <div class="section-content">
        <strong>Rank:</strong> ${item['Candidate Rank'] || 'N/A'}<br>
        <strong>Match Tier:</strong> ${item['Match Tier'] || 'N/A'}<br>
        <strong>IDF Cosine:</strong> ${item['IDF Cosine'] || 'N/A'}<br>
        <strong>Shared Distinct Words:</strong> ${item['Shared Distinct Words'] || 'N/A'}<br>
        <strong>PY Sentence Range:</strong> ${item['PY Sentence Range'] || 'N/A'}
      </div>
    `;
    
    content.appendChild(ddSection);
    content.appendChild(pySection);
    content.appendChild(sharedSection);
    content.appendChild(metaSection);
    
    card.appendChild(header);
    card.appendChild(content);
    gallery.appendChild(card);
    cards.push(card);
  });
}

function toggleCard(index) {
  const card = cards[index];
  if (card.classList.contains('collapsed')) {
    card.classList.remove('collapsed');
    card.classList.add('expanded');
  } else {
    card.classList.add('collapsed');
    card.classList.remove('expanded');
  }
}

function expandAll() {
  cards.forEach(card => {
    card.classList.remove('collapsed');
    card.classList.add('expanded');
  });
}

function collapseAll() {
  cards.forEach(card => {
    card.classList.add('collapsed');
    card.classList.remove('expanded');
  });
}

function setupSearch() {
  const searchInput = document.getElementById('searchInput');
  searchInput.addEventListener('keyup', (e) => {
    const query = e.target.value.toLowerCase();
    
    if (query === '') {
      filteredData = [...allData];
    } else {
      filteredData = allData.filter(item => {
        const sharedWords = (item['Shared Words'] || '').toLowerCase();
        const ddPreview = (item['Dd Paragraph Preview'] || '').toLowerCase();
        const pyPreview = (item['PY Paragraph Preview'] || '').toLowerCase();
        
        return sharedWords.includes(query) || ddPreview.includes(query) || pyPreview.includes(query);
      });
    }
    
    renderGallery();
    updateStats();
  });
}

function updateStats() {
  const resultCount = document.getElementById('resultCount');
  if (filteredData.length === allData.length) {
    resultCount.textContent = `Showing all ${allData.length} matches`;
  } else {
    resultCount.textContent = `Showing ${filteredData.length} of ${allData.length} matches`;
  }
}

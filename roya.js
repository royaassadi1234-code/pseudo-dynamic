// Configuration
const SHEET_ID = '12RfhLBWxO8mJAcnY1OvsRNktxzETsJvFHE2zXFDO8as';
const SHEET_GID = '956712292';
const jsonUrl = `https://opensheet.elk.sh/${SHEET_ID}/${SHEET_GID}`;

// Fetch data from Google Sheets using opensheet API
fetch(jsonUrl)
  .then(response => {
    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
    const gallery = document.getElementById('gallery');
    
    data.forEach(item => {
      const card = document.createElement('div');
      card.className = 'card';
      
      const link = document.createElement('a');
      link.href = item.Link || '#';
      link.target = '_blank';
      
      const img = document.createElement('img');
      img.src = item.Image || '';
      img.alt = item.Title || '';
      img.loading = 'lazy';
      
      const content = document.createElement('div');
      content.className = 'card-content';
      
      const title = document.createElement('div');
      title.className = 'card-title';
      title.textContent = item.Title || '';
      
      const description = document.createElement('div');
      description.className = 'card-description';
      description.textContent = item.Description || '';
      
      content.appendChild(title);
      content.appendChild(description);
      
      link.appendChild(img);
      link.appendChild(content);
      
      card.appendChild(link);
      gallery.appendChild(card);
    });
  })
  .catch(error => {
    console.error('Error fetching JSON:', error);
  });

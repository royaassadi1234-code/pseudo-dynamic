// Configuration
const SHEET_ID = '12RfhLBWxO8mJAcnY1OvsRNktxzETsJvFHE2zXFDO8as';
const SHEET_GID = '956712292';
const jsonUrl = `https://opensheet.elk.sh/${SHEET_ID}/${SHEET_GID}`;

console.log('Fetching from:', jsonUrl);

// Fetch data from Google Sheets using opensheet API
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
    
    const gallery = document.getElementById('gallery');
    
    if (!data || data.length === 0) {
      gallery.innerHTML = '<p>No data found in sheet</p>';
      return;
    }
    
    data.forEach((item, index) => {
      console.log(`Item ${index}:`, item);
      
      const card = document.createElement('div');
      card.className = 'card';
      
      const ddPreview = document.createElement('div');
      ddPreview.className = 'card-section';
      ddPreview.innerHTML = `<strong>Dd Paragraph Preview:</strong><br>${item['Dd Paragraph Preview'] || 'N/A'}`;
      
      const pyPreview = document.createElement('div');
      pyPreview.className = 'card-section';
      pyPreview.innerHTML = `<strong>PY Paragraph Preview:</strong><br>${item['PY Paragraph Preview'] || 'N/A'}`;
      
      const sharedWords = document.createElement('div');
      sharedWords.className = 'card-section';
      sharedWords.innerHTML = `<strong>Shared Words:</strong><br>${item['Shared Words'] || 'N/A'}`;
      
      card.appendChild(ddPreview);
      card.appendChild(pyPreview);
      card.appendChild(sharedWords);
      
      gallery.appendChild(card);
    });
  })
  .catch(error => {
    console.error('Error fetching JSON:', error);
    const gallery = document.getElementById('gallery');
    gallery.innerHTML = `<p style="color: red;">Error loading data: ${error.message}</p>`;
  });

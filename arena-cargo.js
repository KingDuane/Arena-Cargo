(() => {
  let arenaPage = 1;
  let isLoading = false;

  async function fetchArenaChannel(channelSlug) {
    try {
      console.log('Fetching page:', arenaPage);
      const response = await fetch(`https://api.are.na/v2/channels/${channelSlug}/contents?page=${arenaPage}&per=100&direction=desc`);
      const data = await response.json();
      console.log('Received data:', data);
      return data;
    } catch (error) {
      console.error('Error fetching Arena channel:', error);
    }
  }

  function displayArenaContent(blocks, append = false) {
    try {
      const container = document.getElementById('arena-content');
      if (!container) {
        console.error('Container element not found!');
        return;
      }
      
      if (!append) {
        container.innerHTML = '';
      }
      
      blocks.contents.forEach(block => {
        const element = document.createElement('div');
        element.className = 'block';
        
        if (block.class === 'Image') {
          const imageUrl = block.image?.display?.url;
          if (imageUrl) {
            element.innerHTML = `<img src="${imageUrl}" alt="${block.title || ''}" loading="lazy">`;
          }
        } else if (block.class === 'Text') {
          element.innerHTML = block.content || '';
        } else if (block.class === 'Link') {
          const imageUrl = block.image?.display?.url;
          element.innerHTML = `
            <a href="${block.source?.url}" target="_blank" class="link-block">
              ${imageUrl ? `<img src="${imageUrl}" alt="${block.title || ''}" loading="lazy">` : ''}
              <p class="link-title">${block.title || ''}</p>
            </a>`;
        } 
        
        if (element.innerHTML) {
          container.appendChild(element);
        }
      });
      
      // Add styles dynamically
      if (!document.getElementById('arena-styles')) {
        const styles = document.createElement('style');
        styles.id = 'arena-styles';
        styles.textContent = `
          #arena-content {
            width: 100%;
            max-width: 1200px;
            margin: 0 auto;
          }
          
          .block {
            margin-bottom: 2rem;
          }
          
          .block img {
            max-width: 100%;
            height: auto;
            display: block;
          }
          
          .link-block {
            text-decoration: none;
            color: inherit;
            display: block;
          }
          
          .link-title {
            margin-top: 0.5rem;
            font-size: 0.9rem;
          }
        `;
        document.head.appendChild(styles);
      }
    } catch (error) {
      console.error('Error displaying content:', error);
    }
  }

  async function loadMore() {
    if (isLoading) return;
    isLoading = true;

    const data = await fetchArenaChannel('effusum');
    if (data && data.contents) {
      displayArenaContent(data, arenaPage > 1);
      arenaPage++;
    }
    
    isLoading = false;
  }

  // Scroll handler
  window.addEventListener('scroll', () => {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 1000) {
      loadMore();
    }
  });

  // Initial load when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadMore);
  } else {
    loadMore();
  }
})();

// Fetch and parse data.json
async function loadAppData() {
  try {
    const response = await fetch('data.json');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to load app data:', error);
    return null;
  }
}

async function init() {
  const data = await loadAppData();
  if (!data) return;

  // Apply ALL data-driven styles before revealing
  const settings = data.sections.app_settings;
  document.documentElement.style.setProperty('--primary-color', settings.primary_color.value);
  document.documentElement.style.setProperty('--secondary-color', settings.secondary_color.value);
  document.documentElement.style.setProperty('--background-color', settings.background_color.value);
  document.documentElement.style.setProperty('--text-color', settings.text_color.value);
  document.documentElement.style.setProperty('--accent-color', settings.accent_color.value);
  document.documentElement.style.setProperty('--header-background', settings.header_background.value);
  document.documentElement.style.setProperty('--header-text-color', settings.header_text_color.value);

  if (settings.background_image && settings.background_image.value) {
      document.documentElement.style.setProperty('--bg-image', `url(${settings.background_image.value})`);
  }

  // Populate Storefront Header
  const storefront = data.sections.storefront;

  // Handle store name
  const storeNameElement = document.getElementById('store-name');
  if (storefront.store_name && storefront.store_name.value) {
    storeNameElement.textContent = storefront.store_name.value;
  } else {
    storeNameElement.style.display = 'none';
  }

  // Handle logo
  const logoElement = document.getElementById('store-logo');
  if (storefront.logo && storefront.logo.value) {
    logoElement.src = storefront.logo.value;
  } else {
    logoElement.style.display = 'none';
  }

  // Populate Ticker Announcement
  if (storefront.announcement && storefront.announcement.value) {
    document.getElementById('announcement-text').textContent = storefront.announcement.value;
    document.getElementById('announcement-text-dup').textContent = storefront.announcement.value;
  }

  // Render Categories and Products
  const categories = data.sections.categories.value;
  const products = data.sections.products.value;
  const menuGrid = document.getElementById('menu-grid');

  // Sort categories by sort_order
  const sortedCategories = [...categories].sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));

  sortedCategories.forEach(category => {
    // Filter products for this category
    const categoryProducts = products.filter(p => p.category === category.id);

    // Only render column if it has products
    if (categoryProducts.length === 0) return;

    // Create Category Column
    const col = document.createElement('div');
    col.className = 'category-column';
    col.innerHTML = `<h2 class="category-title">${category.name}</h2>`;

    const productList = document.createElement('div');
    productList.className = 'product-list';

    // Populate Products
    categoryProducts.forEach(product => {
      const item = document.createElement('div');
      item.className = 'product-item';

      const hasSavings = product.savings && product.savings.trim() !== '';
      const hasRegularPrice = product.regular_price && product.regular_price.trim() !== '';

      item.innerHTML = `
        <div class="product-header">
          <div class="product-name">${product.name}</div>
          <div class="product-price-container">
            ${hasRegularPrice ? `<div class="product-regular-price">${product.regular_price}</div>` : ''}
            <div class="product-sale-price">${product.sale_price}</div>
          </div>
        </div>
        ${hasSavings ? `<div class="product-savings">${product.savings}</div>` : ''}
      `;
      productList.appendChild(item);
    });

    col.appendChild(productList);
    menuGrid.appendChild(col);
  });

  // Reveal the app — all styles and content are now applied
  document.getElementById('app-container').classList.add('loaded');
}

// Start application
init();
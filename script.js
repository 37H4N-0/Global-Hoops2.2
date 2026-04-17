const shoeDatabase = [
  { id: 1, brand: "NIKE", name: "Kobe 5 Protro 'Eggplant'", releaseDate: "April 18, 2026 10:00:00", price: 200, hype: 5, img: "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/e4e04410-d9d1-4475-bed0-6e4a2c918e6c/kobe-5-protro-basketball-shoe-9J0v9T.png", tech: "Zoom Turbo" },
  { id: 2, brand: "ADIDAS", name: "AE1 'Best of Adi'", releaseDate: "April 25, 2026 10:00:00", price: 120, hype: 5, img: "https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/7f6517a618e04099a43e49e061c27df6_9366/AE_1_Velocity_Blue_Shoes_Blue_IF1864_01_standard.jpg", tech: "Jet Boost" },
  { id: 3, brand: "JORDAN", name: "Luka 3 'Midnight'", releaseDate: "April 10, 2026 10:00:00", price: 130, hype: 4, img: "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/609426f3-8f0c-4e5a-8b38-d7a8d9a4242d/luka-2-basketball-shoes-v4V9L6.png", tech: "IsoPlate" },
  { id: 4, brand: "PUMA", name: "MB.04 'Rare'", releaseDate: "May 20, 2026 10:00:00", price: 125, hype: 4, img: "https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:f3f3f3,w_600,h_600/global/309851/01/sv01/fnd/PNA/fmt/png/MB.03-Blue-Hive-Basketball-Shoes", tech: "Nitro Foam" },
  { id: 5, brand: "LI-NING", name: "Way of Wade 11", releaseDate: "April 01, 2026 10:00:00", price: 225, hype: 5, img: "https://www.wayofwade.com/cdn/shop/files/1_2989c79e-4e5d-4c81-998a-2c4033c5e8d5_800x.png", tech: "Boom Tech" },
  { id: 6, brand: "ANTA", name: "Kai 1 'Enlightened'", releaseDate: "April 12, 2026 10:00:00", price: 125, hype: 5, img: "https://images.complex.com/complex/images/c_fill,f_auto,g_center,w_1200/fl_lossy,pg_1/v9qjvz6j8f5m7k4n5o9d/anta-kai-1-artist-on-court", tech: "NitroEdge" },
  { id: 7, brand: "NEW BALANCE", name: "Two Wxy V5", releaseDate: "April 16, 2026 10:00:00", price: 120, hype: 3, img: "https://nb.scene7.com/is/image/NB/bb2wxygb_nb_02_i?$pdp_main_v4_lg$&wid=700&hei=700", tech: "FuelCell" },
  { id: 8, brand: "YEEZY", name: "YZY BSKTBL KNIT", releaseDate: "April 17, 2026 09:00:00", price: 300, hype: 5, img: "https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/e2e8e9e9e9e9e9e9e9e9e9e9e9e9e9e9_9366/YZY_BSKTBL_KNIT_Slate_Blue_GV8294_01_standard.jpg", tech: "Full Boost" }
];

function getStockInfo(shoe, isFuture) {
  if (isFuture) return "";
  if (shoe.hype === 5) return '<span class="stock-badge stock-sold">SOLD OUT</span>';
  if (shoe.hype === 4) return '<span class="stock-badge stock-low">LOW STOCK</span>';
  return '<span class="stock-badge stock-ok">AVAILABLE</span>';
}

function renderShoes() {
  const searchTerm = document.getElementById('search-bar').value.toLowerCase();
  const priceLimit = document.getElementById('price-filter').value;
  const fGrid = document.getElementById('future-grid');
  const rGrid = document.getElementById('recent-grid');
  fGrid.innerHTML = ''; rGrid.innerHTML = '';
  const now = new Date().getTime();

  const filtered = shoeDatabase.filter(s => {
    const mSearch = s.name.toLowerCase().includes(searchTerm) || s.brand.toLowerCase().includes(searchTerm);
    const mPrice = priceLimit === 'all' || s.price <= parseInt(priceLimit);
    return mSearch && mPrice;
  });

  filtered.forEach(shoe => {
    const isFuture = new Date(shoe.releaseDate).getTime() > now;
    const card = document.createElement('div');
    card.className = 'shoe-card';
    card.onclick = () => openModal(shoe);
    
    const tag = isFuture ? `<div id="t-${shoe.id}" class="timer-box">00:00:00</div>` : `<div class="status-label">RELEASED ${getStockInfo(shoe, false)}</div>`;
    
    card.innerHTML = `
      <div class="image-container"><img src="${shoe.img}"></div>
      <div class="hype-meter">${"🔥".repeat(shoe.hype)}</div>
      <div class="brand-label">${shoe.brand}</div>
      ${tag}
      <div class="shoe-name">${shoe.name}</div>
      <div class="shoe-price">$${shoe.price}</div>
    `;
    if (isFuture) { fGrid.appendChild(card); startTimer(shoe.releaseDate, `t-${shoe.id}`); } 
    else { rGrid.appendChild(card); }
  });
}

function startTimer(date, id) {
  const target = new Date(date).getTime();
  const timer = setInterval(() => {
    const diff = target - new Date().getTime();
    if (diff < 0) { clearInterval(timer); renderShoes(); return; }
    const d = Math.floor(diff/864e5), h = Math.floor((diff%864e5)/36e5), m = Math.floor((diff%36e5)/6e4), s = Math.floor((diff%6e4)/1000);
    const el = document.getElementById(id);
    if (el) el.innerText = `${d}D:${h}H:${m}M:${s}S`;
  }, 1000);
}

function openModal(shoe) {
  const m = document.getElementById('modal');
  const now = new Date().getTime();
  const isFuture = new Date(shoe.releaseDate).getTime() > now;
  const isSoldOut = !isFuture && shoe.hype === 5;
  
  const actionBtn = isFuture 
    ? `<button class="notify-btn">NOTIFY ON RELEASE</button>`
    : isSoldOut ? `<button class="buy-btn disabled">SOLD OUT - CHECK RESALE</button>` : `<a href="https://stockx.com/search?s=${encodeURIComponent(shoe.name)}" target="_blank" class="buy-btn">SHOP NOW</a>`;

  document.getElementById('modal-body').innerHTML = `
    <img src="${shoe.img}" style="width:100%; filter: drop-shadow(0 30px 60px rgba(0,0,0,0.2));">
    <div class="modal-info">
      <p style="color:var(--accent); font-weight:900;">${shoe.brand} // HYPE: ${"🔥".repeat(shoe.hype)}</p>
      <h2 style="margin-bottom:20px;">${shoe.name}</h2>
      <p style="border-top: 1px solid var(--border); padding-top: 20px;"><strong>MSRP:</strong> $${shoe.price} | <strong>TECH:</strong> ${shoe.tech}</p>
      ${actionBtn}
    </div>`;
  m.style.display = "block"; document.body.classList.add('modal-open');
}

function initHero() {
  const highHype = shoeDatabase.filter(s => s.hype === 5);
  const featured = highHype[Math.floor(Math.random() * highHype.length)];
  document.getElementById('featured-hero').innerHTML = `
    <div class="hero-content">
      <div class="hero-text"><h3>FEATURED DROP</h3><h2>${featured.name}</h2><button class="buy-btn" onclick="openModalById(${featured.id})" style="width:auto; padding:15px 40px;">VIEW DETAILS</button></div>
      <div class="hero-img"><img src="${featured.img}"></div>
    </div>`;
}

window.openModalById = (id) => openModal(shoeDatabase.find(s => s.id === id));
document.getElementById('theme-toggle').onclick = () => { document.body.classList.toggle('dark-theme'); };
document.getElementById('search-bar').oninput = renderShoes;
document.getElementById('price-filter').onchange = renderShoes;
document.querySelector('.modal-close').onclick = () => { document.getElementById('modal').style.display = "none"; document.body.classList.remove('modal-open'); };

setInterval(() => { document.getElementById('live-clock').innerText = new Date().toLocaleTimeString(); }, 1000);
initHero(); renderShoes();

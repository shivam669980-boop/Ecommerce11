import { Product, ProductVariant } from '../store/cartStore';

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image_url: string;
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
  logo_url: string;
  description: string;
}

export const INITIAL_CATEGORIES: Category[] = [
  { id: 'c1', name: 'Electronics', slug: 'electronics', description: 'High-end audio, visual, and smart tech devices.', image_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=600' },
  { id: 'c2', name: 'Smartphones', slug: 'smartphones', description: 'Flagship and premium modern mobile devices.', image_url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=600' },
  { id: 'c3', name: 'Laptops', slug: 'laptops', description: 'Powerful computation units for work, creativity, and gaming.', image_url: 'https://images.unsplash.com/photo-1496181130204-7552cc145cdb?q=80&w=600' },
  { id: 'c4', name: 'Fashion', slug: 'fashion', description: 'Designer clothing, outerwear, and wardrobe essentials.', image_url: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=600' },
  { id: 'c5', name: 'Shoes', slug: 'shoes', description: 'Premium sneakers, athletic wear, and formal dress shoes.', image_url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=600' },
  { id: 'c6', name: 'Beauty', slug: 'beauty', description: 'Haircare, skincare, fragrance, and premium styling tech.', image_url: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=600' },
  { id: 'c7', name: 'Home', slug: 'home', description: 'Air purifiers, smart lighting, decor, and automation.', image_url: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?q=80&w=600' },
  { id: 'c8', name: 'Furniture', slug: 'furniture', description: 'Luxury armchairs, office set-ups, beds, and modular systems.', image_url: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=600' },
  { id: 'c9', name: 'Kitchen', slug: 'kitchen', description: 'Smart appliances, knives, professional dinnerware, and utility.', image_url: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=600' },
  { id: 'aa', name: 'Fitness', slug: 'fitness', description: 'Smart wearables, training bags, dumbbells, and active accessories.', image_url: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=600' }
];

export const INITIAL_BRANDS: Brand[] = [
  { id: 'b1', name: 'Apple', slug: 'apple', logo_url: 'https://logo.clearbit.com/apple.com', description: 'Innovative designer of consumer electronics and computers.' },
  { id: 'b2', name: 'Samsung', slug: 'samsung', logo_url: 'https://logo.clearbit.com/samsung.com', description: 'Global leader in display panels, smart chips, and home appliances.' },
  { id: 'b3', name: 'Sony', slug: 'sony', logo_url: 'https://logo.clearbit.com/sony.com', description: 'Legendary Japanese engineering in audio, optics, and gaming systems.' },
  { id: 'b4', name: 'Nike', slug: 'nike', logo_url: 'https://logo.clearbit.com/nike.com', description: 'The ultimate athletic, streetwear, and sportswear active brand.' },
  { id: 'b5', name: 'Adidas', slug: 'adidas', logo_url: 'https://logo.clearbit.com/adidas.com', description: 'Premium German athletic brand offering casual elegance.' },
  { id: 'b6', name: 'L\'Oreal', slug: 'loreal', logo_url: 'https://logo.clearbit.com/loreal.com', description: 'World leader in cellular skincare, premium cosmetics, and haircare.' },
  { id: 'b7', name: 'Dyson', slug: 'dyson', logo_url: 'https://logo.clearbit.com/dyson.com', description: 'Premium airflow engineering in vacuums, purifiers, and beauty tools.' },
  { id: 'b8', name: 'IKEA', slug: 'ikea', logo_url: 'https://logo.clearbit.com/ikea.com', description: 'Beautiful, modular, Scandinavian home furniture and accessories.' },
  { id: 'b9', name: 'Under Armour', slug: 'under-armour', logo_url: 'https://logo.clearbit.com/underarmour.com', description: 'High-performance moisture-wicking and training fabrics.' },
  { id: 'b10', name: 'Dell', slug: 'dell', logo_url: 'https://logo.clearbit.com/dell.com', description: 'High-tier productivity laptops, computers, and visual displays.' }
];

export interface DetailedProduct extends Product {
  long_description: string;
  rating: number;
  reviews_count: number;
  sku: string;
  brand: string;
  category: string;
  options: { name: string; values: string[] }[];
  variants?: ProductVariant[];
  specifications: Record<string, string>;
  faqs: { q: string; a: string }[];
}

export const INITIAL_PRODUCTS: DetailedProduct[] = [];

// Helper to generate products efficiently
const categoriesMap = {
  electronics: 'c1', smartphones: 'c2', laptops: 'c3', fashion: 'c4', shoes: 'c5',
  beauty: 'c6', home: 'c7', furniture: 'c8', kitchen: 'c9', fitness: 'c10'
};

const brandsMap = {
  apple: 'Apple', samsung: 'Samsung', sony: 'Sony', nike: 'Nike', adidas: 'Adidas',
  loreal: 'L\'Oreal', dyson: 'Dyson', ikea: 'IKEA', 'under-armour': 'Under Armour', dell: 'Dell'
};

// 1. ELECTRONICS (10 PRODUCTS)
const electronicsNames = [
  'Sony WH-1000XM5 ANC Headphones', 'Sony HT-A7000 Dolby Atmos Soundbar', 'Apple HomePod 2nd Gen Speaker',
  'Sony BRAVIA XR 65-Inch OLED TV', 'Apple TV 4K 128GB Wi-Fi + Ethernet', 'Dell Professional Soundbar Speaker',
  'Dyson Pure Cool Tower Fan AM07', 'Sony Alpha 7R V Full Frame Mirrorless Camera', 'Apple Watch Ultra 2 Titanium LTE',
  'Sony PlayStation VR2 Headset'
];
const electronicsPrices = [450000, 1350000, 380000, 2800000, 190000, 75000, 520000, 4600000, 1250000, 980000];
const electronicsDiscounts = [11, 7, 8, 5, 3, 9, 4, 6, 8, 9];
const electronicsSkus = ['SONY-WH-XM5', 'SONY-HT-A7000', 'APL-HOMEPOD2', 'SONY-BRV-OLED65', 'APL-TV4K-128', 'DELL-SB-521A', 'DYSON-AM07-FAN', 'SONY-ILCE-7RM5', 'APL-WATCH-ULT2', 'SONY-PS-VR2'];
const electronicsBrands = ['Sony', 'Sony', 'Apple', 'Sony', 'Apple', 'Dell', 'Dyson', 'Sony', 'Apple', 'Sony'];
const electronicsImages = [
  'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=600',
  'https://images.unsplash.com/photo-1545454675-3531b543be5d?q=80&w=600',
  'https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=600',
  'https://images.unsplash.com/photo-1593305841991-05c297ba4575?q=80&w=600',
  'https://images.unsplash.com/photo-1585676798150-137b025345cb?q=80&w=600',
  'https://images.unsplash.com/photo-1588444839799-bec60297be66?q=80&w=600',
  'https://images.unsplash.com/photo-1618945032044-cf6ad46cf617?q=80&w=600',
  'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=600',
  'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?q=80&w=600',
  'https://images.unsplash.com/photo-1593508512255-86ab42a8e620?q=80&w=600'
];

// Generate Electronics
for(let i=0; i<10; i++) {
  INITIAL_PRODUCTS.push({
    id: `e-${i+1}`,
    name: electronicsNames[i],
    slug: electronicsNames[i].toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    description: `High-fidelity, premium class ${electronicsNames[i]} designed for maximum utility and seamless operations.`,
    long_description: `Enjoy world class performance with the ${electronicsNames[i]}. Engineered to perfection with luxury materials, exceptional longevity, and standard compatibility. It features state-of-the-art micro-controllers and comes highly recommended by tech enthusiasts worldwide.`,
    price: electronicsPrices[i],
    sale_price: Math.round(electronicsPrices[i] * (1 - electronicsDiscounts[i]/100)),
    discount: electronicsDiscounts[i],
    rating: 4.5 + (i * 0.05) > 5 ? 4.9 : 4.5 + (i * 0.05),
    reviews_count: 50 + (i * 42),
    inventory: 20 + i,
    image_url: electronicsImages[i],
    images: [electronicsImages[i], 'https://images.unsplash.com/photo-1484704849700-f032a568e944?q=80&w=600'],
    sku: electronicsSkus[i],
    brand: electronicsBrands[i],
    category: 'Electronics',
    options: i === 0 
      ? [{ name: 'Color', values: ['Black', 'Silver', 'Midnight Blue'] }]
      : i === 1 
      ? [{ name: 'Bundle', values: ['Standard', 'With Subwoofer', 'Full Home Theater'] }]
      : [{ name: 'Warranty', values: ['1 Year', '2 Year', '3 Year'] }],
    specifications: {
      'Audio Core': 'Computational Surround Processor',
      'Connectivity': 'Bluetooth 5.3 & Ultra-wide Wifi',
      'Active Noise Control': 'Integrated Smart Processor',
      'Battery Rating': 'Up to 30 Hours active playback'
    },
    faqs: [
      { q: 'Is this item shipping globally?', a: 'Yes, we provide high speed prioritized logistics delivery across Nigeria and international sectors.' },
      { q: 'Does this come with warranty card?', a: 'Absolutely, all premium electronics carry a standard verified manufacturer warranty.' }
    ]
  });
}

// 2. SMARTPHONES (10 PRODUCTS)
const smartphoneNames = [
  'Apple iPhone 16 Pro Max', 'Samsung Galaxy S25 Ultra 5G', 'Samsung Galaxy Z Fold 6 5G',
  'Apple iPhone 16 Plus', 'Samsung Galaxy A55 5G', 'Sony Xperia 1 VI 5G Pro',
  'Apple iPhone 15 Pro Max (Refurbished)', 'Samsung Galaxy S24 Ultra 5G', 'Apple iPhone 16 Base Model',
  'Samsung Galaxy Z Flip 6 5G'
];
const smartphonePrices = [2400000, 2300000, 2600000, 1750000, 540000, 1600000, 1650000, 1850000, 1450000, 1480000];
const smartphoneDiscounts = [6, 7, 6, 6, 8, 7, 6, 5, 5, 7];
const smartphoneSkus = ['APL-IPH16PM', 'SAM-S25ULT', 'SAM-FOLD6', 'APL-IPH16PLS', 'SAM-A55-5G', 'SONY-XP1-VI', 'APL-IPH15PM-RF', 'SAM-S24ULT', 'APL-IPH16', 'SAM-FLIP6'];
const smartphoneBrands = ['Apple', 'Samsung', 'Samsung', 'Apple', 'Samsung', 'Sony', 'Apple', 'Samsung', 'Apple', 'Samsung'];
const smartphoneImages = [
  'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=600',
  'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?q=80&w=600',
  'https://images.unsplash.com/photo-1580910051074-3eb694886505?q=80&w=600',
  'https://images.unsplash.com/photo-1523206489230-c012c64b2b48?q=80&w=600',
  'https://images.unsplash.com/photo-1565849563525-ad01e757c585?q=80&w=600',
  'https://images.unsplash.com/photo-1605787020600-b9ebd5df1d07?q=80&w=600',
  'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?q=80&w=600',
  'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=600',
  'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?q=80&w=600',
  'https://images.unsplash.com/photo-1589492477829-5e65395b66cc?q=80&w=600'
];

// Generate Smartphones
for(let i=0; i<10; i++) {
  INITIAL_PRODUCTS.push({
    id: `s-${i+1}`,
    name: smartphoneNames[i],
    slug: smartphoneNames[i].toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    description: `Leading edge technology ${smartphoneNames[i]} equipped with elite processor modules and vibrant dynamic displays.`,
    long_description: `Get outstanding clarity and computing responses with the ${smartphoneNames[i]}. Made from aerospace-grade structural metals, featuring crystal clear camera arrays, fast charging capacities, and next-gen operating software. Perfect for high productivity, content creation, and mobile gaming.`,
    price: smartphonePrices[i],
    sale_price: Math.round(smartphonePrices[i] * (1 - smartphoneDiscounts[i]/100)),
    discount: smartphoneDiscounts[i],
    rating: 4.6 + (i * 0.04) > 5 ? 4.95 : 4.6 + (i * 0.04),
    reviews_count: 100 + (i * 54),
    inventory: 30 + i,
    image_url: smartphoneImages[i],
    images: [smartphoneImages[i], 'https://images.unsplash.com/photo-1573148195900-7845dcb9b127?q=80&w=600'],
    sku: smartphoneSkus[i],
    brand: smartphoneBrands[i],
    category: 'Smartphones',
    options: [
      { name: 'Color', values: i % 2 === 0 ? ['Desert Titanium', 'Natural Titanium', 'Black Titanium'] : ['Awesome Navy', 'Awesome Iceblue'] },
      { name: 'Storage', values: ['256GB', '512GB'] }
    ],
    specifications: {
      'Display Panel': 'Dynamic AMOLED LTPO Retina Display',
      'Processor Chip': i % 2 === 0 ? 'Apple A18 Pro Bionic' : 'Snapdragon 8 Gen Elite',
      'Camera Resolution': '200 Megapixels Triple Grid System',
      'Cellular support': 'Advanced LTE / 5G Dual SIM Active'
    },
    faqs: [
      { q: 'Is this device SIM unlocked?', a: 'Yes! All of our luxury smartphones are completely factory unlocked to support any telecom carrier worldwide.' }
    ]
  });
}

// 3. LAPTOPS (10 PRODUCTS)
const laptopNames = [
  'Apple MacBook Pro 16-Inch M4 Max', 'Dell XPS 15 9530 Creator Laptop', 'Dell Inspiron 16 Plus',
  'Dell Alienware m18 Gaming Laptop', 'Apple MacBook Air 13-Inch M3', 'Dell Latitude 7440 Business Laptop',
  'Dell G15 5530 Gaming Laptop', 'Samsung Galaxy Book4 Ultra', 'Apple MacBook Pro 14-Inch M4',
  'Dell XPS 13 9340 Ultrabook'
];
const laptopPrices = [4800000, 2700000, 1350000, 4950000, 1450000, 1650000, 1150000, 2900000, 2150000, 1680000];
const laptopDiscounts = [4, 6, 5, 4, 5, 6, 6, 5, 7, 6];
const laptopSkus = ['APL-MBP16-M4M', 'DELL-XPS15-9530', 'DELL-INS16-PLS', 'DELL-AW-M18', 'APL-MBA13-M3', 'DELL-LAT7440', 'DELL-G15-4050', 'SAM-GB4-ULT', 'APL-MBP14-M4', 'DELL-XPS13-9340'];
const laptopBrands = ['Apple', 'Dell', 'Dell', 'Dell', 'Apple', 'Dell', 'Dell', 'Samsung', 'Apple', 'Dell'];
const laptopImages = [
  'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=600',
  'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?q=80&w=600',
  'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?q=80&w=600',
  'https://images.unsplash.com/photo-1603302576837-37561b2e2302?q=80&w=600',
  'https://images.unsplash.com/photo-1496181130204-7552cc145cdb?q=80&w=600',
  'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?q=80&w=600',
  'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=600',
  'https://images.unsplash.com/photo-1589492477829-5e65395b66cc?q=80&w=600',
  'https://images.unsplash.com/photo-1531297484001-80022131f5a1?q=80&w=600',
  'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?q=80&w=600'
];

// Generate Laptops
for(let i=0; i<10; i++) {
  INITIAL_PRODUCTS.push({
    id: `l-${i+1}`,
    name: laptopNames[i],
    slug: laptopNames[i].toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    description: `Heavy productivity computing ${laptopNames[i]} carved from lightweight premium aluminum with extreme battery.`,
    long_description: `Run heavy engineering tools, graphic processing models, and smart code engines effortlessly on the ${laptopNames[i]}. Incorporates ultra responsive physical keyboard structures, professional screen setups, and high-frequency active coolers. Built for ultimate creative longevity.`,
    price: laptopPrices[i],
    sale_price: Math.round(laptopPrices[i] * (1 - laptopDiscounts[i]/100)),
    discount: laptopDiscounts[i],
    rating: 4.7 + (i * 0.03) > 5 ? 4.98 : 4.7 + (i * 0.03),
    reviews_count: 40 + (i * 24),
    inventory: 15 + i,
    image_url: laptopImages[i],
    images: [laptopImages[i]],
    sku: laptopSkus[i],
    brand: laptopBrands[i],
    category: 'Laptops',
    options: [
      { name: 'Storage', values: ['512GB SSD', '1TB SSD'] },
      { name: 'Warranty', values: ['1 Year Basic', '3 Year Premium Care'] }
    ],
    specifications: {
      'Memory Array': 'Up to 64GB High Speed Unified',
      'Processor Architecture': i % 2 === 0 ? 'Apple M4 Max SoC' : 'Intel Core Ultra i9 Pro',
      'Disk Space': '1 Terabyte high-speed NVMe SSD',
      'Cooling Grid': 'Cryogenic dynamic dual fans systems'
    },
    faqs: [
      { q: 'Is memory upgradable?', a: 'Dell models allow RAM upgrades post-sale, while Apple custom M-series uses integrated SOC unified memory.' }
    ]
  });
}

// 4. FASHION (10 PRODUCTS)
const fashionNames = [
  'Luxury Silk Evening Gown', 'Nike Windrunner Hooded Jacket', 'Apple Heritage Graphic Tee',
  'Adidas Originals Beckenbauer Jacket', 'Under Armour Storm Fleece Hoodie', 'Nike Premium N1 Leather Bomber',
  'IKEA Comfort Knit Bed Socks (3-Pack)', 'L\'Oreal Paris Designer Silk Scarf', 'Adidas Terrex Primaloft Parka',
  'Under Armour Tactical Duty Pants'
];
const fashionPrices = [320000, 85000, 45000, 92000, 72000, 480000, 12000, 65000, 220000, 88000];
const fashionDiscounts = [9, 8, 7, 8, 10, 6, 17, 11, 10, 9];
const fashionSkus = ['FASH-SLK-GWN', 'NIKE-WND-JKT', 'APL-HRT-TEE', 'ADID-BCK-JKT', 'UA-STRM-HDD', 'NIKE-LTH-BMB', 'IKEA-SOX-3P', 'LOR-SLK-SCRF', 'ADID-TER-PRM', 'UA-TAC-PNT'];
const fashionBrands = ['L\'Oreal', 'Nike', 'Apple', 'Adidas', 'Under Armour', 'Nike', 'IKEA', 'L\'Oreal', 'Adidas', 'Under Armour'];
const fashionImages = [
  'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=600',
  'https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=600',
  'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=600',
  'https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?q=80&w=600',
  'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=600',
  'https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=600',
  'https://images.unsplash.com/photo-1582966772680-860e372bb558?q=80&w=600',
  'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?q=80&w=600',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=600',
  'https://images.unsplash.com/photo-1479064555552-3ef4979f8908?q=80&w=600'
];

// Generate Fashion
for(let i=0; i<10; i++) {
  INITIAL_PRODUCTS.push({
    id: `f-${i+1}`,
    name: fashionNames[i],
    slug: fashionNames[i].toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    description: `Designer premium ${fashionNames[i]} tailored from luxury fabrics for unmatched elegance and comfort.`,
    long_description: `Step out in extreme style with the ${fashionNames[i]}. Meticulously crafted from selected thread fibres that breathe naturally and sit soft on skin. Tailored to retain form, fit, and elegance through extensive wear. Elevates your aesthetic instantly.`,
    price: fashionPrices[i],
    sale_price: Math.round(fashionPrices[i] * (1 - fashionDiscounts[i]/100)),
    discount: fashionDiscounts[i],
    rating: 4.4 + (i * 0.05) > 5 ? 4.85 : 4.4 + (i * 0.05),
    reviews_count: 30 + (i * 45),
    inventory: 50 + i,
    image_url: fashionImages[i],
    images: [fashionImages[i]],
    sku: fashionSkus[i],
    brand: fashionBrands[i],
    category: 'Fashion',
    options: [
      { name: 'Size', values: ['S', 'M', 'L', 'XL'] },
      { name: 'Color', values: ['Black', 'Royal Navy', 'Olive Green'] }
    ],
    specifications: {
      'Material Composition': 'Fine organic luxury threads blend',
      'Stitching Pattern': 'Double-reinforced premium piping lines',
      'Fitment Standard': 'Modern European true-to-size contour',
      'Washing instructions': 'Dry clean only or delicate cold washes'
    },
    faqs: [
      { q: 'Is sizing true-to-fit?', a: 'Yes, our premium fashion articles follow standard size guides. We recommend ordering your usual sizing.' }
    ]
  });
}

// 5. SHOES (10 PRODUCTS)
const shoeNames = [
  'Nike Air Force 1 \'07 Premium', 'Adidas Ultraboost Light Running Shoes', 'Nike Air Max 90 Classic',
  'Adidas Stan Smith Lux Leather', 'Under Armour Charged Assert 10', 'Nike Air Jordan 1 Retro High OG',
  'Adidas Samba OG Classic Leather', 'Luxury Italian Leather Oxford Dress Shoes', 'Under Armour Project Rock Slides',
  'Nike Pegasus 41 Running Shoes'
];
const shoePrices = [165000, 210000, 145000, 125000, 95000, 240000, 110000, 350000, 55000, 135000];
const shoeDiscounts = [9, 7, 7, 8, 7, 8, 10, 11, 11, 7];
const shoeSkus = ['NIKE-AF1-PRM', 'ADID-UBL-RUN', 'NIKE-AM90-CLS', 'ADID-SS-LUX', 'UA-CHRG-10', 'NIKE-AJ1-OG', 'ADID-SAMBA-OG', 'SHOE-OXF-ITA', 'UA-ROCK-SLD', 'NIKE-PEG-41'];
const shoeBrands = ['Nike', 'Adidas', 'Nike', 'Adidas', 'Under Armour', 'Nike', 'Adidas', 'L\'Oreal', 'Under Armour', 'Nike'];
const shoeImages = [
  'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=600',
  'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=600',
  'https://images.unsplash.com/photo-1552346154-21d32810aba3?q=80&w=600',
  'https://images.unsplash.com/photo-1608231387042-66d1773070a5?q=80&w=600',
  'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?q=80&w=600',
  'https://images.unsplash.com/photo-1556906781-9a412961c28c?q=80&w=600',
  'https://images.unsplash.com/photo-1491553895911-0055eca6402d?q=80&w=600',
  'https://images.unsplash.com/photo-1533867617858-e7b97e060509?q=80&w=600',
  'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?q=80&w=600',
  'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=600'
];

// Generate Shoes
for(let i=0; i<10; i++) {
  INITIAL_PRODUCTS.push({
    id: `sh-${i+1}`,
    name: shoeNames[i],
    slug: shoeNames[i].toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    description: `High performance premium active ${shoeNames[i]} designed for superb stride energy returns.`,
    long_description: `Achieve maximum ground contact and cloud comfort transitions with the ${shoeNames[i]}. Features vulcanised rubber grip patterns, flexible woven upper contours, and high frequency cushion beds that return energy instantly. Elegant aesthetic matching casual styling or high intensity track sessions.`,
    price: shoePrices[i],
    sale_price: Math.round(shoePrices[i] * (1 - shoeDiscounts[i]/100)),
    discount: shoeDiscounts[i],
    rating: 4.5 + (i * 0.05) > 5 ? 4.9 : 4.5 + (i * 0.05),
    reviews_count: 80 + (i * 48),
    inventory: 40 + i,
    image_url: shoeImages[i],
    images: [shoeImages[i]],
    sku: shoeSkus[i],
    brand: shoeBrands[i],
    category: 'Shoes',
    options: [
      { name: 'Size', values: ['41', '42', '43', '44', '45'] },
      { name: 'Color', values: ['Classic White', 'Carbon Black', 'Active Sport Neon'] }
    ],
    specifications: {
      'Outsole Composition': 'High traction anti-slip vulcanised rubber',
      'Midsole Tech': 'Reactive pressurized responsive cushion cells',
      'Upper weave': 'Adaptive flex knit breathable mesh fibres',
      'Closure method': 'High speed lock down lace arrays'
    },
    faqs: [
      { q: 'Is it suitable for wide feet?', a: 'Yes! Ultraboost and Nike AF1 models adapt beautifully to wide feet structures.' }
    ]
  });
}

// 6. BEAUTY (10 PRODUCTS)
const beautyNames = [
  'L\'Oreal Revitalift Filler Serum', 'L\'Oreal Paris Age Perfect Night Cream', 'Dyson Supersonic Nural Hair Dryer',
  'Dyson Airwrap Multi-Styler Complete', 'Dyson Corrale Cordless Straightener', 'L\'Oreal Paris Elvive Bond Repair Kit',
  'Luxury Eau de Parfum Gold Edition', 'L\'Oreal Pure Clay Charcoal Mask', 'Dyson Chitosan Styling Post-Styling Cream',
  'L\'Oreal Infallible Matte Lipstick'
];
const beautyPrices = [32000, 38000, 550000, 650000, 480000, 45000, 185000, 18000, 65000, 14000];
const beautyDiscounts = [12, 8, 5, 5, 6, 13, 8, 17, 11, 14];
const beautySkus = ['LOR-REV-FIL', 'LOR-AGE-CRM', 'DYSON-SUP-NUR', 'DYSON-AIR-STYL', 'DYSON-COR-STR', 'LOR-BND-KIT', 'BEAU-PRF-GLD', 'LOR-CLAY-MSK', 'DYSON-CHT-CRM', 'LOR-INF-LIP'];
const beautyBrands = ['L\'Oreal', 'L\'Oreal', 'Dyson', 'Dyson', 'Dyson', 'L\'Oreal', 'L\'Oreal', 'L\'Oreal', 'Dyson', 'L\'Oreal'];
const beautyImages = [
  'https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=600',
  'https://images.unsplash.com/photo-1608248597481-496100c8c836?q=80&w=600',
  'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=600',
  'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?q=80&w=600',
  'https://images.unsplash.com/photo-1527799851257-6592aae8693b?q=80&w=600',
  'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?q=80&w=600',
  'https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=600',
  'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?q=80&w=600',
  'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?q=80&w=600',
  'https://images.unsplash.com/photo-1586495777744-4413f21062fa?q=80&w=600'
];

// Generate Beauty
for(let i=0; i<10; i++) {
  INITIAL_PRODUCTS.push({
    id: `b-${i+1}`,
    name: beautyNames[i],
    slug: beautyNames[i].toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    description: `Premium aesthetic ${beautyNames[i]} formulated for cellular rejuvenation and stunning style presentation.`,
    long_description: `Achieve flawless styling, deep hydration, and luxurious self care with the ${beautyNames[i]}. Tested clinically, incorporating gentle bio-active molecules, rich fragrances, or revolutionary thermal sensors that shield natural hair structures. Yields premium, noticeable beauty transformations.`,
    price: beautyPrices[i],
    sale_price: Math.round(beautyPrices[i] * (1 - beautyDiscounts[i]/100)),
    discount: beautyDiscounts[i],
    rating: 4.6 + (i * 0.04) > 5 ? 4.98 : 4.6 + (i * 0.04),
    reviews_count: 50 + (i * 35),
    inventory: 35 + i,
    image_url: beautyImages[i],
    images: [beautyImages[i]],
    sku: beautySkus[i],
    brand: beautyBrands[i],
    category: 'Beauty',
    options: i === 6 
      ? [{ name: 'Size', values: ['50ml', '100ml'] }]
      : i === 9 
      ? [{ name: 'Color', values: ['Rouge Red', 'Nude Beige', 'Blush Pink'] }]
      : [{ name: 'Bundle', values: ['Standard Option', 'Duo Pack Value Saver'] }],
    specifications: {
      'Organic Certification': 'Dermatologically certified premium safe',
      'Active Ingredients': 'Hyaluronic acid / Citric bond rebuilders',
      'Skin Affinity': 'Suitable for dry, oily, and highly sensitive profiles',
      'Thermal Shielding': 'Smart continuous airflow thermal sensors'
    },
    faqs: [
      { q: 'Is it completely safe for color treated hair?', a: 'Absolutely, L\'Oreal bond kit and Dyson hair systems protect colored fibers completely.' }
    ]
  });
}

// 7. HOME (10 PRODUCTS)
const homeNames = [
  'IKEA TRÅDFRI Smart Lighting Kit', 'Dyson Purifier Hot+Cool Gen1', 'Dyson V15 Detect Cordless Vacuum',
  'IKEA ÅRSTID Classical Brass Table Lamp', 'IKEA KUNGSMYNTA Luxury Queen Bedding Set',
  'IKEA NISSEDAL Elegant Wall Mirror', 'Dyson Purifier Cool Autoreact Fan', 'IKEA HILJA Soft Elegant Window Curtains',
  'IKEA LOHALS Woven Jute Area Rug', 'IKEA TJENA Classic Desk Organizer'
];
const homePrices = [45000, 650000, 780000, 28000, 95000, 35000, 520000, 22000, 85000, 12000];
const homeDiscounts = [13, 8, 8, 14, 11, 14, 8, 18, 12, 17];
const homeSkus = ['IKEA-TRD-LGT', 'DYSON-HP-GEN1', 'DYSON-V15-VAC', 'IKEA-ARS-LMP', 'IKEA-KNG-BED', 'IKEA-NIS-MIR', 'DYSON-PUR-AR', 'IKEA-HIL-CRT', 'IKEA-LOH-RUG', 'IKEA-TJN-ORG'];
const homeBrands = ['IKEA', 'Dyson', 'Dyson', 'IKEA', 'IKEA', 'IKEA', 'Dyson', 'IKEA', 'IKEA', 'IKEA'];
const homeImages = [
  'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?q=80&w=600',
  'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=600',
  'https://images.unsplash.com/photo-1558317374-067fb5f30001?q=80&w=600',
  'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?q=80&w=600',
  'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=600',
  'https://images.unsplash.com/photo-1618220179428-22790b461013?q=80&w=600',
  'https://images.unsplash.com/photo-1585338107529-13afc5f02586?q=80&w=600',
  'https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=600',
  'https://images.unsplash.com/photo-1581428982868-e410dd047a90?q=80&w=600',
  'https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=600'
];

// Generate Home
for(let i=0; i<10; i++) {
  INITIAL_PRODUCTS.push({
    id: `ho-${i+1}`,
    name: homeNames[i],
    slug: homeNames[i].toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    description: `Sleek scandinavian minimalist design ${homeNames[i]} adding premium warmth to your indoor space.`,
    long_description: `Revolutionize your indoor sanctuary with the ${homeNames[i]}. Engineered to bring clean organic aesthetics, premium air purifications, smart Dimming gateways, or incredibly soft Lyocell woven bedding sheets. Melts away daily stress to make home complete.`,
    price: homePrices[i],
    sale_price: Math.round(homePrices[i] * (1 - homeDiscounts[i]/100)),
    discount: homeDiscounts[i],
    rating: 4.4 + (i * 0.05) > 5 ? 4.9 : 4.4 + (i * 0.05),
    reviews_count: 60 + (i * 38),
    inventory: 30 + i,
    image_url: homeImages[i],
    images: [homeImages[i]],
    sku: homeSkus[i],
    brand: homeBrands[i],
    category: 'Home',
    options: i === 8 
      ? [{ name: 'Size', values: ['160x230 cm', '200x300 cm'] }]
      : [{ name: 'Color', values: ['Minimalist White', 'Neutral Grey', 'Soft Sage'] }],
    specifications: {
      'Organic Sourcing': 'Eco-harvested sustainable materials',
      'Assembly Standard': 'Fast, zero-tools user mounting layout',
      'Structural base': 'Heavy duty brass, natural jute, or HEPA H13 filters',
      'Energy rating': 'A++ high-saving green certification'
    },
    faqs: [
      { q: 'Is assembly guide included?', a: 'Yes, all scandinavian furniture and lighting items contain clean pictographic setup instructions.' }
    ]
  });
}

// 8. FURNITURE (10 PRODUCTS)
const furnitureNames = [
  'IKEA STRANDMON Velvet Wing Chair', 'IKEA BILLY Bookcase with Glass Doors', 'IKEA LACK Coffee Table',
  'IKEA EKEDALEN Extendable Dining Table', 'IKEA MARKUS High-Back Office Chair', 'IKEA MALM Queen Bed Frame with Storage',
  'IKEA MICKE Compact Computer Desk', 'IKEA PAX Modular Bedroom Wardrobe', 'IKEA BESTÅ Premium TV Media Console',
  'IKEA KALLAX Shelving Unit 4x4'
];
const furniturePrices = [260000, 110000, 32000, 240000, 185000, 380000, 75000, 680000, 195000, 88000];
const furnitureDiscounts = [8, 14, 13, 8, 9, 8, 9, 9, 8, 10];
const furnitureSkus = ['IKEA-STR-CHR', 'IKEA-BLY-BKCS', 'IKEA-LCK-TBL', 'IKEA-EKD-TBL', 'IKEA-MRK-CHR', 'IKEA-MLM-BED', 'IKEA-MCK-DSK', 'IKEA-PAX-WRD', 'IKEA-BST-TV', 'IKEA-KLX-4X4'];
const furnitureBrands = ['IKEA', 'IKEA', 'IKEA', 'IKEA', 'IKEA', 'IKEA', 'IKEA', 'IKEA', 'IKEA', 'IKEA'];
const furnitureImages = [
  'https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=600',
  'https://images.unsplash.com/photo-1595515106969-1ce29566ff1c?q=80&w=600',
  'https://images.unsplash.com/photo-1581428982868-e410dd047a90?q=80&w=600',
  'https://images.unsplash.com/photo-1577140917170-285929fb55b7?q=80&w=600',
  'https://images.unsplash.com/photo-1505797149-43b0069ec26b?q=80&w=600',
  'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=600',
  'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?q=80&w=600',
  'https://images.unsplash.com/photo-1558882224-cca166733360?q=80&w=600',
  'https://images.unsplash.com/photo-1601887389937-0b02c26b6c3c?q=80&w=600',
  'https://images.unsplash.com/photo-1592078615290-033ee584e267?q=80&w=600'
];

// Generate Furniture
for(let i=0; i<10; i++) {
  INITIAL_PRODUCTS.push({
    id: `fu-${i+1}`,
    name: furnitureNames[i],
    slug: furnitureNames[i].toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    description: `Solid scandinavian hardwood ${furnitureNames[i]} designed for clean modern office and living rooms.`,
    long_description: `Build high efficiency elegant interiors with the ${furnitureNames[i]}. Engineered using durable natural oak veneers, scratch-resistant acrylic lacquers, and dynamic ergonomic steel hinges. Pocket springs and mesh supports ensure standard physiological comforts.`,
    price: furniturePrices[i],
    sale_price: Math.round(furniturePrices[i] * (1 - furnitureDiscounts[i]/100)),
    discount: furnitureDiscounts[i],
    rating: 4.5 + (i * 0.04) > 5 ? 4.95 : 4.5 + (i * 0.04),
    reviews_count: 50 + (i * 32),
    inventory: 15 + i,
    image_url: furnitureImages[i],
    images: [furnitureImages[i]],
    sku: furnitureSkus[i],
    brand: furnitureBrands[i],
    category: 'Furniture',
    options: [
      { name: 'Color', values: ['Solid Oak Wash', 'Obsidian Black Lacquer'] }
    ],
    specifications: {
      'Hardwood species': 'Solid Nordic Pine & Oak wood board',
      'Structural joinery': 'Reinforced heavy-duty hidden brackets',
      'Lacquer finish': 'Gloss protective scratch-free acrylic layer',
      'Drawer mechanisms': 'Soft close hydraulic roller rails'
    },
    faqs: [
      { q: 'Is standard delivery to door available?', a: 'Yes, we provide prioritized direct logistics transport and setup guides straight to your apartment door.' }
    ]
  });
}

// 9. KITCHEN (10 PRODUCTS)
const kitchenNames = [
  'IKEA VÄRDERA Dinnerware (18-Piece)', 'Dyson Airblade Tap Water Filter', 'Samsung Family Hub Smart Fridge',
  'Sony Smart Induction Hot Kettle', 'IKEA 365+ Stainless Steel Cookware (7-Piece)', 'IKEA VÖRDA Professional Chef Knife',
  'Samsung NeoChefs Smart Microwave', 'IKEA BEKVÄM Solid Birch Spice Rack', 'IKEA PROPPMÄTT Solid Beech Cutting Board',
  'IKEA HÅLLBAR Pull-out Recycling Bin'
];
const kitchenPrices = [48000, 320000, 3800000, 95000, 85000, 18000, 195000, 9500, 14000, 22000];
const kitchenDiscounts = [13, 9, 5, 11, 12, 17, 8, 16, 14, 18];
const kitchenSkus = ['IKEA-VRD-DIN', 'DYSON-AB-TAP', 'SAM-HUB-FRG', 'SONY-SMT-KTL', 'IKEA-365-POT', 'IKEA-VRD-KNF', 'SAM-NEO-MW', 'IKEA-BKV-SPC', 'IKEA-PRP-CTB', 'IKEA-HLB-BIN'];
const kitchenBrands = ['IKEA', 'Dyson', 'Samsung', 'Sony', 'IKEA', 'IKEA', 'Samsung', 'IKEA', 'IKEA', 'IKEA'];
const kitchenImages = [
  'https://images.unsplash.com/photo-1576092768241-dec231879fc3?q=80&w=600',
  'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=600',
  'https://images.unsplash.com/photo-1571175432230-01a2d86a397a?q=80&w=600',
  'https://images.unsplash.com/photo-1576092768241-dec231879fc3?q=80&w=600',
  'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?q=80&w=600',
  'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?q=80&w=600',
  'https://images.unsplash.com/photo-1584622781564-1d987f7333c1?q=80&w=600',
  'https://images.unsplash.com/photo-1588854337236-6889d631faa8?q=80&w=600',
  'https://images.unsplash.com/photo-1581428982868-e410dd047a90?q=80&w=600',
  'https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?q=80&w=600'
];

// Generate Kitchen
for(let i=0; i<10; i++) {
  INITIAL_PRODUCTS.push({
    id: `k-${i+1}`,
    name: kitchenNames[i],
    slug: kitchenNames[i].toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    description: `Professional class culinary ${kitchenNames[i]} built from high-durability kitchen alloys and premium glaze.`,
    long_description: `Cook with sheer culinary delight using the ${kitchenNames[i]}. Engineered to bring chemical-free heat dispersion, molybdenum-alloy razor edge retention, or dynamic touchless sensor purifications. Built to make kitchen spaces incredibly clean and responsive.`,
    price: kitchenPrices[i],
    sale_price: Math.round(kitchenPrices[i] * (1 - kitchenDiscounts[i]/100)),
    discount: kitchenDiscounts[i],
    rating: 4.6 + (i * 0.04) > 5 ? 4.95 : 4.6 + (i * 0.04),
    reviews_count: 70 + (i * 31),
    inventory: 40 + i,
    image_url: kitchenImages[i],
    images: [kitchenImages[i]],
    sku: kitchenSkus[i],
    brand: kitchenBrands[i],
    category: 'Kitchen',
    options: [
      { name: 'Bundle', values: ['Standard Culinary Pack', 'Chef Masterclass Upgrade Kit'] }
    ],
    specifications: {
      'Steel density grade': 'Molybdenum-vanadium tempered alloy',
      'Thermal support': 'Induction, gas, and micro-convection ready',
      'Ceramic coating': 'High-density glazed double-fired porcelain',
      'Food safety standard': '100% BPA and lead-free organic boundaries'
    },
    faqs: [
      { q: 'Is it safe to wash in dishwashers?', a: 'Absolutely, all dinnerware and stainless pots support high-temperature professional dishwashers.' }
    ]
  });
}

// 10. FITNESS (10 PRODUCTS)
const fitnessNames = [
  'Under Armour Storm Contender Gym Bag', 'Under Armour Meridian Training Leggings', 'Nike Mastery Sticky Yoga Mat',
  'Adidas Adjustable Cast Iron Dumbbell Set', 'Under Armour Performance Sweatband Set',
  'Under Armour Vacuum Insulated Water Bottle', 'Under Armour Latex Resistance Bands (3-Pack)',
  'Apple Watch Nike Sports Band', 'Nike Premium Training Weight Gloves', 'Adidas High-Speed Ball bearing Jump Rope'
];
const fitnessPrices = [65000, 54000, 68000, 240000, 12000, 28000, 18000, 65000, 22000, 14000];
const fitnessDiscounts = [11, 9, 13, 8, 17, 14, 17, 9, 14, 14];
const fitnessSkus = ['UA-STRM-DUF', 'UA-MRD-LGG', 'NIKE-MST-YGA', 'ADID-ADJ-DBL', 'UA-SWT-SET', 'UA-FLSK-INS', 'UA-RST-BND', 'APL-NK-BAND', 'NIKE-WGT-GLV', 'ADID-JMP-RPE'];
const fitnessBrands = ['Under Armour', 'Under Armour', 'Nike', 'Adidas', 'Under Armour', 'Under Armour', 'Under Armour', 'Apple', 'Nike', 'Adidas'];
const fitnessImages = [
  'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=600',
  'https://images.unsplash.com/photo-1506157786151-b8491531f063?q=80&w=600',
  'https://images.unsplash.com/photo-1599447421416-3414500d18a5?q=80&w=600',
  'https://images.unsplash.com/photo-1638536532686-d610adfc8e5c?q=80&w=600',
  'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?q=80&w=600',
  'https://images.unsplash.com/photo-1602143407151-7111542de6e8?q=80&w=600',
  'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=600',
  'https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?q=80&w=600',
  'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=600',
  'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=600'
];

// Generate Fitness
for(let i=0; i<10; i++) {
  INITIAL_PRODUCTS.push({
    id: `fit-${i+1}`,
    name: fitnessNames[i],
    slug: fitnessNames[i].toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    description: `High performance active training ${fitnessNames[i]} designed for sports elite athletes.`,
    long_description: `Achieve your maximum anatomical peak performance values with the ${fitnessNames[i]}. Engineered utilizing sweat-wicking moisture networks, laser-guided dial selector locks, or high-tensile organic latex loop strands. Made to resist rigorous athletic abrasion.`,
    price: fitnessPrices[i],
    sale_price: Math.round(fitnessPrices[i] * (1 - fitnessDiscounts[i]/100)),
    discount: fitnessDiscounts[i],
    rating: 4.5 + (i * 0.05) > 5 ? 4.9 : 4.5 + (i * 0.05),
    reviews_count: 90 + (i * 33),
    inventory: 40 + i,
    image_url: fitnessImages[i],
    images: [fitnessImages[i]],
    sku: fitnessSkus[i],
    brand: fitnessBrands[i],
    category: 'Fitness',
    options: [
      { name: 'Color', values: ['Jet Black', 'Electric Teal', 'Chalk White'] }
    ],
    specifications: {
      'Active moisture tech': 'UA signature multi-channel thread weave',
      'Structural composite': 'Tempered solid cast iron or double wall steel',
      'Elastic tension capacity': 'Light, Medium, and heavy loop configurations',
      'Grip comfort factor': 'Molded anti-slip dense neoprene sleeves'
    },
    faqs: [
      { q: 'Is it water repellent?', a: 'Yes! The Storm Contender duffel and UA active fabrics completely resist heavy moisture spray.' }
    ]
  });
}

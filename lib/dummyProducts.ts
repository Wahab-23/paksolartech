export interface Category {
    id: number;
    name: string;
    slug: string;
    icon: string;
    description: string;
    productCount: number;
}

export interface Product {
    id: number;
    name: string;
    slug: string;
    description: string;
    shortDesc: string;
    category_id: number;
    category_slug: string;
    category_name: string;
    image_url: string;
    badge?: string;
    status: 'active' | 'inactive';
    specs: { label: string; value: string }[];
    price_from: number;
    price_to?: number;
    is_featured: boolean;
    wattage?: number;
    brand: string;
}

export const categories: Category[] = [
    {
        id: 1,
        name: 'Solar Panels',
        slug: 'solar-panels',
        icon: '☀️',
        description: 'High-efficiency monocrystalline and polycrystalline panels for every need.',
        productCount: 4,
    },
    {
        id: 2,
        name: 'Inverters',
        slug: 'inverters',
        icon: '⚡',
        description: 'Grid-tie, hybrid and off-grid inverters from globally trusted brands.',
        productCount: 3,
    },
    {
        id: 3,
        name: 'Battery Storage',
        slug: 'batteries',
        icon: '🔋',
        description: 'Lithium and AGM batteries to keep your home powered around the clock.',
        productCount: 3,
    },
    {
        id: 4,
        name: 'Accessories',
        slug: 'accessories',
        icon: '🔧',
        description: 'Mounting structures, cables, charge controllers and monitoring systems.',
        productCount: 3,
    },
];

export const products: Product[] = [
    /* ── Solar Panels ── */
    {
        id: 1,
        name: 'SunPower Maxeon 430W Monocrystalline',
        slug: 'sunpower-maxeon-430w',
        shortDesc: 'Industry-leading 22.8% efficiency monocrystalline panel.',
        description:
            'The SunPower Maxeon 430W monocrystalline panel sets the gold standard for residential solar. With 22.8% conversion efficiency, it generates more energy per square foot than any competing panel on the market. Built to withstand Pakistan\'s harsh summer heat and monsoon conditions, it carries a 25-year product warranty and 40-year performance guarantee.',
        category_id: 1,
        category_slug: 'solar-panels',
        category_name: 'Solar Panels',
        image_url: '/products/panel-maxeon.jpg',
        badge: 'Best Seller',
        status: 'active',
        price_from: 45000,
        price_to: 52000,
        is_featured: true,
        wattage: 430,
        brand: 'SunPower',
        specs: [
            { label: 'Wattage', value: '430W' },
            { label: 'Efficiency', value: '22.8%' },
            { label: 'Cell Type', value: 'Monocrystalline PERC' },
            { label: 'Dimensions', value: '1840 × 1032 × 40 mm' },
            { label: 'Weight', value: '21.5 kg' },
            { label: 'Warranty', value: '25 Years Product / 40 Years Performance' },
            { label: 'Temperature Coefficient', value: '-0.27% /°C' },
        ],
    },
    {
        id: 2,
        name: 'Jinko Tiger Neo 540W Bifacial',
        slug: 'jinko-tiger-neo-540w',
        shortDesc: 'Dual-sided 540W panel with up to 30% rear-side gain.',
        description:
            'Jinko Tiger Neo 540W bifacial panels capture sunlight from both sides, giving up to 30% additional energy generation from reflected light. Perfect for commercial rooftops and ground-mounted systems in Pakistan\'s high-irradiance zones.',
        category_id: 1,
        category_slug: 'solar-panels',
        category_name: 'Solar Panels',
        image_url: '/products/panel-jinko.jpg',
        badge: 'Commercial Grade',
        status: 'active',
        price_from: 52000,
        price_to: 60000,
        is_featured: true,
        wattage: 540,
        brand: 'Jinko Solar',
        specs: [
            { label: 'Wattage', value: '540W' },
            { label: 'Efficiency', value: '21.2%' },
            { label: 'Cell Type', value: 'N-Type Bifacial' },
            { label: 'Dimensions', value: '2278 × 1134 × 35 mm' },
            { label: 'Weight', value: '28.0 kg' },
            { label: 'Warranty', value: '12 Years Product / 30 Years Performance' },
            { label: 'Rear Gain', value: 'Up to 30%' },
        ],
    },
    {
        id: 3,
        name: 'Canadian Solar HiKu 400W Poly',
        slug: 'canadian-solar-hiku-400w',
        shortDesc: 'Budget-friendly 400W polycrystalline panel for residential use.',
        description:
            'An excellent entry-level option for budget-conscious homeowners. The Canadian Solar HiKu400W delivers reliable performance at an affordable price point, making solar accessible to a wider audience across Pakistan.',
        category_id: 1,
        category_slug: 'solar-panels',
        category_name: 'Solar Panels',
        image_url: '/products/panel-canadian.jpg',
        status: 'active',
        price_from: 32000,
        price_to: 38000,
        is_featured: false,
        wattage: 400,
        brand: 'Canadian Solar',
        specs: [
            { label: 'Wattage', value: '400W' },
            { label: 'Efficiency', value: '18.9%' },
            { label: 'Cell Type', value: 'Polycrystalline' },
            { label: 'Dimensions', value: '2108 × 1048 × 40 mm' },
            { label: 'Weight', value: '24.5 kg' },
            { label: 'Warranty', value: '10 Years Product / 25 Years Performance' },
        ],
    },
    {
        id: 4,
        name: 'LONGi Hi-MO 6 580W Mono PERC',
        slug: 'longi-himo6-580w',
        shortDesc: 'High-output 580W panel ideal for large-scale systems.',
        description:
            'LONGi\'s Hi-MO 6 pushes the boundaries of output per panel. At 580W with PERC technology, fewer panels are needed to hit your energy target — reducing installation costs and rooftop footprint for large residential and commercial projects.',
        category_id: 1,
        category_slug: 'solar-panels',
        category_name: 'Solar Panels',
        image_url: '/products/panel-longi.jpg',
        badge: 'High Output',
        status: 'active',
        price_from: 58000,
        price_to: 68000,
        is_featured: true,
        wattage: 580,
        brand: 'LONGi Solar',
        specs: [
            { label: 'Wattage', value: '580W' },
            { label: 'Efficiency', value: '22.0%' },
            { label: 'Cell Type', value: 'Mono PERC' },
            { label: 'Dimensions', value: '2384 × 1096 × 35 mm' },
            { label: 'Weight', value: '32.3 kg' },
            { label: 'Temperature Coeff.', value: '-0.30% /°C' },
            { label: 'Warranty', value: '15 Years Product / 30 Years Performance' },
        ],
    },

    /* ── Inverters ── */
    {
        id: 5,
        name: 'Solis 5kW Hybrid Inverter',
        slug: 'solis-5kw-hybrid',
        shortDesc: '5kW hybrid inverter with battery management & MPPT.',
        description:
            'The Solis 5kW Hybrid Inverter is the heart of a modern hybrid solar system. It seamlessly switches between solar, battery and grid power, ensuring your home never experiences a blackout. Features dual MPPT inputs and a built-in Wi-Fi monitoring module for real-time energy tracking via the Solis app.',
        category_id: 2,
        category_slug: 'inverters',
        category_name: 'Inverters',
        image_url: '/products/inverter-solis.jpg',
        badge: 'Most Popular',
        status: 'active',
        price_from: 85000,
        price_to: 95000,
        is_featured: true,
        brand: 'Solis',
        specs: [
            { label: 'Output Power', value: '5000W' },
            { label: 'MPPT Trackers', value: '2' },
            { label: 'Battery Voltage', value: '48V' },
            { label: 'Efficiency', value: '98.3%' },
            { label: 'Display', value: 'LCD + Wi-Fi App' },
            { label: 'Protection', value: 'IP65' },
            { label: 'Warranty', value: '5 Years' },
        ],
    },
    {
        id: 6,
        name: 'Growatt 10kW On-Grid Inverter',
        slug: 'growatt-10kw-ongrid',
        shortDesc: '10kW grid-tie inverter with net metering support.',
        description:
            'Growatt\'s 10kW on-grid inverter is engineered for large residential and small commercial systems in Pakistan. It is fully compatible with WAPDA / LESCO net-metering requirements and comes pre-configured for Pakistan\'s grid specification.',
        category_id: 2,
        category_slug: 'inverters',
        category_name: 'Inverters',
        image_url: '/products/inverter-growatt.jpg',
        status: 'active',
        price_from: 120000,
        price_to: 140000,
        is_featured: false,
        brand: 'Growatt',
        specs: [
            { label: 'Output Power', value: '10000W' },
            { label: 'Max Input Voltage', value: '1000 VDC' },
            { label: 'MPPT Trackers', value: '2' },
            { label: 'Efficiency', value: '98.4%' },
            { label: 'Monitoring', value: 'Wi-Fi + RS485' },
            { label: 'Net Metering', value: 'Supported' },
            { label: 'Warranty', value: '5 Years' },
        ],
    },
    {
        id: 7,
        name: 'Voltronic Axpert 3kW Off-Grid',
        slug: 'voltronic-axpert-3kw',
        shortDesc: 'Reliable 3kW off-grid inverter for rural setups.',
        description:
            'A go-to choice for remote villages and areas with no grid connectivity. The Voltronic Axpert 3kW handles fluctuating loads gracefully and works with a wide battery bank range. Includes a built-in 60A MPPT charge controller.',
        category_id: 2,
        category_slug: 'inverters',
        category_name: 'Inverters',
        image_url: '/products/inverter-voltronic.jpg',
        status: 'active',
        price_from: 48000,
        price_to: 56000,
        is_featured: false,
        brand: 'Voltronic',
        specs: [
            { label: 'Output Power', value: '3000W' },
            { label: 'Battery Voltage', value: '24V / 48V' },
            { label: 'Charge Controller', value: '60A MPPT Built-in' },
            { label: 'Efficiency', value: '93%' },
            { label: 'Input Voltage', value: '90–280 VAC' },
            { label: 'Warranty', value: '2 Years' },
        ],
    },

    /* ── Batteries ── */
    {
        id: 8,
        name: 'Pylon Tech US5000 5.12kWh LiFePO4',
        slug: 'pylontech-us5000',
        shortDesc: '5.12kWh lithium iron phosphate battery — 6000+ cycle life.',
        description:
            'Pylontech\'s US5000 is Pakistan\'s best-selling lithium battery for good reason. It uses safe LiFePO4 chemistry with a cycle life exceeding 6,000 full cycles (equivalent to ~16 years at daily cycling). Stackable up to 16 units and compatible with most hybrid inverters including Solis, Growatt and Deye.',
        category_id: 3,
        category_slug: 'batteries',
        category_name: 'Battery Storage',
        image_url: '/products/battery-pylontech.jpg',
        badge: 'Top Rated',
        status: 'active',
        price_from: 180000,
        price_to: 200000,
        is_featured: true,
        brand: 'Pylontech',
        specs: [
            { label: 'Capacity', value: '5.12 kWh' },
            { label: 'Chemistry', value: 'LiFePO4' },
            { label: 'Cycle Life', value: '6000+ cycles @ 80% DoD' },
            { label: 'Voltage', value: '48V' },
            { label: 'Communication', value: 'CAN / RS485' },
            { label: 'Stackable', value: 'Up to 16 Units' },
            { label: 'Warranty', value: '10 Years' },
        ],
    },
    {
        id: 9,
        name: 'BYD Battery-Box Premium HVS 10.2kWh',
        slug: 'byd-hvs-10kwh',
        shortDesc: '10.2kWh high-voltage lithium battery for large homes.',
        description:
            'BYD\'s Battery-Box Premium HVS is designed for large residential and small commercial energy storage. Its high-voltage architecture improves round-trip efficiency and allows slim, wall-mounted installation. Pairs perfectly with SMA and Fronius inverters.',
        category_id: 3,
        category_slug: 'batteries',
        category_name: 'Battery Storage',
        image_url: '/products/battery-byd.jpg',
        status: 'active',
        price_from: 380000,
        price_to: 420000,
        is_featured: true,
        brand: 'BYD',
        specs: [
            { label: 'Capacity', value: '10.2 kWh' },
            { label: 'Chemistry', value: 'LiFePO4' },
            { label: 'Voltage', value: '200–800 VDC (HV)' },
            { label: 'Round-Trip Efficiency', value: '97%' },
            { label: 'Mounting', value: 'Wall-mount' },
            { label: 'Warranty', value: '10 Years' },
        ],
    },
    {
        id: 10,
        name: 'Tesla Powerwall 2 — 13.5kWh',
        slug: 'tesla-powerwall-2',
        shortDesc: 'World-famous home battery with 13.5kWh usable capacity.',
        description:
            'The Tesla Powerwall 2 is the most recognisable home battery system in the world. It stores 13.5kWh of usable energy, integrates seamlessly with solar systems, and offers whole-home backup capability. Manage everything through the Tesla app.',
        category_id: 3,
        category_slug: 'batteries',
        category_name: 'Battery Storage',
        image_url: '/products/battery-tesla.jpg',
        badge: 'Premium',
        status: 'active',
        price_from: 850000,
        is_featured: false,
        brand: 'Tesla',
        specs: [
            { label: 'Usable Capacity', value: '13.5 kWh' },
            { label: 'Continuous Power', value: '5 kW' },
            { label: 'Peak Power', value: '7 kW' },
            { label: 'Round-Trip Efficiency', value: '90%' },
            { label: 'Monitoring', value: 'Tesla App' },
            { label: 'Warranty', value: '10 Years' },
        ],
    },

    /* ── Accessories ── */
    {
        id: 11,
        name: 'Aluminium Rooftop Mounting Structure — 10 Panel',
        slug: 'aluminium-mounting-10panel',
        shortDesc: 'Heavy-duty tilt-adjustable aluminium racking for 10 panels.',
        description:
            'Our in-house engineered aluminium mounting structure is designed specifically for Pakistani rooftop profiles. Corrosion-resistant anodised aluminium rails with stainless steel hardware. Tilt angle adjustable from 5° to 30° to optimise sun exposure year-round.',
        category_id: 4,
        category_slug: 'accessories',
        category_name: 'Accessories',
        image_url: '/products/accessory-mount.jpg',
        status: 'active',
        price_from: 22000,
        price_to: 28000,
        is_featured: false,
        brand: 'PakSolarTech',
        specs: [
            { label: 'Material', value: 'Anodised Aluminium / SS Hardware' },
            { label: 'Panel Capacity', value: '10 Panels' },
            { label: 'Tilt Angle', value: '5° – 30° Adjustable' },
            { label: 'Wind Load', value: '150 km/h Certified' },
            { label: 'Warranty', value: '15 Years' },
        ],
    },
    {
        id: 12,
        name: 'Victron SmartSolar MPPT 100/30',
        slug: 'victron-mppt-100-30',
        shortDesc: '30A Bluetooth MPPT charge controller for off-grid systems.',
        description:
            'Victron\'s SmartSolar MPPT 100/30 is the gold standard for off-grid charge control. Built-in Bluetooth lets you monitor real-time solar and battery data directly from the VictronConnect app on your phone — no cables needed.',
        category_id: 4,
        category_slug: 'accessories',
        category_name: 'Accessories',
        image_url: '/products/accessory-mppt.jpg',
        badge: 'New',
        status: 'active',
        price_from: 18500,
        price_to: 22000,
        is_featured: true,
        brand: 'Victron Energy',
        specs: [
            { label: 'Max Charge Current', value: '30A' },
            { label: 'Max PV Open Circuit Voltage', value: '100V' },
            { label: 'Battery Voltage', value: '12 / 24V Auto' },
            { label: 'Connectivity', value: 'Bluetooth (VictronConnect)' },
            { label: 'Protection', value: 'IP43' },
            { label: 'Warranty', value: '5 Years' },
        ],
    },
    {
        id: 13,
        name: 'Huawei SUN2000 Smart Logger 3000A',
        slug: 'huawei-smart-logger-3000a',
        shortDesc: 'Real-time monitoring gateway for up to 80 inverters.',
        description:
            'The Huawei Smart Logger 3000A is a professional-grade monitoring system for solar plants. It aggregates data from up to 80 Huawei inverters and communicates to the FusionSolar cloud, offering granular energy analytics, fault alerts and remote O&M capabilities.',
        category_id: 4,
        category_slug: 'accessories',
        category_name: 'Accessories',
        image_url: '/products/accessory-logger.jpg',
        status: 'active',
        price_from: 35000,
        price_to: 45000,
        is_featured: false,
        brand: 'Huawei',
        specs: [
            { label: 'Connected Inverters', value: 'Up to 80' },
            { label: 'Communication', value: 'RS485 / Ethernet' },
            { label: 'Cloud Platform', value: 'FusionSolar' },
            { label: 'Protection', value: 'IP41' },
            { label: 'Warranty', value: '3 Years' },
        ],
    },
];

export function getProductBySlug(slug: string): Product | undefined {
    return products.find((p) => p.slug === slug);
}

export function getProductsByCategory(categorySlug: string): Product[] {
    if (categorySlug === 'all') return products;
    return products.filter((p) => p.category_slug === categorySlug);
}

export function getFeaturedProducts(): Product[] {
    return products.filter((p) => p.is_featured);
}

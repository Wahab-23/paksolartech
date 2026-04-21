const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

const servicesData = {
  'residential-solar': {
    slug: 'residential-solar',
    title: 'Residential Solar Solutions',
    shortDesc: 'Power your home with clean, affordable solar energy. Custom-designed rooftop systems tailored to your needs.',
    icon: 'Sun',
    image: 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&q=80&w=1200',
    features: [
      'Up to 90% reduction in monthly bills',
      '25-year performance warranty',
      'Net metering support included',
      'High-efficiency monocrystalline panels',
    ],
    longDesc: 'Our residential solar solutions are designed to provide Pakistan\'s homeowners with energy independence and massive savings. We handle everything from the initial site survey and system design to net metering documentation and professional installation.',
    benefits: [
      { title: 'Drastic Bill Reduction', desc: 'Slash your monthly electricity expenses by up to 90%.', icon: 'TrendingUp' },
      { title: 'Energy Independence', desc: 'Protect your family from rising electricity tariffs and grid instability.', icon: 'Shield' },
      { title: 'Eco-Friendly', desc: 'Reduce your carbon footprint and contribute to a greener Pakistan.', icon: 'Heart' },
    ],
    process: [
      { step: '01', title: 'Free Site Survey', desc: 'Our engineers visit your home to assess roof space and energy needs.' },
      { step: '02', title: 'System Design', desc: 'We create a custom solar blueprint optimized for your roof\'s orientation.' },
      { step: '03', title: 'Installation', desc: 'Quick and professional installation by our certified technicians.' },
      { step: '04', title: 'Net Metering', desc: 'We handle all WAPDA/DISCO documentation to get your net meter running.' },
    ]
  },
  'commercial-solar': {
    slug: 'commercial-solar',
    title: 'Commercial Solar Energy',
    shortDesc: 'Reduce operational costs with large-scale solar installations for businesses and industrial facilities.',
    icon: 'Zap',
    image: 'https://images.unsplash.com/photo-1497440001374-f26997328c1b?auto=format&fit=crop&q=80&w=1200',
    features: [
      'Rapid ROI for businesses',
      'Tax benefits and green energy credits',
      'Scalable industrial grade equipment',
      'Real-time energy monitoring dashboard',
    ],
    longDesc: 'For businesses and industries, solar isn\'t just about environment—it\'s a strategic financial move. We offer robust commercial systems that significantly lower operational costs and provide a hedge against future energy price hikes.',
    benefits: [
      { title: 'High ROI', desc: 'Commercial systems typically pay for themselves within 3-4 years.', icon: 'TrendingUp' },
      { title: 'CSR & ESG', desc: 'Enhance your brand image by adopting sustainable energy practices.', icon: 'Globe2' },
      { title: 'Predictable Costs', desc: 'Lock in your energy costs for the next 25 years.', icon: 'Clock' },
    ],
    process: [
      { step: '01', title: 'Energy Audit', desc: 'Detailed analysis of your industrial/commercial load profile.' },
      { step: '02', title: 'Financial Modeling', desc: 'Detailed breakdown of ROI, payback period, and tax savings.' },
      { step: '03', title: 'Execution', desc: 'Structured project management to ensure zero downtime during install.' },
      { step: '04', title: 'Operation & Support', desc: 'Full-time monitoring and priority maintenance for businesses.' },
    ]
  },
  'battery-storage': {
    slug: 'battery-storage',
    title: 'Advanced Battery Storage',
    shortDesc: 'Store excess solar energy for use during peak hours or power outages with advanced battery solutions.',
    icon: 'Battery',
    image: 'https://images.unsplash.com/photo-1620714223084-8fcacc6dfd8d?auto=format&fit=crop&q=80&w=1200',
    features: [
      'Lithium Ferro Phosphate (LFP) technology',
      'Uninterrupted backup during outages',
      'Smart energy management software',
      'Long cycle life (6000+ cycles)',
    ],
    longDesc: 'Never experience a blackout again. Our battery storage solutions integrate seamlessly with your solar panels to store energy for nighttime use or during grid failures, ensuring your home or business stays powered 24/7.',
    benefits: [
      { title: 'No More Loadshedding', desc: 'Instant switchover ensures your appliances keep running.', icon: 'Zap' },
      { title: 'Time-of-Use Savings', desc: 'Discharge batteries during expensive peak hours to save more.', icon: 'TrendingUp' },
      { title: 'Modular Design', desc: 'Easily expand your storage capacity as your needs grow.', icon: 'Settings' },
    ]
  },
  'maintenance-repair': {
    slug: 'maintenance-repair',
    title: 'Maintenance & Repair',
    shortDesc: 'Keep your solar system running at peak performance with our expert maintenance and repair services.',
    icon: 'Wrench',
    image: 'https://images.unsplash.com/photo-1613665813446-82a78c468a1d?auto=format&fit=crop&q=80&w=1200',
    features: [
      'Periodic panel cleaning',
      'Inverter health diagnostics',
      'Wiring and structure integrity checks',
      'Emergency repair services',
    ],
    longDesc: 'Dust and dirt can reduce solar efficiency by up to 30%. Our professional maintenance team ensures your investment continues to perform at its peak, providing regular cleaning and technical health checks.',
    benefits: [
      { title: 'Peak Performance', desc: 'Regular cleaning maximizes your energy harvest.', icon: 'Sun' },
      { title: 'System Longevity', desc: 'Identify and fix minor issues before they become major failures.', icon: 'Shield' },
      { title: 'Safety First', desc: 'Ensure all electrical connections are secure and heat-free.', icon: 'Wrench' },
    ]
  },
  'energy-consulting': {
    slug: 'energy-consulting',
    title: 'Energy Consulting',
    shortDesc: 'Get expert advice on energy optimization, system sizing, and maximizing your solar investment ROI.',
    icon: 'BarChart3',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1200',
    features: [
      'Feasibility studies',
      'Detailed ROI analysis',
      'System optimization strategies',
      'Technical specification advisory',
    ],
    longDesc: 'Not sure where to start? Our expert consultants provide data-driven insights to help you make informed decisions about your solar transition, ensuring you get the best system for your specific energy profile.',
    benefits: [
      { title: 'Accurate Sizing', desc: 'Don\'t overpay for capacity you don\'t need.', icon: 'Settings' },
      { title: 'Financial Clarity', desc: 'Understand exactly when your system will pay for itself.', icon: 'DollarSign' },
      { title: 'Tech Guidance', desc: 'Choose the right brands and technology for your climate.', icon: 'Info' },
    ]
  },
  'warranty-support': {
    slug: 'warranty-support',
    title: 'Warranty & Support',
    shortDesc: 'Industry-leading warranties and 24/7 customer support to ensure your peace of mind.',
    icon: 'Shield',
    image: 'https://images.unsplash.com/photo-1521791136364-798a730bb361?auto=format&fit=crop&q=80&w=1200',
    features: [
      '25-year panel performance warranty',
      '10-year inverter replacement warranty',
      '5-year structure warranty',
      'Priority on-site support',
    ],
    longDesc: 'We stand by our work. Our systems come with comprehensive warranties backed by top-tier manufacturers. Our dedicated support team is always available to handle any technical queries or support requests.',
    benefits: [
      { title: 'Manufacturer Backed', desc: 'Warranties from global Tier-1 solar brands.', icon: 'Globe2' },
      { title: 'Local Response', desc: 'Our technicians are on the ground in all major cities.', icon: 'Headphones' },
      { title: 'Peace of Mind', desc: 'Rest easy knowing your energy future is protected.', icon: 'Shield' },
    ]
  }
};

async function seed() {
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'new_user',
        password: 'new_password',
        database: 'testdb'
    });

    console.log('Connected to DB');

    try {
        for (const [slug, data] of Object.entries(servicesData)) {
            await connection.execute(
                'INSERT INTO services (title, slug, short_desc, long_desc, icon, image_url, features, benefits, process) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
                [
                    data.title,
                    data.slug,
                    data.shortDesc,
                    data.longDesc,
                    data.icon,
                    data.image,
                    JSON.stringify(data.features || []),
                    JSON.stringify(data.benefits || []),
                    JSON.stringify(data.process || [])
                ]
            );
            console.log(`Inserted ${slug}`);
        }
    } catch (err) {
        console.error('Error seeding:', err);
    } finally {
        await connection.end();
    }
}

seed();

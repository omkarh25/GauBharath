import type { Product, Thought } from '@/types';

/**
 * Seed data derived from the screenshots provided.
 * Can be loaded into Firestore manually or via the admin panel.
 */

export const SEED_PRODUCTS: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    slug: 'agni-hotra-dhoop-sticks',
    titleEn: 'Agni Hotra Dhoop Sticks',
    titleKn: 'ಅಗ್ನಿ ಹೋತ್ರ ಧೂಪ ಕಡ್ಡಿ',
    descriptionEn:
      'Sacred dhoop sticks crafted for Agni Hotra — the fire ritual that purifies the atmosphere and uplifts consciousness.',
    price: 70,
    originalPrice: 80,
    category: 'dhoop',
    imageUrl: '/assets/products/dhoop.svg',
    inStock: true,
    featured: true,
    benefits: ['Purifies air', 'Aids meditation', 'Natural fragrance'],
  },
  {
    slug: 'gomaya-lamp',
    titleEn: 'Gomaya Lamp',
    titleKn: 'ಗೋಮಯ ಹಬ್ಬತಿ',
    descriptionEn:
      'Traditional cow-dung lamp used in pujas. Burns with a steady, sacred flame that invites divine presence.',
    price: 3,
    originalPrice: 5,
    category: 'lamp',
    imageUrl: '/assets/products/lamp.svg',
    inStock: true,
    featured: true,
  },
  {
    slug: 'cow-dung-cake',
    titleEn: 'Cow Dung Cake',
    titleKn: 'ಗೋಮಯ ಖಿಂಡ',
    descriptionEn:
      'Sun-dried cow dung cakes — a traditional, smokeless fuel used in havan kunds and sacred fires.',
    price: 80,
    originalPrice: 100,
    category: 'cake',
    imageUrl: '/assets/products/cake.svg',
    inStock: true,
  },
  {
    slug: 'asta-dasha-lobhana',
    titleEn: 'Asta Dasha Lobhana',
    titleKn: 'ಅಷ್ಟ ದಶ ಲೋಭನ',
    descriptionEn:
      'Ayurvedic formulation with 18 precious ingredients — used in traditional ghee-processing rituals.',
    price: 200,
    originalPrice: 250,
    category: 'wellness',
    imageUrl: '/assets/products/lobhana.svg',
    inStock: true,
    featured: true,
  },
  {
    slug: 'anga-mardhana-taila',
    titleEn: 'Anga Mardhana Taila',
    titleKn: 'ಅಂಗಮರ್ಧನ ತೈಲ',
    descriptionEn:
      'Herbal oil used for full-body abhyanga massage. Nourishes skin, soothes muscles, and calms the mind.',
    price: 120,
    originalPrice: 130,
    category: 'oil',
    imageUrl: '/assets/products/oil.svg',
    inStock: true,
    featured: true,
    benefits: ['Relieves dryness', 'Calms nerves', 'Promotes sleep'],
  },
  {
    slug: 'karna-bindu',
    titleEn: 'Karna Bindu',
    titleKn: 'ಕರ್ಣ ಬಿಂದು',
    descriptionEn:
      'A few drops of this herbal oil in each ear are believed to support hearing and quiet the mind.',
    price: 100,
    originalPrice: 110,
    category: 'oil',
    imageUrl: '/assets/products/oil.svg',
    inStock: true,
  },
  {
    slug: 'nabhi-poorana-taila',
    titleEn: 'Nabhi Poorana Taila',
    titleKn: 'ನಾಭಿ ಪೂರಣ ತೈಲ',
    descriptionEn:
      'Warmed oil applied around the navel — a traditional practice for digestive harmony and grounding.',
    price: 100,
    originalPrice: 110,
    category: 'oil',
    imageUrl: '/assets/products/oil.svg',
    inStock: true,
  },
  {
    slug: 'skin-lip-care-balm',
    titleEn: 'Skin & Lip Care Balm',
    titleKn: 'ಸ್ಕಿನ್ ಅಂಡ್ ಲಿಪ್ ಕೇರ್',
    descriptionEn:
      'Natural Cow Ghritham based balm for soft skin and supple lips — gentle enough for daily use.',
    price: 100,
    originalPrice: 110,
    category: 'wellness',
    imageUrl: '/assets/products/balm.svg',
    inStock: true,
    benefits: ['Hydrates', 'Repairs', 'Natural ingredients'],
  },
  {
    slug: 'charma-shoodhaka',
    titleEn: 'Charma Shoodhaka',
    titleKn: 'ಚರ್ಮ ಶೋಧಕ',
    descriptionEn:
      'Skin purifier formulated with traditional herbs. Promotes a clear, radiant complexion.',
    price: 100,
    originalPrice: 110,
    category: 'wellness',
    imageUrl: '/assets/products/oil.svg',
    inStock: true,
  },
  {
    slug: 'kesha-lavanya-taila',
    titleEn: 'Kesha Lavanya Taila',
    titleKn: 'ಕೇಶ ಲಾವಣ್ಯ ತೈಲ',
    descriptionEn:
      'A luxurious herbal hair oil that nourishes the scalp and brings lustre to every strand.',
    price: 350,
    originalPrice: 360,
    category: 'oil',
    imageUrl: '/assets/products/oil.svg',
    inStock: true,
    featured: true,
  },
  {
    slug: 'arjuna-tea',
    titleEn: 'Arjuna Tea',
    titleKn: 'ಅರ್ಜುನ ಟೀ',
    descriptionEn:
      'Bark of the Arjuna tree, revered in Ayurveda for heart wellness. A grounding, earthy brew.',
    price: 200,
    originalPrice: 210,
    category: 'tea',
    imageUrl: '/assets/products/tea.svg',
    inStock: true,
    featured: true,
  },
  {
    slug: 'hing-vati',
    titleEn: 'Hing Vati',
    titleKn: 'ಹಿಂಗ್ ವಟಿ',
    descriptionEn:
      'Asafoetida tablets traditionally taken after meals to support digestion and reduce bloating.',
    price: 60,
    originalPrice: 70,
    category: 'wellness',
    imageUrl: '/assets/products/tablet.svg',
    inStock: true,
  },
  {
    slug: 'ksheera-kranthi-soap',
    titleEn: 'Ksheera Kranthi Soap',
    titleKn: 'ಕ್ಷೀರ ಕ್ರಾಂತಿ ಸೋಪ್',
    descriptionEn:
      'Milk-enriched herbal soap that gently cleanses while leaving the skin soft and fragrant.',
    price: 60,
    originalPrice: 70,
    category: 'soap',
    imageUrl: '/assets/products/soap.svg',
    inStock: true,
  },
  {
    slug: 'kesar-chandan-soap',
    titleEn: 'Kesar Chandan Soap',
    titleKn: 'ಕೇಸರ್ ಚಂದನ್ ಸೋಪ್',
    descriptionEn:
      'Saffron and sandalwood — a timeless combination for glowing, fragrant skin.',
    price: 60,
    originalPrice: 70,
    category: 'soap',
    imageUrl: '/assets/products/soap.svg',
    inStock: true,
  },
  {
    slug: 'gomaya-soap',
    titleEn: 'Gomaya Soap',
    titleKn: 'ಗೋಮಯ ಸೋಪ್',
    descriptionEn:
      'Enriched with Gomaya (cow dung) extracts and herbs. A traditional bath soap with a gentle touch.',
    price: 60,
    originalPrice: 70,
    category: 'soap',
    imageUrl: '/assets/products/soap.svg',
    inStock: true,
  },
  {
    slug: 'kaarbana-soap',
    titleEn: 'Kaarbana Soap',
    titleKn: 'ಕಾರ್ಬನ್ ಸೋಪ್',
    descriptionEn:
      'A purifying herbal soap that draws out impurities and refreshes tired skin.',
    price: 60,
    originalPrice: 70,
    category: 'soap',
    imageUrl: '/assets/products/soap.svg',
    inStock: true,
  },
  {
    slug: 'netra-shuddhikari',
    titleEn: 'Eye Cleaner',
    titleKn: 'ನೇತ್ರ ಶುದ್ಧಿಕಾರಿ',
    descriptionEn:
      'A few drops refresh tired eyes — an Ayurvedic formulation for daily eye care.',
    price: 100,
    originalPrice: 110,
    category: 'wellness',
    imageUrl: '/assets/products/eye-drop.svg',
    inStock: true,
  },
];

export const SEED_THOUGHTS: Omit<Thought, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    text: 'Sanyasi, Sansari, Sanchari. Ayke nimmadu',
    author: 'Modaksha',
    backgroundUrl: '/assets/thoughts/sunrise.svg',
    order: 1,
  },
  {
    text: 'Koti kottaru sigalarada parishuddha preethi — gau preethi',
    author: 'Modaksha',
    backgroundUrl: '/assets/thoughts/gau.svg',
    order: 2,
  },
  {
    text: 'Yochisutta solabedi, sothu yochisi',
    author: 'Modaksha',
    backgroundUrl: '/assets/thoughts/fire.svg',
    order: 3,
  },
  {
    text: 'Satyavannu mucchalagada ekaika sthala — Antaratma',
    author: 'Modaksha',
    backgroundUrl: '/assets/thoughts/temple.svg',
    order: 4,
  },
];

export const SEED_SETTINGS = {
  heroHeadlineEn: 'GauBharath',
  heroHeadlineKn: 'ಗೋಭಾರತ್',
  heroSubtext:
    'A sacred endeavour in Gau Seva and Gau Preethi — rooted in tradition, offered with love.',
  founderName: 'Modaksha',
  founderBio:
    'Modaksha is the founder of GauBharath, a devotee of Go-Matha whose life is dedicated to the service and protection of cows — and to sharing their gifts with the world.',
  shalaAddress: 'Maarigudi Road, Mangaluru 575014, Karnataka, India',
  shalaPhone: '+91 98765 43210',
  shalaEmail: 'connect@gaubharath.org',
  shalaHours: 'Open 24 hours',
};

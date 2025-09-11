import { Product, ProductCategory, Element, ProductFilter, ProductSearchResult } from '@/types/product';

// In-memory product database (in production, this would be a real database)
let products: Product[] = [
  {
    id: 'sacred-rose-bouquet-001',
    name: 'Sacred Rose Love Binding Bouquet',
    description: 'Hand-picked roses blessed with intention for love magic and romantic ceremonies',
    longDescription: 'This enchanted bouquet features deep red roses harvested under the full moon and blessed with ancient love spells. Each bloom carries the energy of Venus and is perfect for handfasting ceremonies, romantic rituals, or altar devotion. The arrangement includes complementary herbs like rosemary for remembrance and lavender for peace.',
    price: 8500, // $85.00
    category: ProductCategory.SACRED_FLOWERS,
    subcategory: 'Love & Romance',
    images: [
      {
        id: 'img-001',
        url: '/images/products/sacred-rose-bouquet.jpg',
        altText: 'Sacred red rose bouquet with ritual herbs',
        isPrimary: true,
        sortOrder: 1
      }
    ],
    tags: ['love magic', 'handfasting', 'venus', 'romance', 'full moon blessed'],
    isActive: true,
    isCustomizable: true,
    customizationOptions: [
      {
        id: 'custom-001',
        name: 'Rose Color',
        type: 'select',
        required: false,
        options: ['Deep Red', 'Pink', 'White', 'Burgundy'],
        additionalPrice: 0
      },
      {
        id: 'custom-002',
        name: 'Special Blessing Request',
        type: 'text',
        required: false
      }
    ],
    stockQuantity: 12,
    weight: 500, // grams
    seasonalAvailability: {
      availableMonths: [4, 5, 6, 7, 8, 9, 10],
      specialOccasions: ['Beltane', 'Wedding Season', 'Venus Rituals']
    },
    ritualProperties: {
      elements: [Element.FIRE, Element.WATER],
      intentions: ['love', 'romance', 'commitment', 'passion'],
      sabbats: ['Beltane', 'Litha'],
      moonPhases: ['Full Moon', 'Waxing Moon'],
      planetaryAssociations: ['Venus']
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'autumn-altar-wreath-001',
    name: 'Samhain Ancestor Altar Wreath',
    description: 'Handcrafted wreath with autumn elements to honor the ancestors during Samhain',
    longDescription: 'This sacred wreath is woven with oak leaves for strength, chrysanthemums for honor, and dried pomegranates for rebirth. Adorned with black candles and ancestral symbols, it creates a powerful focal point for your Samhain altar. Each element is chosen to facilitate communication with the spirit realm.',
    price: 12500, // $125.00
    category: ProductCategory.ALTAR_PIECES,
    subcategory: 'Seasonal Altars',
    images: [
      {
        id: 'img-002',
        url: '/images/products/samhain-wreath.jpg',
        altText: 'Autumn wreath with oak leaves and pomegranates',
        isPrimary: true,
        sortOrder: 1
      }
    ],
    tags: ['samhain', 'ancestors', 'autumn', 'oak', 'spirit work'],
    isActive: true,
    isCustomizable: false,
    stockQuantity: 8,
    weight: 800,
    seasonalAvailability: {
      availableMonths: [9, 10, 11],
      specialOccasions: ['Samhain', 'Autumn Equinox']
    },
    ritualProperties: {
      elements: [Element.EARTH, Element.SPIRIT],
      intentions: ['ancestor connection', 'divination', 'protection', 'wisdom'],
      sabbats: ['Samhain'],
      moonPhases: ['New Moon', 'Dark Moon'],
      planetaryAssociations: ['Saturn', 'Pluto']
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'cleansing-herb-bundle-001',
    name: 'White Sage & Lavender Cleansing Bundle',
    description: 'Ethically sourced white sage with organic lavender for space clearing and purification',
    longDescription: 'Our cleansing bundles combine ethically wildcrafted white sage with organically grown lavender from our sacred garden. Perfect for clearing negative energy, blessing new spaces, or preparing for ritual work. Each bundle is tied with natural hemp and blessed under the new moon.',
    price: 1800, // $18.00
    category: ProductCategory.RITUAL_HERBS,
    subcategory: 'Cleansing & Purification',
    images: [
      {
        id: 'img-003',
        url: '/images/products/sage-lavender-bundle.jpg',
        altText: 'White sage and lavender smudge bundle',
        isPrimary: true,
        sortOrder: 1
      }
    ],
    variations: [
      {
        id: 'var-001',
        name: 'Small Bundle',
        price: 1800,
        sku: 'SAGE-LAV-SM',
        stockQuantity: 25,
        attributes: { size: 'small', length: '4 inches' }
      },
      {
        id: 'var-002',
        name: 'Large Bundle',
        price: 2800,
        sku: 'SAGE-LAV-LG',
        stockQuantity: 15,
        attributes: { size: 'large', length: '6 inches' }
      }
    ],
    tags: ['cleansing', 'sage', 'lavender', 'purification', 'smudging'],
    isActive: true,
    isCustomizable: false,
    stockQuantity: 40,
    weight: 50,
    ritualProperties: {
      elements: [Element.AIR, Element.FIRE],
      intentions: ['cleansing', 'purification', 'protection', 'peace'],
      sabbats: ['All'],
      moonPhases: ['New Moon', 'Waning Moon']
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export class ProductDatabase {
  static getAllProducts(): Product[] {
    return products.filter(p => p.isActive);
  }

  static getProductById(id: string): Product | null {
    return products.find(p => p.id === id && p.isActive) || null;
  }

  static searchProducts(filter: ProductFilter, page: number = 1, limit: number = 12): ProductSearchResult {
    let filteredProducts = products.filter(p => p.isActive);

    // Apply filters
    if (filter.category) {
      filteredProducts = filteredProducts.filter(p => p.category === filter.category);
    }

    if (filter.priceRange) {
      filteredProducts = filteredProducts.filter(p => 
        p.price >= filter.priceRange!.min && p.price <= filter.priceRange!.max
      );
    }

    if (filter.elements && filter.elements.length > 0) {
      filteredProducts = filteredProducts.filter(p => 
        p.ritualProperties?.elements.some(e => filter.elements!.includes(e))
      );
    }

    if (filter.intentions && filter.intentions.length > 0) {
      filteredProducts = filteredProducts.filter(p =>
        p.ritualProperties?.intentions.some(i => 
          filter.intentions!.some(fi => i.toLowerCase().includes(fi.toLowerCase()))
        )
      );
    }

    if (filter.isCustomizable !== undefined) {
      filteredProducts = filteredProducts.filter(p => p.isCustomizable === filter.isCustomizable);
    }

    if (filter.inStock) {
      filteredProducts = filteredProducts.filter(p => 
        !p.stockQuantity || p.stockQuantity > 0
      );
    }

    if (filter.tags && filter.tags.length > 0) {
      filteredProducts = filteredProducts.filter(p =>
        p.tags.some(tag => 
          filter.tags!.some(filterTag => 
            tag.toLowerCase().includes(filterTag.toLowerCase())
          )
        )
      );
    }

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

    return {
      products: paginatedProducts,
      total: filteredProducts.length,
      page,
      limit,
      filters: filter
    };
  }

  static getProductsByCategory(category: ProductCategory): Product[] {
    return products.filter(p => p.isActive && p.category === category);
  }

  static getFeaturedProducts(count: number = 3): Product[] {
    return products
      .filter(p => p.isActive)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, count);
  }

  static addProduct(product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Product {
    const newProduct: Product = {
      ...product,
      id: `product-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    products.push(newProduct);
    return newProduct;
  }

  static updateProduct(id: string, updates: Partial<Product>): Product | null {
    const productIndex = products.findIndex(p => p.id === id);
    if (productIndex === -1) return null;

    products[productIndex] = {
      ...products[productIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    return products[productIndex];
  }

  static deleteProduct(id: string): boolean {
    const productIndex = products.findIndex(p => p.id === id);
    if (productIndex === -1) return false;

    products[productIndex].isActive = false;
    products[productIndex].updatedAt = new Date().toISOString();
    return true;
  }

  static getAvailableFilters() {
    const categories = Object.values(ProductCategory);
    const elements = Object.values(Element);
    
    const allIntentions = new Set<string>();
    const allTags = new Set<string>();
    
    products.forEach(product => {
      if (product.ritualProperties?.intentions) {
        product.ritualProperties.intentions.forEach(intention => 
          allIntentions.add(intention)
        );
      }
      product.tags.forEach(tag => allTags.add(tag));
    });

    return {
      categories,
      elements,
      intentions: Array.from(allIntentions).sort(),
      tags: Array.from(allTags).sort()
    };
  }
}
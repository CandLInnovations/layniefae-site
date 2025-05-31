export interface FloralProduct {
  id: string;
  name: string;
  type: 'crown' | 'bouquet' | 'boutonniere' | 'arrangement' | 'wreath';
  description: string;
  price: number;
  images: string[];
  customizable: boolean;
  seasonal: boolean;
  tags: string[];
  ingredients?: string[];
}

export interface WeddingService {
  id: string;
  title: string;
  description: string;
  duration: string;
  price: number;
  includes: string[];
  type: 'handfasting' | 'blessing' | 'full-ceremony' | 'elopement';
}

export interface ContactForm {
  name: string;
  email: string;
  phone?: string;
  service: 'florals' | 'wedding' | 'both';
  eventDate?: string;
  message: string;
  budget?: string;
}

export interface SEOProps {
  title: string;
  description: string;
  image?: string;
  url?: string;
}
export interface Product {
  _id: string;
  code: string;
  name: string;
  description: string;
  price: number;
  tax: number;
//   category: Category; // Updated to be of type Category
  available: boolean;
  createdAt?: Date; // Optional, added by timestamps
  updatedAt?: Date; // Optional, added by timestamps
}

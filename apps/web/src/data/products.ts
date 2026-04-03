export type Product = {
  id: string
  name: string
  sku: string
  category: 'Dien tu' | 'Thoi trang' | 'Phu kien'
  price: number
  stock: number
  status: 'in_stock' | 'low_stock' | 'out_of_stock'
  image: string
}

export const products: Product[] = [
  { id: 'SP001', name: 'Tai nghe Bluetooth Sport', sku: 'SKU-1001', category: 'Dien tu', price: 450000, stock: 120, status: 'in_stock', image: 'https://placehold.co/80x80' },
  { id: 'SP002', name: 'Ao thun nam co ban', sku: 'SKU-1002', category: 'Thoi trang', price: 180000, stock: 5, status: 'low_stock', image: 'https://placehold.co/80x80' },
  { id: 'SP003', name: 'Sac du phong 10000mAh', sku: 'SKU-1003', category: 'Phu kien', price: 350000, stock: 85, status: 'in_stock', image: 'https://placehold.co/80x80' },
  { id: 'SP004', name: 'Quan jean slim fit', sku: 'SKU-1004', category: 'Thoi trang', price: 520000, stock: 0, status: 'out_of_stock', image: 'https://placehold.co/80x80' },
  { id: 'SP005', name: 'Loa mini di dong', sku: 'SKU-1005', category: 'Dien tu', price: 680000, stock: 42, status: 'in_stock', image: 'https://placehold.co/80x80' },
  { id: 'SP006', name: 'Ao khoac hoodie unisex', sku: 'SKU-1006', category: 'Thoi trang', price: 390000, stock: 3, status: 'low_stock', image: 'https://placehold.co/80x80' },
  { id: 'SP007', name: 'Cap sac Type-C nhanh', sku: 'SKU-1007', category: 'Phu kien', price: 95000, stock: 200, status: 'in_stock', image: 'https://placehold.co/80x80' },
  { id: 'SP008', name: 'Dong ho thong minh', sku: 'SKU-1008', category: 'Dien tu', price: 1250000, stock: 18, status: 'in_stock', image: 'https://placehold.co/80x80' },
  { id: 'SP009', name: 'Vay lien nu thanh lich', sku: 'SKU-1009', category: 'Thoi trang', price: 650000, stock: 0, status: 'out_of_stock', image: 'https://placehold.co/80x80' },
  { id: 'SP010', name: 'Op lung dien thoai silicon', sku: 'SKU-1010', category: 'Phu kien', price: 75000, stock: 310, status: 'in_stock', image: 'https://placehold.co/80x80' },
  { id: 'SP011', name: 'Ban phim co gaming', sku: 'SKU-1011', category: 'Dien tu', price: 890000, stock: 7, status: 'low_stock', image: 'https://placehold.co/80x80' },
  { id: 'SP012', name: 'Ao so mi nam cong so', sku: 'SKU-1012', category: 'Thoi trang', price: 420000, stock: 55, status: 'in_stock', image: 'https://placehold.co/80x80' },
  { id: 'SP013', name: 'Mieng dan cuong luc', sku: 'SKU-1013', category: 'Phu kien', price: 45000, stock: 500, status: 'in_stock', image: 'https://placehold.co/80x80' },
  { id: 'SP014', name: 'Chuot khong day van phong', sku: 'SKU-1014', category: 'Dien tu', price: 290000, stock: 0, status: 'out_of_stock', image: 'https://placehold.co/80x80' },
  { id: 'SP015', name: 'Chan vay nu midi', sku: 'SKU-1015', category: 'Thoi trang', price: 310000, stock: 28, status: 'in_stock', image: 'https://placehold.co/80x80' },
  { id: 'SP016', name: 'Gia do dien thoai xe hoi', sku: 'SKU-1016', category: 'Phu kien', price: 120000, stock: 4, status: 'low_stock', image: 'https://placehold.co/80x80' },
  { id: 'SP017', name: 'Camera an ninh WiFi', sku: 'SKU-1017', category: 'Dien tu', price: 750000, stock: 33, status: 'in_stock', image: 'https://placehold.co/80x80' },
  { id: 'SP018', name: 'Ao polo nam cao cap', sku: 'SKU-1018', category: 'Thoi trang', price: 280000, stock: 67, status: 'in_stock', image: 'https://placehold.co/80x80' },
  { id: 'SP019', name: 'Tai nghe chup tai co day', sku: 'SKU-1019', category: 'Dien tu', price: 560000, stock: 2, status: 'low_stock', image: 'https://placehold.co/80x80' },
  { id: 'SP020', name: 'Balo laptop chong nuoc', sku: 'SKU-1020', category: 'Phu kien', price: 480000, stock: 41, status: 'in_stock', image: 'https://placehold.co/80x80' },
]

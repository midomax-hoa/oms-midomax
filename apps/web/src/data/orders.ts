export type Order = {
  id: string
  date: string
  customer: string
  total: number
  status: 'cho_xac_nhan' | 'dang_xu_ly' | 'dang_giao' | 'hoan_thanh' | 'da_huy'
  payment: 'COD' | 'Chuyen khoan' | 'Vi dien tu'
  shipping: 'Giao hang nhanh' | 'Giao hang tiet kiem' | 'Viettel Post'
}

export const orders: Order[] = [
  { id: 'DH001', date: '2026-03-01', customer: 'Nguyen Van An', total: 2500000, status: 'hoan_thanh', payment: 'Chuyen khoan', shipping: 'Giao hang nhanh' },
  { id: 'DH002', date: '2026-03-02', customer: 'Tran Thi Bich', total: 1800000, status: 'dang_giao', payment: 'COD', shipping: 'Giao hang tiet kiem' },
  { id: 'DH003', date: '2026-03-03', customer: 'Le Van Cuong', total: 4200000, status: 'cho_xac_nhan', payment: 'Vi dien tu', shipping: 'Viettel Post' },
  { id: 'DH004', date: '2026-03-04', customer: 'Pham Thi Dung', total: 950000, status: 'dang_xu_ly', payment: 'COD', shipping: 'Giao hang nhanh' },
  { id: 'DH005', date: '2026-03-05', customer: 'Hoang Van Em', total: 3100000, status: 'hoan_thanh', payment: 'Chuyen khoan', shipping: 'Giao hang tiet kiem' },
  { id: 'DH006', date: '2026-03-06', customer: 'Vo Thi Phuong', total: 7500000, status: 'da_huy', payment: 'Vi dien tu', shipping: 'Giao hang nhanh' },
  { id: 'DH007', date: '2026-03-07', customer: 'Dang Van Giang', total: 1200000, status: 'dang_giao', payment: 'COD', shipping: 'Viettel Post' },
  { id: 'DH008', date: '2026-03-08', customer: 'Bui Thi Hanh', total: 5600000, status: 'hoan_thanh', payment: 'Chuyen khoan', shipping: 'Giao hang nhanh' },
  { id: 'DH009', date: '2026-03-09', customer: 'Ngo Van Ich', total: 890000, status: 'cho_xac_nhan', payment: 'COD', shipping: 'Giao hang tiet kiem' },
  { id: 'DH010', date: '2026-03-10', customer: 'Duong Thi Kim', total: 3400000, status: 'dang_xu_ly', payment: 'Vi dien tu', shipping: 'Viettel Post' },
  { id: 'DH011', date: '2026-03-11', customer: 'Ly Van Lam', total: 2100000, status: 'hoan_thanh', payment: 'Chuyen khoan', shipping: 'Giao hang nhanh' },
  { id: 'DH012', date: '2026-03-12', customer: 'Mai Thi Nhung', total: 6800000, status: 'dang_giao', payment: 'COD', shipping: 'Giao hang tiet kiem' },
  { id: 'DH013', date: '2026-03-13', customer: 'Trinh Van Oanh', total: 1500000, status: 'da_huy', payment: 'Vi dien tu', shipping: 'Giao hang nhanh' },
  { id: 'DH014', date: '2026-03-14', customer: 'Cao Thi Phuong', total: 4700000, status: 'cho_xac_nhan', payment: 'Chuyen khoan', shipping: 'Viettel Post' },
  { id: 'DH015', date: '2026-03-15', customer: 'Ha Van Quang', total: 2300000, status: 'dang_xu_ly', payment: 'COD', shipping: 'Giao hang tiet kiem' },
  { id: 'DH016', date: '2026-03-16', customer: 'Dinh Thi Rang', total: 8900000, status: 'hoan_thanh', payment: 'Vi dien tu', shipping: 'Giao hang nhanh' },
  { id: 'DH017', date: '2026-03-17', customer: 'Luong Van Son', total: 1100000, status: 'dang_giao', payment: 'COD', shipping: 'Viettel Post' },
  { id: 'DH018', date: '2026-03-18', customer: 'Vu Thi Thao', total: 3800000, status: 'cho_xac_nhan', payment: 'Chuyen khoan', shipping: 'Giao hang nhanh' },
  { id: 'DH019', date: '2026-03-19', customer: 'Do Van Uy', total: 2700000, status: 'hoan_thanh', payment: 'Vi dien tu', shipping: 'Giao hang tiet kiem' },
  { id: 'DH020', date: '2026-03-20', customer: 'Truong Thi Van', total: 5200000, status: 'dang_xu_ly', payment: 'COD', shipping: 'Viettel Post' },
  { id: 'DH021', date: '2026-03-21', customer: 'Luu Van Xuan', total: 1600000, status: 'da_huy', payment: 'Chuyen khoan', shipping: 'Giao hang nhanh' },
  { id: 'DH022', date: '2026-03-22', customer: 'Tang Thi Yen', total: 4100000, status: 'dang_giao', payment: 'Vi dien tu', shipping: 'Giao hang tiet kiem' },
  { id: 'DH023', date: '2026-03-23', customer: 'Chau Van Zung', total: 9500000, status: 'hoan_thanh', payment: 'Chuyen khoan', shipping: 'Giao hang nhanh' },
  { id: 'DH024', date: '2026-03-24', customer: 'Kieu Thi Ai', total: 780000, status: 'cho_xac_nhan', payment: 'COD', shipping: 'Viettel Post' },
  { id: 'DH025', date: '2026-03-25', customer: 'Ton Van Binh', total: 3300000, status: 'dang_xu_ly', payment: 'Vi dien tu', shipping: 'Giao hang tiet kiem' },
]

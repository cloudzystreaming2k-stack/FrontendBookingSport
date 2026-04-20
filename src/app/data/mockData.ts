// Mock data cho website đặt sân thể thao

export interface Court {
  id: string;
  code?: string; // Mã sân
  name: string;
  type: 'pickleball' | 'badminton' | 'basketball' | 'tennis' | 'volleyball';
  area: string;
  address: string;
  description: string;
  images: string[];
  facilities: string[];
  pricing: {
    morning: number; // 6h-12h
    afternoon: number; // 12h-18h
    evening: number; // 18h-22h
  };
  rating: number;
  reviewCount: number;
  capacity?: number; // Sức chứa (số người)
  openingHours?: string; // Giờ mở cửa
  status: 'active' | 'maintenance';
  owner?: string; // Chủ sân
  coordinates?: [number, number]; // [latitude, longitude]
}

export interface Booking {
  id: string;
  courtId: string;
  courtName: string;
  userId: string;
  userName: string;
  date: string;
  startTime: string;
  endTime: string;
  hours: number;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  paymentStatus: 'pending' | 'paid' | 'refunded';
  paymentMethod?: 'vnpay' | 'momo' | 'banking' | 'momo';
  createdAt: string;
}

export interface Review {
  id: string;
  courtId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'customer' | 'admin';
  createdAt: string;
}

export interface Promotion {
  id: string;
  code: string;
  description: string;
  discount: number; // percentage
  validFrom: string;
  validTo: string;
  status: 'active' | 'expired';
}

export interface NewsArticle {
  id: string;
  title: string;
  content: string;
  image: string;
  author: string;
  createdAt: string;
  category: string;
  status: 'published' | 'draft';
}

export interface CourtType {
  id: string;
  name: string;
  slug: string;
  icon: string; // emoji or icon name
  color: string; // tailwind color class
  features: string[];
  minPlayers: number;
  maxPlayers: number;
  courtCount: number; // number of courts of this type
  status: 'active' | 'inactive';
  createdAt: string;
}

// Mock Courts Data
export const mockCourts: Court[] = [
  {
    id: '1',
    code: 'SANAAAAA',
    name: 'Sân Pickleball Quận 1',
    type: 'pickleball',
    area: 'Quận 1',
    address: '123 Nguyễn Huệ, Quận 1, TP.HCM',
    description: 'Sân pickleball hiện đại với 4 sân chuẩn quốc tế, đầy đủ tiện nghi',
    images: [
      'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=800',
      'https://images.unsplash.com/photo-1519766304817-4f37bda74a26?w=800',
      'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=800',
    ],
    facilities: ['Bãi đỗ xe', 'Phòng thay đồ', 'Wifi miễn phí', 'Nước uống', 'Căng tin'],
    pricing: { morning: 150000, afternoon: 180000, evening: 250000 },
    rating: 4.8,
    reviewCount: 124,
    capacity: 8,
    openingHours: '06:00 - 22:00',
    status: 'active',
    owner: 'Nguyễn Văn A',
  },
  {
    id: '2',
    code: 'CL01',
    name: 'Sân Cầu Lông Số 1',
    type: 'badminton',
    area: 'Tân Bình',
    address: '456 Trường Chinh, Tân Bình, TP.HCM',
    description: 'Sân cầu lông chuyên nghiệp với mặt sân gỗ cao cấp, đã...',
    images: [
      'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=800',
      'https://images.unsplash.com/photo-1519766304817-4f37bda74a26?w=800',
    ],
    facilities: ['Bãi đỗ xe rộng', 'Phòng tắm', 'Wifi', 'Cho thuê vợt', 'Bán đồ thể thao'],
    pricing: { morning: 100000, afternoon: 120000, evening: 180000 },
    rating: 4.6,
    reviewCount: 89,
    capacity: 4,
    openingHours: '06:00 - 22:00',
    status: 'active',
    owner: 'Trần Thị B',
  },
  {
    id: '3',
    code: 'CL02',
    name: 'Sân Cầu Lông Số 2',
    type: 'badminton',
    area: 'Tân Bình',
    address: '456 Trường Chinh, Tân Bình, TP.HCM',
    description: 'Sân cầu lông rộng rãi, thoáng mát, có điều hòa',
    images: [
      'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=800',
    ],
    facilities: ['Bãi đỗ xe rộng', 'Phòng tắm', 'Wifi', 'Điều hòa'],
    pricing: { morning: 100000, afternoon: 120000, evening: 180000 },
    rating: 4.5,
    reviewCount: 67,
    capacity: 4,
    openingHours: '06:00 - 22:00',
    status: 'active',
    owner: 'Lê Văn C',
    coordinates: [10.811667, 106.66], // Tân Bình 2
  },
  {
    id: '4',
    code: 'BR01',
    name: 'Sân Bóng Rổ Phú Nhuận',
    type: 'basketball',
    area: 'Phú Nhuận',
    address: '789 Phan Xích Long, Phú Nhuận, TP.HCM',
    description: 'Sân bóng rổ ngoài trời với mặt sân cao su tiêu chuẩn NBA',
    images: [
      'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800',
      'https://images.unsplash.com/photo-1519766304817-4f37bda74a26?w=800',
    ],
    facilities: ['Bãi đỗ xe', 'Phòng thay đồ', 'Nước uống', 'Ghế ngồi khán giả'],
    pricing: { morning: 200000, afternoon: 250000, evening: 350000 },
    rating: 4.5,
    reviewCount: 67,
    capacity: 14,
    openingHours: '06:00 - 22:00',
    status: 'active',
    owner: 'Phạm Thị D',
    coordinates: [10.803333, 106.685], // Phú Nhuận
  },
  {
    id: '5',
    code: 'TN01',
    name: 'Sân Tennis Quận 2',
    type: 'tennis',
    area: 'Thủ Đức',
    address: '321 Xa Lộ Hà Nội, Thủ Đức, TP.HCM',
    description: 'Câu lạc bộ tennis cao cấp với 6 sân chuẩn ITF',
    images: [
      'https://images.unsplash.com/photo-1622163642998-1ea32b0bbc67?w=800',
      'https://images.unsplash.com/photo-1519766304817-4f37bda74a26?w=800',
    ],
    facilities: ['Bãi đỗ xe VIP', 'Phòng thay đồ sang trọng', 'Spa', 'Nhà hàng', 'Pro shop'],
    pricing: { morning: 300000, afternoon: 350000, evening: 450000 },
    rating: 4.9,
    reviewCount: 156,
    capacity: 4,
    openingHours: '06:00 - 22:00',
    status: 'active',
    owner: 'Hoàng Minh E',
    coordinates: [10.805, 106.743333], // Quận 2 / Thủ Đức
  },
  {
    id: '6',
    code: 'CL03',
    name: 'Sân Cầu Lông Bình Thạnh',
    type: 'badminton',
    area: 'Bình Thạnh',
    address: '555 Điện Biên Phủ, Bình Thạnh, TP.HCM',
    description: 'Sân cầu lông trong nhà, điều hòa mát mẻ',
    images: [
      'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=800',
    ],
    facilities: ['Điều hòa', 'Bãi đỗ xe', 'Wifi', 'Nước uống'],
    pricing: { morning: 80000, afternoon: 100000, evening: 150000 },
    rating: 4.3,
    reviewCount: 45,
    capacity: 4,
    openingHours: '06:00 - 22:00',
    status: 'active',
    owner: 'Nguyễn Văn A',
  },
  {
    id: '7',
    code: 'PB02',
    name: 'Sân Pickleball Quận 7',
    type: 'pickleball',
    area: 'Quận 7',
    address: '888 Nguyễn Văn Linh, Quận 7, TP.HCM',
    description: 'Khu phức hợp thể thao với 6 sân pickleball',
    images: [
      'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=800',
    ],
    facilities: ['Bãi đỗ xe miễn phí', 'Phòng tắm', 'Căng tin', 'Wifi', 'Khu vui chơi trẻ em'],
    pricing: { morning: 120000, afternoon: 150000, evening: 200000 },
    rating: 4.7,
    reviewCount: 92,
    capacity: 8,
    openingHours: '06:00 - 22:00',
    status: 'active',
    owner: 'Trần Thị B',
  },
];

// Mock Bookings Data
export const mockBookings: Booking[] = [
  {
    id: 'BK001',
    courtId: '1',
    courtName: 'Sân Pickleball Quận 1',
    userId: 'U001',
    userName: 'Nguyễn Văn A',
    date: '2026-03-05',
    startTime: '18:00',
    endTime: '20:00',
    hours: 2,
    totalPrice: 500000,
    status: 'confirmed',
    paymentStatus: 'paid',
    paymentMethod: 'vnpay',
    createdAt: '2026-03-03T10:30:00',
  },
  {
    id: 'BK002',
    courtId: '2',
    courtName: 'Sân Cầu Lông Tân Bình',
    userId: 'U002',
    userName: 'Trần Thị B',
    date: '2026-03-04',
    startTime: '08:00',
    endTime: '10:00',
    hours: 2,
    totalPrice: 200000,
    status: 'completed',
    paymentStatus: 'paid',
    paymentMethod: 'momo',
    createdAt: '2026-03-01T14:20:00',
  },
  {
    id: 'BK003',
    courtId: '3',
    courtName: 'Sân Bóng Rổ Phú Nhuận',
    userId: 'U003',
    userName: 'Lê Văn C',
    date: '2026-03-06',
    startTime: '19:00',
    endTime: '21:00',
    hours: 2,
    totalPrice: 700000,
    status: 'pending',
    paymentStatus: 'pending',
    createdAt: '2026-03-03T09:15:00',
  },
  {
    id: 'BK004',
    courtId: '1',
    courtName: 'Sân Pickleball Quận 1',
    userId: 'U004',
    userName: 'Phạm Thị D',
    date: '2026-03-10',
    startTime: '07:00',
    endTime: '09:00',
    hours: 2,
    totalPrice: 300000,
    status: 'confirmed',
    paymentStatus: 'paid',
    paymentMethod: 'banking',
    createdAt: '2026-03-05T08:00:00',
  },
  {
    id: 'BK005',
    courtId: '4',
    courtName: 'Sân Tennis Quận 2',
    userId: 'U005',
    userName: 'Hoàng Minh E',
    date: '2026-03-11',
    startTime: '18:00',
    endTime: '20:00',
    hours: 2,
    totalPrice: 900000,
    status: 'confirmed',
    paymentStatus: 'paid',
    paymentMethod: 'momo',
    createdAt: '2026-03-06T11:00:00',
  },
  {
    id: 'BK006',
    courtId: '2',
    courtName: 'Sân Cầu Lông Tân Bình',
    userId: 'U001',
    userName: 'Nguyễn Văn A',
    date: '2026-03-12',
    startTime: '18:00',
    endTime: '20:00',
    hours: 2,
    totalPrice: 360000,
    status: 'confirmed',
    paymentStatus: 'paid',
    paymentMethod: 'vnpay',
    createdAt: '2026-03-07T09:00:00',
  },
  {
    id: 'BK007',
    courtId: '3',
    courtName: 'Sân Bóng Rổ Phú Nhuận',
    userId: 'U002',
    userName: 'Trần Thị B',
    date: '2026-03-13',
    startTime: '18:00',
    endTime: '20:00',
    hours: 2,
    totalPrice: 700000,
    status: 'cancelled',
    paymentStatus: 'refunded',
    createdAt: '2026-03-08T10:00:00',
  },
  {
    id: 'BK008',
    courtId: '6',
    courtName: 'Sân Pickleball Quận 7',
    userId: 'U003',
    userName: 'Lê Văn C',
    date: '2026-03-13',
    startTime: '19:00',
    endTime: '21:00',
    hours: 2,
    totalPrice: 400000,
    status: 'pending',
    paymentStatus: 'pending',
    createdAt: '2026-03-09T14:00:00',
  },
  {
    id: 'BK009',
    courtId: '5',
    courtName: 'Sân Cầu Lông Bình Thạnh',
    userId: 'U004',
    userName: 'Phạm Thị D',
    date: '2026-03-15',
    startTime: '20:00',
    endTime: '22:00',
    hours: 2,
    totalPrice: 300000,
    status: 'confirmed',
    paymentStatus: 'paid',
    paymentMethod: 'momo',
    createdAt: '2026-03-10T09:30:00',
  },
  {
    id: 'BK010',
    courtId: '1',
    courtName: 'Sân Pickleball Quận 1',
    userId: 'U005',
    userName: 'Hoàng Minh E',
    date: '2026-03-18',
    startTime: '06:00',
    endTime: '08:00',
    hours: 2,
    totalPrice: 300000,
    status: 'pending',
    paymentStatus: 'pending',
    createdAt: '2026-03-11T16:00:00',
  },
  {
    id: 'BK011',
    courtId: '4',
    courtName: 'Sân Tennis Quận 2',
    userId: 'U002',
    userName: 'Trần Thị B',
    date: '2026-03-20',
    startTime: '08:00',
    endTime: '10:00',
    hours: 2,
    totalPrice: 600000,
    status: 'completed',
    paymentStatus: 'paid',
    paymentMethod: 'banking',
    createdAt: '2026-03-12T08:00:00',
  },
  {
    id: 'BK012',
    courtId: '2',
    courtName: 'Sân Cầu Lông Tân Bình',
    userId: 'U003',
    userName: 'Lê Văn C',
    date: '2026-03-22',
    startTime: '17:00',
    endTime: '19:00',
    hours: 2,
    totalPrice: 360000,
    status: 'confirmed',
    paymentStatus: 'paid',
    paymentMethod: 'momo',
    createdAt: '2026-03-13T12:00:00',
  },
  {
    id: 'BK013',
    courtId: '3',
    courtName: 'Sân Bóng Rổ Phú Nhuận',
    userId: 'U001',
    userName: 'Nguyễn Văn A',
    date: '2026-03-25',
    startTime: '19:00',
    endTime: '21:00',
    hours: 2,
    totalPrice: 700000,
    status: 'pending',
    paymentStatus: 'pending',
    createdAt: '2026-03-14T10:00:00',
  },
  {
    id: 'BK014',
    courtId: '6',
    courtName: 'Sân Pickleball Quận 7',
    userId: 'U004',
    userName: 'Phạm Thị D',
    date: '2026-03-28',
    startTime: '07:00',
    endTime: '09:00',
    hours: 2,
    totalPrice: 240000,
    status: 'cancelled',
    paymentStatus: 'refunded',
    createdAt: '2026-03-15T09:00:00',
  },
];

// Mock Reviews Data
export const mockReviews: Review[] = [
  {
    id: 'R001',
    courtId: '1',
    userId: 'U001',
    userName: 'Nguyễn Văn A',
    rating: 5,
    comment: 'Sân rất đẹp, sạch sẽ. Nhân viên nhiệt tình. Sẽ quay lại!',
    status: 'approved',
    createdAt: '2026-03-02T16:30:00',
  },
  {
    id: 'R002',
    courtId: '1',
    userId: 'U004',
    userName: 'Phạm Thị D',
    rating: 4,
    comment: 'Sân tốt nhưng giá hơi cao vào giờ cao điểm',
    status: 'pending',
    createdAt: '2026-03-01T10:20:00',
  },
  {
    id: 'R003',
    courtId: '2',
    userId: 'U002',
    userName: 'Trần Thị B',
    rating: 5,
    comment: 'Sân cầu lông chuẩn, sàn gỗ tốt. Rất hài lòng!',
    status: 'approved',
    createdAt: '2026-02-28T11:45:00',
  },
  {
    id: 'R004',
    courtId: '3',
    userId: 'U003',
    userName: 'Lê Văn C',
    rating: 3,
    comment: 'Sân ổn nhưng phòng thay đồ cần cải thiện',
    status: 'rejected',
    createdAt: '2026-02-26T14:30:00',
  },
  {
    id: 'R005',
    courtId: '4',
    userId: 'U005',
    userName: 'Hoàng Minh E',
    rating: 5,
    comment: 'Sân tennis đẳng cấp! Mặt sân chuẩn, dịch vụ xuất sắc!',
    status: 'approved',
    createdAt: '2026-02-25T09:00:00',
  },
  {
    id: 'R006',
    courtId: '2',
    userId: 'U001',
    userName: 'Nguyễn Văn A',
    rating: 4,
    comment: 'Sân đẹp, giá hợp lý. Sẽ giới thiệu bạn bè',
    status: 'pending',
    createdAt: '2026-02-24T16:00:00',
  },
  {
    id: 'R007',
    courtId: '6',
    userId: 'U002',
    userName: 'Trần Thị B',
    rating: 2,
    comment: 'Nhân viên không chuyên nghiệp, sân bẩn',
    status: 'rejected',
    createdAt: '2026-02-23T11:30:00',
  },
  {
    id: 'R008',
    courtId: '5',
    userId: 'U003',
    userName: 'Lê Văn C',
    rating: 5,
    comment: 'Sân sạch sẽ, điều hòa mát mẻ. Rất thoải mái!',
    status: 'approved',
    createdAt: '2026-02-22T10:15:00',
  },
  {
    id: 'R009',
    courtId: '1',
    userId: 'U005',
    userName: 'Hoàng Minh E',
    rating: 4,
    comment: 'Sân pickleball tốt, vị trí thuận lợi',
    status: 'pending',
    createdAt: '2026-02-21T15:45:00',
  },
  {
    id: 'R010',
    courtId: '3',
    userId: 'U004',
    userName: 'Phạm Thị D',
    rating: 4,
    comment: 'Sân bóng rổ rộng rãi, thoáng mát',
    status: 'approved',
    createdAt: '2026-02-20T13:20:00',
  },
];

// Mock Users Data
export const mockUsers: User[] = [
  {
    id: 'U001',
    name: 'Nguyễn Văn A',
    email: 'nguyenvana@email.com',
    phone: '0901234567',
    role: 'customer',
    createdAt: '2026-01-15T10:00:00',
  },
  {
    id: 'U002',
    name: 'Trần Thị B',
    email: 'tranthib@email.com',
    phone: '0912345678',
    role: 'customer',
    createdAt: '2026-01-20T14:30:00',
  },
  {
    id: 'ADMIN',
    name: 'Admin',
    email: 'admin@sportsbooking.com',
    phone: '0900000000',
    role: 'admin',
    createdAt: '2025-12-01T00:00:00',
  },
];

// Mock Promotions Data
export const mockPromotions: Promotion[] = [
  {
    id: 'P001',
    code: 'NEWUSER10',
    description: 'Giảm 10% cho khách hàng mới',
    discount: 10,
    validFrom: '2026-01-01',
    validTo: '2026-12-31',
    status: 'active',
  },
  {
    id: 'P002',
    code: 'MORNING20',
    description: 'Giảm 20% khung giờ sáng (6h-12h)',
    discount: 20,
    validFrom: '2026-03-01',
    validTo: '2026-03-31',
    status: 'active',
  },
];

// Mock News Data
// Mock News Data
export const mockNews: NewsArticle[] = [
  {
    id: 'N001',
    title: 'Pickleball - Môn thể thao đang gây sốt tại Việt Nam',
    content: 'Pickleball là môn thể thao kết hợp giữa tennis, cầu lông và bóng bàn. Môn thể thao này đang ngày càng phổ biến tại Việt Nam với số lượng sân và người chơi tăng nhanh. Với luật chơi đơn giản, dễ tiếp cận và phù hợp với mọi lứa tuổi, pickleball đang trở thành lựa chọn hàng đầu cho những ai muốn rèn luyện sức khỏe và kết nối cộng đồng.',
    image: 'https://images.unsplash.com/photo-1769911112109-8ce1e4f75e19?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaWNrbGViYWxsJTIwcGFkZGxlJTIwc3BvcnRzfGVufDF8fHx8MTc3NjI1ODMxMXww&ixlib=rb-4.1.0&q=80&w=1080',
    author: 'Nguyễn Minh Tuấn',
    createdAt: '2026-04-15T10:00:00',
    category: 'Tin tức',
    status: 'published',
  },
  {
    id: 'N002',
    title: 'Hướng dẫn chọn vợt cầu lông phù hợp cho người mới',
    content: 'Việc chọn vợt cầu lông phù hợp rất quan trọng đối với người mới bắt đầu. Bài viết này sẽ hướng dẫn bạn các tiêu chí cần lưu ý khi chọn vợt, từ trọng lượng, độ cứng, điểm cân bằng đến chất liệu khung vợt. Với những thông tin chi tiết này, bạn sẽ dễ dàng tìm được chiếc vợt phù hợp nhất.',
    image: 'https://images.unsplash.com/photo-1613918431551-b2ef2720387c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYWRtaW50b24lMjBtYXRjaCUyMGNvbXBldGl0aW9ufGVufDF8fHx8MTc3NjI1ODMxMnww&ixlib=rb-4.1.0&q=80&w=1080',
    author: 'Trần Văn Hoàng',
    createdAt: '2026-04-14T14:30:00',
    category: 'Hướng dẫn',
    status: 'published',
  },
  {
    id: 'N003',
    title: 'Lợi ích của việc chơi thể thao đều đặn',
    content: 'Chơi thể thao đều đặn mang lại nhiều lợi ích cho sức khỏe thể chất và tinh thần. Hãy cùng tìm hiểu những lợi ích tuyệt vời này từ việc cải thiện sức khỏe tim mạch, tăng cường hệ miễn dịch, giảm căng thẳng đến việc xây dựng thói quen sống lành mạnh và kết nối với cộng đồng.',
    image: 'https://images.unsplash.com/photo-1634144646738-809a0f8897c4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaXRuZXNzJTIwaGVhbHRoJTIwZXhlcmNpc2V8ZW58MXx8fHwxNzc2MjU4MzEyfDA&ixlib=rb-4.1.0&q=80&w=1080',
    author: 'Lê Thị Mai',
    createdAt: '2026-04-13T09:00:00',
    category: 'Sức khỏe',
    status: 'published',
  },
  {
    id: 'N004',
    title: 'Giải đấu bóng rổ toàn quốc sắp diễn ra tại TP.HCM',
    content: 'Giải đấu bóng rổ toàn quốc năm 2026 sẽ được tổ chức tại TP.HCM với sự tham gia của hơn 50 đội đến từ khắp cả nước. Đây là cơ hội tuyệt vời cho các vận động viên thể hiện tài năng và giao lưu học hỏi. Giải đấu hứa hẹn sẽ mang đến những trận cầu kịch tính và đầy cảm xúc.',
    image: 'https://images.unsplash.com/photo-1710378844976-93a6538671ef?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYXNrZXRiYWxsJTIwY291cnQlMjBpbmRvb3J8ZW58MXx8fHwxNzc2MjAzNDMxfDA&ixlib=rb-4.1.0&q=80&w=1080',
    author: 'Phạm Quốc Anh',
    createdAt: '2026-04-12T16:00:00',
    category: 'Sự kiện',
    status: 'published',
  },
  {
    id: 'N005',
    title: 'Chế độ dinh dưỡng cho người chơi thể thao',
    content: 'Dinh dưỡng đóng vai trò quan trọng trong việc nâng cao hiệu suất tập luyện và thi đấu. Bài viết này sẽ chia sẻ những nguyên tắc cơ bản về chế độ ăn uống khoa học, bổ sung protein, carbohydrate và vitamin phù hợp với từng loại hình thể thao.',
    image: 'https://images.unsplash.com/photo-1535879335191-618713ec3e3f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcG9ydHMlMjBudXRyaXRpb24lMjBoZWFsdGh5fGVufDF8fHx8MTc3NjI1ODMxM3ww&ixlib=rb-4.1.0&q=80&w=1080',
    author: 'Võ Thị Lan',
    createdAt: '2026-04-11T11:00:00',
    category: 'Sức khỏe',
    status: 'published',
  },
  {
    id: 'N006',
    title: 'Kỹ thuật cơ bản cho người mới chơi tennis',
    content: 'Tennis là môn thể thao đòi hỏi kỹ thuật và sự kiên nhẫn. Bài viết sẽ hướng dẫn các kỹ thuật cơ bản như cách cầm vợt, tư thế đứng, cách di chuyển và các cú đánh forehand, backhand cơ bản cho người mới bắt đầu.',
    image: 'https://images.unsplash.com/photo-1696661115319-a9b6801e2571?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZW5uaXMlMjB0b3VybmFtZW50JTIwcHJvZmVzc2lvbmFsfGVufDF8fHx8MTc3NjI1ODMxM3ww&ixlib=rb-4.1.0&q=80&w=1080',
    author: 'Đặng Minh Khoa',
    createdAt: '2026-04-10T15:30:00',
    category: 'Hướng dẫn',
    status: 'draft',
  },
  {
    id: 'N007',
    title: 'Top 5 sân cầu lông đẹp nhất TP.HCM',
    content: 'Khám phá những sân cầu lông có cơ sở vật chất tốt nhất tại TP.HCM. Từ sân có không gian rộng rãi, thoáng mát đến những tiện ích đầy đủ như phòng thay đồ, khu vực nghỉ ngơi và dịch vụ cho thuê dụng cụ chuyên nghiệp.',
    image: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=800',
    author: 'Hoàng Thị Hương',
    createdAt: '2026-04-09T10:00:00',
    category: 'Tin tức',
    status: 'published',
  },
  {
    id: 'N008',
    title: 'Cách khởi động trước khi chơi thể thao',
    content: 'Khởi động đúng cách giúp giảm nguy cơ chấn thương và tăng hiệu quả tập luyện. Hướng dẫn các bài tập khởi động từ cơ bản đến nâng cao, phù hợp với từng môn thể thao và độ tuổi khác nhau.',
    image: 'https://images.unsplash.com/photo-1758521959972-83d0bd10a152?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxydW5uaW5nJTIwd29ya291dCUyMHRyYWluaW5nfGVufDF8fHx8MTc3NjI1ODMxNHww&ixlib=rb-4.1.0&q=80&w=1080',
    author: 'Nguyễn Văn Thành',
    createdAt: '2026-04-08T08:00:00',
    category: 'Hướng dẫn',
    status: 'published',
  },
  {
    id: 'N009',
    title: 'Lễ hội thể thao mùa hè 2026',
    content: 'Sự kiện thể thao lớn nhất trong năm sắp diễn ra với hàng trăm hoạt động thú vị. Đăng ký ngay để tham gia các môn thể thao yêu thích, gặp gỡ những người bạn mới và nhận nhiều quà tặng hấp dẫn từ ban tổ chức.',
    image: 'https://images.unsplash.com/photo-1763472615780-f5b88411a097?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcG9ydHMlMjBldmVudCUyMGNlbGVicmF0aW9ufGVufDF8fHx8MTc3NjI1ODMxNHww&ixlib=rb-4.1.0&q=80&w=1080',
    author: 'Bùi Thanh Tâm',
    createdAt: '2026-04-07T13:00:00',
    category: 'Sự kiện',
    status: 'published',
  },
  {
    id: 'N010',
    title: 'Yoga và thể thao: Sự kết hợp hoàn hảo',
    content: 'Yoga không chỉ giúp tăng cường sức khỏe mà còn hỗ trợ tuyệt vời cho các vận động viên thể thao. Tìm hiểu cách kết hợp yoga vào lịch tập luyện để cải thiện độ linh hoạt, sức mạnh và tinh thần tập trung.',
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800',
    author: 'Trần Mỹ Linh',
    createdAt: '2026-04-06T09:30:00',
    category: 'Sức khỏe',
    status: 'published',
  },
  {
    id: 'N011',
    title: 'Pickleball cho người cao tuổi',
    content: 'Pickleball là lựa chọn lý tưởng cho người cao tuổi nhờ tính chất nhẹ nhàng, không quá căng thẳng nhưng vẫn đảm bảo hiệu quả rèn luyện sức khỏe. Tìm hiểu lợi ích và cách bắt đầu chơi pickleball an toàn.',
    image: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=800',
    author: 'Phan Văn Dũng',
    createdAt: '2026-04-05T14:00:00',
    category: 'Sức khỏe',
    status: 'draft',
  },
  {
    id: 'N012',
    title: 'Giải cầu lông sinh viên 2026',
    content: 'Giải đấu cầu lông dành cho sinh viên các trường đại học tại Việt Nam chính thức mở đăng ký. Đây là sân chơi bổ ích để các bạn trẻ thể hiện tài năng, rèn luyện kỹ năng và tạo dựng tinh thần đồng đội.',
    image: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=800',
    author: 'Lý Hoàng Nam',
    createdAt: '2026-04-04T11:00:00',
    category: 'Sự kiện',
    status: 'published',
  },
  {
    id: 'N013',
    title: 'Bóng chuyền - Môn thể thao đồng đội hấp dẫn',
    content: 'Bóng chuyền là môn thể thao tập thể đang được yêu thích tại Việt Nam. Với tính đồng đội cao, phát triển toàn diện thể chất và kỹ năng phối hợp nhóm. Nhiều sân bóng chuyền hiện đại đang được xây dựng để phục vụ nhu cầu tập luyện và thi đấu của người dân.',
    image: 'https://images.unsplash.com/photo-1771909713106-86b9a412964a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2b2xsZXliYWxsJTIwbWF0Y2glMjBjb21wZXRpdGlvbnxlbnwxfHx8fDE3NzY0MzM2NzN8MA&ixlib=rb-4.1.0&q=80&w=1080',
    author: 'Nguyễn Thu Hà',
    createdAt: '2026-04-03T10:00:00',
    category: 'Tin tức',
    status: 'published',
  },
  {
    id: 'N014',
    title: 'Bóng bàn - Lợi ích tuyệt vời cho trí não',
    content: 'Bóng bàn không chỉ rèn luyện thể chất mà còn giúp cải thiện khả năng phản xạ, tăng cường trí nhớ và sự tập trung. Đây là môn thể thao phù hợp cho mọi lứa tuổi, từ trẻ em đến người cao tuổi, với chi phí đầu tư hợp lý và dễ tiếp cận.',
    image: 'https://images.unsplash.com/photo-1774755458463-224dc3ca8331?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0YWJsZSUyMHRlbm5pcyUyMHBhZGRsZXxlbnwxfHx8fDE3NzY0MDI1OTJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    author: 'Đỗ Văn Minh',
    createdAt: '2026-04-02T14:00:00',
    category: 'Tin tức',
    status: 'draft',
  },
  {
    id: 'N015',
    title: 'Các loại hình thể thao phổ biến tại Việt Nam',
    content: 'Tổng hợp các môn thể thao đang được ưa chuộng tại Việt Nam như cầu lông, bóng đá, bóng rổ, pickleball và tennis. Mỗi môn đều có những đặc điểm riêng biệt và phù hợp với từng đối tượng người chơi. Bài viết giúp bạn tìm được môn thể thao phù hợp nhất.',
    image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800',
    author: 'Trương Quang Hải',
    createdAt: '2026-04-01T09:00:00',
    category: 'Tin tức',
    status: 'published',
  },
  {
    id: 'N016',
    title: 'Hướng dẫn kỹ thuật giao bóng trong tennis',
    content: 'Giao bóng (serve) là kỹ thuật quan trọng nhất trong tennis. Bài viết hướng dẫn chi tiết từ tư thế chuẩn bị, cách tung bóng, động tác vung vợt đến các loại giao bóng khác nhau như flat serve, slice serve và kick serve cho người mới bắt đầu.',
    image: 'https://images.unsplash.com/photo-1696661115319-a9b6801e2571?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZW5uaXMlMjB0b3VybmFtZW50JTIwcHJvZmVzc2lvbmFsfGVufDF8fHx8MTc3NjI1ODMxM3ww&ixlib=rb-4.1.0&q=80&w=1080',
    author: 'Lê Quang Liêm',
    createdAt: '2026-03-31T16:00:00',
    category: 'Hướng dẫn',
    status: 'draft',
  },
  {
    id: 'N017',
    title: 'Chiến thuật chơi đôi trong pickleball',
    content: 'Pickleball đôi đòi hỏi sự phối hợp nhịp nhàng giữa hai người chơi. Bài viết chia sẻ các chiến thuật di chuyển, vị trí đứng, giao tiếp và phân công vai trò hiệu quả để giành chiến thắng trong các trận đấu đôi.',
    image: 'https://images.unsplash.com/photo-1761039807856-9f412d0e0a3d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcG9ydHMlMjBjb2FjaGluZyUyMHRyYWluaW5nfGVufDF8fHx8MTc3NjQzMzY3M3ww&ixlib=rb-4.1.0&q=80&w=1080',
    author: 'Phạm Thị Nga',
    createdAt: '2026-03-30T11:00:00',
    category: 'Hướng dẫn',
    status: 'published',
  },
  {
    id: 'N018',
    title: 'Phòng tránh chấn thương khi chơi thể thao',
    content: 'Chấn thương là rủi ro không mong muốn khi tập luyện thể thao. Tìm hiểu cách phòng tránh chấn thương qua việc khởi động đầy đủ, sử dụng trang thiết bị bảo hộ, luyện tập đúng kỹ thuật và nghỉ ngơi hợp lý để bảo vệ sức khỏe lâu dài.',
    image: 'https://images.unsplash.com/photo-1761156896753-f68418033fb9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcG9ydHMlMjBpbmp1cnklMjBwcmV2ZW50aW9ufGVufDF8fHx8MTc3NjQzMzY3NXww&ixlib=rb-4.1.0&q=80&w=1080',
    author: 'Bs. Trần Minh Tuấn',
    createdAt: '2026-03-29T08:00:00',
    category: 'Sức khỏe',
    status: 'published',
  },
  {
    id: 'N019',
    title: 'Giải vô địch bóng bàn TP.HCM mở rộng',
    content: 'Giải bóng bàn lớn nhất năm tại TP.HCM sẽ diễn ra vào tháng 5/2026 với sự tham gia của hơn 200 vận động viên. Giải đấu có nhiều nội dung thi đấu từ đơn nam, đơn nữ đến đôi nam, đôi nữ và đôi nam nữ. Tổng giải thưởng lên đến 500 triệu đồng.',
    image: 'https://images.unsplash.com/photo-1762345127396-ac4a970436c3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcG9ydHMlMjB0b3VybmFtZW50JTIwdHJvcGh5fGVufDF8fHx8MTc3NjQyMTUzOXww&ixlib=rb-4.1.0&q=80&w=1080',
    author: 'Ban tổ chức',
    createdAt: '2026-03-28T15:00:00',
    category: 'Sự kiện',
    status: 'published',
  },
  {
    id: 'N020',
    title: 'Ngày hội bơi lội cộng đồng 2026',
    content: 'Sự kiện bơi lội dành cho cộng đồng sẽ được tổ chức tại các bể bơi công cộng trên toàn quốc. Đây là cơ hội để mọi người, đặc biệt là trẻ em, được học bơi miễn phí từ các huấn luyện viên chuyên nghiệp và tham gia các trò chơi vui nhộn trên nước.',
    image: 'https://images.unsplash.com/photo-1691748693124-3111df9d7b1e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzd2ltbWluZyUyMHBvb2wlMjB0cmFpbmluZ3xlbnwxfHx8fDE3NzY0MzM2NzV8MA&ixlib=rb-4.1.0&q=80&w=1080',
    author: 'Hội Bơi lội Việt Nam',
    createdAt: '2026-03-27T10:00:00',
    category: 'Sự kiện',
    status: 'draft',
  },
];
// Statistics for Admin Dashboard
export const mockStatistics = {
  totalRevenue: 125000000,
  totalBookings: 342,
  totalCourts: 6,
  occupancyRate: 78,
  revenueByMonth: [
    { month: 'T1', revenue: 15000000 },
    { month: 'T2', revenue: 18000000 },
    { month: 'T3', revenue: 22000000 },
  ],
  bookingsByType: [
    { type: 'Pickleball', count: 120, fill: '#FF6B6B' },
    { type: 'Cầu lông', count: 145, fill: '#4ECDC4' },
    { type: 'Bóng rổ', count: 45, fill: '#45B7D1' },
    { type: 'Tennis', count: 32, fill: '#FFA07A' },
  ],
  recentBookings: mockBookings.slice(0, 5),
};

// Mock Court Types Data
export const mockCourtTypes: CourtType[] = [
  {
    id: 'CT001',
    name: 'Pickleball',
    slug: 'pickleball',
    icon: '🏓',
    color: 'bg-orange-500',
    features: ['Sân nhỏ dễ học', 'Thích hợp mọi lứa tuổi', 'Ít chấn thương', 'Thi đấu đôi hoặc đơn'],
    minPlayers: 2,
    maxPlayers: 4,
    courtCount: 2,
    status: 'active',
    createdAt: '2025-12-01T00:00:00',
  },
  {
    id: 'CT002',
    name: 'Cầu lông',
    slug: 'badminton',
    icon: '🏸',
    color: 'bg-green-500',
    features: ['Phổ biến rộng rãi', 'Rèn luyện phản xạ', 'Cải thiện thể lực', 'Thi đấu đơn và đôi'],
    minPlayers: 2,
    maxPlayers: 4,
    courtCount: 2,
    status: 'active',
    createdAt: '2025-12-01T00:00:00',
  },
  {
    id: 'CT003',
    name: 'Bóng rổ',
    slug: 'basketball',
    icon: '🏀',
    color: 'bg-red-500',
    features: ['Thể thao đồng đội', 'Phát triển chiều cao', 'Rèn kỹ năng teamwork', 'Đốt calo hiệu quả'],
    minPlayers: 6,
    maxPlayers: 10,
    courtCount: 1,
    status: 'active',
    createdAt: '2025-12-01T00:00:00',
  },
  {
    id: 'CT004',
    name: 'Tennis',
    slug: 'tennis',
    icon: '🎾',
    color: 'bg-yellow-500',
    features: ['Kỹ thuật cao', 'Rèn luyện toàn diện', 'Thích hợp thi đấu chuyên nghiệp', 'Cải thiện sự tập trung'],
    minPlayers: 2,
    maxPlayers: 4,
    courtCount: 1,
    status: 'active',
    createdAt: '2025-12-01T00:00:00',
  },
  {
    id: 'CT005',
    name: 'Bóng chuyền',
    slug: 'volleyball',
    icon: '🏐',
    color: 'bg-blue-500',
    features: ['Thể thao đồng đội 6 người', 'Phát triển phối hợp', 'Tăng chiều cao', 'Vui vẻ và năng động'],
    minPlayers: 6,
    maxPlayers: 12,
    courtCount: 0,
    status: 'inactive',
    createdAt: '2026-01-15T00:00:00',
  },
];

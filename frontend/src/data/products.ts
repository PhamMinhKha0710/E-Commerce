// data/products.ts
import { Product } from '@/app/products/ProductType';

export const products: Product[] = [
  {
    slug: 'tai-nghe-bluetooth-headphone-edifier-w820nb-plus-thoang-khi-thoai-mai',
    name: 'Tai Nghe Bluetooth Headphone Edifier W820NB PLUS thoáng khí thoải mái',
    category: 'Dành cho bạn',
    image: 'http://bizweb.dktcdn.net/thumb/grande/100/497/938/products/sp20.jpg?v=1696241238643',
    brand: 'EDIFIER', // Tách brand ra ngoài
    description: `
      <p><strong>Kiểu kết nối:</strong> Không dây</p>
      <p><strong>Các loại tai nghe:</strong> Chụp tai</p>
      <p><strong>Game chuyên dụng:</strong> Có</p>
      <p><strong>Thiết bị âm thanh tương thích:</strong> Điện thoại di động</p>
      <p><strong>Loại phụ kiện headphone:</strong> Ampli headphones</p>
      <p><strong>Tính năng các loại tai nghe:</strong> Tích hợp micro, Cản tiếng ồn, Chống ồn, Chống mồ hôi, Điều chỉnh âm lượng</p>
      <p><strong>Kiểu kết nối headphone:</strong> Bluetooth</p>
      <p><strong>Kho hàng:</strong> 2418</p>
      <p><strong>Gửi từ:</strong> Hà Nội</p>
    `, // Chuỗi HTML
    price: 1399000,
    oldPrice: 2399000,
    currency: 'VND',
    availability: 'InStock',
    seller: {
      name: 'ND Mall',
      url: 'https://nd-mall.mysapo.net',
      logo: 'http://bizweb.dktcdn.net/100/497/938/themes/938102/assets/logo.png?1736305669595',
    },
    images: [
      'http://bizweb.dktcdn.net/thumb/1024x1024/100/497/938/products/sp20.jpg?v=1696241238643',
      'http://bizweb.dktcdn.net/thumb/1024x1024/100/497/938/products/sp20-8.jpg?v=1696241239970',
      'http://bizweb.dktcdn.net/thumb/1024x1024/100/497/938/products/sp20-7.jpg?v=1696241241043',
      'http://bizweb.dktcdn.net/thumb/1024x1024/100/497/938/products/sp20-6.jpg?v=1696241241713',
      'http://bizweb.dktcdn.net/thumb/1024x1024/100/497/938/products/sp20-5.jpg?v=1696241242423',
      'http://bizweb.dktcdn.net/thumb/1024x1024/100/497/938/products/sp20-4.jpg?v=1696241243020',
      'http://bizweb.dktcdn.net/thumb/1024x1024/100/497/938/products/sp20-3.jpg?v=1696241243643',
      'http://bizweb.dktcdn.net/thumb/1024x1024/100/497/938/products/sp20-2.jpg?v=1696241244330',
    ],
    
  },
];

// relatedProducts: [
//   {
//     slug: 'iphone-14-pro-max',
//     name: 'iPhone 14 Pro Max',
//     category: 'Dành cho bạn',
//     image: 'http://bizweb.dktcdn.net/thumb/large/100/497/938/products/a2.jpg?v=1696321699110',
//     brand: 'Apple',
//     description: `
//       <p><strong>Kiểu kết nối:</strong> Không dây</p>
//       <p><strong>Loại sản phẩm:</strong> Điện thoại</p>
//       <p><strong>Game chuyên dụng:</strong> Không</p>
//       <p><strong>Hệ điều hành tương thích:</strong> iOS</p>
//       <p><strong>Kho hàng:</strong> 100</p>
//       <p><strong>Gửi từ:</strong> Hà Nội</p>
//     `,
//     price: 26000000,
//     oldPrice: 28000000,
//     currency: 'VND',
//     availability: 'InStock',
//     seller: { name: 'ND Mall', url: 'https://nd-mall.mysapo.net', logo: '' },
//     images: ['http://bizweb.dktcdn.net/thumb/large/100/497/938/products/a2.jpg?v=1696321699110'],
//   },
//   {
//     slug: 'iphone-14-pro-max',
//     name: 'iPhone 14 Pro Max',
//     category: 'Dành cho bạn',
//     image: 'http://bizweb.dktcdn.net/thumb/large/100/497/938/products/a2.jpg?v=1696321699110',
//     brand: 'Apple',
//     description: `
//       <p><strong>Kiểu kết nối:</strong> Không dây</p>
//       <p><strong>Loại sản phẩm:</strong> Điện thoại</p>
//       <p><strong>Game chuyên dụng:</strong> Không</p>
//       <p><strong>Hệ điều hành tương thích:</strong> iOS</p>
//       <p><strong>Kho hàng:</strong> 100</p>
//       <p><strong>Gửi từ:</strong> Hà Nội</p>
//     `,
//     price: 26000000,
//     oldPrice: 28000000,
//     currency: 'VND',
//     availability: 'InStock',
//     seller: { name: 'ND Mall', url: 'https://nd-mall.mysapo.net', logo: '' },
//     images: ['http://bizweb.dktcdn.net/thumb/large/100/497/938/products/a2.jpg?v=1696321699110'],
//   }
//   // Các sản phẩm liên quan khác giữ nguyên cấu trúc tương tự
// ],
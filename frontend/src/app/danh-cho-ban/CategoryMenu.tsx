// components/CategoryMenu.tsx
import CategoryItem from './CategoryItem';

const categoryData = [
  {
    title: 'Đồ Chơi - Mẹ & Bé',
    href: '/do-choi-me-be',
    subItems: [
      {
        title: 'Tã, Bỉm',
        href: '/ta-bim',
        subItems: [
          { title: 'Danh mục con tã bỉm', href: '/danh-muc-con-ta-bim' },
        ],
      },
      { title: 'Dinh dưỡng cho bé', href: '/dinh-duong-cho-be' },
      { title: 'Thực phẩm ăn dặm', href: '/thuc-pham-an-dam' },
      { title: 'Dinh dưỡng cho mẹ', href: '/dinh-duong-cho-me' },
      { title: 'Đồ dùng cho bé', href: '/do-dung-cho-be' },
    ],
  },
  {
    title: 'Điện Thoại - Máy Tính Bảng',
    href: '/dien-thoai-may-tinh-bang',
    subItems: [
      { title: 'Điện thoại Smartphone', href: '/dien-thoai-smartphone' },
      { title: 'Máy tính bảng', href: '/may-tinh-bang' },
      { title: 'Máy đọc sách', href: '/may-doc-sach' },
      { title: 'Điện thoại phổ thông', href: '/dien-thoai-pho-thong' },
      { title: 'Điện thoại bàn', href: '/dien-thoai-ban' },
    ],
  },
  {
    title: 'Làm Đẹp - Sức Khỏe',
    href: '/lam-dep-suc-khoe',
    subItems: [
      { title: 'Chăm sóc da mặt', href: '/cham-soc-da-mat' },
      { title: 'Trang điểm', href: '/trang-diem' },
      { title: 'Chăm sóc cá nhân', href: '/cham-soc-ca-nhan' },
      { title: 'Chăm sóc cơ thể', href: '/cham-soc-co-the' },
      { title: 'Dược mỹ phẩm', href: '/duoc-my-pham' },
    ],
  },
  {
    title: 'Điện Gia Dụng',
    href: '/dien-gia-dung',
    subItems: [
      { title: 'Đồ dùng nhà bếp', href: '/do-dung-nha-bep' },
      { title: 'Thiết bị gia đình', href: '/thiet-bi-gia-dinh' },
    ],
  },
  {
    title: 'Phụ kiện thời trang',
    href: '/phu-kien-thoi-trang',
    subItems: [
      { title: 'Mắt kính', href: '/mat-kinh' },
      { title: 'Phụ kiện thời trang nữ', href: '/phu-kien-thoi-trang-nu' },
      { title: 'Phụ kiện thời trang nam', href: '/phu-kien-thoi-trang-nam' },
    ],
  },
  {
    title: 'Đồng hồ và Trang sức',
    href: '/dong-ho-va-trang-suc',
    subItems: [
      { title: 'Đồng hồ nam', href: '/dong-ho-nam' },
      { title: 'Đồng hồ nữ', href: '/dong-ho-nu' },
      { title: 'Đồng hồ trẻ em', href: '/dong-ho-tre-em' },
      { title: 'Phụ kiện đồng hồ', href: '/phu-kien-dong-ho' },
      { title: 'Trang sức', href: '/trang-suc' },
    ],
  },
  {
    title: 'Laptop - Máy Vi Tính - Linh kiện',
    href: '/laptop-may-vi-tinh-linh-kien',
    subItems: [
      { title: 'Laptop', href: '/laptop' },
      {
        title: 'Thiết Bị Văn Phòng - Thiết Bị Ngoại Vi',
        href: '/thiet-bi-van-phong-thiet-bi-ngoai-vi',
      },
      { title: 'Thiết Bị Lưu Trữ', href: '/thiet-bi-luu-tru' },
      { title: 'Thiết Bị Mạng', href: '/thiet-bi-mang' },
      { title: 'PC - Máy Tính Bộ', href: '/pc-may-tinh-bo' },
      {
        title: 'Linh Kiện Máy Tính - Phụ Kiện Máy Tính',
        href: '/linh-kien-may-tinh-phu-kien-may-tinh',
      },
    ],
  },
  {
    title: 'Nhà cửa & Đời sống',
    href: '/nha-cua-doi-song',
    subItems: [
      { title: 'Dụng cụ nhà bếp', href: '/dung-cu-nha-bep' },
      { title: 'Đồ dùng phòng ăn', href: '/do-dung-phong-an' },
      { title: 'Đồ dùng phòng ngủ', href: '/do-dung-phong-ngu' },
      { title: 'Nội thất', href: '/noi-that' },
      { title: 'Trang trí nhà cửa', href: '/trang-tri-nha-cua' },
    ],
  },
  { title: 'Bách Hóa Online', href: '/bach-hoa-online' },
  {
    title: 'Thiết Bị Số - Phụ Kiện Số',
    href: '/thiet-bi-so-phu-kien-so',
  },
  { title: 'Điện Tử - Điện Lạnh - TV', href: '/dien-tu-dien-lanh-tv' },
  { title: 'Thể Thao - Dã Ngoại', href: '/the-thao-da-ngoai' },
];

const CategoryMenu: React.FC = () => {
    return (
      <div className="aside-content aside-cate">
        <div className="title-head">Danh mục sản phẩm</div>
        <nav className="nav-category">
          <ul className="nav navbar-pills">
            {categoryData.map((item, index) => (
              <CategoryItem
                key={index}
                title={item.title}
                href={item.href}
                subItems={item.subItems}
              />
            ))}
          </ul>
        </nav>
      </div>
    );
  };
  
  export default CategoryMenu;
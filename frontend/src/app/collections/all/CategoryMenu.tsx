// components/CategoryMenu.tsx
import CategoryItem from '@/app/collections/all/CategoryItem';

const categoryData = [
  {
    title: 'Đồ Chơi - Mẹ & Bé',
    href: '/collections/do-choi-me-be',
    subItems: [
      {
        title: 'Tã, Bỉm',
        href: '/collections/ta-bim',
        subItems: [
          { title: 'Danh mục con tã bỉm', href: '/collections/danh-muc-con-ta-bim' },
        ],
      },
      { title: 'Dinh dưỡng cho bé', href: '/collections/dinh-duong-cho-be' },
      { title: 'Thực phẩm ăn dặm', href: '/collections/thuc-pham-an-dam' },
      { title: 'Dinh dưỡng cho mẹ', href: '/collections/dinh-duong-cho-me' },
      { title: 'Đồ dùng cho bé', href: '/collections/do-dung-cho-be' },
    ],
  },
  {
    title: 'Điện Thoại - Máy Tính Bảng',
    href: '/collections/dien-thoai-may-tinh-bang',
    subItems: [
      { title: 'Điện thoại Smartphone', href: '/collections/dien-thoai-smartphone' },
      { title: 'Máy tính bảng', href: '/collections/may-tinh-bang' },
      { title: 'Máy đọc sách', href: '/collections/may-doc-sach' },
      { title: 'Điện thoại phổ thông', href: '/collections/dien-thoai-pho-thong' },
      { title: 'Điện thoại bàn', href: '/collections/dien-thoai-ban' },
    ],
  },
  {
    title: 'Làm Đẹp - Sức Khỏe',
    href: '/collections/lam-dep-suc-khoe',
    subItems: [
      { title: 'Chăm sóc da mặt', href: '/collections/cham-soc-da-mat' },
      { title: 'Trang điểm', href: '/collections/trang-diem' },
      { title: 'Chăm sóc cá nhân', href: '/collections/cham-soc-ca-nhan' },
      { title: 'Chăm sóc cơ thể', href: '/collections/cham-soc-co-the' },
      { title: 'Dược mỹ phẩm', href: '/collections/duoc-my-pham' },
    ],
  },
  {
    title: 'Điện Gia Dụng',
    href: '/collections/dien-gia-dung',
    subItems: [
      { title: 'Đồ dùng nhà bếp', href: '/collections/do-dung-nha-bep' },
      { title: 'Thiết bị gia đình', href: '/collections/thiet-bi-gia-dinh' },
    ],
  },
  {
    title: 'Phụ kiện thời trang',
    href: '/collections/phu-kien-thoi-trang',
    subItems: [
      { title: 'Mắt kính', href: '/collections/mat-kinh' },
      { title: 'Phụ kiện thời trang nữ', href: '/collections/phu-kien-thoi-trang-nu' },
      { title: 'Phụ kiện thời trang nam', href: '/collections/phu-kien-thoi-trang-nam' },
    ],
  },
  {
    title: 'Đồng hồ và Trang sức',
    href: '/collections/dong-ho-va-trang-suc',
    subItems: [
      { title: 'Đồng hồ nam', href: '/collections/dong-ho-nam' },
      { title: 'Đồng hồ nữ', href: '/collections/dong-ho-nu' },
      { title: 'Đồng hồ trẻ em', href: '/collections/dong-ho-tre-em' },
      { title: 'Phụ kiện đồng hồ', href: '/collections/phu-kien-dong-ho' },
      { title: 'Trang sức', href: '/collections/trang-suc' },
    ],
  },
  {
    title: 'Laptop - Máy Vi Tính - Linh kiện',
    href: '/collections/laptop-may-vi-tinh-linh-kien',
    subItems: [
      { title: 'Laptop', href: '/collections/laptop' },
      {
        title: 'Thiết Bị Văn Phòng - Thiết Bị Ngoại Vi',
        href: '/collections/thiet-bi-van-phong-thiet-bi-ngoai-vi',
      },
      { title: 'Thiết Bị Lưu Trữ', href: '/collections/thiet-bi-luu-tru' },
      { title: 'Thiết Bị Mạng', href: '/collections/thiet-bi-mang' },
      { title: 'PC - Máy Tính Bộ', href: '/collections/pc-may-tinh-bo' },
      {
        title: 'Linh Kiện Máy Tính - Phụ Kiện Máy Tính',
        href: '/collections/linh-kien-may-tinh-phu-kien-may-tinh',
      },
    ],
  },
  {
    title: 'Nhà cửa & Đời sống',
    href: '/collections/nha-cua-doi-song',
    subItems: [
      { title: 'Dụng cụ nhà bếp', href: '/collections/dung-cu-nha-bep' },
      { title: 'Đồ dùng phòng ăn', href: '/collections/do-dung-phong-an' },
      { title: 'Đồ dùng phòng ngủ', href: '/collections/do-dung-phong-ngu' },
      { title: 'Nội thất', href: '/collections/noi-that' },
      { title: 'Trang trí nhà cửa', href: '/collections/trang-tri-nha-cua' },
    ],
  },
  { title: 'Bách Hóa Online', href: '/collections/bach-hoa-online' },
  {
    title: 'Thiết Bị Số - Phụ Kiện Số',
    href: '/collections/thiet-bi-so-phu-kien-so',
  },
  { title: 'Điện Tử - Điện Lạnh - TV', href: '/collections/dien-tu-dien-lanh-tv' },
  { title: 'Thể Thao - Dã Ngoại', href: '/collections/the-thao-da-ngoai' },
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
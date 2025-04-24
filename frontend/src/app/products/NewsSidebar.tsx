//NewsSidebar.tsx
import Image from 'next/image';

const newsItems = [
  {
    href: 'xiaomi-13-dang-duoc-thu-nghiem-miui-15-on-dinh-dua-tren-android-14.html',
    title: 'Xiaomi 13 đang được thử nghiệm MIUI 15 ổn định dựa trên Android 14',
    imgSrc: 'http://bizweb.dktcdn.net/thumb/medium/100/497/938/articles/t12.jpg?v=1696325901413',
  },
  {
    href: 'apple-pencil-3-kha-nang-co-co-che-thay-ngoi-cung-voi-tinh-nang-hoan-toan-moi.html',
    title: 'Apple Pencil 3 khả năng có cơ chế thay ngòi cùng với tính năng hoàn toàn mới',
    imgSrc: 'http://bizweb.dktcdn.net/thumb/medium/100/497/938/articles/t11.jpg?v=1696325869497',
  },
  {
    href: 'tu-van-chon-mua-laptop-hp-ho-tro-tac-vu-hoc-tap-van-phong-co-ban-ban-chay-tai-tgdd.html',
    title: 'Tư vấn chọn mua laptop HP hỗ trợ tác vụ học tập văn phòng cơ bản bán chạy tại TGDĐ',
    imgSrc: 'http://bizweb.dktcdn.net/thumb/medium/100/497/938/articles/t10.jpg?v=1696325835147',
  },
  {
    href: 'apple-du-kien-se-som-dua-mot-cong-cu-manh-me-tich-hop-ai-len-app-store.html',
    title: 'Apple dự kiến sẽ sớm đưa một công cụ mạnh mẽ tích hợp AI lên App Store',
    imgSrc: 'http://bizweb.dktcdn.net/thumb/medium/100/497/938/articles/t9.jpg?v=1696325755650',
  },
  {
    href: 'tam-gia-1-trieu-rinh-ngay-combo-tai-nghe-loa-nay-chat-luong-khoi-ban-chill-nhac-mien-che.html',
    title: 'Tầm giá 1 triệu, rinh ngay combo tai nghe + loa này, chất lượng khỏi bàn, chill nhạc miễn chê',
    imgSrc: 'http://bizweb.dktcdn.net/thumb/medium/100/497/938/articles/t8.jpg?v=1696325716373',
  },
];

export default function NewsSidebar() {
  return (
    <div className="blog-bar">
      <div className="title">
        <a href="tin-tuc.html" title="Tin nổi bật">Tin nổi bật</a>
      </div>
      <div className="clearfix"></div>
      <div className="blog-bar-default">
        {newsItems.map((item, index) => (
          <div key={index} className="c-new">
            <a href={item.href} title={item.title} className="c-new__img">
              <Image
                src={item.imgSrc}
                alt={item.title}
                width={100} // Điều chỉnh theo kích thước thực tế
                height={100} // Điều chỉnh theo kích thước thực tế
                className="lazyload img-responsive mx-auto d-block"
                loading="lazy"
              />
            </a>
            <div className="c-new__info">
              <a href={item.href} title={item.title}>{item.title}</a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
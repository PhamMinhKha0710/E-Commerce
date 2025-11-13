// components/BannerItem.tsx
import Image from 'next/image';

interface BannerItemProps {
  href: string;
  title: string;
  imgSrc: string;
  alt: string;
}

const BannerItem: React.FC<BannerItemProps> = ({ href, title, imgSrc, alt }) => {
  return (
    <div className="col-lg-4 col-md-4 col-12 item">
      <a href={href} title={title} className="hover-banner">
        <Image
          className="img-responsive lazyload"
          src={imgSrc}
          alt={alt}
          width={400} // Điều chỉnh theo kích thước thực tế của ảnh
          height={200} // Điều chỉnh theo kích thước thực tế của ảnh
          loading="lazy" // Hỗ trợ lazy loading
        />
      </a>
    </div>
  );
};

export default BannerItem;
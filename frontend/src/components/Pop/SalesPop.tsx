"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { collection, randomTimes, randomUsers } from "@/data/salesPopData";

// Interface cho dữ liệu sản phẩm
interface SalesPopItem {
  href: string;
  imgSrc: string;
  title: string;
  alt: string;
}

// Interface cho dữ liệu hiện tại của popup
interface CurrentPop {
  randomTime: string;
  randomUser: string;
  randomProduct: SalesPopItem;
}

// Hàm xáo trộn mảng (Fisher-Yates shuffle)
const fisherYates = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export default function SalesPop() {
  const [isVisible, setIsVisible] = useState(false);
  const [currentPop, setCurrentPop] = useState<CurrentPop | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const shuffledCollection = fisherYates<SalesPopItem>(collection);

  // Xử lý sự kiện scroll, mousemove, touchstart
  useEffect(() => {
    const handleEvent = () => {
      if (!isLoaded) {
        setIsLoaded(true);
        startSalesPop();
      }
    };

    window.addEventListener("scroll", handleEvent);
    window.addEventListener("mousemove", handleEvent);
    window.addEventListener("touchstart", handleEvent);

    // Cleanup event listeners
    return () => {
      window.removeEventListener("scroll", handleEvent);
      window.removeEventListener("mousemove", handleEvent);
      window.removeEventListener("touchstart", handleEvent);
    };
  }, [isLoaded]);

  // Lấy ngẫu nhiên một item
  const getRandomItem = (): CurrentPop => {
    const randomTime = randomTimes[Math.floor(Math.random() * randomTimes.length)];
    const randomUser = randomUsers[Math.floor(Math.random() * randomUsers.length)];
    const randomProduct =
      shuffledCollection[Math.floor(Math.random() * shuffledCollection.length)];

    return { randomTime, randomUser, randomProduct };
  };

  // Bắt đầu hiển thị sales popup
  const startSalesPop = () => {
    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentPop(getRandomItem());
        setIsVisible(true);
      }, 1000);

      setTimeout(() => {
        setIsVisible(false);
      }, 11000);
    }, 17000);

    // Cleanup interval khi component unmount
    return () => clearInterval(interval);
  };

  // Xử lý đóng popup
  const handleClose = () => {
    setIsVisible(false);
  };

  if (!currentPop || !isVisible) return null;

  return (
    <div className={`jas-sale-pop ${isVisible ? "slideUp" : ""}`}>
      <div style={{ display: "flex" }}>
        <a href={currentPop.randomProduct.href} className="jas-sale-pop-img mr__20">
            <Image
            width={480}
            height={480}
            src={currentPop.randomProduct.imgSrc}
            alt={currentPop.randomProduct.alt}
            priority={false} // Tùy chọn: đặt thành true nếu muốn tải trước
            className="object-cover"
            />
        </a>
        <div className="jas-sale-pop-content">
            <h4 className="fs__12 fwm mg__0 jas-sale-name">{currentPop.randomUser}</h4>
            <h3 className="mg__0 mt__5 mb__5 fs__18">
            <a
                href={currentPop.randomProduct.href}
                title={currentPop.randomProduct.title}
            >
                Đã đặt {currentPop.randomProduct.title}
            </a>
            </h3>
            <span className="fs__12 jas-sale-pop-timeago">
            {currentPop.randomTime} trước
            </span>
        </div>
      </div>
      <span className="pe-7s-close pa fs__20" onClick={handleClose}></span>
    </div>
  );
}
"use client";
import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

function Banner() {
  const [showBanner, setShowBanner] = useState(false);
  const [closedForever, setClosedForever] = useState(false); // State cho checkbox
  const modalRef = useRef<HTMLDivElement>(null); // Tham chiếu đến modal

  useEffect(() => {
    const isPopupClosed = () => document.cookie.includes("popupClosed=true");

    if (!isPopupClosed()) {
      const delayTime = (modalRef.current?.dataset.delay) ? parseInt(modalRef.current.dataset.delay) : 3000;

      const timer = setTimeout(() => {
        setShowBanner(true);
      }, delayTime);

      return () => clearTimeout(timer); // Clear timer khi component unmount
    }
  }, []);

  const handleClose = () => {
    setShowBanner(false);
    if (closedForever) {
      const currentDate = new Date();
      const expiryTime = new Date(currentDate.getTime() + 8 * 60 * 60 * 1000);
      document.cookie = `popupClosed=true; expires=${expiryTime.toUTCString()}; path=/`; // Sử dụng toUTCString
    }
  };

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setClosedForever(event.target.checked);
  };

  // Tạo banner image sử dụng next/image
  const bannerImage = (
    <Image
      src="http://bizweb.dktcdn.net/100/497/938/themes/938102/assets/popup_banner.png?1736305669595"
      alt="ND Mall"
      width={800}
      height={400}
      style={{ width: '100%', height: 'auto' }} // Make the image responsive
    />
  );


  return (
    <div id="modal-banner" className="modal-banner" style={{ display: showBanner ? 'block' : 'none' }} data-delay="5000" ref={modalRef}>
      <div className="modalbanner-overlay fancybox-overlay fancybox-overlay-fixed" onClick={handleClose}></div>
      <div className="modal-banner-promo">
        <div className="modal-body">
          <a href="#" title="ND Mall" className="banner-promotion" data-section="banner_popup">
            {bannerImage}
          </a>
          <div className="check-close">
            <input type="checkbox" id="check-close-banner" name="vehicle1" value="Bike" checked={closedForever} onChange={handleCheckboxChange} />
            <label htmlFor="check-close-banner">Không hiện lại thông báo nữa</label>
          </div>
          <a title="Đóng" className="modalbanner-close close-window" href="#" onClick={handleClose}>
            <svg aria-hidden="true" focusable="false" data-prefix="far" data-icon="times" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" className="svg-inline--fa fa-times fa-w-10"><path fill="currentColor" d="M207.6 256l107.72-107.72c6.23-6.23 6.23-16.34 0-22.58l-25.03-25.03c-6.23-6.23-16.34-6.23-22.58 0L160 208.4 52.28 100.68c-6.23-6.23-16.34-6.23-22.58 0L4.68 125.7c-6.23 6.23-6.23 16.34 0 22.58L112.4 256 4.68 363.72c-6.23 6.23-6.23 16.34 0 22.58l25.03 25.03c6.23 6.23 16.34 6.23 22.58 0L160 303.6l107.72 107.72c6.23 6.23 16.34 6.23 22.58 0l25.03-25.03c6.23-6.23 6.23-16.34 0-22.58L207.6 256z" className=""></path></svg>
          </a>
        </div>
      </div>
    </div>
  );
}

export default Banner;
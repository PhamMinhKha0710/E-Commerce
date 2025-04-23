import Image from "next/image";
import Link from "next/link"; // Import Link component

const Footer = () => {
    return (
        <footer className="footer">
        <div className="mid-footer">
            <div className="container">
                <div className="row">
                    <div className="col-xl-4 col-lg-3 col-12 col-left">
                        <h4 className="title-menu">
                            Thông tin liên hệ
                        </h4>
                        <div className="contact-footer">
                            <div className="item">
                                <strong>Tên công ty</strong>
                                Công ty TNHH AE TKP
                            </div>
                            <div className="item">
                                <strong>Địa chỉ</strong>

                                Tòa nhà E1-Hutech, Khu Công nghệ cao TP.HCM, Đường D1, P.Long Thạnh Mỹ, Hồ Chí Minh

                            </div>
                            <div className="item">
                                <strong>Email</strong>
                                <a href="mailto:support@tkp.com" title="support@tkp.com">support@tkp.vn</a>
                            </div>
                            <div className="item">
                                <strong>Hotline</strong>
                                <a className="fone" href="tel:19000019" title="19006750">1900 0019</a>
                            </div>
                            <div className="item">
                                <strong>Thời gian hỗ trợ</strong>
                                08:30 - 21:30 các ngày trong tuần
                            </div>
                        </div>


                    </div>
                    <div className="col-xl-8 col-lg-9 col-12 col-right">
                        <div className="row">
                            <div className="col-lg-4 col-md-4 col-12 link_list col-footer">
                                <h4 className="title-menu">
                                    Hướng dẫn
                                    <span className="Collapsible__Plus"></span>
                                </h4>
                                <div className="list-menu hidden-mobile">

                                    <Link href="/" legacyBehavior><a title="Trang chủ">Trang chủ</a></Link> 
                                    <Link href="/gioi-thieu" legacyBehavior><a title="Giới thiệu">Giới thiệu</a></Link> 
                                    <Link href="/san-pham" legacyBehavior><a title="Sản phẩm">Sản phẩm</a></Link> 
                                    <Link href="/yeu-thich" legacyBehavior><a title="Yêu thích">Yêu thích</a></Link> 
                                    <Link href="/lien-he" legacyBehavior><a title="Liên hệ">Liên hệ</a></Link> 
                                    <Link href="/tin-tuc" legacyBehavior><a title="Tin tức">Tin tức</a></Link> 
                                    <Link href="/he-thong-cua-hang" legacyBehavior><a title="Hệ thống cửa hàng">Hệ thống cửa hàng</a></Link> 
                                    <Link href="/affiliate" legacyBehavior><a title="Đăng ký Affiliate">Đăng ký Affiliate</a></Link> 

                                </div>
                            </div>
                            <div className="col-lg-4 col-md-4 col-12 link_list col-footer">
                                <h4 className="title-menu">
                                    Chăm sóc khách hàng
                                    <span className="Collapsible__Plus"></span>
                                </h4>
                                <div className="list-menu hidden-mobile">

                                    <Link href="#" legacyBehavior><a title="Các câu hỏi thường gặp">Các câu hỏi thường gặp</a></Link> 
                                    <Link href="#" legacyBehavior><a title="Gửi yêu cầu hỗ trợ">Gửi yêu cầu hỗ trợ</a></Link> 
                                    <Link href="#" legacyBehavior><a title="Đặt hàng online">Đặt hàng online</a></Link> 
                                    <Link href="#" legacyBehavior><a title="Phương thức vận chuyển">Phương thức vận chuyển</a></Link> 
                                    <Link href="#" legacyBehavior><a title="Hoàn trả đơn hàng">Hoàn trả đơn hàng</a></Link>
                                    <Link href="#" legacyBehavior><a title="Đăng ký Affiliate">Đăng ký Affiliate</a></Link>
                                    <Link href="#" legacyBehavior><a title="Chính sách kiểm hàng">Chính sách kiểm hàng</a></Link>

                                </div>
                            </div>
                            <div className="col-lg-4 col-md-4 col-12 col-footer">
                                <div className="module-social">
                                    <h4 className="title-menu">
                                        Kết nối
                                        <span className="Collapsible__Plus"></span>
                                    </h4>
                                    <div className="hidden-mobile">
                                        <div className="social-footer">
                                            <a href="#" className="social-button" title="Facebook" target="_blank" rel="nofollow">
                                                <svg className="icon"> <use xmlnsXlink="http://www.w3.org/1999/xlink" xlinkHref="#icon-facebook"></use> </svg>
                                            </a>
                                            <a href="#" className="social-button" title="Youtube" target="_blank" rel="nofollow">
                                                <svg className="icon"> <use xmlnsXlink="http://www.w3.org/1999/xlink" xlinkHref="#icon-youtube"></use> </svg>
                                            </a>
                                            <a href="#" className="social-button" title="Twitter" target="_blank" rel="nofollow">
                                                <svg className="icon"> <use xmlnsXlink="http://www.w3.org/1999/xlink" xlinkHref="#icon-twitter"></use> </svg>
                                            </a>
                                            <a href="#" className="social-button" title="Instagram" target="_blank" rel="nofollow">
                                                <svg className="icon"> <use xmlnsXlink="http://www.w3.org/1999/xlink" xlinkHref="#icon-instagram"></use> </svg>
                                            </a>
                                            <a href="#" className="social-button" title="Google" target="_blank" rel="nofollow">
                                                <svg className="icon"> <use xmlnsXlink="http://www.w3.org/1999/xlink" xlinkHref="#icon-google"></use> </svg>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                                <div className="module-application">
                                    <h4 className="title-menu">
                                        Tải ứng dụng TKP MALL
                                        <span className="Collapsible__Plus"></span>
                                    </h4>
                                    <div className="hidden-mobile">
                                        <Image
                                            src="http://bizweb.dktcdn.net/100/497/938/themes/938102/assets/img-app-store.png?1736305669595"
                                            width={120}  // Thay thế bằng width thực tế
                                            height={40} // Thay thế bằng height thực tế
                                            alt="Tải ứng dụng trên App Store" // Alt text mô tả hơn
                                        />
                                        <Image
                                            src="http://bizweb.dktcdn.net/100/497/938/themes/938102/assets/img-google-play.png?1736305669595"
                                            width={135} // Thay thế bằng width thực tế
                                            height={40} // Thay thế bằng height thực tế
                                            alt="Tải ứng dụng trên Google Play" // Alt text mô tả hơn
                                        />
                                    </div>
                                </div>
                                <div className="module-payment">
                                    <h4 className="title-menu">
                                        Phương thức thanh toán
                                        <span className="Collapsible__Plus"></span>
                                    </h4>
                                    <div className="hidden-mobile">
                                        <div className="item">
                                            <Image
                                                src="http://bizweb.dktcdn.net/100/497/938/themes/938102/assets/icon_payment_1.png?1736305669595"
                                                width={40}  // Thay thế bằng width thực tế
                                                height={25} // Thay thế bằng height thực tế
                                                alt="Thanh toán bằng thẻ Visa" // Alt text mô tả hơn
                                            />
                                        </div>
                                        <div className="item">
                                            <Image
                                                src="http://bizweb.dktcdn.net/100/497/938/themes/938102/assets/icon_payment_2.png?1736305669595"
                                                width={40}  // Thay thế bằng width thực tế
                                                height={25} // Thay thế bằng height thực tế
                                                alt="Thanh toán bằng thẻ Mastercard" // Alt text mô tả hơn
                                            />
                                        </div>
                                        <div className="item">
                                            <Image
                                                src="http://bizweb.dktcdn.net/100/497/938/themes/938102/assets/icon_payment_3.png?1736305669595"
                                                width={40}  // Thay thế bằng width thực tế
                                                height={25} // Thay thế bằng height thực tế
                                                alt="Thanh toán bằng thẻ JCB" // Alt text mô tả hơn
                                            />
                                        </div>
                                        <div className="item">
                                            <Image
                                                src="http://bizweb.dktcdn.net/100/497/938/themes/938102/assets/icon_payment_4.png?1736305669595"
                                                width={40}  // Thay thế bằng width thực tế
                                                height={25} // Thay thế bằng height thực tế
                                                alt="Thanh toán khi giao hàng (COD)" // Alt text mô tả hơn
                                            />
                                        </div>
                                        <div className="item">
                                            <Image
                                                src="http://bizweb.dktcdn.net/100/497/938/themes/938102/assets/icon_payment_5.png?1736305669595"
                                                width={40}  // Thay thế bằng width thực tế
                                                height={25} // Thay thế bằng height thực tế
                                                alt="Thanh toán bằng VNPay" // Alt text mô tả hơn
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>

            </div>
        </div>
        <div id="copyright" className="copyright">
            <div className="container">
                <div className="border">
                    <div className="row d-flex align-items-center">
                        <div className="col-lg-8 col-md-6 col-12">
                            <div className="wsp">
                                @ Bản quyền thuộc về TKP
                                <span className="d-sm-inline-block d-none"> | </span>
                                <span className="opacity1">
                                    Cung cấp bởi
                                     <a href="#!" rel="noopener" title="TKP" target="_blank">TiepDepTrai</a>
                                </span>
                            </div>
                        </div>
                        <div className="col-lg-4 col-md-6 col-12">
                            <div className="logo-footer">
                                <Link href="/" legacyBehavior><a className="logo" title="Logo">
                                    <Image
                                        height={49}
                                        width={124}
                                        src="/images/smile.svg"
                                        alt="Logo TKP" // Alt text mô tả hơn
                                    />
                                </a></Link>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </footer>
    )
}

export default Footer;
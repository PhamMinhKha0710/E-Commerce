import React from "react";
import LoginForm from "./login-form";
import SocialLoginButtons from "../components/SocialLoginButton";
import Breadcrumb from "@/app/auth/components/BreadCrumb";

const LoginPage = () => {
    return (
        <section className="section" style={{ marginTop: "-30px" }}>
            <Breadcrumb>
                <>Đăng nhập tài khoản</>
            </Breadcrumb>
            <div className="container">
                <div className="wrap_background_aside page_login">
                    <div className="row">
                        <div className="col-lg-5 col-md-6 col-sm-12 col-xl-4 offset-0 offset-xl-4 offset-lg-4 offset-md-3 offset-xl-3 col-12">
                            <div className="row">
                                <div className="page-login pagecustome clearfix">
                                    <div className="wpx">
                                        <h1 className="title_heads a-center">
                                            <span>Đăng nhập</span>
                                        </h1>
                                        <span className="block a-center dkm margin-top-10">
                                            Nếu bạn chưa có tài khoản,{" "}
                                            <a
                                                href="/account/register"
                                                className="btn-link-style btn-register"
                                            >
                                                đăng ký tại đây
                                            </a>
                                        </span>
                                        <LoginForm />
                                        <SocialLoginButtons />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default LoginPage;

"use client";

import React, { FormEvent, useState, useRef, useEffect } from "react";
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

const LoginForm = () => {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [recoverEmail, setRecoverEmail] = useState("");
  const [showRecoverForm, setShowRecoverForm] = useState(false);
  const [formError, setFormError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const recoverFormRef = useRef<HTMLDivElement>(null);
  const [recoverFormHeight, setRecoverFormHeight] = useState(0);

  useEffect(() => {
    if (recoverFormRef.current) {
      setRecoverFormHeight(recoverFormRef.current.scrollHeight);
    }
  }, [showRecoverForm]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError("");

    if (!email || !password) {
      setFormError("Vui lòng điền đầy đủ email và mật khẩu.");
      return;
    }

    setIsLoading(true);

    try {
      await login(email, password);
      const redirectUrl = localStorage.getItem('redirectAfterLogin') || '/';
      localStorage.removeItem('redirectAfterLogin');
      router.push(redirectUrl);
    } catch  {
      setFormError("Đăng nhập thất bại. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRecoverSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError("");

    if (!recoverEmail) {
      setFormError("Vui lòng nhập email để khôi phục mật khẩu.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:5130/api/auth/recover-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: recoverEmail,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        setFormError(errorData.message || errorData.error || "Gửi yêu cầu khôi phục thất bại.");
        setIsLoading(false);
        return;
      }

      alert("Yêu cầu khôi phục mật khẩu đã được gửi. Vui lòng kiểm tra email.");
      setRecoverEmail("");
      setShowRecoverForm(false);
    } catch (error) {
      console.error("Recover error:", error);
      setFormError("Đã xảy ra lỗi khi gửi yêu cầu khôi phục. Vui lòng thử lại sau.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleRecoverForm = () => {
    setShowRecoverForm(!showRecoverForm);
  };

  const recoverFormStyle = {
    height: showRecoverForm ? `${recoverFormHeight}px` : "0px",
    overflow: "hidden",
    transition: "height 0.3s ease-in-out",
  };

  return (
    <>
      <div id="login" className="section">
        <form
          method="post"
          action="https://nd-mall.mysapo.net/account/login"
          id="customer_login"
          acceptCharset="UTF-8"
          onSubmit={handleSubmit}
        >
          <input name="FormType" type="hidden" value="customer_login" />
          <input name="utf8" type="hidden" value="true" />
          <input name="ReturnUrl" type="hidden" value="/auth" />
          {formError && (
            <span className="form-signup" style={{ color: "red" }}>
              {formError}
            </span>
          )}
          <div className="form-signup clearfix">
            <fieldset className="form-group">
              <input
                type="email"
                pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,63}$"
                className="form-control form-control-lg"
                value={email}
                name="email"
                id="customer_email"
                placeholder="Email"
                required
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
            </fieldset>
            <fieldset className="form-group">
              <input
                type="password"
                className="form-control form-control-lg"
                value={password}
                name="password"
                id="customer_password"
                placeholder="Mật khẩu"
                required
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
            </fieldset>
            <div className="pull-xs-left">
              <input
                className="btn btn-style btn_50"
                type="submit"
                value={isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
                disabled={isLoading}
              />
              <span className="block a-center quenmk" onClick={handleToggleRecoverForm}>
                Quên mật khẩu
              </span>
            </div>
          </div>
        </form>
      </div>
      <div className="h_recover" style={recoverFormStyle} ref={recoverFormRef}>
        <div id="recover-password" className="form-signup page-login">
          <form
            method="post"
            action="https://nd-mall.mysapo.net/account/recover"
            id="recover_customer_password"
            acceptCharset="UTF-8"
            onSubmit={handleRecoverSubmit}
          >
            <input name="FormType" type="hidden" value="recover_customer_password" />
            <input name="utf8" type="hidden" value="true" />
            <div className="form-signup" style={{ color: "red" }}>
              {formError && showRecoverForm && formError}
            </div>
            <div className="form-signup clearfix">
              <fieldset className="form-group">
                <input
                  type="email"
                  pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,63}$"
                  className="form-control form-control-lg"
                  value={recoverEmail}
                  name="Email"
                  id="recover-email"
                  placeholder="Email"
                  required
                  onChange={(e) => setRecoverEmail(e.target.value)}
                  disabled={isLoading}
                />
              </fieldset>
            </div>
            <div className="action_bottom">
              <input
                className="btn btn-style btn_50"
                style={{ marginTop: "0px" }}
                type="submit"
                value={isLoading ? "Đang xử lý..." : "Lấy lại mật khẩu"}
                disabled={isLoading}
              />
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default LoginForm;
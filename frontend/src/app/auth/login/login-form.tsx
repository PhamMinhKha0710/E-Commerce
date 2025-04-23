'use client';
import React, { FormEvent, useState, useRef, useEffect } from 'react';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [recoverEmail, setRecoverEmail] = useState('');
  const [showRecoverForm, setShowRecoverForm] = useState(false);
  const [formError, setFormError] = useState('');
  const recoverFormRef = useRef<HTMLDivElement>(null);
  const [recoverFormHeight, setRecoverFormHeight] = useState(0);

  useEffect(() => {
    if (recoverFormRef.current) {
      setRecoverFormHeight(recoverFormRef.current.scrollHeight);
    }
  }, [showRecoverForm]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError('');

    if (!email || !password) {
      setFormError('Vui lòng điền đầy đủ email và mật khẩu.');
      return;
    }

    // TODO: Gửi yêu cầu đăng nhập đến backend
    console.log('Logging in with:', email, password);
  };

  const handleRecoverSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // TODO: Send recover email request to backend
    console.log('Recovering password with:', recoverEmail);
  };

  const handleToggleRecoverForm = () => {
    setShowRecoverForm(!showRecoverForm);
  };

  const recoverFormStyle = {
    height: showRecoverForm ? `${recoverFormHeight}px` : '0px',
    overflow: 'hidden',
    transition: 'height 0.3s ease-in-out', // Thêm transition ở đây
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
          <input name="ReturnUrl" type="hidden" value="/account" />
          {formError && <span className="form-signup" style={{ color: 'red' }}>{formError}</span>}
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
              />
            </fieldset>
            <div className="pull-xs-left">
              <input className="btn btn-style btn_50" type="submit" value="Đăng nhập" />
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
            <div className="form-signup" style={{ color: 'red' }}></div>
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
                />
              </fieldset>
            </div>
            <div className="action_bottom">
              <input className="btn btn-style btn_50" style={{ marginTop: '0px' }} type="submit" value="Lấy lại mật khẩu" />
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default LoginForm;
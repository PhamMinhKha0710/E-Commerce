"use client";
import { JSX, useState, useEffect, useRef } from 'react';
import styles from './AddressPage.module.css';
import addressData from './addressData.json';

// Define interfaces for the JSON data structure
interface Ward {
  Id?: string;
  Name?: string;
  Level: string;
}

interface District {
  Id: string;
  Name: string;
  Wards: Ward[];
}

interface Province {
  Id: string;
  Name: string;
  Districts: District[];
}

interface Address {
  id?: string;
  name: string;
  address: string;
  phone: string;
  isDefault?: boolean;
}

interface CustomSelectProps {
  options: string[];
  placeholder: string;
  onChange: (value: string) => void;
  value: string;
  disabled?: boolean;
}

const CustomSelect: React.FC<CustomSelectProps> = ({ options, placeholder, onChange, value, disabled }) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (option: string) => {
    onChange(option);
    setIsOpen(false);
  };

  const toggleDropdown = () => {
    if (!disabled) setIsOpen((prev) => !prev);
  };

  return (
    <div className={styles.customSelectWrapper} ref={selectRef}>
      <div
        className={`${styles.customSelect} ${disabled ? styles.disabled : ''}`}
        onClick={toggleDropdown}
      >
        <span className={value ? styles.selectedValue : styles.placeholder}>
          {value || placeholder}
        </span>
        <span className={styles.arrow}></span>
      </div>
      {isOpen && !disabled && (
        <div className={styles.dropdown}>
          {options.map((option, index) => (
            <div
              key={index}
              className={styles.option}
              onClick={() => handleSelect(option)}
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const parseAddress = (fullAddress: string) => {
  const parts = fullAddress.split(', ').map(part => part.trim());
  if (parts.length >= 4) {
    return {
      street: parts[0],
      ward: parts[1],
      district: parts[2],
      province: parts[3]
    };
  }
  return {
    street: fullAddress,
    ward: '',
    district: '',
    province: ''
  };
};

export default function AddressPage(): JSX.Element {
  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedWard, setSelectedWard] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [street, setStreet] = useState('');
  const [addressType, setAddressType] = useState('home');
  const [isDefault, setIsDefault] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('accessToken');
      if (!token) {
        setError('Vui lòng đăng nhập để xem địa chỉ');
        return;
      }
      console.log(`Fetching addresses with token: ${token}`);
      const response = await fetch('http://localhost:5130/api/addresses', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) {
        if (response.status === 401) {
          setError('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại');
        } else {
          throw new Error(`Failed to fetch addresses: ${response.statusText}`);
        }
        return;
      }
      const data: Address[] = await response.json();
      console.log('Received addresses:', data);
      // Sort addresses: default address first
      setAddresses(data.sort((a, b) => (b.isDefault ? 1 : 0) - (a.isDefault ? 1 : 0)));
    } catch (error) {
      console.error('Error fetching addresses:', error);
      setError('Không thể tải danh sách địa chỉ. Vui lòng thử lại');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const provinces: string[] = addressData.map((province: Province) => province.Name);

  const districtOptions: string[] = selectedProvince
    ? addressData
        .find((province: Province) => province.Name === selectedProvince)
        ?.Districts.map((district: District) => district.Name) || []
    : [];

  const wardOptions: string[] = selectedDistrict
    ? addressData
        .find((province: Province) => province.Name === selectedProvince)
        ?.Districts.find((district: District) => district.Name === selectedDistrict)
        ?.Wards.filter((ward: Ward) => ward.Name)
        .map((ward: Ward) => ward.Name!) || []
    : [];

  const handleProvinceChange = (province: string) => {
    setSelectedProvince(province);
    setSelectedDistrict('');
    setSelectedWard('');
  };

  const handleDistrictChange = (district: string) => {
    setSelectedDistrict(district);
    setSelectedWard('');
  };

  const handleEditAddress = (id: string) => {
    const address = addresses.find((addr) => addr.id === id);
    if (!address) {
      setError('Không tìm thấy địa chỉ để chỉnh sửa');
      return;
    }

    const parsed = parseAddress(address.address);
    setFullName(address.name);
    setPhone(address.phone);
    setSelectedProvince(parsed.province);
    setSelectedDistrict(parsed.district);
    setSelectedWard(parsed.ward);
    setStreet(parsed.street);
    setAddressType('home');
    setIsDefault(address.isDefault || false);
    setIsEditing(true);
    setEditingAddressId(id);
    setIsFormVisible(true);
  };

  const handleAddNewAddress = () => {
    if (!localStorage.getItem('accessToken')) {
      setError('Vui lòng đăng nhập để thêm địa chỉ');
      return;
    }
    setFullName('');
    setPhone('');
    setSelectedProvince('');
    setSelectedDistrict('');
    setSelectedWard('');
    setStreet('');
    setAddressType('home');
    setIsDefault(false);
    setIsEditing(false);
    setEditingAddressId(null);
    setIsFormVisible(true);
  };

  const handleCancel = () => {
    setFullName('');
    setPhone('');
    setSelectedProvince('');
    setSelectedDistrict('');
    setSelectedWard('');
    setStreet('');
    setAddressType('home');
    setIsDefault(false);
    setIsEditing(false);
    setEditingAddressId(null);
    setIsFormVisible(false);
    setError(null);
  };

  const handleSubmit = async () => {
    const newAddress: Address = {
      name: fullName,
      address: `${street}, ${selectedWard}, ${selectedDistrict}, ${selectedProvince}`,
      phone,
      isDefault
    };

    try {
      setError(null);
      const token = localStorage.getItem('accessToken');
      if (!token) {
        setError('Vui lòng đăng nhập để lưu địa chỉ');
        return;
      }

      if (isEditing && editingAddressId !== null) {
        console.log(`Updating address ID: ${editingAddressId}`);
        const response = await fetch(`http://localhost:5130/api/addresses/${editingAddressId}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(newAddress)
        });
        if (!response.ok) {
          if (response.status === 401) {
            setError('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại');
          } else if (response.status === 404) {
            setError('Không tìm thấy địa chỉ để cập nhật');
          } else {
            throw new Error(`Failed to update address: ${response.statusText}`);
          }
          return;
        }
        await fetchAddresses(); // Refresh the entire address list
      } else {
        console.log('Adding new address:', newAddress);
        const response = await fetch('http://localhost:5130/api/addresses', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(newAddress)
        });
        if (!response.ok) {
          if (response.status === 401) {
            setError('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại');
          } else {
            throw new Error(`Failed to add address: ${response.statusText}`);
          }
          return;
        }
        await fetchAddresses(); // Refresh the entire address list
      }
    } catch (error) {
      console.error('Error submitting address:', error);
      setError('Không thể lưu địa chỉ. Vui lòng thử lại');
    }

    handleCancel();
  };

  const handleDeleteAddress = async (id: string) => {
    try {
      setError(null);
      const token = localStorage.getItem('accessToken');
      if (!token) {
        setError('Vui lòng đăng nhập để xóa địa chỉ');
        return;
      }
      console.log(`Deleting address ID: ${id}`);
      const response = await fetch(`http://localhost:5130/api/addresses/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) {
        if (response.status === 401) {
          setError('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại');
        } else if (response.status === 404) {
          setError('Không tìm thấy địa chỉ để xóa');
        } else {
          throw new Error(`Failed to delete address: ${response.statusText}`);
        }
        return;
      }
      await fetchAddresses(); // Refresh the entire address list
    } catch (error) {
      console.error('Error deleting address:', error);
      setError('Không thể xóa địa chỉ. Vui lòng thử lại');
    }
  };

  const addressRows: Address[][] = [];
  for (let i = 0; i < addresses.length; i += 2) {
    addressRows.push(addresses.slice(i, i + 2));
  }

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <div className={styles.addressSection}>
          <h3 className={styles.title}>2. Địa chỉ giao hàng</h3>
          <h5 className={styles.addressListText}>Chọn địa chỉ giao hàng có sẵn bên dưới:</h5>
          {error && <p className={styles.error}>{error}</p>}
          {loading ? (
            <p>Loading addresses...</p>
          ) : addresses.length === 0 ? (
            <p>Chưa có địa chỉ nào.</p>
          ) : (
            <div className={styles.addressList}>
              {addressRows.map((row, rowIndex) => (
                <div key={rowIndex} className={styles.addressRow}>
                  {row.map((address) => (
                    <div
                      key={address.id}
                      className={`${styles.addressItem} ${address.isDefault ? styles.defaultAddress : ''}`}
                    >
                      <div className={styles.content}>
                        <p className={styles.name}>{address.name}</p>
                        <p className={styles.address}>Địa chỉ: {address.address}</p>
                        <p className={styles.address}>Việt Nam</p>
                        <p className={styles.phone}>Điện thoại: {address.phone}</p>
                      </div>
                      <div className={styles.action}>
                        <button
                          type="button"
                          className={styles.savingAddress}
                          style={address.isDefault ? { backgroundColor: 'rgb(0, 182, 240)' } : {}}
                        >
                          Giao đến địa chỉ này
                        </button>
                        <button
                          type="button"
                          className={styles.editAddress}
                          onClick={() => handleEditAddress(address.id!)}
                        >
                          Sửa
                        </button>
                        {!address.isDefault && (
                          <button
                            type="button"
                            className={styles.deleteAddress}
                            onClick={() => handleDeleteAddress(address.id!)}
                          >
                            Xoá
                          </button>
                        )}
                      </div>
                      {address.isDefault && <span className={styles.default}>Mặc định</span>}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
        <p className={styles.addNewAddress}>
          Bạn muốn giao hàng đến địa chỉ khác?{' '}
          <span onClick={handleAddNewAddress} style={{ cursor: 'pointer' }}>
            Thêm địa chỉ giao hàng mới
          </span>
        </p>
        {isFormVisible && (
          <div className={`${styles.formContainer} ${isEditing ? styles.editing : ''}`}>
            <div className={styles.form} style={{margin: 'auto'}}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Họ tên</label>
                <input
                  type="text"
                  name="full_name"
                  placeholder="Nhập họ tên"
                  maxLength={50}
                  className={styles.input}
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Điện thoại di động</label>
                <input
                  type="text"
                  name="telephone"
                  placeholder="Nhập số điện thoại"
                  className={styles.input}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Tỉnh/Thành phố</label>
                <CustomSelect
                  options={provinces}
                  placeholder="Chọn Tỉnh/Thành phố"
                  onChange={handleProvinceChange}
                  value={selectedProvince}
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Quận/Huyện</label>
                <CustomSelect
                  options={districtOptions}
                  placeholder="Chọn Quận/Huyện"
                  onChange={handleDistrictChange}
                  value={selectedDistrict}
                  disabled={!selectedProvince}
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Phường/Xã</label>
                <CustomSelect
                  options={wardOptions}
                  placeholder="Chọn Phường/Xã"
                  onChange={setSelectedWard}
                  value={selectedWard}
                  disabled={!selectedDistrict}
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Địa chỉ</label>
                <textarea
                  name="street"
                  placeholder="Ví dụ: 52, đường Trần Hưng Đạo"
                  className={styles.textarea}
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                ></textarea>
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}></label>
                <span className={styles.hint}>
                  Để nhận hàng thuận tiện hơn, bạn vui lòng cho Smile-Mart biết loại địa chỉ.
                </span>
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label} style={{ paddingTop: 0 }}>Loại địa chỉ</label>
                <span className={styles.radioGroup}>
                  <label className={styles.radioLabel}>
                    <input
                      type="radio"
                      name="delivery_address_type"
                      value="home"
                      className={styles.radioInput}
                      checked={addressType === 'home'}
                      onChange={() => setAddressType('home')}
                    />
                    <span className={styles.radioCustom}></span>
                    Nhà riêng / Chung cư
                  </label>
                  <label className={styles.radioLabel}>
                    <input
                      type="radio"
                      name="delivery_address_type"
                      value="company"
                      className={styles.radioInput}
                      checked={addressType === 'company'}
                      onChange={() => setAddressType('company')}
                    />
                    <span className={styles.radioCustom}></span>
                    Cơ quan / Công ty
                  </label>
                </span>
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}></label>
                <span>
                  <label className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      name="is_default"
                      className={styles.checkboxInput}
                      checked={isDefault}
                      onChange={(e) => setIsDefault(e.target.checked)}
                    />
                    <span className={styles.checkboxCustom}></span>
                    Sử dụng địa chỉ này làm mặc định.
                  </label>
                </span>
              </div>
              <div className={styles.formGroup} style={{ marginBottom: 0 }}>
                <label className={styles.label}></label>
                <div className={styles.buttonGroup}>
                  <button className={styles.cancelButton} onClick={handleCancel}>
                    Huỷ bỏ
                  </button>
                  <button
                    className={`${styles.submitButton} ${isEditing ? styles.editing : ''}`}
                    onClick={handleSubmit}
                  >
                    {isEditing ? 'Cập nhật' : 'Giao đến địa chỉ này'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
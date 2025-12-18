// Service để quản lý categories

export interface Category {
  id: number;
  title: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5130';

class CategoryService {
  private categoriesCache: Category[] | null = null;
  private cacheExpiry: number = 0;
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  /**
   * Lấy tất cả categories từ API
   */
  async getAllCategories(): Promise<Category[]> {
    // Kiểm tra cache
    if (this.categoriesCache && Date.now() < this.cacheExpiry) {
      return this.categoriesCache;
    }

    try {
      const response = await fetch(`${API_URL}/api/Categories`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch categories: ${response.status}`);
      }

      const data = await response.json();
      const categories = Array.isArray(data) ? data : [];

      // Lưu vào cache
      this.categoriesCache = categories;
      this.cacheExpiry = Date.now() + this.CACHE_DURATION;

      return categories;
    } catch (error) {
      console.error('Error fetching categories:', error);
      return [];
    }
  }

  /**
   * Tìm category theo tên (case-insensitive, partial match)
   * Hỗ trợ nhiều cách so sánh để tìm category chính xác nhất
   */
  async findCategoryByName(name: string): Promise<Category | null> {
    const categories = await this.getAllCategories();
    const normalizedName = name.toLowerCase().trim();

    // Bước 1: Tìm chính xác (exact match)
    let found = categories.find((cat) => {
      const normalizedTitle = cat.title.toLowerCase().trim();
      return normalizedTitle === normalizedName;
    });

    if (found) {
      console.log(`[CategoryService] Found exact match: "${found.title}" for "${name}"`);
      return found;
    }

    // Bước 2: Tìm bằng cách loại bỏ dấu và so sánh
    const removeDiacritics = (str: string): string => {
      return str
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim();
    };

    const normalizedNameNoDiacritics = removeDiacritics(name);
    found = categories.find((cat) => {
      const normalizedTitle = removeDiacritics(cat.title);
      return normalizedTitle === normalizedNameNoDiacritics;
    });

    if (found) {
      console.log(`[CategoryService] Found match (no diacritics): "${found.title}" for "${name}"`);
      return found;
    }

    // Bước 3: Tìm partial match (tên category chứa tên tìm kiếm hoặc ngược lại)
    found = categories.find((cat) => {
      const normalizedTitle = cat.title.toLowerCase().trim();
      return (
        normalizedTitle.includes(normalizedName) ||
        normalizedName.includes(normalizedTitle)
      );
    });

    if (found) {
      console.log(`[CategoryService] Found partial match: "${found.title}" for "${name}"`);
      return found;
    }

    // Bước 4: Tìm bằng cách so sánh từng từ
    const nameWords = normalizedName.split(/\s+/).filter(w => w.length > 2);
    if (nameWords.length > 0) {
      found = categories.find((cat) => {
        const normalizedTitle = cat.title.toLowerCase().trim();
        const titleWords = normalizedTitle.split(/\s+/).filter(w => w.length > 2);
        // Kiểm tra xem có ít nhất 50% từ khớp không
        const matchingWords = nameWords.filter(word => 
          titleWords.some(titleWord => 
            titleWord.includes(word) || word.includes(titleWord)
          )
        );
        return matchingWords.length >= Math.ceil(nameWords.length * 0.5);
      });

      if (found) {
        console.log(`[CategoryService] Found word-based match: "${found.title}" for "${name}"`);
        return found;
      }
    }

    console.warn(`[CategoryService] No category found for name: "${name}"`);
    return null;
  }

  /**
   * Tìm category theo ID
   */
  async findCategoryById(id: number): Promise<Category | null> {
    const categories = await this.getAllCategories();
    return categories.find(cat => cat.id === id) || null;
  }

  /**
   * Chuyển đổi slug thành category name
   * Ví dụ: "ta-bim" -> "Tã, Bỉm"
   */
  slugToCategoryName(slug: string): string {
    // Chuyển slug thành tên category
    // Ví dụ: "ta-bim" -> "Tã, Bỉm"
    const slugMap: Record<string, string> = {
      'ta-bim': 'Tã, Bỉm',
      'danh-muc-con-ta-bim': 'Danh mục con tã bỉm',
      'do-choi-me-be': 'Đồ Chơi - Mẹ & Bé',
      'dinh-duong-cho-be': 'Dinh dưỡng cho bé',
      'thuc-pham-an-dam': 'Thực phẩm ăn dặm',
      'dinh-duong-cho-me': 'Dinh dưỡng cho mẹ',
      'do-dung-cho-be': 'Đồ dùng cho bé',
      'dien-thoai-may-tinh-bang': 'Điện Thoại - Máy Tính Bảng',
      'dien-thoai-smartphone': 'Điện thoại Smartphone',
      'may-tinh-bang': 'Máy tính bảng',
      'may-doc-sach': 'Máy đọc sách',
      'dien-thoai-pho-thong': 'Điện thoại phổ thông',
      'dien-thoai-ban': 'Điện thoại bàn',
      'lam-dep-suc-khoe': 'Làm Đẹp - Sức Khỏe',
      'cham-soc-da-mat': 'Chăm sóc da mặt',
      'trang-diem': 'Trang điểm',
      'cham-soc-ca-nhan': 'Chăm sóc cá nhân',
      'cham-soc-co-the': 'Chăm sóc cơ thể',
      'duoc-my-pham': 'Dược mỹ phẩm',
      'dien-gia-dung': 'Điện Gia Dụng',
      'do-dung-nha-bep': 'Đồ dùng nhà bếp',
      'thiet-bi-gia-dinh': 'Thiết bị gia đình',
      'phu-kien-thoi-trang': 'Phụ kiện thời trang',
      'mat-kinh': 'Mắt kính',
      'phu-kien-thoi-trang-nu': 'Phụ kiện thời trang nữ',
      'phu-kien-thoi-trang-nam': 'Phụ kiện thời trang nam',
      'dong-ho-va-trang-suc': 'Đồng hồ và Trang sức',
      'dong-ho-nam': 'Đồng hồ nam',
      'dong-ho-nu': 'Đồng hồ nữ',
      'dong-ho-tre-em': 'Đồng hồ trẻ em',
      'phu-kien-dong-ho': 'Phụ kiện đồng hồ',
      'trang-suc': 'Trang sức',
      'laptop-may-vi-tinh-linh-kien': 'Laptop - Máy Vi Tính - Linh kiện',
      'laptop': 'Laptop',
      'thiet-bi-van-phong-thiet-bi-ngoai-vi': 'Thiết Bị Văn Phòng - Thiết Bị Ngoại Vi',
      'thiet-bi-luu-tru': 'Thiết Bị Lưu Trữ',
      'thiet-bi-mang': 'Thiết Bị Mạng',
      'pc-may-tinh-bo': 'PC - Máy Tính Bộ',
      'linh-kien-may-tinh-phu-kien-may-tinh': 'Linh Kiện Máy Tính - Phụ Kiện Máy Tính',
      'nha-cua-doi-song': 'Nhà cửa & Đời sống',
      'dung-cu-nha-bep': 'Dụng cụ nhà bếp',
      'do-dung-phong-an': 'Đồ dùng phòng ăn',
      'do-dung-phong-ngu': 'Đồ dùng phòng ngủ',
      'noi-that': 'Nội thất',
      'trang-tri-nha-cua': 'Trang trí nhà cửa',
      'bach-hoa-online': 'Bách Hóa Online',
      'thiet-bi-so-phu-kien-so': 'Thiết Bị Số - Phụ Kiện Số',
      'dien-tu-dien-lanh-tv': 'Điện Tử - Điện Lạnh - TV',
      'the-thao-da-ngoai': 'Thể Thao - Dã Ngoại',
      'pin-sac-du-phong': 'Pin - Sạc dự phòng',
      'cham-soc-thu-cung': 'Chăm sóc thú cưng',
    };

    return slugMap[slug] || slug;
  }

  /**
   * Tìm category từ slug
   */
  async findCategoryBySlug(slug: string): Promise<Category | null> {
    const categoryName = this.slugToCategoryName(slug);
    return await this.findCategoryByName(categoryName);
  }

  /**
   * Chuyển đổi category name thành slug
   * Ví dụ: "Tã, Bỉm" -> "ta-bim"
   */
  categoryNameToSlug(name: string): string {
    // Tạo reverse map từ slugMap
    const slugMap: Record<string, string> = {
      'ta-bim': 'Tã, Bỉm',
      'danh-muc-con-ta-bim': 'Danh mục con tã bỉm',
      'do-choi-me-be': 'Đồ Chơi - Mẹ & Bé',
      'dinh-duong-cho-be': 'Dinh dưỡng cho bé',
      'thuc-pham-an-dam': 'Thực phẩm ăn dặm',
      'dinh-duong-cho-me': 'Dinh dưỡng cho mẹ',
      'do-dung-cho-be': 'Đồ dùng cho bé',
      'dien-thoai-may-tinh-bang': 'Điện Thoại - Máy Tính Bảng',
      'dien-thoai-smartphone': 'Điện thoại Smartphone',
      'may-tinh-bang': 'Máy tính bảng',
      'may-doc-sach': 'Máy đọc sách',
      'dien-thoai-pho-thong': 'Điện thoại phổ thông',
      'dien-thoai-ban': 'Điện thoại bàn',
      'lam-dep-suc-khoe': 'Làm Đẹp - Sức Khỏe',
      'cham-soc-da-mat': 'Chăm sóc da mặt',
      'trang-diem': 'Trang điểm',
      'cham-soc-ca-nhan': 'Chăm sóc cá nhân',
      'cham-soc-co-the': 'Chăm sóc cơ thể',
      'duoc-my-pham': 'Dược mỹ phẩm',
      'dien-gia-dung': 'Điện Gia Dụng',
      'do-dung-nha-bep': 'Đồ dùng nhà bếp',
      'thiet-bi-gia-dinh': 'Thiết bị gia đình',
      'phu-kien-thoi-trang': 'Phụ kiện thời trang',
      'mat-kinh': 'Mắt kính',
      'phu-kien-thoi-trang-nu': 'Phụ kiện thời trang nữ',
      'phu-kien-thoi-trang-nam': 'Phụ kiện thời trang nam',
      'dong-ho-va-trang-suc': 'Đồng hồ và Trang sức',
      'dong-ho-nam': 'Đồng hồ nam',
      'dong-ho-nu': 'Đồng hồ nữ',
      'dong-ho-tre-em': 'Đồng hồ trẻ em',
      'phu-kien-dong-ho': 'Phụ kiện đồng hồ',
      'trang-suc': 'Trang sức',
      'laptop-may-vi-tinh-linh-kien': 'Laptop - Máy Vi Tính - Linh kiện',
      'laptop': 'Laptop',
      'thiet-bi-van-phong-thiet-bi-ngoai-vi': 'Thiết Bị Văn Phòng - Thiết Bị Ngoại Vi',
      'thiet-bi-luu-tru': 'Thiết Bị Lưu Trữ',
      'thiet-bi-mang': 'Thiết Bị Mạng',
      'pc-may-tinh-bo': 'PC - Máy Tính Bộ',
      'linh-kien-may-tinh-phu-kien-may-tinh': 'Linh Kiện Máy Tính - Phụ Kiện Máy Tính',
      'nha-cua-doi-song': 'Nhà cửa & Đời sống',
      'dung-cu-nha-bep': 'Dụng cụ nhà bếp',
      'do-dung-phong-an': 'Đồ dùng phòng ăn',
      'do-dung-phong-ngu': 'Đồ dùng phòng ngủ',
      'noi-that': 'Nội thất',
      'trang-tri-nha-cua': 'Trang trí nhà cửa',
      'bach-hoa-online': 'Bách Hóa Online',
      'thiet-bi-so-phu-kien-so': 'Thiết Bị Số - Phụ Kiện Số',
      'dien-tu-dien-lanh-tv': 'Điện Tử - Điện Lạnh - TV',
      'the-thao-da-ngoai': 'Thể Thao - Dã Ngoại',
      'pin-sac-du-phong': 'Pin - Sạc dự phòng',
      'cham-soc-thu-cung': 'Chăm sóc thú cưng',
    };

    // Tìm slug từ name
    for (const [slug, categoryName] of Object.entries(slugMap)) {
      if (categoryName.toLowerCase() === name.toLowerCase()) {
        return slug;
      }
    }

    // Nếu không tìm thấy trong map, tạo slug từ name
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[đĐ]/g, 'd')
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  }

  /**
   * Xóa cache
   */
  clearCache(): void {
    this.categoriesCache = null;
    this.cacheExpiry = 0;
  }
}

export const categoryService = new CategoryService();


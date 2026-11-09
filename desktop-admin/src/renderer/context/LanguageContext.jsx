import React, { createContext, useContext, useState, useEffect } from 'react';

const translations = {
  ar: {
    brand: {
      name: "شيخون",
      adminTitle: "لوحة تحكم المشرفين",
      sub: "إدارة مخزون قطع الغيار والوسائط السحابية"
    },
    auth: {
      title: "تسجيل دخول المشرف",
      subtitle: "أدخل بيانات حساب Supabase Auth للوصول إلى لوحة التحكم",
      email: "البريد الإلكتروني",
      password: "كلمة المرور",
      loginButton: "تسجيل الدخول",
      loggingIn: "جاري التحقق...",
      logout: "تسجيل الخروج",
      demoLogin: "الدخول بوضع المعاينة التجريبي (Demo)",
      supabaseConfig: "إعدادات الربط مع سوبابيز (Supabase)",
      supabaseUrl: "عنوان مشروع سوبابيز (Project URL)",
      supabaseKey: "المفتاح العام (Anon Key)",
      saveConfig: "حفظ الإعدادات",
      invalidLogin: "البريد الإلكتروني أو كلمة المرور غير صحيحة",
      fillAllFields: "يرجى تعبئة كافة الحقول المطلوبة"
    },
    dashboard: {
      title: "كتالوج قطع الغيار",
      subtitle: "عرض وتعديل وحذف وإضافة قطع غيار السيارات مع رفع الصور المباشر",
      addProductBtn: "إضافة قطعة غيار جديدة",
      searchPlaceholder: "بحث فوري بالاسم (عربي / إنجليزي) أو برقم القطعة...",
      totalParts: "إجمالي القطع",
      inStock: "متوفر بالمخزن",
      categoriesCount: "الأقسام النشطة",
      viewGrid: "شبكة كروت",
      viewTable: "جدول بيانات",
      refresh: "تحديث البيانات"
    },
    table: {
      image: "الصورة",
      nameAr: "الاسم بالعربية",
      nameEn: "الاسم بالإنجليزية",
      category: "القسم",
      partNumber: "رقم القطعة",
      price: "السعر",
      createdAt: "تاريخ الإضافة",
      actions: "الإجراءات",
      edit: "تعديل",
      delete: "حذف",
      noData: "لا توجد قطع غيار مسجلة حالياً"
    },
    form: {
      addNewTitle: "إضافة قطعة غيار جديدة للمخزون",
      editTitle: "تعديل بيانات قطعة الغيار",
      nameArLabel: "اسم القطعة باللغة العربية (مطلوب)",
      nameArPlaceholder: "مثال: طقم أقراص فرامل سيراميك بريمبو",
      nameEnLabel: "اسم القطعة باللغة الإنجليزية (مطلوب)",
      nameEnPlaceholder: "e.g., Brembo Ceramic Brake Discs Kit",
      copyNameToEn: "نسخ الاسم العربي للإنجليزي",
      copyNameToAr: "نسخ الاسم الإنجليزي للعربي",
      categoryLabel: "قسم القطعة",
      partNumberLabel: "رقم القطعة الأصلي (OEM)",
      priceLabel: "السعر التقديري ($)",
      imageUploadLabel: "صورة قطعة الغيار (مطلوبة)",
      dragDropText: "اسحب وأفلت صورة القطعة هنا، أو اضغط للاختيار",
      supportedFormats: "يدعم PNG, JPG, WEBP, AVIF حتى 10 ميجابايت",
      replaceImageText: "تغيير الصورة الحالية (اختياري)",
      uploadingImage: "جاري رفع الصورة إلى Supabase Storage...",
      savingProduct: "جاري حفظ البيانات في قاعدة البيانات...",
      saveBtn: "حفظ ونشر القطعة",
      updateBtn: "تحديث بيانات القطعة",
      cancelBtn: "إلغاء",
      validationImageRequired: "يرجى اختيار صورة لقطعة الغيار",
      validationNameRequired: "الاسم باللغة العربية والإنجليزية مطلوبان"
    },
    deleteModal: {
      title: "تأكيد حذف قطعة الغيار",
      message: "هل أنت متأكد من رغبتك في حذف هذه القطعة؟ سيتم إزالتها نهائياً من قاعدة البيانات ومخزن الصور.",
      confirmBtn: "نعم، احذف القطعة",
      cancelBtn: "إلغاء"
    },
    messages: {
      addedSuccess: "تمت إضافة قطعة الغيار بنجاح!",
      updatedSuccess: "تم تحديث بيانات القطعة بنجاح!",
      deletedSuccess: "تم حذف القطعة بنجاح!",
      errorOccurred: "حدث خطأ أثناء معالجة الطلب"
    }
  },
  en: {
    brand: {
      name: "Shikhon",
      adminTitle: "Admin Dashboard",
      sub: "Manage spare parts catalog & Supabase cloud assets"
    },
    auth: {
      title: "Admin Sign In",
      subtitle: "Enter your Supabase Auth credentials to access the management portal",
      email: "Email Address",
      password: "Password",
      loginButton: "Sign In",
      loggingIn: "Authenticating...",
      logout: "Sign Out",
      demoLogin: "Explore in Demo Mode",
      supabaseConfig: "Supabase Connection Settings",
      supabaseUrl: "Project URL",
      supabaseKey: "Anon Key",
      saveConfig: "Save Settings",
      invalidLogin: "Invalid email or password",
      fillAllFields: "Please fill in all required fields"
    },
    dashboard: {
      title: "Spare Parts Catalog",
      subtitle: "Add, inspect, edit, or delete automotive components with direct cloud storage upload",
      addProductBtn: "Add New Spare Part",
      searchPlaceholder: "Search across names (Arabic/English) or part numbers...",
      totalParts: "Total Inventory",
      inStock: "In Stock",
      categoriesCount: "Active Categories",
      viewGrid: "Grid View",
      viewTable: "Table View",
      refresh: "Refresh Data"
    },
    table: {
      image: "Image",
      nameAr: "Arabic Name",
      nameEn: "English Name",
      category: "Category",
      partNumber: "Part #",
      price: "Price",
      createdAt: "Created At",
      actions: "Actions",
      edit: "Edit",
      delete: "Delete",
      noData: "No spare parts registered yet"
    },
    form: {
      addNewTitle: "Add New Spare Part to Inventory",
      editTitle: "Edit Spare Part Details",
      nameArLabel: "Part Name in Arabic (Required)",
      nameArPlaceholder: "e.g., طقم أقراص فرامل سيراميك بريمبو",
      nameEnLabel: "Part Name in English (Required)",
      nameEnPlaceholder: "e.g., Brembo Ceramic Brake Discs Kit",
      copyNameToEn: "Copy Arabic name to English",
      copyNameToAr: "Copy English name to Arabic",
      categoryLabel: "Component Category",
      partNumberLabel: "OEM Part Number",
      priceLabel: "Estimated Price ($)",
      imageUploadLabel: "Spare Part Image (Required)",
      dragDropText: "Drag & drop part photo here, or click to browse",
      supportedFormats: "Supports PNG, JPG, WEBP, AVIF up to 10MB",
      replaceImageText: "Change current image (optional)",
      uploadingImage: "Uploading image to Supabase Storage...",
      savingProduct: "Saving product in Supabase PostgreSQL...",
      saveBtn: "Save & Publish Part",
      updateBtn: "Update Part Details",
      cancelBtn: "Cancel",
      validationImageRequired: "Please select an image for this spare part",
      validationNameRequired: "Both Arabic and English names are required"
    },
    deleteModal: {
      title: "Confirm Spare Part Deletion",
      message: "Are you sure you want to permanently delete this part? It will be removed from both the database and cloud storage.",
      confirmBtn: "Yes, Delete Part",
      cancelBtn: "Cancel"
    },
    messages: {
      addedSuccess: "Spare part created successfully!",
      updatedSuccess: "Spare part updated successfully!",
      deletedSuccess: "Spare part deleted successfully!",
      errorOccurred: "An error occurred while processing your request"
    }
  }
};

const LanguageContext = createContext(null);

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('shikhon_admin_lang') === 'en' ? 'en' : 'ar';
  });

  useEffect(() => {
    localStorage.setItem('shikhon_admin_lang', language);
    const dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.setAttribute('dir', dir);
    document.documentElement.setAttribute('lang', language);
    document.title = language === 'ar' 
      ? 'شيخون - لوحة تحكم المشرفين' 
      : 'Shikhon - Admin Dashboard';
  }, [language]);

  const toggleLanguage = () => {
    setLanguage(prev => (prev === 'ar' ? 'en' : 'ar'));
  };

  const isRTL = language === 'ar';

  const t = (path) => {
    const keys = path.split('.');
    let result = translations[language];
    for (const key of keys) {
      if (result && typeof result === 'object' && key in result) {
        result = result[key];
      } else {
        let fallback = translations.en;
        for (const fKey of keys) {
          fallback = fallback?.[fKey];
        }
        return fallback || path;
      }
    }
    return result || path;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, isRTL, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

import { z } from "zod";
import { LISTING_LIMITS, USER_LIMITS } from "@/constants";

// ============================================
// Auth Validasyonları
// ============================================

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email adresi gerekli")
    .email("Geçerli bir email adresi girin")
    .regex(
      /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.edu\.tr$/,
      "Sadece .edu.tr uzantılı email adresleri kabul edilmektedir"
    ),
  password: z.string().min(1, "Şifre gerekli"),
});

export const registerSchema = z
  .object({
    full_name: z
      .string()
      .min(USER_LIMITS.fullName.min, `Ad soyad en az ${USER_LIMITS.fullName.min} karakter olmalı`)
      .max(USER_LIMITS.fullName.max, `Ad soyad en fazla ${USER_LIMITS.fullName.max} karakter olabilir`),
    email: z
      .string()
      .min(1, "Email adresi gerekli")
      .email("Geçerli bir email adresi girin")
      .regex(
        /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.edu\.tr$/,
        "Sadece .edu.tr uzantılı email adresleri kabul edilmektedir"
      ),
    password: z
      .string()
      .min(8, "Şifre en az 8 karakter olmalı")
      .regex(/[A-Z]/, "Şifre en az bir büyük harf içermeli")
      .regex(/[a-z]/, "Şifre en az bir küçük harf içermeli")
      .regex(/[0-9]/, "Şifre en az bir rakam içermeli"),
    confirmPassword: z.string().min(1, "Şifre tekrarı gerekli"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Şifreler eşleşmiyor",
    path: ["confirmPassword"],
  });

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, "Email adresi gerekli")
    .email("Geçerli bir email adresi girin")
    .regex(
      /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.edu\.tr$/,
      "Sadece .edu.tr uzantılı email adresleri kabul edilmektedir"
    ),
});

export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Şifre en az 8 karakter olmalı")
      .regex(/[A-Z]/, "Şifre en az bir büyük harf içermeli")
      .regex(/[a-z]/, "Şifre en az bir küçük harf içermeli")
      .regex(/[0-9]/, "Şifre en az bir rakam içermeli"),
    confirmPassword: z.string().min(1, "Şifre tekrarı gerekli"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Şifreler eşleşmiyor",
    path: ["confirmPassword"],
  });

// ============================================
// İlan Validasyonları
// ============================================

export const createListingSchema = z.object({
  title: z
    .string()
    .min(LISTING_LIMITS.title.min, `Başlık en az ${LISTING_LIMITS.title.min} karakter olmalı`)
    .max(LISTING_LIMITS.title.max, `Başlık en fazla ${LISTING_LIMITS.title.max} karakter olabilir`),
  description: z
    .string()
    .min(LISTING_LIMITS.description.min, `Açıklama en az ${LISTING_LIMITS.description.min} karakter olmalı`)
    .max(LISTING_LIMITS.description.max, `Açıklama en fazla ${LISTING_LIMITS.description.max} karakter olabilir`),
  price: z
    .number()
    .min(LISTING_LIMITS.price.min, `Fiyat en az ${LISTING_LIMITS.price.min} TL olmalı`)
    .max(LISTING_LIMITS.price.max, `Fiyat en fazla ${LISTING_LIMITS.price.max} TL olabilir`),
  category_id: z.string().min(1, "Kategori seçimi zorunlu"),
  condition: z.enum(["new", "like_new", "good", "fair", "poor"], {
    message: "Ürün durumu seçimi zorunlu",
  }),
});

export const updateListingSchema = createListingSchema.partial();

// ============================================
// Profil Validasyonları
// ============================================

export const updateProfileSchema = z.object({
  full_name: z
    .string()
    .min(USER_LIMITS.fullName.min, `Ad soyad en az ${USER_LIMITS.fullName.min} karakter olmalı`)
    .max(USER_LIMITS.fullName.max, `Ad soyad en fazla ${USER_LIMITS.fullName.max} karakter olabilir`)
    .optional(),
  username: z
    .string()
    .min(USER_LIMITS.username.min, `Kullanıcı adı en az ${USER_LIMITS.username.min} karakter olmalı`)
    .max(USER_LIMITS.username.max, `Kullanıcı adı en fazla ${USER_LIMITS.username.max} karakter olabilir`)
    .regex(/^[a-z0-9_]+$/, "Kullanıcı adı sadece küçük harf, rakam ve alt çizgi içerebilir")
    .optional()
    .or(z.literal("")),
  phone: z
    .string()
    .max(USER_LIMITS.phone.max, `Telefon en fazla ${USER_LIMITS.phone.max} karakter olabilir`)
    .optional()
    .or(z.literal("")),
  bio: z
    .string()
    .max(USER_LIMITS.bio.max, `Biyografi en fazla ${USER_LIMITS.bio.max} karakter olabilir`)
    .optional()
    .or(z.literal("")),
  university_name: z.string().optional().or(z.literal("")),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Mevcut şifre gerekli"),
    newPassword: z
      .string()
      .min(8, "Yeni şifre en az 8 karakter olmalı")
      .regex(/[A-Z]/, "Şifre en az bir büyük harf içermeli")
      .regex(/[a-z]/, "Şifre en az bir küçük harf içermeli")
      .regex(/[0-9]/, "Şifre en az bir rakam içermeli"),
    confirmPassword: z.string().min(1, "Şifre tekrarı gerekli"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Şifreler eşleşmiyor",
    path: ["confirmPassword"],
  });

// ============================================
// Mesaj Validasyonları
// ============================================

export const sendMessageSchema = z.object({
  content: z
    .string()
    .min(1, "Mesaj boş olamaz")
    .max(2000, "Mesaj en fazla 2000 karakter olabilir"),
});

// ============================================
// Rapor Validasyonları
// ============================================

export const createReportSchema = z.object({
  reason: z.enum(
    ["spam", "inappropriate", "fraud", "wrong_category", "duplicate", "other"],
    {
      message: "Rapor sebebi seçimi zorunlu",
    }
  ),
  description: z
    .string()
    .max(500, "Açıklama en fazla 500 karakter olabilir")
    .optional(),
});

// ============================================
// Tip Çıkarımları
// ============================================

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
export type CreateListingFormData = z.infer<typeof createListingSchema>;
export type UpdateListingFormData = z.infer<typeof updateListingSchema>;
export type UpdateProfileFormData = z.infer<typeof updateProfileSchema>;
export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;
export type SendMessageFormData = z.infer<typeof sendMessageSchema>;
export type CreateReportFormData = z.infer<typeof createReportSchema>;

---
name: NovaStore Design System
colors:
  surface: '#fbf8ff'
  surface-dim: '#d9d9e7'
  surface-bright: '#fbf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f2ff'
  surface-container: '#ededfb'
  surface-container-high: '#e7e7f5'
  surface-container-highest: '#e1e1ef'
  on-surface: '#191b25'
  on-surface-variant: '#434656'
  inverse-surface: '#2e303a'
  inverse-on-surface: '#f0effe'
  outline: '#737688'
  outline-variant: '#c3c5d9'
  surface-tint: '#004ced'
  primary: '#003ec7'
  on-primary: '#ffffff'
  primary-container: '#0052ff'
  on-primary-container: '#dfe3ff'
  inverse-primary: '#b7c4ff'
  secondary: '#a04100'
  on-secondary: '#ffffff'
  secondary-container: '#fe6b00'
  on-secondary-container: '#572000'
  tertiary: '#3c4e74'
  on-tertiary: '#ffffff'
  tertiary-container: '#54668e'
  on-tertiary-container: '#dce5ff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dde1ff'
  primary-fixed-dim: '#b7c4ff'
  on-primary-fixed: '#001452'
  on-primary-fixed-variant: '#0038b6'
  secondary-fixed: '#ffdbcc'
  secondary-fixed-dim: '#ffb693'
  on-secondary-fixed: '#351000'
  on-secondary-fixed-variant: '#7a3000'
  tertiary-fixed: '#d8e2ff'
  tertiary-fixed-dim: '#b4c6f3'
  on-tertiary-fixed: '#051a3e'
  on-tertiary-fixed-variant: '#35466c'
  background: '#fbf8ff'
  on-background: '#191b25'
  surface-variant: '#e1e1ef'
  surface-main: '#FFFFFF'
  surface-muted: '#F4F5F7'
  text-primary: '#091E42'
  text-secondary: '#44546F'
  accent-energy: '#FF6B00'
  status-critical: '#D7391B'
  status-success: '#00875A'
typography:
  headline-xl:
    fontFamily: Manrope
    fontSize: 40px
    fontWeight: '700'
    lineHeight: '1.2'
  headline-lg:
    fontFamily: Manrope
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Manrope
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Manrope
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.5'
  body-md:
    fontFamily: Manrope
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  body-sm:
    fontFamily: Manrope
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.4'
  label-lg:
    fontFamily: Manrope
    fontSize: 14px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Manrope
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1.2'
  headline-lg-mobile:
    fontFamily: Manrope
    fontSize: 28px
    fontWeight: '700'
    lineHeight: '1.2'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 4px
  container-max: 1280px
  gutter: 24px
  margin-desktop: 48px
  margin-mobile: 16px
  stack-xs: 4px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 24px
  stack-xl: 48px
---

# UX Tasarım Planı: NovaStore Müşteri Portalı

## 1. Genel Vizyon
Kullanıcının minimum sürtünme ile ürün bulabildiği, sepetine ekleyebildiği ve güvenle sipariş verebildiği, modern bir e-ticaret deneyimi.

## 2. Kullanıcı Yolculuğu (User Flow)
`Ana Sayfa (Ürün Keşfi)` $\rightarrow$ `Ürün Detay` $\rightarrow$ `Sepete Ekle` $\rightarrow$ `Sepet Kontrol`

## 3. Sayfa Yapıları ve Fonksiyonlar

### A. Giriş ve Kayıt (Auth)
- **Kayıt Sayfası:** Kullanıcı adı, e-posta ve şifre ile hızlı hesap oluşturma.
- **Giriş Sayfası:** Basit giriş formu.
- **Misafir Modu:** (Opsiyonel) Giriş yapmadan ürünleri inceleme, ancak sipariş aşamasında giriş zorunluluğu.

### B. Ürün Kataloğu (Aktif Ürünler)
- **Ana Sayfa / Market:** 
    - **Ürün Kartları:** Ürün görseli, isim, fiyat ve "Sepete Ekle" butonu.
    - **Kategori Filtreleme:** Üst menüde kategoriler (Elektronik, Giyim vb.) arası hızlı geçiş.
    - **Sıralama:** Fiyata göre (Artan/Azalan) veya popülerliğe göre sıralama.
- **Ürün Detay Sayfası:** Ürün açıklaması, yüksek çözünürlüklü görsel, stok durumu (örneğin: "Sadece 5 adet kaldı!") ve miktar seçici.

### C. Alışveriş Sepeti (Cart)
- **Sepet Özeti:** Eklenen ürünlerin listesi, miktar güncelleme (+/-) ve ürün çıkarma.
- **Dinamik Toplam:** Alt toplam, tahmini kargo ve genel toplamın anlık hesaplanması.
- **Check-out Butonu:** Ödeme sayfasına yönlendiren belirgin çağrı (CTA) butonu.

## 4. Görsel Dil ve UI Prensipleri
- **Odak Noktası:** Ürün görsellerinin ön planda olduğu, beyaz alanların (white space) bol kullanıldığı ferah bir tasarım.
- **Renk Sistemi:** 
    - Sınırlı renk paleti kullanımı.
    - Hiyerarşik yapı (60-30-10 kuralı) uygulanarak rastgele renk kullanımından kaçınılacak.
    - Güven veren ana renkler (Örn: Enerjik Turuncu veya Güven veren Mavi).
- **Tipografi:** 
    - Maksimum 1 veya 2 tutarlı typeface seçimi.
    - Türkçe ve İngilizce karakter desteği olan, okunabilir fontlar.
- **Interaktivite:** Sepete ürün eklendiğinde küçük bir bildirim (toast notification) veya sepet ikonunda sayı artışı.

## 5. Teknik Entegrasyon (Backend Bağlantısı)
- **Ürünler:** `/api/reports/low-stock` gibi admin rotaları yerine, tüm aktif ürünleri dönen yeni bir `GET /api/products` endpoint'ine ihtiyaç duyulacak.
- **Siparişler:** Sepetteki ürünleri `Orders` ve `OrderDetails` tablolarına kaydeden yeni bir `POST /api/orders` endpoint'i geliştirilecek.

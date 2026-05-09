# UX Tasarım Planı: NovaStore Müşteri Portalı

## 1. Genel Vizyon
Kullanıcının minimum sürtünme ile ürün bulabildiği, sepetine ekleyebildiği ve güvenle sipariş verebildiği, modern bir e-ticaret deneyimi.

## 2. Kullanıcı Yolculuğu (User Flow)
`Ana Sayfa (Ürün Keşfi)` $\rightarrow$ `Ürün Detay` $\rightarrow$ `Sepete Ekle` $\rightarrow$ `Sepet Kontrol` $\rightarrow$ `Ödeme/Sipariş` $\rightarrow$ `Sipariş Takip`

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

# 4. Görsel Dil ve UI Prensipleri
- **Odak Noktası:** Ürün görsellerinin ön planda olduğu, beyaz alanların (white space) bol kullanıldığı ferah bir tasarım.
- **Renkler:** Güven veren canlı renkler (Örn: Marka rengi olarak Enerjik bir Turuncu veya Güven veren bir Mavi).
- **Interaktivite:** Sepete ürün eklendiğinde küçük bir bildirim (toast notification) veya sepet ikonunda sayı artışı.

## 5. Teknik Entegrasyon (Backend Bağlantısı)
- **Ürünler:** `/api/reports/low-stock` gibi admin rotaları yerine, tüm aktif ürünleri dönen yeni bir `GET /api/products` endpoint'ine ihtiyaç duyulacak.
- **Siparişler:** Sepetteki ürünleri `Orders` ve `OrderDetails` tablolarına kaydeden yeni bir `POST /api/orders` endpoint'i geliştirilecek.

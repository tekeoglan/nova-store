# UX Tasarım Planı: NovaStore Yönetim Paneli

## 1. Genel Vizyon
Veri yoğunluklu, temiz ve yönetici odaklı bir "Admin Dashboard" tasarımı. Temel amaç, karmaşık SQL raporlarını son kullanıcının kolayca anlayabileceği tablolara ve görsel grafiklere dönüştürmektir.

## 2. Kullanıcı Yolculuğu (User Flow)
`Giriş Sayfası` $\rightarrow$ `Dashboard (Genel Bakış)` $\rightarrow$ `Raporlar Menüsü` $\rightarrow$ `Detaylı Veri Görünümü`

## 3. Sayfa Yapıları ve Fonksiyonlar

### A. Kimlik Doğrulama (Auth)
- **Login Sayfası:** Minimalist merkezlenmiş form. Kullanıcı adı, şifre ve "Hatalı giriş" uyarı mesajları.
- **Kayıt Sayfası:** Yeni yönetici hesabı oluşturma formu.

### B. Ana Panel (Dashboard)
- **Özet Kartları:** Toplam Ürün Sayısı, Toplam Sipariş, Toplam Ciro ve Kritik Stok Sayısı gibi hızlı metrikler.
- **Hızlı Erişim:** En çok kullanılan raporlara (örn: Düşük Stok) kestirme butonlar.

### C. Raporlar Merkezi (Reports Hub)
Her rapor için özel bir görünüm:
- **Düşük Stok Listesi:** Kırmızı vurgulu, sıralanabilir tablo. "Siparişe Dönüştür" aksiyon butonu.
- **Sipariş Geçmişi:** Tarih ve Müşteri adına göre filtrelenebilir geniş tablo.
- **Müşteri Detayları:** Arama çubuğu $\rightarrow$ Müşteri Seçimi $\rightarrow$ Aldığı Ürünlerin Listesi (Kart görünümü).
- **Kategori İstatistikleri:** Pasta grafiği (Pie Chart) veya yatay çubuk grafikler.
- **Ciro Sıralaması:** "Leaderboard" tarzı, en yüksekten en düşüğe sıralı liste.
- **Sipariş Yaşlandırma:** Gün sayısına göre renk kodlu (Yeşil $\rightarrow$ Sarı $\rightarrow$ Kırmızı) liste.

## 4. Görsel Dil ve UI Prensipleri
- **Renk Paleti:** Profesyonel koyu mavi/gri tonları, dikkat çekici vurgu renkleri (Sarı: Uyarı, Kırmızı: Kritik, Yeşil: Başarılı).
- **Bileşenler:** Responsive tablolar, Search-bar'lar, Date-picker'lar ve yan menü (Sidebar) navigasyonu.

## 5. Teknik Entegrasyon Planı
- **Frontend:** React veya Vue.js (Önerilen).
- **State Management:** JWT token'ın `cookie` üzerinde tutulması.
- **API Bağlantısı:** Axios/Fetch ile `/api/auth` ve `/api/reports` endpointlerinin tüketilmesi.

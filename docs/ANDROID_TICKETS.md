# ANDROID_TICKETS

## Özet

Android ticket katmanı, MVP kapsamında foundation seviyesinde hazırlanmıştır. Ticket ekranları build, repository, ViewModel ve navigation düzeyinde bağlıdır.

Bu doküman şu alanları kapsar:

- employee ticket list foundation
- employee ticket detail foundation
- employee ticket create foundation
- technician queue foundation
- technician status update foundation
- ticket comment foundation

## Tamamlanan Foundation Akışları

### Employee

- `EmployeeHomeScreen -> MyTickets`
- `MyTickets -> TicketDetail`
- `EmployeeHomeScreen / MyTickets -> CreateTicket`

### Technician

- `TechnicianHomeScreen -> TechnicianQueue`
- `TechnicianQueue -> TicketDetail`
- `TicketDetail` içinde status update aksiyonları

### Tüm roller için

- `TicketDetail` içinde görünür yorumları okuma
- technician/admin için internal not seçeneği

## Repository Yaklaşımı

Ticket repository tarafında şu fonksiyonlar hazırdır:

```kotlin
suspend fun loadMyTickets(): Result<List<TicketSummary>>
suspend fun loadTechnicianQueue(): Result<List<TicketSummary>>
suspend fun loadTicketDetail(ticketId: String): Result<TicketDetail>
suspend fun loadTicketComments(ticketId: String): Result<List<TicketComment>>
suspend fun addTicketComment(ticketId: String, body: String, isInternal: Boolean): Result<Unit>
suspend fun updateTicketStatus(ticketId: String, status: TicketStatus): Result<Unit>
suspend fun createTicket(input: CreateTicketInput): Result<String>
```

Kurallar:

- service role kullanılmaz
- publishable key + kullanıcı session yaklaşımı korunur
- RLS sonucuna güvenilir
- ham Supabase hata mesajı kullanıcıya gösterilmez

## Foundation Seviyesinde Kalan Noktalar

Bu alanlar kod ve build düzeyinde hazırdır; ancak canlı runtime kanıtı eksiktir:

- employee `MyTicketsScreen` canlı liste
- employee ticket detail canlı ilerleme
- employee ticket create canlı insert
- technician queue canlı liste
- technician status update canlı kanıtı
- ticket comment submit canlı kanıtı

## Neden Foundation Olarak Tutuluyor?

- güvenli demo kullanıcı parolaları dokümana yazılmıyor
- yeni auth tablosu müdahalesi yapılmıyor
- bu nedenle her Android ekran canlı kullanıcı oturumuyla tekrar tekrar kanıtlanamadı

Bu yüzden dokümanda “tamamlandı” yerine daha doğru olarak “foundation hazır, runtime kısmen doğrulandı” dili korunur.

## Kullanıcıya Görünen Özellik Özeti

- Türkçe etiketler ve badge yapısı
- loading, empty ve error durumları
- kontrollü geri akışları
- technician/admin için role tabanlı ticket işlemleri

## Bilinen Eksikler

- queue filtreleme yok
- admin için ayrı ticket akışı yok
- pagination yok
- canlı employee/technician session ile tüm ticket akışları tam kanıtlanmadı

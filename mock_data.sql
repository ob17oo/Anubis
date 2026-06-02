-- Cleanup existing data (order matters to respect foreign key constraints)
TRUNCATE TABLE 
    "_EventToCollection", 
    "_EventToArtist", 
    "reviews", 
    "favorites", 
    "notifications", 
    "payments", 
    "tickets", 
    "orders", 
    "promo_codes", 
    "events", 
    "venues", 
    "artists", 
    "collections", 
    "User", 
    "City" 
    CASCADE;

-- 1. Insert Cities (City)
-- Note: 'cmmjcycy600013b6svl5n4s62' is the default city_id used in database migrations (Rostov-on-Don)
INSERT INTO "City" ("id", "name") VALUES
('cmmjcycy600013b6svl5n4s62', 'Ростов-на-Дону'),
('clycitymoscow123456789012', 'Москва'),
('clycityspb123456789012345', 'Санкт-Петербург'),
('clycitykazan1234567890123', 'Казань'),
('clycitysochi1234567890123', 'Сочи'),
('clycityekater123456789012', 'Екатеринбург');

-- 2. Insert Users (User)
-- Passwords are encrypted with bcrypt for 'password123'
INSERT INTO "User" ("id", "user_name", "password", "city_id", "email", "image_url", "role") VALUES
('clyuseradmin1234567890123', 'Администратор', '$2b$10$lyHpyEZfSdoNEJMMAGgzgOjla9JsqUhjTzhMV/2QTpvecMdfN2d2S', 'clycitymoscow123456789012', 'admin@eventnear.ru', '/static/default/default-user.svg', 'ADMIN'::"USER_ROLE"),
('clyuserorganizer123456789', 'Арт-Центр', '$2b$10$lyHpyEZfSdoNEJMMAGgzgOjla9JsqUhjTzhMV/2QTpvecMdfN2d2S', 'clycitymoscow123456789012', 'organizer@eventnear.ru', '/static/default/default-user.svg', 'ORGANIZER'::"USER_ROLE"),
('clyuserbuyer1234567890123', 'Иван Иванов', '$2b$10$lyHpyEZfSdoNEJMMAGgzgOjla9JsqUhjTzhMV/2QTpvecMdfN2d2S', 'clycitymoscow123456789012', 'user@eventnear.ru', '/static/default/default-user.svg', 'USER'::"USER_ROLE");

-- 3. Insert Artists (artists)
INSERT INTO "artists" ("id", "name", "bio", "image_url", "created_at", "updated_at") VALUES
('clyartistband123456789012', 'Баста', 'Известный российский рэп-исполнитель, композитор и продюсер.', 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80&w=400', NOW(), NOW()),
('clyartistband123456789013', 'Скриптонит', 'Казахстанский рэп-исполнитель и битмейкер, основатель лейбла Musica36.', 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=400', NOW(), NOW()),
('clyartistband123456789014', 'Нурлан Сабуров', 'Популярный стендап-комик, телеведущий, резидент шоу "Что было дальше?".', 'https://images.unsplash.com/photo-1585699324551-f6c309eed262?auto=format&fit=crop&q=80&w=400', NOW(), NOW()),
('clyartistband123456789015', 'Сергей Безруков', 'Народный артист Российской Федерации, актер театра и кино.', 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=400', NOW(), NOW());

-- 4. Insert Venues (venues)
INSERT INTO "venues" ("id", "name", "address", "capacity", "city_id", "created_at", "updated_at") VALUES
('clyvenuemoscow12345678901', 'Крокус Сити Холл', 'МКАД, 66-й километр, Красногорск', 6000, 'clycitymoscow123456789012', NOW(), NOW()),
('clyvenuemoscow12345678902', 'ВТБ Арена', 'Ленинградский просп., 36, Москва', 15000, 'clycitymoscow123456789012', NOW(), NOW()),
('clyvenuemoscow12345678903', 'Большой театр', 'Театральная площадь, 1, Москва', 1800, 'clycitymoscow123456789012', NOW(), NOW()),
('clyvenuespb1234567890123', 'БКЗ Октябрьский', 'Лиговский просп., 6, Санкт-Петербург', 3700, 'clycityspb123456789012345', NOW(), NOW()),
('clyvenuerostov12345678901', 'КСК Экспресс', 'ул. Закруткина, 67А, Ростов-на-Дону', 2500, 'cmmjcycy600013b6svl5n4s62', NOW(), NOW());

-- 5. Insert Events (events)
-- Mixing genres: cinema, concert, kids, standup, theater, sport
-- Dates are set relative to current date (in the future)
INSERT INTO "events" ("id", "title", "description", "image_url", "city_id", "event_location", "event_date", "price", "ticket_amount", "created_at", "updated_at", "genre", "rating", "duration", "age_restriction", "status", "is_moderated", "organizer_id", "venue_id") VALUES
-- Published Events (upcoming)
('clyeventconcert1234567890', 'Большой концерт Басты', 'Все хиты, живой звук, грандиозное шоу в Крокус Сити Холле. Специальные гости и презентация нового альбома.', 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&q=80&w=800', 'clycitymoscow123456789012', 'Крокус Сити Холл', NOW() + INTERVAL '10 days', 3000, 500, NOW(), NOW(), 'concert'::"EventType", 4.8, 150, '16+', 'PUBLISHED'::"EventStatus", true, 'clyuserorganizer123456789', 'clyvenuemoscow12345678901'),
('clyeventstandup1234567890', 'Сольный концерт Нурлана Сабурова', 'Новая сольная программа популярного стендап-комика. Острый юмор, неожиданные темы и только живые эмоции.', 'https://images.unsplash.com/photo-1585699324551-f6c309eed262?auto=format&fit=crop&q=80&w=800', 'clycitymoscow123456789012', 'ВТБ Арена', NOW() + INTERVAL '15 days', 2500, 300, NOW(), NOW(), 'standup'::"EventType", 4.9, 90, '18+', 'PUBLISHED'::"EventStatus", true, 'clyuserorganizer123456789', 'clyvenuemoscow12345678902'),
('clyeventtheater1234567890', 'Спектакль "Хулиган. Исповедь"', 'Сергей Безруков в музыкально-поэтическом спектакле о жизни и творчестве великого русского поэта Сергея Есенина.', 'https://images.unsplash.com/photo-1460723237483-7a6dc9d0b212?auto=format&fit=crop&q=80&w=800', 'clycitymoscow123456789012', 'Большой театр', NOW() + INTERVAL '20 days', 4000, 200, NOW(), NOW(), 'theater'::"EventType", 4.7, 120, '12+', 'PUBLISHED'::"EventStatus", true, 'clyuserorganizer123456789', 'clyvenuemoscow12345678903'),
('clyeventsport123456789012', 'Футбольный матч Спартак - Зенит', 'Главное футбольное противостояние сезона. Битва двух столиц на стадионе ВТБ Арена.', 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80&w=800', 'clycitymoscow123456789012', 'ВТБ Арена', NOW() + INTERVAL '25 days', 1500, 1000, NOW(), NOW(), 'sport'::"EventType", 4.5, 105, '6+', 'PUBLISHED'::"EventStatus", true, 'clyuserorganizer123456789', 'clyvenuemoscow12345678902'),
('clyeventkids1234567890123', 'Шоу-сказка "Алиса в Стране Чудес"', 'Интерактивный детский спектакль с элементами магии, акробатики и 3D-эффектов для всей семьи.', 'https://images.unsplash.com/photo-1518887570146-0612132dd618?auto=format&fit=crop&q=80&w=800', 'clycitymoscow123456789012', 'Крокус Сити Холл', NOW() + INTERVAL '30 days', 1200, 400, NOW(), NOW(), 'kids'::"EventType", 4.6, 80, '0+', 'PUBLISHED'::"EventStatus", true, 'clyuserorganizer123456789', 'clyvenuemoscow12345678901'),
('clyeventcinema12345678901', 'Фестиваль короткометражного кино', 'Показ лучших короткометражных фильмов года от молодых российских режиссеров.', 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&q=80&w=800', 'clycitymoscow123456789012', 'Большой театр', NOW() + INTERVAL '5 days', 800, 150, NOW(), NOW(), 'cinema'::"EventType", 4.4, 180, '16+', 'PUBLISHED'::"EventStatus", true, 'clyuserorganizer123456789', 'clyvenuemoscow12345678903'),
('clyeventconcertspb123456', 'Концерт Скриптонита в СПб', 'Презентация нового релиза и лучшие треки. Мощный бас, фирменный звук и нереальная атмосфера БКЗ Октябрьский.', 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=800', 'clycityspb123456789012345', 'БКЗ Октябрьский', NOW() + INTERVAL '12 days', 3500, 400, NOW(), NOW(), 'concert'::"EventType", 4.9, 120, '18+', 'PUBLISHED'::"EventStatus", true, 'clyuserorganizer123456789', 'clyvenuespb1234567890123'),
('clyeventconcertrostov123', 'Баста. Ростов-на-Дону', 'Долгожданный концерт Басты в родном городе на сцене КСК Экспресс. Все любимые хиты.', 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?auto=format&fit=crop&q=80&w=800', 'cmmjcycy600013b6svl5n4s62', 'КСК Экспресс', NOW() + INTERVAL '8 days', 2800, 300, NOW(), NOW(), 'concert'::"EventType", 4.8, 150, '16+', 'PUBLISHED'::"EventStatus", true, 'clyuserorganizer123456789', 'clyvenuerostov12345678901'),

-- Event awaiting Moderation
('clyeventmodstandup12345', 'Стендап Вечер: Молодые Комики', 'Лучшие молодые стендап-комики Москвы на одной сцене. Острый юмор, жизненные темы.', 'https://images.unsplash.com/photo-1516280440614-37939bbacd6a?auto=format&fit=crop&q=80&w=800', 'clycitymoscow123456789012', 'ВТБ Арена', NOW() + INTERVAL '3 days', 1000, 100, NOW(), NOW(), 'standup'::"EventType", 0.0, 90, '18+', 'MODERATING'::"EventStatus", false, 'clyuserorganizer123456789', 'clyvenuemoscow12345678902'),

-- Event in Draft state
('clyeventdraftcinema1234', 'Ретроспектива фильмов Андрея Тарковского', 'Показ шедевров мирового кинематографа на большом экране: Солярис, Зеркало, Сталкер.', 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=80&w=800', 'clycitymoscow123456789012', 'Крокус Сити Холл', NOW() + INTERVAL '40 days', 600, 200, NOW(), NOW(), 'cinema'::"EventType", 0.0, 160, '12+', 'DRAFT'::"EventStatus", false, 'clyuserorganizer123456789', 'clyvenuemoscow12345678901');

-- 6. Insert Promo Codes (promo_codes)
INSERT INTO "promo_codes" ("id", "code", "discount", "max_uses", "used_count", "expires_at", "event_id", "created_at") VALUES
('clypromo10percent123456', 'WELCOME10', 10, 100, 5, NOW() + INTERVAL '60 days', NULL, NOW()),
('clypromo20percent123456', 'BASTA20', 20, 50, 2, NOW() + INTERVAL '30 days', 'clyeventconcert1234567890', NOW());

-- 7. Insert Collections (collections)
INSERT INTO "collections" ("id", "title", "description", "cover_url", "created_at", "updated_at") VALUES
('clycollectionhit1234567', 'Главные события лета', 'Самые ожидаемые и масштабные мероприятия этого сезона, которые нельзя пропустить.', 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&q=80&w=800', NOW(), NOW()),
('clycollectionhumor123456', 'Вечера смеха и юмора', 'Стендап шоу, комедии и веселые импровизации для отличного настроения.', 'https://images.unsplash.com/photo-1527224857830-43a7acc85260?auto=format&fit=crop&q=80&w=800', NOW(), NOW());

-- 8. Insert implicit relation records for EventToArtist
-- Columns: A = Artist ID, B = Event ID
INSERT INTO "_EventToArtist" ("A", "B") VALUES
('clyartistband123456789012', 'clyeventconcert1234567890'),
('clyartistband123456789012', 'clyeventconcertrostov123'),
('clyartistband123456789014', 'clyeventstandup1234567890'),
('clyartistband123456789015', 'clyeventtheater1234567890'),
('clyartistband123456789013', 'clyeventconcertspb123456');

-- 9. Insert implicit relation records for EventToCollection
-- Columns: A = Collection ID, B = Event ID
INSERT INTO "_EventToCollection" ("A", "B") VALUES
('clycollectionhit1234567', 'clyeventconcert1234567890'),
('clycollectionhit1234567', 'clyeventstandup1234567890'),
('clycollectionhit1234567', 'clyeventsport123456789012'),
('clycollectionhumor123456', 'clyeventstandup1234567890');

-- 10. Insert Reviews (reviews)
INSERT INTO "reviews" ("id", "rating", "text", "user_id", "event_id", "created_at", "updated_at") VALUES
('clyreview1234567890123456', 5, 'Баста как всегда на высоте! Живой звук, потрясающая энергетика!', 'clyuserbuyer1234567890123', 'clyeventconcert1234567890', NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day'),
('clyreview1234567890123457', 4, 'Очень смешно, но ВТБ Арена слишком большая для стендапа, звук иногда шел эхом.', 'clyuserbuyer1234567890123', 'clyeventstandup1234567890', NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days');

-- 11. Insert Favorites (favorites)
INSERT INTO "favorites" ("id", "user_id", "event_id", "created_at") VALUES
('clyfavorite1234567890123', 'clyuserbuyer1234567890123', 'clyeventconcert1234567890', NOW());

-- 12. Insert Orders (orders)
INSERT INTO "orders" ("id", "user_id", "total_amount", "status", "created_at", "updated_at") VALUES
('clyorder12345678901234567', 'clyuserbuyer1234567890123', 6000, 'PAID'::"OrderStatus", NOW() - INTERVAL '5 days', NOW() - INTERVAL '5 days');

-- 13. Insert Tickets (tickets)
INSERT INTO "tickets" ("id", "user_id", "event_id", "order_id", "quantity", "price", "status", "created_at", "qr_code") VALUES
('clyticket1234567890123456', 'clyuserbuyer1234567890123', 'clyeventconcert1234567890', 'clyorder12345678901234567', 2, 6000, 'CONFIRMED'::"TicketStatus", NOW() - INTERVAL '5 days', 'qr_clyticket1234567890123456');

-- 14. Insert Payments (payments)
INSERT INTO "payments" ("id", "order_id", "amount", "currency", "provider", "transaction_id", "status", "created_at", "updated_at") VALUES
('clypayment123456789012345', 'clyorder12345678901234567', 6000, 'RUB', 'stripe', 'ch_1234567890abcdefghijkl', 'COMPLETED'::"PaymentStatus", NOW() - INTERVAL '5 days', NOW() - INTERVAL '5 days');

-- 15. Insert Notifications (notifications)
INSERT INTO "notifications" ("id", "user_id", "title", "message", "type", "is_read", "created_at") VALUES
('clynotification123456789', 'clyuserbuyer1234567890123', 'Добро пожаловать в EventNear!', 'Спасибо за регистрацию на нашем сервисе. Здесь вы найдете лучшие события вашего города!', 'SYSTEM'::"NotificationType", false, NOW() - INTERVAL '5 days'),
('clynotification123456790', 'clyuserbuyer1234567890123', 'Билеты успешно куплены', 'Ваш заказ №clyorder12345678901234567 на Большой концерт Басты успешно оплачен. Билеты доступны в личном кабинете.', 'ORDER'::"NotificationType", true, NOW() - INTERVAL '5 days');

INSERT INTO categories (name, sort_order) VALUES
('まぐろ', 1),
('白身・光り物', 2),
('えび', 3),
('サーモン', 4),
('いか', 5),
('軍艦巻き', 6),
('サイドメニュー', 7);

INSERT INTO products (name, price, image_path, category_id) VALUES
('まぐろ', 150, 'images/products/maguro.png', 1),
('本鮪中とろ', 250, 'images/products/chu_tro.png', 1),
('とろびんちょう', 200, 'images/products/toro_bincho.png', 1),
('活〆はまち', 200, 'images/products/katu_hamachi.png', 2),
('活〆まだい', 200, 'images/products/katu_madai.png', 2),
('しめさば', 200, 'images/products/sime_sama.png', 2),
('サーモン', 200, 'images/products/salmon.png', 4),
('焼とろサーモン', 200, 'images/products/yaki_toro_salmon.png', 4),
('いくら', 260, 'images/products/ikura.png', 6),
('うに軍艦', 360, 'images/products/uni.png', 6),
('えび', 160, 'images/products/ebi.png', 3),
('甘えび', 160, 'images/products/ama_ebi.png', 3),
('アカイカ', 160, 'images/products/aka_ika.png', 5),
('かつおだしの茶碗蒸し', 300, 'images/products/tyawan_musi.png', 7),
('あおさみそ汁', 150, 'images/products/aosa_misosiru.png', 7),
('カリカリポテト', 280, 'images/products/kari_poteto.png', 7);

INSERT INTO seats (number)
VALUES (1), (2), (3), (4), (5), (6), (7), (8), (9), (10);
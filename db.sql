Create DATABASE hw1;
USE hw1;

CREATE TABLE users (
    name VARCHAR(100),
    lastname VARCHAR(100),
    email VARCHAR(200),
    username VARCHAR(20) PRIMARY KEY,
    password VARCHAR(200)
) Engine = InnoDB;

CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    category VARCHAR(50),
    name VARCHAR(100),
    description TEXT,
    price DECIMAL(10, 2),
    image VARCHAR(255),
    hover_image VARCHAR(255)
);

INSERT INTO `products` (`category`, `name`, `description`, `price`, `image`, `hover_image`) VALUES
('sweaters', 'Sweater', 'A classic sweater to keep you warm during the colder months. Made with soft fabric and available in various colors.', 65.99, './pictures/sweater.jpg', './pictures/sweater_hover.jpg'),
('denim', 'Denim Jeans', 'Classic and versatile jeans, perfect for any occasion. Made from durable denim and suitable for all body types.', 89.99, './pictures/denim_jeans.jpg', './pictures/denim_jeans_hover.jpg'),
('top', 'Tank Top', 'Lightweight and comfortable sleeveless top, ideal for summer days. Available in various designs and colors.', 29.99, './pictures/tank_top.jpg', './pictures/tank_top_hover.jpg'),
('bottom', 'Shorts', 'Comfortable and fashionable shorts, perfect for summer. Made with lightweight fabric and equipped with practical pockets.', 45.99, './pictures/shorts_1.jpg', './pictures/shorts.jpg'),
('sweaters', 'Knit Pullover', 'Knit pullover, ideal for a casual and cozy style. Perfect to pair with jeans or trousers.', 55.99, './pictures/knit_pullover.jpg', './pictures/knit_pullover_hover.jpg'),
('sweaters', 'Hooded Sweatshirt', 'Comfortable and stylish hooded sweatshirt, perfect for cooler days. Made with soft fabric and equipped with a kangaroo pocket.', 39.99, './pictures/hooded_sweatshirt.jpg', './pictures/hooded_sweatshirt_hover.jpg'),
('denim', 'Skinny Jeans', 'Figure-flattering skinny jeans, perfect for a trendy look. Made with stretch fabric for optimal comfort.', 69.99, './pictures/skinny_jeans.jpg', './pictures/skinny_jeans_hover.jpg'),
('denim', 'Denim Jacket', 'Denim jacket, perfect for a grunge and stylish look. Equipped with pockets and metal buttons.', 79.99, './pictures/denim_jacket.jpg', './pictures/denim_jacket_hover.jpg'),
('top', 'Blouse', 'Elegant and feminine blouse, perfect for the office or special occasions. Made with lightweight fabric and embellished with refined details.', 49.99, './pictures/blouse.jpg', './pictures/blouse_hover.jpg'),
('top', 'Crop Top', 'Trendy crop top, ideal for creating fashionable summer outfits. To pair with high-waisted pants or skirts.', 34.99, './pictures/crop_top.jpg', './pictures/crop_top_hover.jpg'),
('bottom', 'Wide Leg Trousers', 'Wide leg trousers, perfect for a sophisticated and comfortable style. Made with high-quality fabric and equipped with side pockets.', 79.99, './pictures/wide_leg.jpg', './pictures/wide_leg_trousers.jpg'),
('bottom', 'Denim Skirt', 'Versatile and fashionable denim skirt, perfect to complete casual chic outfits. Made with durable fabric and equipped with buttons.', 59.99, './pictures/denim-skirt.jpg', './pictures/denim_skirt.jpg');

CREATE TABLE cart (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product INT,
    size varchar(5),
    quantity int(11),
    username VARCHAR(20),
    FOREIGN KEY (product) REFERENCES products(id),
    FOREIGN KEY (username) REFERENCES users(username)
);

CREATE TABLE inventory (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT,
    size VARCHAR(50),
    quantity INT,
    FOREIGN KEY (product_id) REFERENCES products(id)
) Engine = InnoDB;

INSERT INTO inventory (product_id, size, quantity) VALUES
    (1, 'S', 10),
    (1, 'M', 15),
    (1, 'L', 5),
    (2, 'S', 20),
    (2, 'M', 25),
    (2, 'L', 10),
    (3, 'S', 30),
    (3, 'M', 0),
    (3, 'L', 20),
    (4, 'S', 10),
    (4, 'M', 15),
    (4, 'L', 5),
    (5, 'S', 20),
    (5, 'M', 25),
    (5, 'L', 10),
    (6, 'S', 0),
    (6, 'M', 35),
    (6, 'L', 20),
    (7, 'S', 10),
    (7, 'M', 15),
    (7, 'L', 5),
    (8, 'S', 20),
    (8, 'M', 25),
    (8, 'L', 10),
    (9, 'S', 30),
    (9, 'M', 35),
    (9, 'L', 20),
    (10, 'S', 10),
    (10, 'M', 15),
    (10, 'L', 5),
    (11, 'S', 20),
    (11, 'M', 25),
    (11, 'L', 0),
    (12, 'S', 30),
    (12, 'M', 35),
    (12, 'L', 20);

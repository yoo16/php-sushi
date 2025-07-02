├── admin
│   ├── category
│   │   ├── add.php
│   │   ├── create.php
│   │   ├── delete.php
│   │   ├── edit.php
│   │   ├── index.php
│   │   └── update.php
│   ├── index.php
│   ├── product
│   │   ├── add.php
│   │   ├── create.php
│   │   ├── delete.php
│   │   ├── edit.php
│   │   ├── index.php
│   │   └── update.php
│   └── visit
│       └── index.php
├── api
│   ├── category
│   │   └── fetch.php
│   ├── order
│   │   ├── add.php
│   │   ├── billed.php
│   │   └── fetch.php
│   └── product
│       └── fetch.php
├── app
│   ├── controllers
│   │   └── admin
│   │       ├── CategoryController.php
│   │       ├── HomeController.php
│   │       ├── OrderController.php
│   │       ├── ProductController.php
│   │       └── VisitController.php
│   ├── models
│   │   ├── Category.php
│   │   ├── Order.php
│   │   ├── Product.php
│   │   ├── Seat.php
│   │   └── Visit.php
│   └── views
│       ├── admin
│       │   ├── category
│       │   │   ├── create.php
│       │   │   ├── edit.php
│       │   │   └── index.php
│       │   ├── home
│       │   │   └── index.php
│       │   ├── product
│       │   │   ├── create.php
│       │   │   ├── edit.php
│       │   │   └── index.php
│       │   └── visit
│       │       └── index.php
│       └── components
│           ├── admin_nav.php
│           └── head.php
├── app.php
├── env.php
├── images
│   └── products
│       └── xxxx.png
└── lib
    ├── Database.php
    ├── File.php
    └── Sanitize.php
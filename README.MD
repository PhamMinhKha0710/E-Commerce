## Full source
```
.
├── Docker
│   ├── Dockerfile
│   ├── README.md
│   ├── dicts
│   ├── docker-compose.yml
│   ├── elasticsearch-analysis-vietnamese-8.7.0.zip
│   ├── libcoccoc_tokenizer_jni.dylib
│   └── libcoccoc_tokenizer_jni.so
├── README.MD
├── admin
│   ├── README.md
│   ├── eslint.config.mjs
│   ├── next-env.d.ts
│   ├── next.config.ts
│   ├── package-lock.json
│   ├── package.json
│   ├── postcss.config.mjs
│   ├── public
│   ├── src
│   └── tsconfig.json
├── backend
│   ├── Ecommerce.Api
│   ├── Ecommerce.Application
│   ├── Ecommerce.Domain
│   ├── Ecommerce.Infrastructure
│   ├── Ecommerce.Shared
│   ├── Ecommerce.sln
│   └── Tests
└── frontend
    ├── README.md
    ├── eslint.config.mjs
    ├── next-env.d.ts
    ├── next.config.ts
    ├── package-lock.json
    ├── package.json
    ├── postcss.config.mjs
    ├── public
    ├── src
    └── tsconfig.json
```
## Backend
```
.
├── Ecommerce.Api
│   ├── Controllers
│   │   ├── AuthController.cs
│   │   └── CategoriesController.cs
│   ├── Ecommerce.Api.csproj
│   ├── Ecommerce.Api.http
│   ├── Filter
│   │   └── SecurityRequirementsOperationFilter.cs
│   ├── Program.cs
│   ├── Properties
│   │   └── launchSettings.json
│   ├── appsettings.Development.json
│   └── appsettings.json
├── Ecommerce.Application
│   ├── CommandHandler
│   │   └── AuthHandler
│   ├── Commands
│   │   └── AuthCommands
│   ├── Common
│   │   ├── DTOs
│   │   ├── TokenService.cs
│   │   └── Utilities
│   ├── Ecommerce.Application.csproj
│   ├── Interfaces
│   │   ├── IJwtTokenService.cs
│   │   ├── IPasswordHaser.cs
│   │   ├── Repositories
│   │   └── Services
│   ├── Queries
│   │   ├── Auth
│   │   └── Categories
│   └── QueryHandlers
│       ├── Auth
│       └── Categories
├── Ecommerce.Domain
│   ├── Ecommerce.Domain.csproj
│   ├── Entities
│   │   ├── Address.cs
│   │   ├── Brand.cs
│   │   ├── OrderLine.cs
│   │   ├── OrderStatus.cs
│   │   ├── OrderStatusHistory.cs
│   │   ├── PaymentType.cs
│   │   ├── Product.cs
│   │   ├── ProductCategory.cs
│   │   ├── ProductConfiguration.cs
│   │   ├── ProductImage.cs
│   │   ├── ProductItem.cs
│   │   ├── Promotion.cs
│   │   ├── PromotionCategory.cs
│   │   ├── RefreshToken.cs
│   │   ├── ShippingMethod.cs
│   │   ├── ShopOrder.cs
│   │   ├── ShoppingCart.cs
│   │   ├── ShoppingCartItem.cs
│   │   ├── User.cs
│   │   ├── UserAddress.cs
│   │   ├── UserPaymentMethod.cs
│   │   ├── UserReview.cs
│   │   ├── Variation.cs
│   │   └── VariationOption.cs
│   ├── Service
│   └── ValueObjects
│       └── EmailSettings.cs
├── Ecommerce.Infrastructure
│   ├── Ecommerce.Infrastructure.csproj
│   ├── Elasticsearch
│   ├── Migrations
│   │   ├── 20250426182153_initDatabase.Designer.cs
│   │   ├── 20250426182153_initDatabase.cs
│   │   └── AppDbContextModelSnapshot.cs
│   └── Persistence
│       ├── AppDbContext.cs
│       ├── AppDbContextFactory.cs
│       ├── Data
│       ├── Repositories
│       └── Service
├── Ecommerce.Shared
│   └── Ecommerce.Shared.csproj
├── Ecommerce.sln
└── Tests
    ├── Ecommerce.Api.Tests
    │   ├── Ecommerce.Api.Tests.csproj
    │   └── UnitTest1.cs
    ├── Ecommerce.Application.Tests
    │   ├── Ecommerce.Application.Tests.csproj
    │   └── UnitTest1.cs
    ├── Ecommerce.Domain.Tests
    │   ├── Ecommerce.Domain.Tests.csproj
    │   └── UnitTest1.cs
    └── Ecommerce.Infrastructure.Tests
        ├── Ecommerce.Infrastructure.Tests.csproj
        └── UnitTest1.cs
```
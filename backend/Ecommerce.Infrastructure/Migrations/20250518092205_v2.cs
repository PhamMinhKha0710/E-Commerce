using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Ecommerce.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class v2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_PromotionCategory_ProductCategories_ProductCategoryId",
                table: "PromotionCategory");

            migrationBuilder.DropForeignKey(
                name: "FK_PromotionCategory_Promotions_PromotionId",
                table: "PromotionCategory");

            migrationBuilder.DropPrimaryKey(
                name: "PK_PromotionCategory",
                table: "PromotionCategory");

            migrationBuilder.DropColumn(
                name: "ImageEmbedding",
                table: "Products");

            migrationBuilder.RenameTable(
                name: "PromotionCategory",
                newName: "PromotionCategories");

            migrationBuilder.RenameIndex(
                name: "IX_PromotionCategory_ProductCategoryId",
                table: "PromotionCategories",
                newName: "IX_PromotionCategories_ProductCategoryId");

            migrationBuilder.AddColumn<DateTime>(
                name: "CreateAt",
                table: "ShopOrders",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "PromotionId",
                table: "ShopOrders",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "Fee",
                table: "ShippingMethods",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<decimal>(
                name: "LimitDiscountPrice",
                table: "Promotions",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<int>(
                name: "TotalQuantity",
                table: "Promotions",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "UsedQuantity",
                table: "Promotions",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "ElasticsearchId",
                table: "Products",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<DateTime>(
                name: "OrderDate",
                table: "OrderLines",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddPrimaryKey(
                name: "PK_PromotionCategories",
                table: "PromotionCategories",
                columns: new[] { "PromotionId", "ProductCategoryId" });

            migrationBuilder.CreateTable(
                name: "PopularityStats",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ProductId = table.Column<int>(type: "int", nullable: false),
                    CategoryId = table.Column<int>(type: "int", nullable: false),
                    ViewCount = table.Column<int>(type: "int", nullable: false, defaultValue: 0),
                    PurchaseCount = table.Column<int>(type: "int", nullable: false, defaultValue: 0),
                    TimePeriod = table.Column<DateTime>(type: "datetime", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PopularityStats", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PopularityStats_ProductCategories_CategoryId",
                        column: x => x.CategoryId,
                        principalTable: "ProductCategories",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_PopularityStats_Products_ProductId",
                        column: x => x.ProductId,
                        principalTable: "Products",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ProductSimilarities",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ProductId1 = table.Column<int>(type: "int", nullable: false),
                    ProductId2 = table.Column<int>(type: "int", nullable: false),
                    Similarity = table.Column<double>(type: "float(18)", precision: 18, scale: 4, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProductSimilarities", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ProductSimilarities_Products_ProductId1",
                        column: x => x.ProductId1,
                        principalTable: "Products",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_ProductSimilarities_Products_ProductId2",
                        column: x => x.ProductId2,
                        principalTable: "Products",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "UserSearches",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    keyWord = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    SearchTime = table.Column<DateTime>(type: "datetime", nullable: false),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    UserId1 = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserSearches", x => x.Id);
                    table.ForeignKey(
                        name: "FK_UserSearches_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_UserSearches_Users_UserId1",
                        column: x => x.UserId1,
                        principalTable: "Users",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "UserViewHistories",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    ProductId = table.Column<int>(type: "int", nullable: false),
                    ViewTime = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserViewHistories", x => x.Id);
                    table.ForeignKey(
                        name: "FK_UserViewHistories_Products_ProductId",
                        column: x => x.ProductId,
                        principalTable: "Products",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_UserViewHistories_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ShopOrders_PromotionId",
                table: "ShopOrders",
                column: "PromotionId");

            migrationBuilder.CreateIndex(
                name: "IX_PopularityStats_CategoryId",
                table: "PopularityStats",
                column: "CategoryId");

            migrationBuilder.CreateIndex(
                name: "IX_PopularityStats_ProductId",
                table: "PopularityStats",
                column: "ProductId");

            migrationBuilder.CreateIndex(
                name: "IX_PopularityStats_TimePeriod",
                table: "PopularityStats",
                column: "TimePeriod");

            migrationBuilder.CreateIndex(
                name: "IX_ProductSimilarities_ProductId1_ProductId2",
                table: "ProductSimilarities",
                columns: new[] { "ProductId1", "ProductId2" });

            migrationBuilder.CreateIndex(
                name: "IX_ProductSimilarities_ProductId2",
                table: "ProductSimilarities",
                column: "ProductId2");

            migrationBuilder.CreateIndex(
                name: "IX_UserSearches_keyWord",
                table: "UserSearches",
                column: "keyWord");

            migrationBuilder.CreateIndex(
                name: "IX_UserSearches_SearchTime",
                table: "UserSearches",
                column: "SearchTime");

            migrationBuilder.CreateIndex(
                name: "IX_UserSearches_UserId",
                table: "UserSearches",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_UserSearches_UserId1",
                table: "UserSearches",
                column: "UserId1");

            migrationBuilder.CreateIndex(
                name: "IX_UserViewHistories_ProductId",
                table: "UserViewHistories",
                column: "ProductId");

            migrationBuilder.CreateIndex(
                name: "IX_UserViewHistories_UserId",
                table: "UserViewHistories",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_UserViewHistories_ViewTime",
                table: "UserViewHistories",
                column: "ViewTime");

            migrationBuilder.AddForeignKey(
                name: "FK_PromotionCategories_ProductCategories_ProductCategoryId",
                table: "PromotionCategories",
                column: "ProductCategoryId",
                principalTable: "ProductCategories",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_PromotionCategories_Promotions_PromotionId",
                table: "PromotionCategories",
                column: "PromotionId",
                principalTable: "Promotions",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_ShopOrders_Promotions_PromotionId",
                table: "ShopOrders",
                column: "PromotionId",
                principalTable: "Promotions",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_PromotionCategories_ProductCategories_ProductCategoryId",
                table: "PromotionCategories");

            migrationBuilder.DropForeignKey(
                name: "FK_PromotionCategories_Promotions_PromotionId",
                table: "PromotionCategories");

            migrationBuilder.DropForeignKey(
                name: "FK_ShopOrders_Promotions_PromotionId",
                table: "ShopOrders");

            migrationBuilder.DropTable(
                name: "PopularityStats");

            migrationBuilder.DropTable(
                name: "ProductSimilarities");

            migrationBuilder.DropTable(
                name: "UserSearches");

            migrationBuilder.DropTable(
                name: "UserViewHistories");

            migrationBuilder.DropIndex(
                name: "IX_ShopOrders_PromotionId",
                table: "ShopOrders");

            migrationBuilder.DropPrimaryKey(
                name: "PK_PromotionCategories",
                table: "PromotionCategories");

            migrationBuilder.DropColumn(
                name: "CreateAt",
                table: "ShopOrders");

            migrationBuilder.DropColumn(
                name: "PromotionId",
                table: "ShopOrders");

            migrationBuilder.DropColumn(
                name: "Fee",
                table: "ShippingMethods");

            migrationBuilder.DropColumn(
                name: "LimitDiscountPrice",
                table: "Promotions");

            migrationBuilder.DropColumn(
                name: "TotalQuantity",
                table: "Promotions");

            migrationBuilder.DropColumn(
                name: "UsedQuantity",
                table: "Promotions");

            migrationBuilder.DropColumn(
                name: "ElasticsearchId",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "OrderDate",
                table: "OrderLines");

            migrationBuilder.RenameTable(
                name: "PromotionCategories",
                newName: "PromotionCategory");

            migrationBuilder.RenameIndex(
                name: "IX_PromotionCategories_ProductCategoryId",
                table: "PromotionCategory",
                newName: "IX_PromotionCategory_ProductCategoryId");

            migrationBuilder.AddColumn<byte[]>(
                name: "ImageEmbedding",
                table: "Products",
                type: "VARBINARY(MAX)",
                nullable: false,
                defaultValue: new byte[0]);

            migrationBuilder.AddPrimaryKey(
                name: "PK_PromotionCategory",
                table: "PromotionCategory",
                columns: new[] { "PromotionId", "ProductCategoryId" });

            migrationBuilder.AddForeignKey(
                name: "FK_PromotionCategory_ProductCategories_ProductCategoryId",
                table: "PromotionCategory",
                column: "ProductCategoryId",
                principalTable: "ProductCategories",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_PromotionCategory_Promotions_PromotionId",
                table: "PromotionCategory",
                column: "PromotionId",
                principalTable: "Promotions",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}

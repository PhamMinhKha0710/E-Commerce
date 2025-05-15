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
            migrationBuilder.DropColumn(
                name: "ImageEmbedding",
                table: "Products");

            migrationBuilder.AddColumn<DateTime>(
                name: "CreateAt",
                table: "ShopOrders",
                type: "datetime2",
                nullable: true);

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
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "PopularityStats");

            migrationBuilder.DropTable(
                name: "ProductSimilarities");

            migrationBuilder.DropTable(
                name: "UserSearches");

            migrationBuilder.DropTable(
                name: "UserViewHistories");

            migrationBuilder.DropColumn(
                name: "CreateAt",
                table: "ShopOrders");

            migrationBuilder.DropColumn(
                name: "ElasticsearchId",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "OrderDate",
                table: "OrderLines");

            migrationBuilder.AddColumn<byte[]>(
                name: "ImageEmbedding",
                table: "Products",
                type: "VARBINARY(MAX)",
                nullable: false,
                defaultValue: new byte[0]);
        }
    }
}

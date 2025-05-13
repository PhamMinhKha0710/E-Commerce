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

            migrationBuilder.AddColumn<string>(
                name: "ElasticsearchId",
                table: "Products",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

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
                name: "ProductSimilarity",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ProductId1 = table.Column<int>(type: "int", nullable: false),
                    ProductId2 = table.Column<int>(type: "int", nullable: false),
                    Similarity = table.Column<double>(type: "float", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProductSimilarity", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ProductSimilarity_Products_ProductId1",
                        column: x => x.ProductId1,
                        principalTable: "Products",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_ProductSimilarity_Products_ProductId2",
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
                    UserId = table.Column<int>(type: "int", nullable: false),
                    ProductId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserViewHistories", x => new { x.UserId, x.ProductId });
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
                name: "IX_ProductSimilarity_ProductId1",
                table: "ProductSimilarity",
                column: "ProductId1");

            migrationBuilder.CreateIndex(
                name: "IX_ProductSimilarity_ProductId1_ProductId2",
                table: "ProductSimilarity",
                columns: new[] { "ProductId1", "ProductId2" });

            migrationBuilder.CreateIndex(
                name: "IX_ProductSimilarity_ProductId2",
                table: "ProductSimilarity",
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
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "PopularityStats");

            migrationBuilder.DropTable(
                name: "ProductSimilarity");

            migrationBuilder.DropTable(
                name: "UserSearches");

            migrationBuilder.DropTable(
                name: "UserViewHistories");

            migrationBuilder.DropColumn(
                name: "ElasticsearchId",
                table: "Products");

            migrationBuilder.AddColumn<byte[]>(
                name: "ImageEmbedding",
                table: "Products",
                type: "VARBINARY(MAX)",
                nullable: false,
                defaultValue: new byte[0]);
        }
    }
}

using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Ecommerce.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddMoMoFieldsToShopOrder : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "MoMoOrderId",
                table: "ShopOrders",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "MoMoRequestId",
                table: "ShopOrders",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "MoMoTransId",
                table: "ShopOrders",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PaymentStatus",
                table: "ShopOrders",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "MoMoOrderId",
                table: "ShopOrders");

            migrationBuilder.DropColumn(
                name: "MoMoRequestId",
                table: "ShopOrders");

            migrationBuilder.DropColumn(
                name: "MoMoTransId",
                table: "ShopOrders");

            migrationBuilder.DropColumn(
                name: "PaymentStatus",
                table: "ShopOrders");
        }
    }
}

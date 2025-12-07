using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Ecommerce.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class IncreaseBrandImageUrlSize : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_orderStatusHistories_OrderStatuses_OrderStatusId",
                table: "orderStatusHistories");

            migrationBuilder.DropIndex(
                name: "IX_OrderStatuses_Status",
                table: "OrderStatuses");

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

            migrationBuilder.AlterColumn<string>(
                name: "Status",
                table: "OrderStatuses",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(50)",
                oldMaxLength: 50);

            migrationBuilder.AlterColumn<string>(
                name: "ImageUrl",
                table: "Brands",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(500)",
                oldMaxLength: 500);

            migrationBuilder.AddForeignKey(
                name: "FK_orderStatusHistories_OrderStatuses_OrderStatusId",
                table: "orderStatusHistories",
                column: "OrderStatusId",
                principalTable: "OrderStatuses",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_orderStatusHistories_OrderStatuses_OrderStatusId",
                table: "orderStatusHistories");

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

            migrationBuilder.AlterColumn<string>(
                name: "Status",
                table: "OrderStatuses",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<string>(
                name: "ImageUrl",
                table: "Brands",
                type: "nvarchar(500)",
                maxLength: 500,
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_OrderStatuses_Status",
                table: "OrderStatuses",
                column: "Status",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_orderStatusHistories_OrderStatuses_OrderStatusId",
                table: "orderStatusHistories",
                column: "OrderStatusId",
                principalTable: "OrderStatuses",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}

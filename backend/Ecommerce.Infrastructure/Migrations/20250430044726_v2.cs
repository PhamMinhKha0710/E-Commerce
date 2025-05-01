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
                name: "FK_paymentLogs_payments_PaymentId",
                table: "paymentLogs");

            migrationBuilder.AlterColumn<int>(
                name: "PaymentId",
                table: "paymentLogs",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AlterColumn<string>(
                name: "Data",
                table: "paymentLogs",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AddColumn<int>(
                name: "OrderId",
                table: "paymentLogs",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_paymentLogs_OrderId",
                table: "paymentLogs",
                column: "OrderId");

            migrationBuilder.AddForeignKey(
                name: "FK_paymentLogs_ShopOrders_OrderId",
                table: "paymentLogs",
                column: "OrderId",
                principalTable: "ShopOrders",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_paymentLogs_payments_PaymentId",
                table: "paymentLogs",
                column: "PaymentId",
                principalTable: "payments",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_paymentLogs_ShopOrders_OrderId",
                table: "paymentLogs");

            migrationBuilder.DropForeignKey(
                name: "FK_paymentLogs_payments_PaymentId",
                table: "paymentLogs");

            migrationBuilder.DropIndex(
                name: "IX_paymentLogs_OrderId",
                table: "paymentLogs");

            migrationBuilder.DropColumn(
                name: "OrderId",
                table: "paymentLogs");

            migrationBuilder.AlterColumn<int>(
                name: "PaymentId",
                table: "paymentLogs",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Data",
                table: "paymentLogs",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AddForeignKey(
                name: "FK_paymentLogs_payments_PaymentId",
                table: "paymentLogs",
                column: "PaymentId",
                principalTable: "payments",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}

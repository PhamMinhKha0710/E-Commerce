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
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
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

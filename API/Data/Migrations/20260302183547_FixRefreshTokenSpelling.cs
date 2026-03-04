using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace API.Data.Migrations
{
    /// <inheritdoc />
    public partial class FixRefreshTokenSpelling : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "RefrashTokenExpiry",
                table: "AspNetUsers",
                newName: "RefreshTokenExpiry");

            migrationBuilder.RenameColumn(
                name: "RefrashToken",
                table: "AspNetUsers",
                newName: "RefreshToken");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "RefreshTokenExpiry",
                table: "AspNetUsers",
                newName: "RefrashTokenExpiry");

            migrationBuilder.RenameColumn(
                name: "RefreshToken",
                table: "AspNetUsers",
                newName: "RefrashToken");
        }
    }
}

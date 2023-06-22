using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Data.Migrations
{
    public partial class U1 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AspNetUsers_Grupe_GrupaId",
                table: "AspNetUsers");

            migrationBuilder.AddForeignKey(
                name: "FK_AspNetUsers_Grupe_GrupaId",
                table: "AspNetUsers",
                column: "GrupaId",
                principalTable: "Grupe",
                principalColumn: "Id");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AspNetUsers_Grupe_GrupaId",
                table: "AspNetUsers");

            migrationBuilder.AddForeignKey(
                name: "FK_AspNetUsers_Grupe_GrupaId",
                table: "AspNetUsers",
                column: "GrupaId",
                principalTable: "Grupe",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}

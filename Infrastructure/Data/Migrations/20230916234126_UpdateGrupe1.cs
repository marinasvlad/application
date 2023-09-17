using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Data.Migrations
{
    public partial class UpdateGrupe1 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AspNetUsers_Grupe_Id",
                table: "AspNetUsers");

            migrationBuilder.AlterColumn<int>(
                name: "Id",
                table: "AspNetUsers",
                type: "INTEGER",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "INTEGER")
                .Annotation("Sqlite:Autoincrement", true);

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUsers_GrupaId",
                table: "AspNetUsers",
                column: "GrupaId");

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

            migrationBuilder.DropIndex(
                name: "IX_AspNetUsers_GrupaId",
                table: "AspNetUsers");

            migrationBuilder.AlterColumn<int>(
                name: "Id",
                table: "AspNetUsers",
                type: "INTEGER",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "INTEGER")
                .OldAnnotation("Sqlite:Autoincrement", true);

            migrationBuilder.AddForeignKey(
                name: "FK_AspNetUsers_Grupe_Id",
                table: "AspNetUsers",
                column: "Id",
                principalTable: "Grupe",
                principalColumn: "Id");
        }
    }
}

using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Data.Migrations
{
    public partial class LocatieUpdated : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "LocatieId",
                table: "AspNetUsers",
                type: "INTEGER",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "Locatii",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    NumeLocatie = table.Column<string>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Locatii", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUsers_LocatieId",
                table: "AspNetUsers",
                column: "LocatieId");

            migrationBuilder.AddForeignKey(
                name: "FK_AspNetUsers_Locatii_LocatieId",
                table: "AspNetUsers",
                column: "LocatieId",
                principalTable: "Locatii",
                principalColumn: "Id");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AspNetUsers_Locatii_LocatieId",
                table: "AspNetUsers");

            migrationBuilder.DropTable(
                name: "Locatii");

            migrationBuilder.DropIndex(
                name: "IX_AspNetUsers_LocatieId",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "LocatieId",
                table: "AspNetUsers");
        }
    }
}

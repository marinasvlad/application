using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Data.Migrations
{
    public partial class UpdatedALot : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "LocatieId",
                table: "Anunturi",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Anunturi_LocatieId",
                table: "Anunturi",
                column: "LocatieId");

            migrationBuilder.AddForeignKey(
                name: "FK_Anunturi_Locatii_LocatieId",
                table: "Anunturi",
                column: "LocatieId",
                principalTable: "Locatii",
                principalColumn: "Id");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Anunturi_Locatii_LocatieId",
                table: "Anunturi");

            migrationBuilder.DropIndex(
                name: "IX_Anunturi_LocatieId",
                table: "Anunturi");

            migrationBuilder.DropColumn(
                name: "LocatieId",
                table: "Anunturi");
        }
    }
}

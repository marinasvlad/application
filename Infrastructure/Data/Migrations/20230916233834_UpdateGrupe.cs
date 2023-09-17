using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Data.Migrations
{
    public partial class UpdateGrupe : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AspNetUsers_Grupe_GrupaId",
                table: "AspNetUsers");

            migrationBuilder.DropIndex(
                name: "IX_AspNetUsers_GrupaId",
                table: "AspNetUsers");

            migrationBuilder.AddColumn<DateTime>(
                name: "DataGrupa",
                table: "Grupe",
                type: "TEXT",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<int>(
                name: "LocatieId",
                table: "Grupe",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTime>(
                name: "OraGrupa",
                table: "Grupe",
                type: "TEXT",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AlterColumn<int>(
                name: "Id",
                table: "AspNetUsers",
                type: "INTEGER",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "INTEGER")
                .OldAnnotation("Sqlite:Autoincrement", true);

            migrationBuilder.CreateIndex(
                name: "IX_Grupe_LocatieId",
                table: "Grupe",
                column: "LocatieId");

            migrationBuilder.AddForeignKey(
                name: "FK_AspNetUsers_Grupe_Id",
                table: "AspNetUsers",
                column: "Id",
                principalTable: "Grupe",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Grupe_Locatii_LocatieId",
                table: "Grupe",
                column: "LocatieId",
                principalTable: "Locatii",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AspNetUsers_Grupe_Id",
                table: "AspNetUsers");

            migrationBuilder.DropForeignKey(
                name: "FK_Grupe_Locatii_LocatieId",
                table: "Grupe");

            migrationBuilder.DropIndex(
                name: "IX_Grupe_LocatieId",
                table: "Grupe");

            migrationBuilder.DropColumn(
                name: "DataGrupa",
                table: "Grupe");

            migrationBuilder.DropColumn(
                name: "LocatieId",
                table: "Grupe");

            migrationBuilder.DropColumn(
                name: "OraGrupa",
                table: "Grupe");

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
    }
}

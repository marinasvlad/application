using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Data.Migrations
{
    public partial class UpdatePrezenteNrPrezente : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "NumarSedinteRamase",
                table: "AspNetUsers",
                newName: "NumarSedinte");

            migrationBuilder.CreateTable(
                name: "Prezente",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Data = table.Column<DateTime>(type: "TEXT", nullable: false),
                    Start = table.Column<DateTime>(type: "TEXT", nullable: false),
                    Stop = table.Column<DateTime>(type: "TEXT", nullable: false),
                    AppUserId = table.Column<int>(type: "INTEGER", nullable: false),
                    Email = table.Column<string>(type: "TEXT", nullable: true),
                    DisplayName = table.Column<string>(type: "TEXT", nullable: true),
                    LocatieId = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Prezente", x => x.Id);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Prezente");

            migrationBuilder.RenameColumn(
                name: "NumarSedinte",
                table: "AspNetUsers",
                newName: "NumarSedinteRamase");
        }
    }
}

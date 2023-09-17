import { Elev } from "./elev";

export class Grupa {
    id: number;
    dataGrupa: Date;
    oraGrupa: Date;
    locatieId: number;
    elevi: Elev[] = [];
    particip: boolean;
}

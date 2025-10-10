// app/data/staticDataTransit.ts

export interface TransitRecord {
  id_import: number;
  id_export: number;
  nomer_vagona: string;
  strana_otpr_import: string;
  strana_nazn_export: string;
  stancia_otpr: string;
  stancia_pereaddr: string;
  stancia_nazn: string;
  data_prib_import: string;
  data_otpr_export: string;
  ves_import: number;
  ves_export: number;
  naimenovanie_gruza: string;
  gp_1: string;
  go_1: string;
  stan_nazn_kzh: number;
  stan_otpr_kzh: number;
  naimenovanie_plat: string;
}

export const transitData: TransitRecord[] = [
  {
    id_import: 84890,
    id_export: 4203783,
    nomer_vagona: "LPLU4545833",
    strana_otpr_import: "УЗБЕКИСТАН",
    strana_nazn_export: "РОССИЯ",
    stancia_otpr: "МАРОКАНД",
    stancia_pereaddr: "ЖАНА-АУЛ",
    stancia_nazn: "ЕЛИМАЙ ОБГП",
    data_prib_import: "2025-01-08",
    data_otpr_export: "2025-06-05 00:00:00",
    ves_import: 2100,
    ves_export: 2100,
    naimenovanie_gruza: "КОНТ_СПЕЦ_ПОР_СОБ",
    gp_1: "9,5114E+11",
    go_1: "41040007373",
    stan_nazn_kzh: 674103,
    stan_otpr_kzh: 674103,
    naimenovanie_plat: 'ТОО "Азия Интермодал"',
  },
  {
    id_import: 132613,
    id_export: 280835,
    nomer_vagona: "99449399",
    strana_otpr_import: "УЗБЕКИСТАН",
    strana_nazn_export: "РОССИЯ",
    stancia_otpr: "АХАНГАРАН",
    stancia_pereaddr: "КОКШЕТАУ 1",
    stancia_nazn: "БУЛАЕВО 1",
    data_prib_import: "2025-01-09",
    data_otpr_export: "2025-01-09 23:01:00",
    ves_import: 0,
    ves_export: 0,
    naimenovanie_gruza: "ВАГОНЫ_Ж/Д_ВСЯКИЕ",
    gp_1: "1,3084E+11",
    go_1: "1,3084E+11",
    stan_nazn_kzh: 687008,
    stan_otpr_kzh: 687008,
    naimenovanie_plat: 'АО "Асты транс"',
  },
  {
    id_import: 170601,
    id_export: 8026745,
    nomer_vagona: "99460863",
    strana_otpr_import: "УЗБЕКИСТАН",
    strana_nazn_export: "РОССИЯ",
    stancia_otpr: "АХАНГАРАН",
    stancia_pereaddr: "ЖАЛПАК ТАЛАП",
    stancia_nazn: "АЛТЫНТОБЕ",
    data_prib_import: "2025-01-09",
    data_otpr_export: "2025-02-02 00:00:00",
    ves_import: 0,
    ves_export: 0,
    naimenovanie_gruza: "ВАГОНЫ_Ж/Д_ВСЯКИЕ",
    gp_1: "5,7053E+11",
    go_1: "5,7053E+11",
    stan_nazn_kzh: 677508,
    stan_otpr_kzh: 677508,
    naimenovanie_plat: 'АО "Асты транс"',
  },
];

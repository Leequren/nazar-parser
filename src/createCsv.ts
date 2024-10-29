import data from "../docs/data.json";
const dataAny = data as any;
import { createObjectCsvWriter } from "csv-writer";

const csvWriter = createObjectCsvWriter({
  path: "cars.csv",
  header: [
    { id: "nameCar", title: "name car" },
    { id: "namePart", title: "name part" },
    { id: "desc", title: "description" },
    { id: "articlePart", title: "articlePart" },
  ],
});
const cars: any[] = [];
for (let carBrandKey in dataAny) {
  const carBrandInfo = dataAny[carBrandKey];
  for (let carModelKey in carBrandInfo.models) {
    const carModelInfo = carBrandInfo.models[carModelKey];
    if (!carModelInfo) continue;
    for (let carBodyKey in carModelInfo.bodies) {
      const carBodyInfo = carModelInfo.bodies[carBodyKey];
      if (!carBodyInfo.equipments) continue;
      console.log(carBodyInfo.equipments);
      for (let carEquipmentKey in carBodyInfo.equipments) {
        const carEquipmentInfo = carBodyInfo.equipments[carEquipmentKey];
        const parts = carEquipmentInfo.parts;
        for (let carPartKey in parts) {
          const carPart = parts[carPartKey];
          // console.log(carPart[carPart.length - 1]);

          let partDesc = "";
          for (let i = 0; i < carPart.length; ++i) {
            partDesc += `${carPart[i]};\n`;
          }

          cars.push({
            nameCar: `${carBrandKey} ${carBodyKey} ${carEquipmentKey}`,
            articlePart: `${carPartKey}`,
            desc: partDesc,
            namePart: `${carPartKey}`,
          });
        }
      }
    }
  }
}
console.log(cars);
csvWriter
  .writeRecords(cars)
  .then(() => console.log("Данные успешно записаны в файл cars.csv"))
  .catch((error) => console.error("Ошибка при записи файла:", error));

import { writeFile } from "fs";
import { join } from "path";
import puppeteer, { Page } from "puppeteer";
function delay(time: number) {
  return new Promise(function (resolve) {
    setTimeout(resolve, time);
  });
}

function genSelectorChild(str: string, numb: number) {
  return `${str}:nth-child(${numb})`;
}

interface IEquipment {
  imgBrandElement: string | null;
  imgEquipment: string | null;
  equipmentHeader: string;
  parts: object;
}

interface IBodyModelCar {
  imgSrc: string | null;
  name: string;
  equipments: Record<string, IEquipment> | null | undefined;
}

interface ICarModel {
  imgSrc: string;
  bodies: Record<string, IBodyModelCar> | null;
}

interface ICarInfo {
  imgSrc: string;
  carBrand: string;
  models: Record<string, ICarModel> | null;
}

function getElementNthChild(element: Element) {
  if (!element.parentElement?.children) return null;
  const children = Array.from(element.parentElement?.children);
  const index = children.indexOf(element) + 1;
  return index;
}

// async function getModelsCarInfo(page: Page, cars: Record<string, ICarInfo>) {
//   let idx = 1;

//   for (let i in cars) {
//     const modelsCar = cars[i];
//     await delay(300);
//     await page.click(`.vehManMenuItem:nth-child(${idx})`);
//     await delay(300);
//     modelsCar.models = await page.evaluate(async () => {
//       const models = document.querySelectorAll(".vehModGrpMenuItem");
//       const modelsData: Record<string, ICarModel> = {};
//       for (let modelDiv of models) {
//         const modelName = modelDiv.querySelector("p")?.textContent;
//         const imgSrc = modelDiv.querySelector("img")?.src;

//         if (!modelName || !imgSrc) {
//           continue;
//         }

//         // await page.click(`.vehModGrpMenuItem`);
//         // await delay(300);
//         // await page.goBack();

//         modelsData[modelName] = {
//           imgSrc,
//           bodies: {},
//         };
//       }
//       console.log(modelsData);
//       return modelsData;
//     });

//     ++idx;
//     await delay(300);
//     await page.goBack();
//   }
// }
function getCarCompInfo(container: Element) {
  console.log(container.querySelector("img"));
  const carPicHref = container.querySelector("img");
  const carDesc = container.querySelector("p");

  if (!carDesc?.textContent || !carPicHref) {
    return;
  }

  return {
    imgSrc: carPicHref.src,
    carBrand: carDesc?.textContent,
    models: null,
  };
}
function getModelCarInfo(container: Element) {
  console.log(container.querySelector("img"));
  const carPicHref = container.querySelector("img");
  const modelDesc = container.querySelector("p");

  if (!modelDesc?.textContent || !carPicHref) {
    return;
  }
  return {
    imgSrc: carPicHref.src,
    modelCar: modelDesc?.textContent,
    bodies: null,
  };
}

function getCarsInfo() {
  const cars = document.querySelectorAll(".vehManMenuItem");
  console.log(cars);
  const carsData: Record<string, ICarInfo> = {};
  for (let carDiv of cars) {
    console.log(getCarCompInfo);
    const carInfo = getCarCompInfo(carDiv);

    if (!carInfo) continue;

    carsData[carInfo.carBrand] = carInfo;
  }
  console.log(carsData);
  return carsData;
}

function getModelsCarInfo() {
  const models = document.querySelectorAll("li.vehModGrpMenuItem");
  const modelsData: Record<string, ICarModel> = {};
  for (let modelContainer of models) {
    const modelCar = getModelCarInfo(modelContainer);
    if (!modelCar) continue;
    modelsData[modelCar.modelCar] = modelCar;
  }
  return modelsData;
}

function getEquipmentBodyCar(container: Element): IEquipment | null {
  const imgBrandElement =
    container.querySelector<HTMLImageElement>("img.manImg");
  const imgEquipment = container.querySelector<HTMLImageElement>("img.manImg");
  // const detailDiv = document.querySelector("div.detail-wrapper");
  const detailDiv = null;
  const equipmentHeader = container.querySelector("p.header");
  if (
    !imgEquipment ||
    !imgBrandElement ||
    !equipmentHeader ||
    !equipmentHeader.textContent
  )
    return null;

  return {
    imgBrandElement: imgBrandElement.src,
    imgEquipment: imgEquipment.src,
    equipmentHeader: equipmentHeader.textContent,
    parts: {},
  };
}

function getBodyModelCar(container: Element): IBodyModelCar | null {
  const imgBodyModelCar =
    container.querySelector<HTMLImageElement>("img.vehImg");
  const nameBodyModelCar = container.querySelector("p");
  console.log(imgBodyModelCar, nameBodyModelCar);
  if (!imgBodyModelCar || !nameBodyModelCar) return null;

  return {
    imgSrc: imgBodyModelCar.src,
    name: nameBodyModelCar.textContent?.trim() ?? "без имени",
    equipments: null,
  };
}

function getBodiesModelCar() {
  const bodies = document.querySelectorAll(".vehModMenuItem");
  console.log("[BODIES]", bodies);
  const bodiesData: Record<string, IBodyModelCar> = {};
  for (let body of bodies) {
    const bodyModelCar = getBodyModelCar(body);
    if (!bodyModelCar || !bodyModelCar.name || !bodyModelCar.imgSrc) continue;
    bodyModelCar.name;
    bodiesData[bodyModelCar.name] = bodyModelCar;
  }
  return bodiesData;
}

function getLevelPath() {
  return Array.from(document.querySelectorAll(".Description")).length;
}
function getBodyNameByPath(): string {
  const body = document.querySelectorAll(".Description")[2].textContent;
  return body ? body : "";
}

function getEquipmentsBodyCar(): Record<string, IEquipment> {
  const equipments = document.querySelectorAll(".carTypeItem");
  console.log("[EQUIPMENTS]", equipments);
  const equipmentsData: Record<string, IEquipment> = {};
  for (let equipment of equipments) {
    const equipmentCar = getEquipmentBodyCar(equipment);
    console.log(equipment, equipmentCar);
    if (!equipmentCar || !equipmentCar.equipmentHeader) continue;
    equipmentsData[equipmentCar.equipmentHeader] = equipmentCar;
  }
  console.log(equipmentsData);
  return equipmentsData;
}
function test() {
  return 1 + 1;
}
async function promiseAll(...funcs: Promise<any>[]) {
  await Promise.all([...funcs]);
}
async function goBackWithWait(page: Page, delayCount: number) {
  await delay(delayCount);
  await promiseAll(
    page.waitForNavigation({ waitUntil: "networkidle0" }),
    page.goBack()
  );
}
enum TCarTypes {
  "Тормозная система" = "break system",
  "Приводной механизм" = "drive mechanism",
  "Ходовая часть" = "Undercarriage",
  "рулевое управления" = "steering controls",
  "Гидравлический фильтр" = "Hydraulic filter",
  "Техобслуживание / сервис" = "Maintenance",
  "Ременной привод и привод цепи управления" = "control circuit drive",
  "Двигатель" = "engine",
  "Система охлаждения двигателя" = "Engine cooling system",
  "Система зажигания и система накаливания" = "Ignition system",
  "Топливная система" = "fuel system",
  "Система впуска воздуха" = "Air intake system",
  "Система кондиционирования" = "Air conditioning system",
  "Клапаны / двери / стеклянные элементы" = "glass elements",
  "Ситема очистки окон" = "clear windows system",
  "Кузов" = "body",
  "Электрика" = "Electrics",
  "Датчик / зонд" = "Sensor",
}
interface IParseCarPartsContainer {
  data: any[];
  manufacturerCode: string;
}
function parseCarPartsContainer(
  container: HTMLElement
): IParseCarPartsContainer {
  const meyleHd = container
    .querySelector<HTMLTableElement>(".tr_bez td span")
    ?.innerText.trim();
  const kritPanels = container.querySelectorAll<HTMLElement>(".al_kritpanel");
  let parsedData = [];

  parsedData.push(meyleHd);

  kritPanels.forEach((panel) => {
    let text = panel.innerText.trim();
    parsedData.push(text.replace(/,\s*$/, ""));
  });

  const manufacturerCode = container
    .querySelector<HTMLElement>(".pnl_customNumbers a")
    ?.innerText?.trim();
  // parsedData.push(`Код производителя: ${manufacturerCode}`);

  console.log(parsedData);
  return {
    data: parsedData,
    manufacturerCode: manufacturerCode ? manufacturerCode : "",
  };
}

function genBtnsSelectorCarpartsTypes() {}
const main = async () => {
  var browser = await puppeteer.launch({ headless: false, devtools: true });
  var page = await browser.newPage();
  await page.goto(
    "https://web2.carparts-cat.com/Sub/GVS/124F3F595E1443C0800D3DCA9A720EF7348016/16/1/1/0/-1/-1/-1/9992/?state=1",
    { waitUntil: "networkidle0" }
  );
  const delayMod = 0;
  try {
    await promiseAll(
      page.waitForNavigation({ waitUntil: "domcontentloaded" }),
      page.click("div.breadCrumbItem")
    );
    console.info("переход на главную страницу выполнен");
  } catch (e) {
    console.error("пошёл нахуй");
  }
  await delay(1000);
  // await startPage.waitForTa(3000);
  await page.addScriptTag({
    content: `${getCarCompInfo} ${getCarsInfo} ${test} ${getModelsCarInfo} ${getModelCarInfo} ${getBodiesModelCar} ${getBodyModelCar} ${getLevelPath} ${getBodyNameByPath} ${getEquipmentBodyCar} ${getEquipmentsBodyCar} ${parseCarPartsContainer}`,
  });
  console.log(page);
  const cars = await page.evaluate(async () => {
    return getCarsInfo();
  });
  try {
    Object.keys(cars).forEach(async (carKey, idx) => {
      if (idx !== 3) return;
      await promiseAll(
        page.click(`li.vehManMenuItem:nth-child(${idx})`),
        // page.waitForNavigation({ waitUntil: "domcontentloaded" })
        page.waitForNavigation({ waitUntil: "networkidle0" })
      );
      // await page.click(`li.vehManMenuItem:nth-child(${idx})`);
      // await page.waitForNavigation({ waitUntil: "networkidle0" });
      console.log("произошёл переход на страницу моделей");
      const models = await page.evaluate(() => {
        return getModelsCarInfo();
      });
      cars[carKey].models = models;
      let idxModel = 1;
      for (let modelKey in cars[carKey].models) {
        await promiseAll(
          page.waitForNavigation({ waitUntil: "domcontentloaded" }),
          page.click(genSelectorChild("li.vehModGrpMenuItem", idxModel))
        );

        const levelPath = await page.evaluate(() => getLevelPath());
        console.log(`[LEVELPATH]: ${levelPath}`);
        if (levelPath === 2) {
          const bodies = await page.evaluate(() => getBodiesModelCar());
          console.log(`[BODIES]: `, bodies);
          cars[carKey].models[modelKey].bodies = bodies;
          let idxBody = 1;
          for (let bodyKey in bodies) {
            const selector = genSelectorChild(".vehModMenuItem", idxBody);

            console.log(selector);
            await promiseAll(
              page.waitForNavigation({ waitUntil: "networkidle0" }),
              page.click(selector)
            );

            console.log("Переход на страницу комплектаций");
            await delay(delayMod);
            const equipments = await page.evaluate(() =>
              getEquipmentsBodyCar()
            );

            // await delay(1000000);

            console.log("[EQUIPMENTS]: ", equipments);
            cars[carKey].models[modelKey].bodies[bodyKey].equipments =
              equipments;

            let idxEquipment = 1;
            console.log(equipments);
            for (let equipmentKey in equipments) {
              const equipmentSelector = genSelectorChild(
                ".carTypeItemContainer",
                idxEquipment
              );
              console.log("start parse new page equipment");
              await promiseAll(
                page.click(equipmentSelector),
                page.waitForNavigation({ waitUntil: "networkidle0" })
              );

              await page.addScriptTag({ content: `${getEquipmentsBodyCar}` });
              const partTabsLength = await page.evaluate(
                () => document.querySelectorAll(".quickstart").length
              );

              for (let i = 1; i <= partTabsLength; ++i) {
                await promiseAll(
                  page.click(genSelectorChild("div.quickstart", i)),
                  page.waitForNavigation({ waitUntil: "networkidle0" })
                );
                await page.addScriptTag({
                  content: `${parseCarPartsContainer}`,
                });
                const parts = await page.evaluate(() => {
                  const partsContainers =
                    document.querySelectorAll<HTMLElement>(".tc_prop");
                  const parts: { [key: string]: any } = {};
                  for (let i = 0; i < partsContainers.length; ++i) {
                    const data = parseCarPartsContainer(partsContainers[i]);
                    parts[data.manufacturerCode] = data.data;
                  }

                  return parts;
                });
                cars[carKey].models[modelKey].bodies[bodyKey].equipments[
                  equipmentKey
                ].parts = parts;
                console.log(parts);
                await goBackWithWait(page, 10);
              }

              await promiseAll(
                page.waitForNavigation({ waitUntil: "networkidle0" }),
                page.click(genSelectorChild("div.history_item", 3))
              );
              await page.waitForSelector("iframe");
              const iframeSrc = await page.evaluate(() => {
                return document.querySelector("iframe")?.src;
              });
              if (iframeSrc) {
                await page.goto(iframeSrc, { waitUntil: "networkidle0" });
              }
              console.log(iframeSrc);
              // await delay(2500);
              // await goBackWithWait(page, 1000);

              ++idxEquipment;
              console.log(idxEquipment);
              // await delay(2000);
            }

            await goBackWithWait(page, 1000);

            ++idxBody;
          }
          console.log(bodies);
        } else if (levelPath === 3) {
          const bodyWithEquipment = await page.evaluate(() => {
            const body: IBodyModelCar = {
              imgSrc: null,
              name: getBodyNameByPath(),
              equipments: getEquipmentsBodyCar(),
            };
            return body;
          });
          // cars[carKey].models[modelKey].bodies

          console.log(bodyWithEquipment);
        }
        await goBackWithWait(page, delayMod);
        ++idxModel;
      }
      await goBackWithWait(page, delayMod);
      ++idx;
    });
    // await page.evaluate(async () => {
    //   for (let i in cars) {
    //   }
    // });
  } catch (e) {
    console.error("произошла ошибка:", e);
    const jsonData = JSON.stringify(cars, null, 2);
    writeFile(join(__dirname, "../", "docs/", "data.json"), jsonData, (err) => {
      if (err) throw err;
      console.log("Файл сохранён");
    });
    // console.log(cars);
  }

  // console.log(JSON.stringify(cars, null, 2));
};

main().catch((error) => {
  console.error(error);
});

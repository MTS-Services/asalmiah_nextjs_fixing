/*
@copyright : ToXSL Technologies Pvt. Ltd. < www.toxsl.com >
@author     : Shiv Charan Panjeta < shiv@toxsl.com >

All Rights Reserved.
Proprietary and confidential :  All information contained herein is, and remains
the property of ToXSL Technologies Pvt. Ltd. and its partners.
Unauthorized copying of this file, via any medium is strictly prohibited.
*/

let mongoose = require("mongoose");
let logger = require("winston");
const { CONST } = require("./constant.js");
const { GOVERNATE, AREA } = require("../app/governate/model/model.js");
const { USER } = require("../app/userService/model/userModel.js");

const dotenv = require("dotenv");
dotenv.config();
mongoose.connect(process.env.DB_URL);

async function createGovernate() {
  const governateArr = [
    {
      title: "Ahmadi",
    },
    {
      title: "Capital",
    },
    {
      title: "Farwaniya",
    },
    {
      title: "Hawally",
    },
    {
      title: "Jahra",
    },
    {
      title: "Mubarak Al-Kabeer",
    },
  ];

  let user = await USER.findOne({ roleId: CONST.ADMIN });

  governateArr.forEach(async (element) => {
    const payload = {
      title: element.title,
      createdBy: user._id,
      stateId: CONST.ACTIVE,
    };

    const isExist = await GOVERNATE.findOne({
      title: payload.title,
    });

    if (isExist) {
      logger.info(`${isExist.title} governate already created`);
    } else {
      const save = await GOVERNATE(payload).save();
    }
  });
  createGovernateArea();
  logger.info("Successfully governate created");
  //  process.exit();
}

createGovernate();

async function createGovernateArea() {
  let area = [
    {
     "Governorate": "Ahmadi",
     "Area": "ABU HALAIFA",
     "Description": "أبو حليفة"
    },
    {
     "Governorate": "Ahmadi",
     "Area": "AHMADI",
     "Description": "الاحمدي"
    },
    {
     "Governorate": "Ahmadi",
     "Area": "FAHAHEEL",
     "Description": "الفحيحيل"
    },
    {
     "Governorate": "Ahmadi",
     "Area": "FUNTASS",
     "Description": "الفنطاس"
    },
    {
     "Governorate": "Ahmadi",
     "Area": "HADEYA",
     "Description": "هدية"
    },
    {
     "Governorate": "Ahmadi",
     "Area": "MANGAF",
     "Description": "المنقف"
    },
    {
     "Governorate": "Ahmadi",
     "Area": "RIGGA",
     "Description": "الرقة"
    },
    {
     "Governorate": "Ahmadi",
     "Area": "SABAHIYA",
     "Description": "الصباحية"
    },
    {
     "Governorate": "Ahmadi",
     "Area": "OM ALHIMAN",
     "Description": "ام الهيمان"
    },
    {
     "Governorate": "Ahmadi",
     "Area": "MAHBULA",
     "Description": "المهبولة"
    },
    {
     "Governorate": "Ahmadi",
     "Area": "ZAHAR",
     "Description": "الظهر"
    },
    {
     "Governorate": "Ahmadi",
     "Area": "JABER AL-ALI",
     "Description": "جابر العلي"
    },
    {
     "Governorate": "Ahmadi",
     "Area": "ABU HASANIYA",
     "Description": "أبو الحصانية"
    },
    {
     "Governorate": "Ahmadi",
     "Area": "AL- KHAIRAN",
     "Description": "الخيران"
    },
    {
     "Governorate": "Ahmadi",
     "Area": "AL-NAWASEEB",
     "Description": "النويصيب"
    },
    {
     "Governorate": "Ahmadi",
     "Area": "AL-ZOOR",
     "Description": "الزور"
    },
    {
     "Governorate": "Ahmadi",
     "Area": "MAQWAA",
     "Description": "المقوع"
    },
    {
     "Governorate": "Ahmadi",
     "Area": "MINA ABDULLA",
     "Description": "ميناء عبدالله"
    },
    {
     "Governorate": "Ahmadi",
     "Area": "OKAELA",
     "Description": "العقيلة"
    },
    {
     "Governorate": "Ahmadi",
     "Area": "SHUAIBA",
     "Description": "الشعيبة"
    },
    {
     "Governorate": "Ahmadi",
     "Area": "SOUTH SABAHIYA",
     "Description": "جنوب الصباحية"
    },
    {
     "Governorate": "Ahmadi",
     "Area": "WAFRA",
     "Description": "الوفرة"
    },
    {
     "Governorate": "Ahmadi",
     "Area": "FAHAD AL AHMAD",
     "Description": "فهد الأحمد"
    },
    {
     "Governorate": "Ahmadi",
     "Area": "ALI SABAH AL SALEM",
     "Description": "علي صباح السالم"
    },
    {
     "Governorate": "Ahmadi",
     "Area": "SABAH AL AHMAD CITY",
     "Description": "مدينة صباح الأحمد"
    },
    {
     "Governorate": "Ahmadi",
     "Area": "EAST  AL AHMADI",
     "Description": "شرق الأحمدي"
    },
    {
     "Governorate": "Ahmadi",
     "Area": "SOUTH AHMADI",
     "Description": "جنوب الأحمدي"
    },
    {
     "Governorate": "Capital",
     "Area": "ABDULAH AL- SALEM",
     "Description": "عبدالله السالم"
    },
    {
     "Governorate": "Capital",
     "Area": "BNAID AL-QAR",
     "Description": "بنيد القار"
    },
    {
     "Governorate": "Capital",
     "Area": "DHIYA",
     "Description": "الدعية"
    },
    {
     "Governorate": "Capital",
     "Area": "EDAILIYA",
     "Description": "العديلية"
    },
    {
     "Governorate": "Capital",
     "Area": "FAIHA",
     "Description": "الفيحاء"
    },
    {
     "Governorate": "Capital",
     "Area": "KAIFAN",
     "Description": "كيفان"
    },
    {
     "Governorate": "Capital",
     "Area": "MANSOURIYA",
     "Description": "المنصورية"
    },
    {
     "Governorate": "Capital",
     "Area": "AL-MURAGAB",
     "Description": "المر قاب"
    },
    {
     "Governorate": "Capital",
     "Area": "NUZHA",
     "Description": "النزهة"
    },
    {
     "Governorate": "Capital",
     "Area": "QADSSIYA",
     "Description": "القادسية"
    },
    {
     "Governorate": "Capital",
     "Area": "SALHIYA",
     "Description": "صالحية"
    },
    {
     "Governorate": "Capital",
     "Area": "SHAMIYA",
     "Description": "الشامية"
    },
    {
     "Governorate": "Capital",
     "Area": "SHARQ",
     "Description": "شرق"
    },
    {
     "Governorate": "Capital",
     "Area": "SHUWAIKH",
     "Description": "الشويخ"
    },
    {
     "Governorate": "Capital",
     "Area": "SAWABER",
     "Description": "الصوابر"
    },
    {
     "Governorate": "Capital",
     "Area": "GHERNATA",
     "Description": "غر ناطة"
    },
    {
     "Governorate": "Capital",
     "Area": "KHALDIYA",
     "Description": "الخالدية"
    },
    {
     "Governorate": "Capital",
     "Area": "RAWDHA",
     "Description": "الروضة"
    },
    {
     "Governorate": "Capital",
     "Area": "SURRA",
     "Description": "السرة"
    },
    {
     "Governorate": "Capital",
     "Area": "QURTUBA",
     "Description": "قرطبة"
    },
    {
     "Governorate": "Capital",
     "Area": "YARMOYK",
     "Description": "اليرموك"
    },
    {
     "Governorate": "Capital",
     "Area": "AL-QIBLA",
     "Description": "القبلة"
    },
    {
     "Governorate": "Capital",
     "Area": "DASMA",
     "Description": "الدسمة"
    },
    {
     "Governorate": "Capital",
     "Area": "DOHA",
     "Description": "الدوحة"
    },
    {
     "Governorate": "Capital",
     "Area": "FAILEKA",
     "Description": "فيلكا"
    },
    {
     "Governorate": "Capital",
     "Area": "OM-SADA",
     "Description": "أم صده"
    },
    {
     "Governorate": "Capital",
     "Area": "SULAIBIKHAT",
     "Description": "الصليبيخات"
    },
    {
     "Governorate": "Capital",
     "Area": "QAIRAWAN",
     "Description": "القيروان"
    },
    {
     "Governorate": "Capital",
     "Area": "ALNAHDHA",
     "Description": "النهضة"
    },
    {
     "Governorate": "Capital",
     "Area": "JABER AL AHMAD CITY",
     "Description": "مدينة جابر الأحمد"
    },
    {
     "Governorate": "Capital",
     "Area": "DASMAN",
     "Description": "دسمان"
    },
    {
     "Governorate": "Capital",
     "Area": "NW SULAIBIKHAT",
     "Description": "شمال غرب الصليبخات"
    },
    {
     "Governorate": "Farwaniya",
     "Area": "AL-ABASIYA",
     "Description": "العباسية"
    },
    {
     "Governorate": "Farwaniya",
     "Area": "AL-HASSAWI",
     "Description": "الحساوي"
    },
    {
     "Governorate": "Farwaniya",
     "Area": "AL-MADAEN",
     "Description": "المدائن"
    },
    {
     "Governorate": "Farwaniya",
     "Area": "AL-OUTHEYLIA",
     "Description": "العضيلية"
    },
    {
     "Governorate": "Farwaniya",
     "Area": "AL-REHAB",
     "Description": "الرحاب"
    },
    {
     "Governorate": "Farwaniya",
     "Area": "AL-SHADADYA",
     "Description": "الشدادية"
    },
    {
     "Governorate": "Farwaniya",
     "Area": "ANDALUS",
     "Description": "الأندلس"
    },
    {
     "Governorate": "Farwaniya",
     "Area": "ARDIYA",
     "Description": "العارضية"
    },
    {
     "Governorate": "Farwaniya",
     "Area": "FARWANIYA",
     "Description": "الفروانية"
    },
    {
     "Governorate": "Farwaniya",
     "Area": "FIRDOWS",
     "Description": "الفردوس"
    },
    {
     "Governorate": "Farwaniya",
     "Area": "JILEEB AL-SHIYOUKH",
     "Description": "جليب الشيوخ"
    },
    {
     "Governorate": "Farwaniya",
     "Area": "NEW KHITAN",
     "Description": "خيطان الجديدة"
    },
    {
     "Governorate": "Farwaniya",
     "Area": "OMARIYA",
     "Description": "العمرية"
    },
    {
     "Governorate": "Farwaniya",
     "Area": "RABIYA",
     "Description": "الرابية"
    },
    {
     "Governorate": "Farwaniya",
     "Area": "REGGEI",
     "Description": "الرقعي"
    },
    {
     "Governorate": "Farwaniya",
     "Area": "SABAH AL-NASER",
     "Description": "صباح الناصر"
    },
    {
     "Governorate": "Farwaniya",
     "Area": "SOUTH RABIYA",
     "Description": "جنوب الرابية"
    },
    {
     "Governorate": "Farwaniya",
     "Area": "KHITAN",
     "Description": "خيطان"
    },
    {
     "Governorate": "Farwaniya",
     "Area": "ESHBELYA",
     "Description": "اشبيلية"
    },
    {
     "Governorate": "Farwaniya",
     "Area": "Abdullah AlMubarak",
     "Description": "عبدالله المبارك الصباح"
    },
    {
     "Governorate": "Farwaniya",
     "Area": "ABRAQ KHITAN",
     "Description": "ابرق خيطان"
    },
    {
     "Governorate": "Farwaniya",
     "Area": "West Abdla Al-Mubarak",
     "Description": "غرب عبدالله المبارك"
    },
    {
     "Governorate": "Farwaniya",
     "Area": "SOUTH ABDULLAH AL-MUBARAK",
     "Description": "جنوب عبدالله المبارك"
    },
    {
     "Governorate": "Hawally",
     "Area": "BAYAN",
     "Description": "بيان"
    },
    {
     "Governorate": "Hawally",
     "Area": "HAWALLY",
     "Description": "حولي"
    },
    {
     "Governorate": "Hawally",
     "Area": "EAST HAWALLY",
     "Description": "شرق حولي"
    },
    {
     "Governorate": "Hawally",
     "Area": "JABRIYA",
     "Description": "الجابرية"
    },
    {
     "Governorate": "Hawally",
     "Area": "RUMAITHIYA",
     "Description": "الرميثية"
    },
    {
     "Governorate": "Hawally",
     "Area": "SALMIYA",
     "Description": "السالمية"
    },
    {
     "Governorate": "Hawally",
     "Area": "SALWA",
     "Description": "سلوى"
    },
    {
     "Governorate": "Hawally",
     "Area": "SHAAB",
     "Description": "الشعب"
    },
    {
     "Governorate": "Hawally",
     "Area": "AL-NOGRAH",
     "Description": "النقرة"
    },
    {
     "Governorate": "Hawally",
     "Area": "MISHRIF",
     "Description": "مشرف"
    },
    {
     "Governorate": "Hawally",
     "Area": "AL-BADA?A",
     "Description": "البدع"
    },
    {
     "Governorate": "Hawally",
     "Area": "MUBARAK AL-ABDULLAH",
     "Description": "مبارك العبدالله الجابر"
    },
    {
     "Governorate": "Hawally",
     "Area": "AL-SALAM",
     "Description": "السلام"
    },
    {
     "Governorate": "Hawally",
     "Area": "AL-SEDIQ",
     "Description": "الصديق"
    },
    {
     "Governorate": "Hawally",
     "Area": "AL-ZAHRA",
     "Description": "الزهراء"
    },
    {
     "Governorate": "Hawally",
     "Area": "HETEEN",
     "Description": "حطين"
    },
    {
     "Governorate": "Hawally",
     "Area": "ALSHUHADA",
     "Description": "الشهداء"
    },
    {
     "Governorate": "Jahra",
     "Area": "AL- JAHRA",
     "Description": "الجهراء"
    },
    {
     "Governorate": "Jahra",
     "Area": "SHAABIYA",
     "Description": "الشعبية"
    },
    {
     "Governorate": "Jahra",
     "Area": "SULAIBIYA",
     "Description": "الصليبية"
    },
    {
     "Governorate": "Jahra",
     "Area": "ATRAF",
     "Description": "الأطراف"
    },
    {
     "Governorate": "Jahra",
     "Area": "AL- QASR",
     "Description": "القصر"
    },
    {
     "Governorate": "Jahra",
     "Area": "AL- NAEM",
     "Description": "النعيم"
    },
    {
     "Governorate": "Jahra",
     "Area": "TAYMA",
     "Description": "تيماء"
    },
    {
     "Governorate": "Jahra",
     "Area": "AL- OYOON",
     "Description": "العيون"
    },
    {
     "Governorate": "Jahra",
     "Area": "AL- WAHA",
     "Description": "الواحة"
    },
    {
     "Governorate": "Jahra",
     "Area": "AL-NASSIEM",
     "Description": "النسيم"
    },
    {
     "Governorate": "Jahra",
     "Area": "Saad Al Abdullah",
     "Description": "سعد العبدلله"
    },
    {
     "Governorate": "Mubarak Al-Kabeer",
     "Area": "FUNAITEES",
     "Description": "الفنيطيس"
    },
    {
     "Governorate": "Mubarak Al-Kabeer",
     "Area": "QURAIN",
     "Description": "القرين"
    },
    {
     "Governorate": "Mubarak Al-Kabeer",
     "Area": "AL-ADAN",
     "Description": "العدان"
    },
    {
     "Governorate": "Mubarak Al-Kabeer",
     "Area": "MUBARAK AL-KABEER",
     "Description": "مبارك الكبير"
    },
    {
     "Governorate": "Mubarak Al-Kabeer",
     "Area": "AL-QUSOOR",
     "Description": "القصور"
    },
    {
     "Governorate": "Mubarak Al-Kabeer",
     "Area": "SABAH AL-SALEM",
     "Description": "صباح السالم"
    },
    {
     "Governorate": "Mubarak Al-Kabeer",
     "Area": "MESELA",
     "Description": "المسيلة"
    },
    {
     "Governorate": "Mubarak Al-Kabeer",
     "Area": "SABAHAN",
     "Description": "صبحان"
    },
    {
     "Governorate": "Mubarak Al-Kabeer",
     "Area": "ABU FATIRA",
     "Description": "أبو فطيرة"
    },
    {
     "Governorate": "Mubarak Al-Kabeer",
     "Area": "AL-MASAYEL",
     "Description": "المسايل"
    }
   ]
   
   let user = await USER.findOne({ roleId: CONST.ADMIN });

   area.forEach(async (element) => {

    let governorate = await GOVERNATE.findOne({
      title: element?.Governorate,
    });

    const payload = {
      title: element?.Area,
      description : element?.Description,
      governateId : governorate?._id,
      createdBy: user._id,
      stateId: CONST.ACTIVE,
    };

    const isExist = await AREA.findOne({
      title: payload.title,
    });

    if (isExist) {
      logger.info(`${isExist.title} Area already created`);
    } else {
      const save = await AREA(payload).save();
    }
  });

  logger.info("Successfully AREA created");
  //  process.exit();
}



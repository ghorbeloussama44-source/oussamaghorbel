/*
 * Contenu du site — Oussama Ghorbel
 * ---------------------------------
 * Pour ajouter un travail au portfolio, copier un bloc dans PROJECTS
 * et remplir au moins le français (fr). Les autres langues retombent
 * sur l'anglais puis le français si elles sont absentes.
 *
 * domains : "business" (entrepreneuriat), "textile", "it" (informatique),
 *           "research" (recherche & science) — on peut en mettre plusieurs.
 * image   : optionnelle, chemin vers assets/img/...
 * link    : optionnel, lien externe ou PDF.
 */

window.SITE_CONTENT = {
  domains: {
    business: { fr: "Entrepreneuriat", en: "Entrepreneurship", ar: "ريادة الأعمال", ru: "Предпринимательство" },
    textile:  { fr: "Textile & industrie", en: "Textile & industry", ar: "النسيج والصناعة", ru: "Текстиль и производство" },
    it:       { fr: "Informatique", en: "Software & IT", ar: "المعلوماتية", ru: "IT и разработка" },
    research: { fr: "Recherche & science", en: "Research & science", ar: "البحث والعلوم", ru: "Наука и исследования" }
  },

  PROJECTS: [
    {
      year: "2014",
      domains: ["research", "it"],
      title: {
        fr: "Reconstruction 3D d'une plante en croissance",
        en: "3D reconstruction of a growing plant",
        ar: "إعادة بناء ثلاثية الأبعاد لنبتة في طور النمو",
        ru: "3D-реконструкция растущего растения"
      },
      desc: {
        fr: "Modélisation et simulation du développement d'une branche végétale — travail de mastère en ingénierie mathématique (C++, 3D).",
        en: "Modelling and simulation of how a plant branch develops — master's research in mathematical engineering (C++, 3D).",
        ar: "نمذجة ومحاكاة تطوّر غصن نباتي — بحث ماجستير في الهندسة الرياضية (C++، ثلاثي الأبعاد).",
        ru: "Моделирование и симуляция развития ветви растения — магистерская работа по математической инженерии (C++, 3D)."
      }
    },
    {
      year: "2014",
      domains: ["business", "textile"],
      title: {
        fr: "Boutique de prêt-à-porter femme — La Marsa",
        en: "Women's fashion store — La Marsa",
        ar: "متجر ملابس نسائية — المرسى",
        ru: "Магазин женской одежды — Ла-Марса"
      },
      desc: {
        fr: "Lancement et gestion de la vente de vêtements femme au centre Carrefour La Marsa.",
        en: "Launched and ran a women's clothing retail point at the Carrefour La Marsa mall.",
        ar: "إطلاق وإدارة نقطة بيع ملابس نسائية في مركز كارفور المرسى.",
        ru: "Запуск и управление точкой продажи женской одежды в ТЦ Carrefour La Marsa."
      }
    },
    {
      year: "2013",
      domains: ["research", "it"],
      title: {
        fr: "Vision par ordinateur : détection d'objets",
        en: "Computer vision: object detection",
        ar: "الرؤية الحاسوبية: كشف الأجسام",
        ru: "Компьютерное зрение: обнаружение объектов"
      },
      desc: {
        fr: "Traitement d'image et détection automatique d'objets avec OpenCV, C++ et Matlab.",
        en: "Image processing and automatic object detection with OpenCV, C++ and Matlab.",
        ar: "معالجة الصور والكشف الآلي عن الأجسام باستخدام OpenCV وC++ وMatlab.",
        ru: "Обработка изображений и автоматическое обнаружение объектов на OpenCV, C++ и Matlab."
      }
    },
    {
      year: "2013",
      domains: ["it", "business"],
      title: {
        fr: "Application Android de suivi commercial",
        en: "Android sales-tracking app",
        ar: "تطبيق أندرويد لتتبّع المبيعات",
        ru: "Android-приложение для учёта продаж"
      },
      desc: {
        fr: "Application mobile assurant la traçabilité de la commercialisation en temps réel.",
        en: "Mobile app giving real-time traceability of sales and distribution.",
        ar: "تطبيق جوّال يضمن تتبّع عمليات التسويق في الوقت الفعلي.",
        ru: "Мобильное приложение для отслеживания продаж в реальном времени."
      }
    },
    {
      year: "2013",
      domains: ["it"],
      title: {
        fr: "Système d'information — entreprise QUEEN",
        en: "Information system — QUEEN company",
        ar: "نظام معلومات — شركة QUEEN",
        ru: "Информационная система — компания QUEEN"
      },
      desc: {
        fr: "Conception et développement du système d'information de l'entreprise, en freelance.",
        en: "Designed and built the company's information system as a freelancer.",
        ar: "تصميم وتطوير نظام المعلومات للشركة بصفة مستقلّة.",
        ru: "Проектирование и разработка информационной системы компании (фриланс)."
      }
    },
    {
      year: "2013",
      domains: ["business", "textile"],
      title: {
        fr: "Boutique de prêt-à-porter homme — Ariana",
        en: "Men's fashion store — Ariana",
        ar: "متجر ملابس رجالية — أريانة",
        ru: "Магазин мужской одежды — Ариана"
      },
      desc: {
        fr: "Vente de vêtements homme en boutique au centre de l'Ariana.",
        en: "Men's clothing retail in a store in central Ariana.",
        ar: "بيع الملابس الرجالية في متجر بوسط أريانة.",
        ru: "Продажа мужской одежды в магазине в центре Арианы."
      }
    },
    {
      year: "2012",
      domains: ["business", "textile"],
      title: {
        fr: "Vêtements de travail sur mesure",
        en: "Custom workwear",
        ar: "ملابس عمل حسب الطلب",
        ru: "Рабочая одежда на заказ"
      },
      desc: {
        fr: "Conception et vente de vêtements de travail et de dossards pour les entreprises.",
        en: "Designed and sold work uniforms and bibs for companies.",
        ar: "تصميم وبيع ملابس العمل والصدريات للمؤسسات.",
        ru: "Разработка и продажа рабочей униформы и жилетов для компаний."
      }
    },
    {
      year: "2012",
      domains: ["textile", "it"],
      title: {
        fr: "Logiciel de traçabilité et d'analyse des défauts",
        en: "Traceability & defect-analysis software",
        ar: "برنامج للتتبّع وتحليل العيوب",
        ru: "ПО для прослеживаемости и анализа дефектов"
      },
      desc: {
        fr: "Outil qui suit chaque produit et analyse les défaillances pour garantir la qualité.",
        en: "Tool that tracks each product and analyses failures to secure product quality.",
        ar: "أداة تتبّع كل منتج وتحلّل الأعطال لضمان الجودة.",
        ru: "Инструмент, который отслеживает каждое изделие и анализирует дефекты для контроля качества."
      }
    },
    {
      year: "2011",
      domains: ["textile", "it"],
      title: {
        fr: "Logiciel d'équilibrage de chaîne de montage",
        en: "Assembly-line balancing software",
        ar: "برنامج موازنة خطّ التجميع",
        ru: "ПО для балансировки сборочной линии"
      },
      desc: {
        fr: "Répartition optimale des opérations de confection entre les postes de la chaîne.",
        en: "Distributes garment operations across workstations to balance the line.",
        ar: "توزيع عمليات الخياطة على مراكز العمل لتحقيق توازن الخطّ.",
        ru: "Оптимальное распределение швейных операций между рабочими местами линии."
      }
    },
    {
      year: "2010",
      domains: ["textile", "research"],
      title: {
        fr: "Amélioration du système GPAO",
        en: "Improving the production-management system",
        ar: "تحسين نظام إدارة الإنتاج",
        ru: "Улучшение системы управления производством"
      },
      desc: {
        fr: "Projet de fin d'études d'ingénieur à la Société Tunisienne de Tricotage et Confection.",
        en: "Engineering final-year project at Société Tunisienne de Tricotage et Confection.",
        ar: "مشروع ختم الدراسات الهندسية في الشركة التونسية للتريكو والخياطة.",
        ru: "Дипломный инженерный проект в компании Société Tunisienne de Tricotage et Confection."
      }
    }
  ],

  EXPERIENCE: [
    {
      period: "2015 – 2017",
      logo: "assets/img/logo-gharieni.jpg",
      org: "German Tunisian International Manufacturing — Groupe Gharieni",
      role: { fr: "Directeur du département textile", en: "Head of Textile Department", ar: "مدير قسم النسيج", ru: "Директор текстильного департамента" }
    },
    {
      period: "2014",
      logo: "assets/img/logo-kenzalou.jpg",
      org: "Kenzalou Confection",
      role: { fr: "Directeur des opérations", en: "Chief Operating Officer", ar: "مدير العمليات", ru: "Операционный директор" }
    },
    {
      period: "2013",
      org: "QUEEN",
      role: { fr: "Développeur du système d'information (freelance)", en: "Information-system developer (freelance)", ar: "مطوّر نظام المعلومات (مستقلّ)", ru: "Разработчик информационной системы (фриланс)" }
    },
    {
      period: "2012",
      org: { fr: "Association Tunisienne de la Mode", en: "Tunisian Fashion Association", ar: "الجمعية التونسية للموضة", ru: "Тунисская ассоциация моды" },
      role: { fr: "Vice-président", en: "Vice-President", ar: "نائب الرئيس", ru: "Вице-президент" }
    },
    {
      period: "2010 – 2011",
      logo: "assets/img/logo-christine.jpg",
      org: "Christine Confection",
      role: { fr: "Responsable contrôle qualité", en: "Quality Control Manager", ar: "مسؤول مراقبة الجودة", ru: "Руководитель контроля качества" }
    },
    {
      period: "2008 – 2010",
      org: "STTC · TIB",
      role: { fr: "Stages : ouvrier, technicien, projet de fin d'études", en: "Internships: worker, technician, final-year project", ar: "تربّصات: عامل، تقني، مشروع ختم الدراسات", ru: "Стажировки: рабочий, техник, дипломный проект" }
    }
  ],

  EDUCATION: [
    {
      period: "2011 – 2014",
      logo: "assets/img/logo-ept.jpg",
      org: { fr: "École Polytechnique de Tunisie", en: "Tunisia Polytechnic School", ar: "المدرسة التونسية للتقنيات", ru: "Политехническая школа Туниса" },
      role: { fr: "Mastère en ingénierie mathématique", en: "Master's in Mathematical Engineering", ar: "ماجستير في الهندسة الرياضية", ru: "Магистратура по математической инженерии" }
    },
    {
      period: "2006 – 2010",
      logo: "assets/img/logo-enim.jpg",
      org: { fr: "École Nationale d'Ingénieurs de Monastir", en: "National Engineering School of Monastir", ar: "المدرسة الوطنية للمهندسين بالمنستير", ru: "Национальная инженерная школа Монастира" },
      role: { fr: "Diplôme national d'ingénieur textile", en: "National Diploma in Textile Engineering", ar: "الشهادة الوطنية لمهندس في النسيج", ru: "Диплом инженера-текстильщика" }
    },
    {
      period: "2004 – 2006",
      org: { fr: "Institut Préparatoire aux Études d'Ingénieurs d'El Manar", en: "El Manar Preparatory Engineering Institute", ar: "المعهد التحضيري للدراسات الهندسية بالمنار", ru: "Подготовительный инженерный институт Эль-Манар" },
      role: { fr: "Classes préparatoires physique-chimie", en: "Preparatory classes, physics & chemistry", ar: "أقسام تحضيرية، فيزياء وكيمياء", ru: "Подготовительные курсы, физика и химия" }
    },
    {
      period: "2004",
      org: { fr: "Baccalauréat", en: "Baccalaureate", ar: "البكالوريا", ru: "Бакалавриат (аттестат)" },
      role: { fr: "Baccalauréat mathématiques", en: "Baccalaureate in Mathematics", ar: "بكالوريا رياضيات", ru: "Аттестат, профиль математика" }
    }
  ],

  TRAINING: [
    { year: "2017", text: { fr: "Anglais des affaires — Business 1, 2 & 3, Amideast", en: "Business English 1, 2 & 3 — Amideast", ar: "الإنجليزية للأعمال 1 و2 و3 — أميديست", ru: "Деловой английский 1, 2 и 3 — Amideast" } },
    { year: "2016", text: { fr: "Management et motivation du personnel — Lumière Formation", en: "Staff management & motivation — Lumière Formation", ar: "إدارة الموظفين وتحفيزهم — Lumière Formation", ru: "Управление и мотивация персонала — Lumière Formation" } },
    { year: "2016", text: { fr: "Certificat « Challenge and Opportunity » — ENIM", en: "“Challenge and Opportunity” certificate — ENIM", ar: "شهادة «Challenge and Opportunity» — ENIM", ru: "Сертификат «Challenge and Opportunity» — ENIM" } },
    { year: "2012 – 2016", text: { fr: "Techniques de communication — British Council", en: "Communication techniques — British Council", ar: "تقنيات التواصل — المجلس الثقافي البريطاني", ru: "Техники коммуникации — British Council" } },
    { year: "2012", text: { fr: "Programmes entrepreneuriaux MORAINE et CEFE", en: "MORAINE and CEFE entrepreneurship programmes", ar: "برنامجا ريادة الأعمال MORAINE وCEFE", ru: "Программы предпринимательства MORAINE и CEFE" } },
    { year: "2011", text: { fr: "Lean Management", en: "Lean Management", ar: "الإدارة الرشيقة (Lean)", ru: "Бережливое управление (Lean)" } },
    { year: "2010", text: { fr: "Norme ISO 9001 version 2008", en: "ISO 9001:2008 standard", ar: "معيار ISO 9001 إصدار 2008", ru: "Стандарт ISO 9001:2008" } }
  ],

  SKILLS: [
    {
      title: { fr: "Management industriel", en: "Industrial management", ar: "الإدارة الصناعية", ru: "Управление производством" },
      items: ["Lean Management", "ISO 9001", "GPAO / ERP", { fr: "Contrôle qualité", en: "Quality control", ar: "مراقبة الجودة", ru: "Контроль качества" }, { fr: "Équilibrage de chaîne", en: "Line balancing", ar: "موازنة الخطوط", ru: "Балансировка линий" }, "Sage"]
    },
    {
      title: { fr: "Textile & CAO", en: "Textile & CAD", ar: "النسيج والتصميم بالحاسوب", ru: "Текстиль и САПР" },
      items: ["Lectra Modaris", "Lectra Diamino", "Gerber AccuMark", "Gerber PDS", { fr: "Placement & coupe", en: "Marker making & cutting", ar: "التموضع والقصّ", ru: "Раскладка и раскрой" }]
    },
    {
      title: { fr: "Développement logiciel", en: "Software development", ar: "تطوير البرمجيات", ru: "Разработка ПО" },
      items: ["C++", "Java", "Android", "PHP", "Oracle · PL/SQL", "WinDev", "Visual Basic"]
    },
    {
      title: { fr: "Data & science", en: "Data & science", ar: "البيانات والعلوم", ru: "Данные и наука" },
      items: ["Matlab", "R", "Stata", "OpenCV", { fr: "Statistiques", en: "Statistics", ar: "الإحصاء", ru: "Статистика" }, { fr: "Modélisation économique", en: "Economic modelling", ar: "النمذجة الاقتصادية", ru: "Экономическое моделирование" }]
    },
    {
      title: { fr: "3D & création", en: "3D & creative", ar: "ثلاثي الأبعاد والإبداع", ru: "3D и творчество" },
      items: ["Unity", "3ds Max", "Photoshop", { fr: "Peinture à l'huile", en: "Oil painting", ar: "الرسم الزيتي", ru: "Масляная живопись" }]
    }
  ],

  GALLERY: [
    { src: "assets/img/interzum.jpg", caption: { fr: "Salon Interzum, Cologne", en: "Interzum trade fair, Cologne", ar: "معرض إنترتسوم، كولونيا", ru: "Выставка Interzum, Кёльн" } },
    { src: "assets/img/salon-usa.jpg", caption: { fr: "Salon international", en: "International trade fair", ar: "معرض دولي", ru: "Международная выставка" } },
    { src: "assets/img/conference.jpg", caption: { fr: "Rencontres professionnelles", en: "Professional meetings", ar: "لقاءات مهنية", ru: "Деловые встречи" } },
    { src: "assets/img/salon.jpg", caption: { fr: "Événement professionnel", en: "Business event", ar: "حدث مهني", ru: "Деловое мероприятие" } },
    { src: "assets/img/porte-bleue.jpg", caption: { fr: "Photographie — portes de Tunisie", en: "Photography — doors of Tunisia", ar: "تصوير — أبواب تونس", ru: "Фотография — двери Туниса" } },
    { src: "assets/img/crepuscule.jpg", caption: { fr: "Photographie — crépuscule", en: "Photography — dusk", ar: "تصوير — الغسق", ru: "Фотография — сумерки" } },
    { src: "assets/img/porte-doree.jpg", caption: { fr: "Photographie — patrimoine", en: "Photography — heritage", ar: "تصوير — التراث", ru: "Фотография — наследие" } },
    { src: "assets/img/vigne.jpg", caption: { fr: "Photographie — lumière", en: "Photography — light", ar: "تصوير — الضوء", ru: "Фотография — свет" } }
  ]
};

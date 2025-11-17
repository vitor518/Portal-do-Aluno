const semesters = [
    {
        semester: 1,
        courses: [
            {
                title: "Circuitos Digitais",
                url: "https://www.youtube.com/playlist?list=PLXyWBo_coJnMYO9Na3t-oYsc2X4kPJBWf",
                prerequisites: "N/A"
            },
            {
                title: "Matemática Discreta",
                url: "https://www.youtube.com/watch?v=KGoSTh1sgyM&list=PL6mfjjCaO1WrEJ0JKRyXO3QjaPkJaSvAS",
                prerequisites: "N/A"
            },
            {
                title: "Linguagens de Programação",
                url: "https://www.youtube.com/watch?v=xfDdxqbkiSQ&list=PLnzT8EWpmbka4KukGR184tifzqcuq_ZDv",
                prerequisites: "N/A"
            },
            {
                title: "Introdução à Ciência da Computação com Python I",
                url: "https://youtube.com/playlist?list=PLcoJJSvnDgcKpOi_UeneTNTIVOigRQwcn&si=RT7FxhHXAYGUuYJD",
                prerequisites: "N/A"
            },
            {
                title: "Geometria Analítica",
                url: "https://www.youtube.com/watch?v=ijkDjQT7UPM&list=PL82Svt6JAgOH3M6TCELx8oegTVCriUg3L",
                prerequisites: "N/A"
            }
        ]
    },
    {
        semester: 2,
        courses: [
            {
                title: "Cálculo I",
                url: "https://www.youtube.com/watch?v=WgHUHPlJETs&list=PLAudUnJeNg4tr-aiNyYCXE46L3qEZ2Nzx",
                prerequisites: "Geometria Analítica"
            },
            {
                title: "Álgebra Linear I",
                url: "https://www.youtube.com/playlist?list=PLIEzh1OveCVczEZAjhVIVd7Qs-X8ILgnI",
                prerequisites: "Geometria Analítica"
            },
            {
                title: "Estruturas de Dados",
                url: "https://www.youtube.com/watch?v=0hT3EKGhbpI&list=PLndfcZyvAqbofQl2kLLdeWWjCcPlOPnrW",
                prerequisites: "Matemática Discreta, Python I"
            },
            {
                title: "Introdução à Ciência da Computação com Python II",
                url: "https://youtube.com/playlist?list=PLcoJJSvnDgcKpOi_UeneTNTIVOigRQwcn&si=RT7FxhHXAYGUuYJD",
                prerequisites: "Python I"
            },
            {
                title: "Laboratório de Programação Orientada a Objetos I",
                url: "https://www.youtube.com/playlist?list=PLTeQ2u81sjqfsFNWrUCIoqJZBSJrai8M7",
                prerequisites: "Python I"
            }
        ]
    },
    {
        semester: 3,
        courses: [
            {
                title: "Algoritmos em Grafos",
                url: "https://www.youtube.com/watch?v=fjOiu6CD5pc&list=PLrPn-zKAOzUzKdPqFNF52g-i9p1f-vmsk",
                prerequisites: "Estruturas de Dados"
            },
            {
                title: "Arquitetura de Computadores I",
                url: "https://www.youtube.com/playlist?list=PLEUHFTHcrJmswfeq7QEHskgkT6HER3gK6",
                prerequisites: "Circuitos Digitais"
            },
            {
                title: "Probabilidade e Estatística",
                url: "https://www.youtube.com/watch?v=snXf8YT7L3U&list=PLrOyM49ctTx8HWnxWRBtKrfcuf7ew_3nm",
                prerequisites: "Cálculo I"
            },
            {
                title: "Cálculo II",
                url: "https://www.youtube.com/watch?v=lQdzRBRL9Tw&list=PLAudUnJeNg4sd0TEJ9EG6hr-3d3jqrddN",
                prerequisites: "Cálculo I"
            },
            {
                title: "Programação Funcional em Haskell",
                url: "https://www.youtube.com/watch?v=eTisiy5FB7k&list=PLYItvall0TqJ25sVTLcMhxsE0Hci58mpQ&index=1",
                prerequisites: "N/A"
            }
        ]
    },
    {
        semester: 4,
        courses: [
            {
                title: "Análise de Algoritmos",
                url: "https://www.youtube.com/watch?v=_HBTCUNPxOg&list=PLncEdvQ20-mgGanwuFczm-4IwIdIcIiha",
                prerequisites: "Algoritmos em Grafos"
            },
            {
                title: "Métodos Numéricos I",
                url: "https://www.youtube.com/watch?v=a6nNQ6qKgiY&list=PLI9WiBCz67cPTTRER4CrsN0wpRN-NmjGA",
                prerequisites: "Python I, Cálculo I"
            },
            {
                title: "Banco de Dados",
                url: "https://www.youtube.com/watch?v=pmAxIs5U1KI&list=PLxI8Can9yAHeHQr2McJ01e-ANyh3K0Lfq",
                prerequisites: "N/A"
            },
            {
                title: "Arquitetura de Computadores II",
                url: "https://www.youtube.com/playlist?list=PLEUHFTHcrJmsqKX-GDD-hBvkF8h2_BfKJ",
                prerequisites: "Python II, Arq. Comp. I"
            },
            {
                title: "Programação Lógica",
                url: "https://youtube.com/playlist?list=PLZ-Bk6jzsb-OScKa7vhpcQXoU2uxYGaFx&si=Y52_w6CQPYEE2fLN",
                prerequisites: "N/A"
            }
        ]
    },
    {
        semester: 5,
        courses: [
            {
                title: "Redes de Computadores",
                url: "https://www.youtube.com/playlist?list=PLvHXLbw-JSPfKp65psX5C9tyNLHHC4uoR",
                prerequisites: "N/A"
            },
            {
                title: "Introdução à Engenharia de Software",
                url: "https://www.youtube.com/watch?v=h_hEI1Kfm2U&list=PLhBaeEzs3d7lsn_Mq2n3R4_api16Wkp1Q",
                prerequisites: "Python II"
            },
            {
                title: "Sistemas Operacionais",
                url: "https://www.youtube.com/watch?v=EGn8fOf7zE0&list=PLSmh8AKk_aUn9HxFs5FnjQupdQnV56MXV",
                prerequisites: "Arq. Comp. II"
            },
            {
                title: "Programação Matemática",
                url: "https://www.youtube.com/watch?v=8rrgnFCL9LM&list=PL2peXovwG2kuqXC6sECjFSiG-MT1yXMQ-",
                prerequisites: "Álgebra Linear I"
            },
            {
                title: "Fundamentos de Computação Gráfica",
                url: "https://www.youtube.com/watch?v=AVSAesOiKYY&list=PLE51fUFkeIwLXwe4rvG4EMgw7zgjP-tDx",
                prerequisites: "Geometria Analítica"
            }
        ]
    },
    {
        semester: 6,
        courses: [
            {
                title: "Linguagens Formais e Autômatos",
                url: "https://www.youtube.com/watch?v=4zMwOozUt9U&list=PLncEdvQ20-mhD_qMeLHtLnA3XDT1Fr_k4&pp=iAQB",
                prerequisites: "Matemática Discreta"
            },
            {
                title: "Inteligência Artificial",
                url: "https://www.youtube.com/watch?v=-T3zDFxngf4&list=PLeejGOroKw_txh7j7S3etF5eudI2WvMx0",
                prerequisites: "Estruturas de Dados, Prob. e Estatística"
            },
            {
                title: "Sistemas Distribuídos",
                url: "https://www.youtube.com/watch?v=TEEy5f46h_Q&list=PLP0bYj2MTFcuXa4-EbBKhvehr-rkxpeR8&index=1",
                prerequisites: "Redes de Computadores"
            },
            {
                title: "Teoria dos Grafos",
                url: "https://www.youtube.com/watch?v=kfHqZLYHfHU&list=PLndfcZyvAqbr2MLCOLEvBNX6FgD8UNWfX",
                prerequisites: "Matemática Discreta"
            },
            {
                title: "Cálculo III",
                url: "https://www.youtube.com/watch?v=8mBTfk7s63s&list=PLAudUnJeNg4ugGUJo52dtgFZ_tCm1Ds5W",
                prerequisites: "Cálculo II"
            }
        ]
    },
    {
        semester: 7,
        courses: [
            {
                title: "Teoria da Computação",
                url: "https://www.youtube.com/watch?v=dWRxL30aoes&list=PLYLYA7XrlskNgCeSpJf9PQHHb8Z4WpRm4",
                prerequisites: "Linguagens Formais e Autômatos"
            },
            {
                title: "Deep Learning",
                url: "https://www.youtube.com/watch?v=0VD_2t6EdS4&list=PL9At2PVRU0ZqVArhU9QMyI3jSe113_m2-",
                prerequisites: "Inteligência Artificial"
            },
            {
                title: "Compiladores",
                url: "https://youtube.com/playlist?list=PLX6Nyaq0ebfhI396WlWN6WlBm-tp7vDtV&si=LoaU9lzLMuSVikgi",
                prerequisites: "Estruturas de Dados, Teoria dos Grafos"
            },
            {
                title: "Computação Quantica",
                url: "https://youtube.com/playlist?list=PLUFcRbu9t-v4peHdmDy4rtG3EnbZNS86R&si=hLYHhS2BTKRgNwMJ",
                prerequisites: "Cálculo III, Arq. Comp. II"
            },
            {
                title: "Metodologia da Pesquisa",
                url: "https://youtube.com/playlist?list=PLclUQno6PMpQO0-XrDwWsPzRzEvjwp1__&si=0dXojlZV5EisMB6s",
                prerequisites: "N/A"
            }
        ]
    }
];

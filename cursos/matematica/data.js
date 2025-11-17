const semesters = [
    {
        semester: 1,
        courses: [
            {
                title: "Fundamentos de Matemática",
                url: "https://www.youtube.com/playlist?list=PLAudUnJeNg4ugGUJo52dtgFZ_tCm1Ds5W",
                prerequisites: "N/A"
            },
            {
                title: "Pré-Cálculo",
                url: "https://www.youtube.com/playlist?list=PLxI8Can9yAHeqNgs3o5Jms5LYLT-vcNKM",
                prerequisites: "N/A"
            },
            {
                title: "Álgebra Linear I",
                url: "https://www.youtube.com/playlist?list=PLIEzh1OveCVczEZAjhVIVd7Qs-X8ILgnI",
                prerequisites: "N/A"
            },
            {
                title: "Geometria Analítica",
                url: "https://www.youtube.com/playlist?list=PL82Svt6JAgOH3M6TCELx8oegTVCriUg3L",
                prerequisites: "N/A"
            }
        ]
    },
    {
        semester: 2,
        courses: [
            {
                title: "Cálculo I",
                url: "https://www.youtube.com/playlist?list=PLAudUnJeNg4tr-aiNyYCXE46L3qEZ2Nzx",
                prerequisites: "Pré-Cálculo"
            },
            {
                title: "Álgebra Linear II",
                url: "https://www.youtube.com/playlist?list=PLIEzh1OveCVczEZAjhVIVd7Qs-X8ILgnI",
                prerequisites: "Álgebra Linear I"
            },
            {
                title: "Matemática Discreta",
                url: "https://www.youtube.com/playlist?list=PL6mfjjCaO1WrEJ0JKRyXO3QjaPkJaSvAS",
                prerequisites: "N/A"
            },
            {
                title: "Introdução à Lógica",
                url: "https://www.youtube.com/playlist?list=PLxI8Can9yAHeCvSI1eCAU_cKcOX4f67PF",
                prerequisites: "N/A"
            }
        ]
    },
    {
        semester: 3,
        courses: [
            {
                title: "Cálculo II",
                url: "https://www.youtube.com/playlist?list=PLAudUnJeNg4sd0TEJ9EG6hr-3d3jqrddN",
                prerequisites: "Cálculo I"
            },
            {
                title: "Equações Diferenciais Ordinárias",
                url: "https://www.youtube.com/playlist?list=PLxI8Can9yAHdKJw-7GhCJIm8w1Qjo7xzF",
                prerequisites: "Cálculo II"
            },
            {
                title: "Probabilidade e Estatística",
                url: "https://www.youtube.com/playlist?list=PLrOyM49ctTx8HWnxWRBtKrfcuf7ew_3nm",
                prerequisites: "Cálculo I"
            },
            {
                title: "Teoria dos Números",
                url: "https://www.youtube.com/playlist?list=PLxI8Can9yAHcAz2Yqj3b-S4dWWcSKSUhi",
                prerequisites: "Matemática Discreta"
            }
        ]
    },
    {
        semester: 4,
        courses: [
            {
                title: "Cálculo III",
                url: "https://www.youtube.com/playlist?list=PLAudUnJeNg4ugGUJo52dtgFZ_tCm1Ds5W",
                prerequisites: "Cálculo II"
            },
            {
                title: "Análise Real I",
                url: "https://www.youtube.com/playlist?list=PLo4jXE-LdDTTOLSTC7Rh0B8LJb8K6-UOx",
                prerequisites: "Cálculo III"
            },
            {
                title: "Álgebra Abstrata",
                url: "https://www.youtube.com/playlist?list=PLxI8Can9yAHd3Y_zzFW56jTG9g7E2gRk1",
                prerequisites: "Álgebra Linear II"
            },
            {
                title: "Métodos Numéricos",
                url: "https://www.youtube.com/playlist?list=PLI9WiBCz67cPTTRER4CrsN0wpRN-NmjGA",
                prerequisites: "Cálculo II, Álgebra Linear II"
            }
        ]
    },
    {
        semester: 5,
        courses: [
            {
                title: "Topologia",
                url: "https://www.youtube.com/playlist?list=PLo4jXE-LdDTSw57bHD5FIqLo5lqBNGGCQ",
                prerequisites: "Análise Real I"
            },
            {
                title: "Análise Complexa",
                url: "https://www.youtube.com/playlist?list=PLo4jXE-LdDTQbzEk1FeaQABH_dXRWbOvT",
                prerequisites: "Cálculo III"
            },
            {
                title: "Geometria Diferencial",
                url: "https://www.youtube.com/playlist?list=PLo4jXE-LdDTS8DGQV1Yt7FMhYbR8FcQqX",
                prerequisites: "Cálculo III, Álgebra Linear II"
            },
            {
                title: "Otimização",
                url: "https://www.youtube.com/playlist?list=PLo4jXE-LdDTTcCuH_yx6Ey4oHIYU6PKRP",
                prerequisites: "Cálculo II"
            }
        ]
    },
    {
        semester: 6,
        courses: [
            {
                title: "Análise Funcional",
                url: "https://www.youtube.com/playlist?list=PLo4jXE-LdDTTDCl08R-THTqBrQz0bTEEt",
                prerequisites: "Topologia"
            },
            {
                title: "Teoria da Medida",
                url: "https://www.youtube.com/playlist?list=PLo4jXE-LdDTRybuUq1uu7H6M6IZKqA6b1",
                prerequisites: "Análise Real I"
            },
            {
                title: "Equações Diferenciais Parciais",
                url: "https://www.youtube.com/playlist?list=PLo4jXE-LdDTRu5yxMXNlS1gUvZs1uW8ch",
                prerequisites: "Equações Diferenciais Ordinárias"
            },
            {
                title: "Matemática Aplicada",
                url: "https://www.youtube.com/playlist?list=PLo4jXE-LdDTSI0V5kWVu_CxhHckTYUZeQ",
                prerequisites: "Métodos Numéricos"
            }
        ]
    }
];

const badges = [
    "Iniciante em Matemática",
    "Explorador do Cálculo",
    "Mestre da Álgebra",
    "Analista Matemático",
    "Topólogo",
    "Matemático Completo"
];

const initialData = {
    stades: [
        { id: 1, nom: "Complexe Moulay Abdellah", ville: "Rabat", capacite: 53000, etat: "Operationnel" },
        { id: 2, nom: "Stade Mohammed V", ville: "Casablanca", capacite: 45000, etat: "Operationnel" },
        { id: 3, nom: "Ibn Batouta", ville: "Tanger", capacite: 65000, etat: "Operationnel" },
        { id: 4, nom: "Grand Stade de Marrakech", ville: "Marrakech", capacite: 45000, etat: "Operationnel" },
        { id: 5, nom: "Grand Stade d'Agadir", ville: "Agadir", capacite: 45000, etat: "Operationnel" },
        { id: 6, nom: "Complexe Sportif de Fès", ville: "Fes", capacite: 45000, etat: "Operationnel" }
    ],
    equipes: [
        { id: 1, pays: "Maroc", groupe: "A", points: 3, coach: "Walid Regragui", image: "https://flagcdn.com/w160/ma.png" },
        { id: 2, pays: "Mali", groupe: "A", points: 1, coach: "Tom Saintfiet", image: "https://flagcdn.com/w160/ml.png" },
        { id: 3, pays: "Zambie", groupe: "A", points: 1, coach: "Avram Grant", image: "https://flagcdn.com/w160/zm.png" },
        { id: 4, pays: "Comores", groupe: "A", points: 0, coach: "Stefano Cusin", image: "https://flagcdn.com/w160/km.png" },
        { id: 5, pays: "Egypte", groupe: "B", points: 3, coach: "Hossam Hassan", image: "https://flagcdn.com/w160/eg.png" },
        { id: 6, pays: "Afrique du Sud", groupe: "B", points: 1, coach: "Hugo Broos", image: "https://flagcdn.com/w160/za.png" },
        { id: 7, pays: "Angola", groupe: "B", points: 1, coach: "Pedro Gonçalves", image: "https://flagcdn.com/w160/ao.png" },
        { id: 8, pays: "Zimbabwe", groupe: "B", points: 0, coach: "M. Marinica", image: "https://flagcdn.com/w160/zw.png" },
        { id: 9, pays: "Nigeria", groupe: "C", points: 0, coach: "Eric Chelle", image: "https://flagcdn.com/w160/ng.png" },
        { id: 10, pays: "Tunisie", groupe: "C", points: 0, coach: "Sami Trabelsi", image: "https://flagcdn.com/w160/tn.png" },
        { id: 11, pays: "Ouganda", groupe: "C", points: 0, coach: "Paul Put", image: "https://flagcdn.com/w160/ug.png" },
        { id: 12, pays: "Tanzanie", groupe: "C", points: 0, coach: "Hemed Suleiman", image: "https://flagcdn.com/w160/tz.png" },
        { id: 13, pays: "Senegal", groupe: "D", points: 3, coach: "Pape Thiaw", image: "https://flagcdn.com/w160/sn.png" },
        { id: 14, pays: "RDC", groupe: "D", points: 0, coach: "Sébastien Desabre", image: "https://flagcdn.com/w160/cd.png" },
        { id: 15, pays: "Benin", groupe: "D", points: 0, coach: "Gernot Rohr", image: "https://flagcdn.com/w160/bj.png" },
        { id: 16, pays: "Botswana", groupe: "D", points: 0, coach: "Didier Gomes", image: "https://flagcdn.com/w160/bw.png" },
        { id: 17, pays: "Algerie", groupe: "E", points: 0, coach: "Vladimir Petkovic", image: "https://flagcdn.com/w160/dz.png" },
        { id: 18, pays: "Burkina Faso", groupe: "E", points: 0, coach: "Brama Traoré", image: "https://flagcdn.com/w160/bf.png" },
        { id: 19, pays: "Guinee Equatoriale", groupe: "E", points: 0, coach: "Juan Micha", image: "https://flagcdn.com/w160/gq.png" },
        { id: 20, pays: "Soudan", groupe: "E", points: 0, coach: "Kwesi Appiah", image: "https://flagcdn.com/w160/sd.png" },
        { id: 21, pays: "Cote d'Ivoire", groupe: "F", points: 0, coach: "Emerse Fae", image: "https://flagcdn.com/w160/ci.png" },
        { id: 22, pays: "Cameroun", groupe: "F", points: 0, coach: "Marc Brys", image: "https://flagcdn.com/w160/cm.png" },
        { id: 23, pays: "Gabon", groupe: "F", points: 0, coach: "T. Mouyouma", image: "https://flagcdn.com/w160/ga.png" },
        { id: 24, pays: "Mozambique", groupe: "F", points: 0, coach: "Chiquinho Conde", image: "https://flagcdn.com/w160/mz.png" }
    ],
    joueurs: [
        { id: 1, nom: "Achraf Hakimi", equipe: "Maroc", poste: "Defenseur", buts: 1 },
        { id: 2, nom: "Brahim Diaz", equipe: "Maroc", poste: "Attaquant", buts: 0 },
        { id: 3, nom: "Yassine Bounou", equipe: "Maroc", poste: "Gardien", buts: 0 },
        { id: 4, nom: "Youssef En-Nesyri", equipe: "Maroc", poste: "Attaquant", buts: 1 },
        { id: 5, nom: "Nayef Aguerd", equipe: "Maroc", poste: "Defenseur", buts: 0 },
        { id: 6, nom: "Yves Bissouma", equipe: "Mali", poste: "Milieu", buts: 0 },
        { id: 7, nom: "Hamari Traore", equipe: "Mali", poste: "Defenseur", buts: 0 },
        { id: 8, nom: "Lassine Sinayoko", equipe: "Mali", poste: "Attaquant", buts: 1 },
        { id: 9, nom: "Patson Daka", equipe: "Zambie", poste: "Attaquant", buts: 1 },
        { id: 10, nom: "Stoppila Sunzu", equipe: "Zambie", poste: "Defenseur", buts: 0 },
        { id: 11, nom: "Myziane Maolida", equipe: "Comores", poste: "Attaquant", buts: 0 },
        { id: 12, nom: "Youssouf M'Changama", equipe: "Comores", poste: "Milieu", buts: 0 },
        { id: 13, nom: "Mohamed Salah", equipe: "Egypte", poste: "Attaquant", buts: 1 },
        { id: 14, nom: "Trezeguet", equipe: "Egypte", poste: "Attaquant", buts: 0 },
        { id: 15, nom: "Percy Tau", equipe: "Afrique du Sud", poste: "Attaquant", buts: 1 },
        { id: 16, nom: "Ronwen Williams", equipe: "Afrique du Sud", poste: "Gardien", buts: 0 },
        { id: 17, nom: "Gelson Dala", equipe: "Angola", poste: "Attaquant", buts: 1 },
        { id: 18, nom: "Mabululu", equipe: "Angola", poste: "Attaquant", buts: 1 },
        { id: 19, nom: "Khama Billiat", equipe: "Zimbabwe", poste: "Attaquant", buts: 0 },
        { id: 20, nom: "Victor Osimhen", equipe: "Nigeria", poste: "Attaquant", buts: 0 },
        { id: 21, nom: "Ademola Lookman", equipe: "Nigeria", poste: "Attaquant", buts: 0 },
        { id: 22, nom: "Youssef Msakni", equipe: "Tunisie", poste: "Attaquant", buts: 0 },
        { id: 23, nom: "Ellyes Skhiri", equipe: "Tunisie", poste: "Milieu", buts: 0 },
        { id: 24, nom: "Sadio Mane", equipe: "Senegal", poste: "Attaquant", buts: 1 },
        { id: 25, nom: "Lamine Camara", equipe: "Senegal", poste: "Milieu", buts: 1 },
        { id: 26, nom: "Yoane Wissa", equipe: "RDC", poste: "Attaquant", buts: 0 },
        { id: 27, nom: "Chancel Mbemba", equipe: "RDC", poste: "Defenseur", buts: 0 },
        { id: 28, nom: "Steve Mounie", equipe: "Benin", poste: "Attaquant", buts: 0 },
        { id: 29, nom: "Riyad Mahrez", equipe: "Algerie", poste: "Attaquant", buts: 0 },
        { id: 30, nom: "Baghdad Bounedjah", equipe: "Algerie", poste: "Attaquant", buts: 0 },
        { id: 31, nom: "Bertrand Traore", equipe: "Burkina Faso", poste: "Attaquant", buts: 0 },
        { id: 32, nom: "Sebastien Haller", equipe: "Cote d'Ivoire", poste: "Attaquant", buts: 0 },
        { id: 33, nom: "Franck Kessie", equipe: "Cote d'Ivoire", poste: "Milieu", buts: 0 },
        { id: 34, nom: "Vincent Aboubakar", equipe: "Cameroun", poste: "Attaquant", buts: 0 },
        { id: 35, nom: "Andre Onana", equipe: "Cameroun", poste: "Gardien", buts: 0 },
        { id: 36, nom: "Pierre-Emerick Aubameyang", equipe: "Gabon", poste: "Attaquant", buts: 0 },
        { id: 37, nom: "Denis Bouanga", equipe: "Gabon", poste: "Attaquant", buts: 0 },
        { id: 38, nom: "Geny Catamo", equipe: "Mozambique", poste: "Attaquant", buts: 0 }
    ],
    matchs: [
        { id: 1, date: "2025-12-21", stade: "Complexe Moulay Abdellah", equipeA: "Maroc", equipeB: "Comores", prix: 500, statut: "Termine", score: "2 - 0" },
        { id: 2, date: "2025-12-22", stade: "Stade Mohammed V", equipeA: "Mali", equipeB: "Zambie", prix: 300, statut: "Termine", score: "1 - 1" },
        { id: 3, date: "2025-12-22", stade: "Grand Stade d'Agadir", equipeA: "Egypte", equipeB: "Zimbabwe", prix: 400, statut: "Termine", score: "1 - 0" },
        { id: 4, date: "2025-12-22", stade: "Grand Stade de Marrakech", equipeA: "Afrique du Sud", equipeB: "Angola", prix: 350, statut: "Termine", score: "2 - 2" },
        { id: 5, date: "2025-12-23", stade: "Complexe Sportif de Fès", equipeA: "Nigeria", equipeB: "Tanzanie", prix: 450, statut: "En_cours", score: "0 - 0" },
        { id: 6, date: "2025-12-23", stade: "Complexe Moulay Abdellah", equipeA: "Tunisie", equipeB: "Ouganda", prix: 400, statut: "A_venir", score: "-" },
        { id: 7, date: "2025-12-23", stade: "Ibn Batouta", equipeA: "Senegal", equipeB: "Botswana", prix: 400, statut: "Termine", score: "2 - 0" },
        { id: 8, date: "2025-12-23", stade: "Ibn Batouta", equipeA: "RDC", equipeB: "Benin", prix: 300, statut: "En_cours", score: "0 - 0" },
        { id: 9, date: "2025-12-24", stade: "Complexe Moulay Abdellah", equipeA: "Algerie", equipeB: "Soudan", prix: 350, statut: "A_venir", score: "-" },
        { id: 10, date: "2025-12-24", stade: "Complexe Moulay Abdellah", equipeA: "Burkina Faso", equipeB: "Guinee Equatoriale", prix: 300, statut: "A_venir", score: "-" },
        { id: 11, date: "2025-12-24", stade: "Grand Stade de Marrakech", equipeA: "Cote d'Ivoire", equipeB: "Mozambique", prix: 500, statut: "A_venir", score: "-" },
        { id: 12, date: "2025-12-24", stade: "Grand Stade d'Agadir", equipeA: "Cameroun", equipeB: "Gabon", prix: 450, statut: "A_venir", score: "-" },
        { id: 13, date: "2025-12-26", stade: "Complexe Moulay Abdellah", equipeA: "Maroc", equipeB: "Zambie", prix: 600, statut: "A_venir", score: "-" },
        { id: 14, date: "2025-12-26", stade: "Stade Mohammed V", equipeA: "Mali", equipeB: "Comores", prix: 300, statut: "A_venir", score: "-" },
        { id: 15, date: "2025-12-27", stade: "Grand Stade d'Agadir", equipeA: "Egypte", equipeB: "Angola", prix: 500, statut: "A_venir", score: "-" },
        { id: 16, date: "2025-12-27", stade: "Grand Stade de Marrakech", equipeA: "Afrique du Sud", equipeB: "Zimbabwe", prix: 300, statut: "A_venir", score: "-" },
        { id: 17, date: "2025-12-28", stade: "Complexe Sportif de Fès", equipeA: "Nigeria", equipeB: "Ouganda", prix: 550, statut: "A_venir", score: "-" },
        { id: 18, date: "2025-12-28", stade: "Complexe Moulay Abdellah", equipeA: "Tunisie", equipeB: "Tanzanie", prix: 350, statut: "A_venir", score: "-" }
    ],
    billets: [
        { id: 1, match: "Maroc vs Comores", client: "Karim Benani", phone: "0600000000", categorie: "VIP", prix: 1000, statut: "Vendu" },
        { id: 2, match: "Maroc vs Comores", client: "Sara Idrissi", phone: "0611111111", categorie: "Standard", prix: 500, statut: "Vendu" },
        { id: 3, match: "Senegal vs Botswana", client: "Mamadou Diop", phone: "0622222222", categorie: "Standard", prix: 400, statut: "Vendu" }
    ]
};

(function initData() {
    for (const [key, value] of Object.entries(initialData)) {
        if (!localStorage.getItem('db_' + key)) {
            localStorage.setItem('db_' + key, JSON.stringify(value));
        }
    }
})();
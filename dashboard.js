class DashboardApp {
    constructor() {
        this.user = JSON.parse(localStorage.getItem('userSession'));
        this.lang = localStorage.getItem('appLang') || 'fr';
        this.currentEntity = null;
        this.currentPage = 1;
        this.itemsPerPage = 5;
        this.sortCol = null;
        this.sortAsc = true;
        this.activeFilters = {};
        this.debounceTimer = null;
        this.init();
    }
    init() {
        if (!this.user) window.location.href = 'index.html';
        document.getElementById('user-name').innerText = this.user.name;
        document.getElementById('user-role').innerText = this.user.role === 'admin' ? 'Admin' : 'Fan';
        if (localStorage.getItem('theme') === 'dark') document.body.classList.add('dark-mode');
        document.getElementById('theme-btn').addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            localStorage.setItem('theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
        });
        document.querySelector("#btn-menu").addEventListener("click", () => document.querySelector(".sidebar").classList.toggle("close"));
        document.getElementById('log_out').addEventListener('click', () => {
            localStorage.removeItem('userSession');
            localStorage.removeItem('currentPage');
            window.location.href = 'index.html';
        });
        this.setLang(this.lang);
        const savedPage = localStorage.getItem('currentPage');
        if (savedPage) { this.router(savedPage); } else { this.router('home'); }
    }
    setLang(lang) {
        this.lang = lang;
        localStorage.setItem('appLang', lang);
        document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
        const texts = this.translations[lang];
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (texts[key]) el.innerHTML = texts[key];
        });
        document.querySelectorAll('.lang-switch-dash span').forEach(s => s.classList.remove('active'));
        if (document.getElementById('d-btn-' + lang)) document.getElementById('d-btn-' + lang).classList.add('active');
        const searchInput = document.getElementById('searchInput');
        if (searchInput) searchInput.placeholder = texts.search;
        this.updateTitle();
        if (this.currentEntity) this.renderCRUD(this.currentEntity);
        else this.renderDashboard();
    }
    updateTitle() {
        const key = this.currentEntity ? 'nav' + this.currentEntity.charAt(0).toUpperCase() + this.currentEntity.slice(1) : 'navDash';
        const el = document.querySelector('.top-nav .text');
        el.setAttribute('data-i18n', key);
        el.innerText = this.translations[this.lang][key];
    }
    router(page) {
        localStorage.setItem('currentPage', page);
        this.activeFilters = {};
        document.querySelectorAll('.nav-list a').forEach(a => a.classList.remove('active'));
        const activeLink = Array.from(document.querySelectorAll('.nav-list a')).find(l => l.getAttribute('onclick').includes(page));
        if (activeLink) activeLink.classList.add('active');
        this.currentEntity = page === 'home' ? null : page;
        this.currentPage = 1;
        if (page === 'home') this.renderDashboard();
        else this.renderCRUD(page);
        this.updateTitle();
    }
    renderDashboard() {
        const t = this.translations[this.lang];
        const db = this.getDb();
        const isAdmin = this.user.role === 'admin';
        const container = document.getElementById('main-container');

        let kpiValue, kpiLabel;
        if (isAdmin) {
            kpiValue = db.billets.reduce((acc, b) => b.statut === 'Vendu' ? acc + parseInt(b.prix) : acc, 0) + " DH";
            kpiLabel = t.kpiRev;
        } else {
            const myBills = db.billets.filter(b => b.client === this.user.name && b.statut === 'Vendu');
            kpiValue = myBills.reduce((acc, b) => acc + parseInt(b.prix), 0) + " DH";
            kpiLabel = t.kpiSpend;
        }
        const ticketCount = isAdmin ? db.billets.length : db.billets.filter(b => b.client === this.user.name).length;

        container.innerHTML = `<div class="cardBox" style="grid-template-columns: repeat(3, 1fr);">
            <div class="card"><div><div class="numbers">${db.stades.length}</div><div class="cardName" data-i18n="kpiStades">${t.kpiStades}</div></div><div class="iconBx"><i class="fa-solid fa-building"></i></div></div>
            <div class="card"><div><div class="numbers">${db.equipes.length}</div><div class="cardName" data-i18n="kpiTeams">${t.kpiTeams}</div></div><div class="iconBx"><i class="fa-solid fa-flag"></i></div></div>
            <div class="card"><div><div class="numbers">${db.matchs.length}</div><div class="cardName" data-i18n="kpiMatchs">${t.kpiMatchs}</div></div><div class="iconBx"><i class="fa-regular fa-futbol"></i></div></div>
            <div class="card"><div><div class="numbers">${ticketCount}</div><div class="cardName" data-i18n="kpiTickets">${t.kpiTickets}</div></div><div class="iconBx"><i class="fa-solid fa-ticket"></i></div></div>
            <div class="card"><div><div class="numbers">${kpiValue}</div><div class="cardName" data-i18n="kpiRev">${kpiLabel}</div></div><div class="iconBx"><i class="fa-solid fa-money-bill"></i></div></div>
            <div class="card"><div><div class="numbers">${db.joueurs.length}</div><div class="cardName" data-i18n="navJoueurs">${t.navJoueurs}</div></div><div class="iconBx"><i class="fa-solid fa-users"></i></div></div>
        </div>
        <div class="graphBox" style="grid-template-columns: 1fr 1fr; grid-gap:20px;">
            <div class="box"><canvas id="c1"></canvas></div><div class="box"><canvas id="c2"></canvas></div><div class="box"><canvas id="c4"></canvas></div><div class="box"><canvas id="c5"></canvas></div><div class="box" style="grid-column: span 2"><canvas id="c3"></canvas></div>
        </div>`;

        setTimeout(() => {
            const op = db.stades.filter(s => s.etat === 'Operationnel').length;
            const cons = db.stades.filter(s => s.etat === 'En_construction').length;
            const ren = db.stades.filter(s => s.etat === 'Renovation').length;

            if (isAdmin) {
                new Chart(document.getElementById('c1'), { type: 'doughnut', data: { labels: [this.translate('Operationnel'), this.translate('En_construction'), this.translate('Renovation')], datasets: [{ data: [op, cons, ren], backgroundColor: ['#006233', '#C1272D', '#D4AF37'] }] }, options: { plugins: { title: { display: true, text: t.chartStades } } } });
                new Chart(document.getElementById('c2'), { type: 'bar', data: { labels: db.equipes.map(e => this.translate(e.pays)), datasets: [{ label: 'Pts', data: db.equipes.map(e => e.points), backgroundColor: '#006233' }] }, options: { plugins: { title: { display: true, text: t.chartEquipes } } } });
                new Chart(document.getElementById('c4'), { type: 'line', data: { labels: db.stades.map(s => this.translate(s.ville)), datasets: [{ label: t.kpiCap, data: db.stades.map(s => s.capacite), borderColor: '#D4AF37', fill: false }] }, options: { plugins: { title: { display: true, text: t.chartCap } } } });
                const sold = db.billets.filter(b => b.statut === 'Vendu').length;
                const res = db.billets.filter(b => b.statut === 'Reserve').length;
                new Chart(document.getElementById('c5'), { type: 'pie', data: { labels: [this.translate('Vendu'), this.translate('Reserve')], datasets: [{ data: [sold, res], backgroundColor: ['#27ae60', '#e67e22'] }] }, options: { plugins: { title: { display: true, text: t.chartTickets } } } });
            } else {
                const myBills = db.billets.filter(b => b.client === this.user.name);
                const standard = myBills.filter(b => b.categorie === 'Standard').length;
                const vip = myBills.filter(b => b.categorie === 'VIP').length;
                new Chart(document.getElementById('c1'), { type: 'pie', data: { labels: ['Standard', 'VIP'], datasets: [{ data: [standard, vip], backgroundColor: ['#006233', '#D4AF37'] }] }, options: { plugins: { title: { display: true, text: t.myCat } } } });
                new Chart(document.getElementById('c2'), { type: 'bar', data: { labels: db.equipes.map(e => this.translate(e.pays)), datasets: [{ label: 'Pts', data: db.equipes.map(e => e.points), backgroundColor: '#006233' }] }, options: { plugins: { title: { display: true, text: t.chartEquipes } } } });
                new Chart(document.getElementById('c4'), { type: 'doughnut', data: { labels: [this.translate('Vendu'), this.translate('Reserve')], datasets: [{ data: [myBills.filter(b => b.statut === 'Vendu').length, myBills.filter(b => b.statut === 'Reserve').length], backgroundColor: ['#27ae60', '#e67e22'] }] }, options: { plugins: { title: { display: true, text: t.myStatus } } } });
                new Chart(document.getElementById('c5'), { type: 'line', data: { labels: db.stades.map(s => this.translate(s.ville)), datasets: [{ label: t.kpiCap, data: db.stades.map(s => s.capacite), borderColor: '#D4AF37', fill: false }] }, options: { plugins: { title: { display: true, text: t.chartCap } } } });
            }
            const topJ = db.joueurs.sort((a, b) => b.buts - a.buts).slice(0, 5);
            new Chart(document.getElementById('c3'), { type: 'polarArea', data: { labels: topJ.map(j => this.translate(j.nom)), datasets: [{ data: topJ.map(j => j.buts), backgroundColor: ['#006233', '#C1272D', '#D4AF37', '#333', '#888'] }] }, options: { plugins: { title: { display: true, text: t.chartGoals } } } });
        }, 100);
    }
    renderCRUD(entity) {
        const config = this.entityConfig[entity];
        let data = JSON.parse(localStorage.getItem('db_' + entity)) || [];
        const t = this.translations[this.lang];
        const isAdmin = this.user.role === 'admin';
        const isUser = this.user.role === 'user';
        if (entity === 'billets' && isUser) data = data.filter(i => i.client === this.user.name);

        const searchInput = document.getElementById('searchInput');
        const searchVal = searchInput ? searchInput.value.toUpperCase() : '';
        if (searchVal) data = data.filter(row => Object.values(row).some(val => String(this.translate(val)).toUpperCase().includes(searchVal)));

        if (config.filters) {
            config.filters.forEach(filterKey => {
                if (this.activeFilters[filterKey] && this.activeFilters[filterKey] !== 'All') {
                    data = data.filter(row => String(row[filterKey]) === this.activeFilters[filterKey]);
                }
            });
        }

        if (this.sortCol) {
            data.sort((a, b) => {
                let valA = a[this.sortCol], valB = b[this.sortCol];
                if (!isNaN(valA) && !isNaN(valB)) return this.sortAsc ? valA - valB : valB - valA;
                return this.sortAsc ? String(valA).localeCompare(String(valB)) : String(valB).localeCompare(String(valA));
            });
        }

        const totalItems = data.length;
        const totalPages = Math.ceil(totalItems / this.itemsPerPage);
        const start = (this.currentPage - 1) * this.itemsPerPage;
        const paginatedData = data.slice(start, start + this.itemsPerPage);

        let html = `<div class="crud-container"><div class="crud-header"><h2>${t['nav' + entity.charAt(0).toUpperCase() + entity.slice(1)]}</h2>
        <div class="search-bar"><input type="text" id="searchInput" placeholder="${t.search}" value="${searchVal}"></div>
        <div class="actions-group"><button class="btn-add" style="background:#2c3e50" onclick="app.exportCSV('${entity}')"><i class="fa-solid fa-file-csv"></i></button><button class="btn-add" style="background:#c0392b" onclick="app.exportPDF('${entity}')"><i class="fa-solid fa-file-pdf"></i></button>${isAdmin ? `<button class="btn-add" onclick="app.openModal()"><i class="fa-solid fa-plus"></i> ${t.add}</button>` : ''}</div></div>`;

        if (config.filters) {
            html += `<div class="filter-container">`;
            config.filters.forEach(filterKey => {
                const allData = JSON.parse(localStorage.getItem('db_' + entity)) || [];
                const uniqueValues = [...new Set(allData.map(item => item[filterKey]))].sort();

                const fieldConfig = config.fields.find(f => f.name === filterKey);
                const labelKey = fieldConfig ? fieldConfig.label : filterKey;

                html += `<select onchange="app.applyFilter('${filterKey}', this.value)" class="filter-select">
                    <option value="All">${this.translateHeader(labelKey)} : ${t.all}</option>`;
                uniqueValues.forEach(val => {
                    const selected = this.activeFilters[filterKey] === String(val) ? 'selected' : '';
                    html += `<option value="${val}" ${selected}>${this.translate(val)}</option>`;
                });
                html += `</select>`;
            });
            html += `</div>`;
        }

        html += `<div class="table-responsive"><table class="styled-table" id="dataTable"><thead><tr>`;
        config.headers.forEach((h, index) => {
            const field = config.fields[index] ? config.fields[index].name : '';
            const icon = this.sortCol === field ? (this.sortAsc ? '▲' : '▼') : '';
            html += `<th class="th-sortable" onclick="app.sortBy('${field}')">${this.translateHeader(h)} <span class="sort-icon">${icon}</span></th>`;
        });
        html += `<th style="text-align:center">${t.actions}</th></tr></thead><tbody>`;

        if (paginatedData.length) {
            paginatedData.forEach(item => {
                html += `<tr>`;
                config.fields.forEach(f => {                    if (entity === 'matchs' && (f.name === 'equipeB' || f.name === 'score')) return;

                    let val = item[f.name];
                    const trans = this.translate(val);
                    if (entity === 'matchs' && f.name === 'equipeA') {
                        const valB = item['equipeB'];
                        const transB = this.translate(valB);
                        const score = item['score'] ? item['score'] : 'VS';
                        html += `<td>${trans} <b>${score}</b> ${transB}</td>`;
                    }
                    else if (f.name === 'image') html += `<td><img src="${val}" class="table-img" onerror="this.style.display='none'"></td>`;
                    else if (f.name === 'statut') {
                        let color = val === 'Vendu' || val === 'Termine' ? '#27ae60' : (val === 'Reserve' || val === 'En_cours' ? '#e67e22' : '#333');
                        html += `<td style="color:${color}; font-weight:bold;">${trans}</td>`;
                    }
                    else html += `<td>${trans}</td>`;
                });
                let actions = `<button class="action-btn btn-view" style="background:#3498db" onclick="app.openDetails(${item.id})"><i class="fa-solid fa-eye"></i></button>`;
                if (isAdmin) actions += `<button class="action-btn btn-edit" onclick="app.openModal(${item.id})"><i class="fa-solid fa-pen"></i></button><button class="action-btn btn-delete" onclick="app.deleteItem(${item.id})"><i class="fa-solid fa-trash"></i></button>`;
                else if (isUser && entity === 'matchs') actions += `<button class="action-btn btn-buy" onclick="app.openBuyModal(${item.id})"><i class="fa-solid fa-cart-shopping"></i></button>`;
                else if (isUser && entity === 'billets') actions = `<button class="action-btn btn-view" style="background:#3498db" onclick="app.openDetails(${item.id})"><i class="fa-solid fa-eye"></i></button>`;
                html += `<td style="text-align:center">${actions}</td></tr>`;
            });
        } else html += `<tr><td colspan="10" style="text-align:center">${t.noData}</td></tr>`;

        html += `</tbody></table></div><div class="pagination">
        <select onchange="app.changeItemsPerPage(this.value)" style="margin-right:auto">
            <option value="5" ${this.itemsPerPage == 5 ? 'selected' : ''}>5</option>
            <option value="10" ${this.itemsPerPage == 10 ? 'selected' : ''}>10</option>
            <option value="25" ${this.itemsPerPage == 25 ? 'selected' : ''}>25</option>
        </select>
        <button onclick="app.changePage(-1)" ${this.currentPage === 1 ? 'disabled' : ''}>❮</button>
        <span style="font-weight:600; font-size:0.9rem">${t.page} ${this.currentPage} / ${totalPages || 1}</span>
        <button onclick="app.changePage(1)" ${this.currentPage === totalPages || totalPages === 0 ? 'disabled' : ''}>❯</button></div></div>`;

        html += `<div id="crudModal" class="modal"><div class="modal-content"><span class="close-modal" onclick="app.closeModal()">&times;</span><h3>${t.add}</h3><form id="crudForm"><input type="hidden" id="itemId">${config.fields.map(f => f.type === 'select' ? `<div class="form-group"><label>${this.translateHeader(f.label)}</label><select id="${f.name}" required>${f.options.map(o => `<option value="${o}">${this.translate(o)}</option>`).join('')}</select></div>` : `<div class="form-group"><label>${this.translateHeader(f.label)}</label><input type="${f.type}" id="${f.name}" required><span class="error-msg" id="err-${f.name}"></span></div>`).join('')}<div class="modal-footer"><button type="button" class="btn-add" style="background:#888" onclick="app.closeModal()">${t.cancel}</button><button type="submit" class="btn-add" id="btnSave">${t.save}</button></div></form></div></div>`;
        document.getElementById('main-container').innerHTML = html;
        const searchInp = document.getElementById('searchInput');
        if (searchInp) {
            searchInp.focus(); searchInp.setSelectionRange(searchInp.value.length, searchInp.value.length);
            searchInp.addEventListener('input', (e) => { clearTimeout(this.debounceTimer); this.debounceTimer = setTimeout(() => { this.currentPage = 1; this.renderCRUD(this.currentEntity); }, 300); });
        }
        if (document.getElementById('crudForm')) document.getElementById('crudForm').addEventListener('submit', (e) => this.saveItem(e));
    }

    applyFilter(key, value) {
        this.activeFilters[key] = value;
        this.currentPage = 1;
        this.renderCRUD(this.currentEntity);
    }
    capitalize(s) { return s && s[0].toUpperCase() + s.slice(1); }

    translate(val) { return (this.dataDictionary[val] && this.dataDictionary[val][this.lang]) || val; }
    translateHeader(val) { return (this.headersDictionary[val] && this.headersDictionary[val][this.lang]) || val; }
    sortBy(col) { if (this.sortCol === col) this.sortAsc = !this.sortAsc; else { this.sortCol = col; this.sortAsc = true; } this.renderCRUD(this.currentEntity); }
    changePage(delta) { this.currentPage += delta; this.renderCRUD(this.currentEntity); }
    changeItemsPerPage(val) { this.itemsPerPage = parseInt(val); this.currentPage = 1; this.renderCRUD(this.currentEntity); }

    openDetails(id) {
        const item = JSON.parse(localStorage.getItem('db_' + this.currentEntity)).find(i => i.id === id);
        const config = this.entityConfig[this.currentEntity];
        let detailsHtml = `<div id="detailsModal" class="modal" style="display:flex"><div class="modal-content"><span class="close-modal" onclick="document.getElementById('detailsModal').remove()">&times;</span>
        <h3>${this.translations[this.lang].details}</h3><div class="details-grid">`;
        config.fields.forEach(f => {
            detailsHtml += `<div class="detail-item"><strong>${this.translateHeader(f.label)} :</strong> <span>${this.translate(item[f.name])}</span></div>`;
        });
        detailsHtml += `</div><div class="modal-footer"><button class="btn-add" style="background:#c0392b" onclick="app.exportSinglePDF(${item.id})"><i class="fa-solid fa-file-pdf"></i> PDF</button></div></div></div>`;
        document.body.insertAdjacentHTML('beforeend', detailsHtml);
    }

    exportSinglePDF(id) {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        const item = JSON.parse(localStorage.getItem('db_' + this.currentEntity)).find(i => i.id === id);
        doc.setFillColor(0, 98, 51); doc.rect(0, 0, 210, 40, 'F');
        doc.setTextColor(255, 255, 255); doc.setFontSize(22); doc.text("AfriCAN 2025", 105, 25, { align: "center" });
        doc.setTextColor(0, 0, 0); doc.setFontSize(14);
        let y = 60;
        this.entityConfig[this.currentEntity].fields.forEach(f => {
            doc.text(`${this.translateHeader(f.label)} : ${this.translate(item[f.name])}`, 20, y);
            y += 10;
        });
        doc.save(`${this.currentEntity}_${id}.pdf`);
    }

    openBuyModal(matchId) {
        const matchs = JSON.parse(localStorage.getItem('db_matchs'));
        const match = matchs.find(m => m.id === matchId);
        const t = this.translations[this.lang];
        const html = `<div id="buyModal" class="modal" style="display:flex"><div class="modal-content"><span class="close-modal" onclick="document.getElementById('buyModal').remove()">&times;</span><h3>${t.buyRes}</h3><form id="buyForm">
            <div class="form-group"><label>${this.translateHeader('Match')}</label><input type="text" value="${this.translate(match.equipeA)} vs ${this.translate(match.equipeB)}" disabled></div>
            <div class="form-group"><label>${this.translateHeader('Client')}</label><input type="text" id="buyName" value="${this.user.name}"></div>
            <div class="form-group"><label>${this.translateHeader('Téléphone')}</label><input type="text" id="buyPhone" required></div>
            <div class="form-group"><label>${this.translateHeader('Catégorie')}</label><select id="ticketCat"><option value="Standard">Standard (${match.prix} DH)</option><option value="VIP">VIP (${parseInt(match.prix) + 500} DH)</option></select></div>
            <div class="form-group"><label>${this.translateHeader('Action')}</label><select id="ticketStatus"><option value="Vendu">${this.translate('Acheter')}</option><option value="Reserve">${this.translate('Reserver')}</option></select></div>
            <div class="modal-footer"><button type="button" class="btn-add" style="background:#888" onclick="document.getElementById('buyModal').remove()">${t.cancel}</button><button type="submit" class="btn-add" id="btnBuySubmit">${t.save}</button></div>
        </form></div></div>`;
        document.body.insertAdjacentHTML('beforeend', html);
        const phoneInput = document.getElementById('buyPhone');
        const btnSubmit = document.getElementById('btnBuySubmit');
        phoneInput.addEventListener('input', () => {
            const regex = /^0\d{9}$/;
            if (!regex.test(phoneInput.value)) { phoneInput.style.borderColor = 'red'; btnSubmit.disabled = true; }
            else { phoneInput.style.borderColor = '#ddd'; btnSubmit.disabled = false; }
        });
        document.getElementById('buyForm').addEventListener('submit', (e) => {
            e.preventDefault();
            const cat = document.getElementById('ticketCat').value;
            const stat = document.getElementById('ticketStatus').value;
            const phone = document.getElementById('buyPhone').value;
            const name = document.getElementById('buyName').value;
            const finalPrice = cat === 'VIP' ? parseInt(match.prix) + 500 : match.prix;
            const billets = JSON.parse(localStorage.getItem('db_billets')) || [];
            billets.push({ id: Date.now(), match: `${this.translate(match.equipeA)} vs ${this.translate(match.equipeB)}`, client: name, phone: phone, categorie: cat, prix: finalPrice, statut: stat });
            localStorage.setItem('db_billets', JSON.stringify(billets));
            document.getElementById('buyModal').remove();
            Swal.fire({ title: this.translate(stat) + '!', icon: 'success', confirmButtonColor: '#006233', confirmButtonText: 'OK' });
        });
    }
    openModal(id = null) {
        document.getElementById('crudModal').style.display = 'flex';
        document.getElementById('crudForm').reset();
        document.getElementById('itemId').value = '';
        const inputs = document.querySelectorAll('#crudForm input');
        const btnSave = document.getElementById('btnSave');
        inputs.forEach(input => {
            input.addEventListener('input', () => {
                let isValid = true;
                const errSpan = document.getElementById('err-' + input.id);
                if (errSpan) errSpan.innerText = "";
                if (input.type === 'number' && input.value < 0) { if (errSpan) errSpan.innerText = this.translations[this.lang].errNeg; isValid = false; }
                if (input.type === 'date') {
                    const selected = new Date(input.value);
                    const today = new Date();
                    if (selected < today) { if (errSpan) errSpan.innerText = this.translations[this.lang].errDate; isValid = false; }
                }
                btnSave.disabled = !isValid;
            });
        });
        if (id) {
            const data = JSON.parse(localStorage.getItem('db_' + this.currentEntity));
            const item = data.find(i => i.id === id);
            document.getElementById('itemId').value = item.id;
            this.entityConfig[this.currentEntity].fields.forEach(f => document.getElementById(f.name).value = item[f.name]);
        }
    }
    closeModal() { document.getElementById('crudModal').style.display = 'none'; }
    saveItem(e) {
        e.preventDefault();
        let data = JSON.parse(localStorage.getItem('db_' + this.currentEntity)) || [];
        const id = document.getElementById('itemId').value;
        const newItem = {};
        this.entityConfig[this.currentEntity].fields.forEach(f => newItem[f.name] = document.getElementById(f.name).value);
        if (id) { const idx = data.findIndex(i => i.id == id); newItem.id = parseInt(id); data[idx] = newItem; }
        else { newItem.id = Date.now(); data.push(newItem); }
        localStorage.setItem('db_' + this.currentEntity, JSON.stringify(data));
        this.closeModal();
        this.renderCRUD(this.currentEntity);
    }
    deleteItem(id) {
        Swal.fire({ title: this.translations[this.lang].confirmDel, icon: 'warning', showCancelButton: true, confirmButtonColor: '#C1272D', confirmButtonText: 'OK', cancelButtonText: this.translations[this.lang].cancel }).then((res) => {
            if (res.isConfirmed) {
                let data = JSON.parse(localStorage.getItem('db_' + this.currentEntity)).filter(i => i.id !== id);
                localStorage.setItem('db_' + this.currentEntity, JSON.stringify(data));
                this.renderCRUD(this.currentEntity);
                Swal.fire(this.translations[this.lang].deleted, '', 'success');
            }
        });
    }
    exportCSV(entity) {
        const data = JSON.parse(localStorage.getItem('db_' + entity));
        let csv = this.entityConfig[entity].headers.join(",") + "\n" + data.map(row => Object.values(row).slice(1).join(",")).join("\n");
        const link = document.createElement('a');
        link.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv);
        link.target = '_blank'; link.download = entity + '.csv'; link.click();
    }
    exportPDF(entity) {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        const config = this.entityConfig[entity];
        const data = JSON.parse(localStorage.getItem('db_' + entity));
        const t = this.translations[this.lang];
        doc.text(`${t['nav' + entity.charAt(0).toUpperCase() + entity.slice(1)]}`, 14, 15);
        doc.autoTable({ head: [config.headers.map(h => this.translateHeader(h))], body: data.map(item => Object.values(item).slice(1).map(val => this.translate(val))), startY: 20, theme: 'grid', headStyles: { fillColor: [0, 98, 51] } });
        doc.save(`${entity}.pdf`);
    }
    getDb() {
        return {
            stades: JSON.parse(localStorage.getItem('db_stades')) || [],
            equipes: JSON.parse(localStorage.getItem('db_equipes')) || [],
            joueurs: JSON.parse(localStorage.getItem('db_joueurs')) || [],
            matchs: JSON.parse(localStorage.getItem('db_matchs')) || [],
            billets: JSON.parse(localStorage.getItem('db_billets')) || []
        };
    }
    translations = {
        fr: { search: "Rechercher...", add: "Ajouter", actions: "Actions", cancel: "Annuler", save: "Enregistrer", page: "Page", navDash: "Tableau de bord", navStades: "Stades", navEquipes: "Équipes", navJoueurs: "Joueurs", navMatchs: "Matchs", navBillets: "Billets", kpiStades: "Stades", kpiTeams: "Équipes", kpiMatchs: "Matchs", kpiTickets: "Billets", kpiRev: "Revenus Globaux", kpiSpend: "Mes Dépenses", navJoueurs: "Joueurs", chartStades: "État Stades", chartEquipes: "Classement", chartGoals: "Buteurs", chartCap: "Capacité Stades", chartTickets: "Ventes vs Réservations", errNeg: "Doit être positif", errDate: "Date future requise", buyRes: "Achat Billet", confirmDel: "Supprimer ?", deleted: "Supprimé !", noData: "Aucune donnée", myCat: "Mes Catégories", myStatus: "Mes Statuts", details: "Détails", all: "Tout" },
        en: { search: "Search...", add: "Add", actions: "Actions", cancel: "Cancel", save: "Save", page: "Page", navDash: "Dashboard", navStades: "Venues", navEquipes: "Teams", navJoueurs: "Players", navMatchs: "Matches", navBillets: "Tickets", kpiStades: "Venues", kpiTeams: "Teams", kpiMatchs: "Matches", kpiTickets: "Tickets", kpiRev: "Total Revenue", kpiSpend: "My Spending", navJoueurs: "Players", chartStades: "Venue Status", chartEquipes: "Ranking", chartGoals: "Scorers", chartCap: "Stadium Capacity", chartTickets: "Sales vs Reservations", errNeg: "Must be positive", errDate: "Future date required", buyRes: "Ticket Purchase", confirmDel: "Delete ?", deleted: "Deleted!", noData: "No data found", myCat: "My Categories", myStatus: "My Status", details: "Details", all: "All" },
        ar: { search: "بحث...", add: "إضافة", actions: "إجراءات", cancel: "إلغاء", save: "حفظ", page: "صفحة", navDash: "لوحة القيادة", navStades: "الملاعب", navEquipes: "الفرق", navJoueurs: "اللاعبين", navMatchs: "المباريات", navBillets: "التذاكر", kpiStades: "ملاعب", kpiTeams: "فرق", kpiMatchs: "مباريات", kpiTickets: "تذاكر", kpiRev: "الإيرادات الكلية", kpiSpend: "نفقاتي", navJoueurs: "لاعبين", chartStades: "حالة الملاعب", chartEquipes: "الترتيب", chartGoals: "الهدافين", chartCap: "سعة الملاعب", chartTickets: "مبيعات vs حجوزات", errNeg: "يجب أن يكون موجبًا", errDate: "تاريخ مستقبلي مطلوب", buyRes: "شراء تذكرة", confirmDel: "حذف ؟", deleted: "تم الحذف", noData: "لا توجد بيانات", myCat: "فئاتي", myStatus: "حالاتي", details: "التفاصيل", all: "الكل" }
    };
    dataDictionary = {
        "Operationnel": { fr: "Opérationnel", en: "Operational", ar: "جاهز" },
        "En_construction": { fr: "En Construction", en: "Construction", ar: "قيد الإنشاء" },
        "Renovation": { fr: "Rénovation", en: "Renovation", ar: "تجديد" },
        "Termine": { fr: "Terminé", en: "Finished", ar: "انتهى" },
        "En_cours": { fr: "En Cours", en: "Live", ar: "جارية" },
        "Defenseur": { fr: "Défenseur", en: "Defender", ar: "مدافع" },
        "Attaquant": { fr: "Attaquant", en: "Striker", ar: "مهاجم" },
        "Gardien": { fr: "Gardien", en: "Goalkeeper", ar: "حارس" },
        "Milieu": { fr: "Milieu", en: "Midfielder", ar: "وسط" },
        "A_venir": { fr: "À venir", en: "Upcoming", ar: "قادمة" },
        "Vendu": { fr: "Vendu", en: "Sold", ar: "مباع" },
        "Acheter": { fr: "Acheter", en: "Buy", ar: "شراء" },
        "Reserver": { fr: "Réserver", en: "Reserve", ar: "حجز" },
        "Reserve": { fr: "Réservé", en: "Reserved", ar: "محجوز" },
        "Casablanca": { fr: "Casablanca", en: "Casablanca", ar: "الدار البيضاء" },
        "Rabat": { fr: "Rabat", en: "Rabat", ar: "الرباط" },
        "Tanger": { fr: "Tanger", en: "Tangier", ar: "طنجة" },
        "Marrakech": { fr: "Marrakech", en: "Marrakesh", ar: "مراكش" },
        "Agadir": { fr: "Agadir", en: "Agadir", ar: "أكادير" },
        "Fes": { fr: "Fès", en: "Fes", ar: "فاس" },
        "Maroc": { fr: "Maroc", en: "Morocco", ar: "المغرب" },
        "Senegal": { fr: "Sénégal", en: "Senegal", ar: "السنغال" },
        "Cote d'Ivoire": { fr: "Côte d'Ivoire", en: "Ivory Coast", ar: "ساحل العاج" },
        "Egypte": { fr: "Égypte", en: "Egypt", ar: "مصر" },
        "Algerie": { fr: "Algérie", en: "Algeria", ar: "الجزائر" },
        "Nigeria": { fr: "Nigeria", en: "Nigeria", ar: "نيجيريا" },
        "Cameroun": { fr: "Cameroun", en: "Cameroon", ar: "الكاميرون" },
        "Tunisie": { fr: "Tunisie", en: "Tunisia", ar: "تونس" },
        "RDC": { fr: "RDC", en: "DRC", ar: "الكونغو الديمقراطية" },
        "Zambie": { fr: "Zambie", en: "Zambia", ar: "زامبيا" },
        "Tanzanie": { fr: "Tanzanie", en: "Tanzania", ar: "تنزانيا" },
        "Ghana": { fr: "Ghana", en: "Ghana", ar: "غانا" },
        "Cap-Vert": { fr: "Cap-Vert", en: "Cape Verde", ar: "الرأس الأخضر" },
        "Mozambique": { fr: "Mozambique", en: "Mozambique", ar: "موزمبيق" },
        "Guinee": { fr: "Guinée", en: "Guinea", ar: "غينيا" },
        "Gambie": { fr: "Gambie", en: "Gambia", ar: "غامبيا" },
        "Burkina Faso": { fr: "Burkina Faso", en: "Burkina Faso", ar: "بوركينا فاسو" },
        "Mauritanie": { fr: "Mauritanie", en: "Mauritania", ar: "موريتانيا" },
        "Angola": { fr: "Angola", en: "Angola", ar: "أنغولا" },
        "Mali": { fr: "Mali", en: "Mali", ar: "مالي" },
        "Afrique du Sud": { fr: "Afrique du Sud", en: "South Africa", ar: "جنوب أفريقيا" },
        "Namibie": { fr: "Namibie", en: "Namibia", ar: "ناميبيا" },
        "Guinee Equatoriale": { fr: "Guinée Équatoriale", en: "Equatorial Guinea", ar: "غينيا الاستوائية" },
        "Botswana": { fr: "Botswana", en: "Botswana", ar: "بوتسوانا" },
        "Comores": { fr: "Comores", en: "Comoros", ar: "جزر القمر" },
        "Zimbabwe": { fr: "Zimbabwe", en: "Zimbabwe", ar: "زيمبابوي" },
        "Ouganda": { fr: "Ouganda", en: "Uganda", ar: "أوغندا" },
        "Benin": { fr: "Bénin", en: "Benin", ar: "بنين" },
        "Soudan": { fr: "Soudan", en: "Sudan", ar: "السودان" },
        "Gabon": { fr: "Gabon", en: "Gabon", ar: "الغابون" },
        "Walid Regragui": { fr: "Walid Regragui", en: "Walid Regragui", ar: "وليد الركراكي" },
        "Aliou Cisse": { fr: "Aliou Cissé", en: "Aliou Cissé", ar: "أليو سيسيه" },
        "Emerse Fae": { fr: "Emerse Faé", en: "Emerse Faé", ar: "إيميرس فاي" },
        "Hossam Hassan": { fr: "Hossam Hassan", en: "Hossam Hassan", ar: "حسام حسن" },
        "Vladimir Petkovic": { fr: "Vladimir Petković", en: "Vladimir Petković", ar: "فلاديمير بيتكوفيتش" },
        "Finidi George": { fr: "Finidi George", en: "Finidi George", ar: "فينيدي جورج" },
        "Marc Brys": { fr: "Marc Brys", en: "Marc Brys", ar: "مارك بريس" },
        "Faouzi Benzarti": { fr: "Faouzi Benzarti", en: "Faouzi Benzarti", ar: "فوزي البنزرتي" },
        "Sébastien Desabre": { fr: "Sébastien Desabre", en: "Sébastien Desabre", ar: "سيباستيان ديسابر" },
        "Avram Grant": { fr: "Avram Grant", en: "Avram Grant", ar: "أفرام غرانت" },
        "Hemed Suleiman": { fr: "Hemed Suleiman", en: "Hemed Suleiman", ar: "حميد سليمان" },
        "Otto Addo": { fr: "Otto Addo", en: "Otto Addo", ar: "أوتو أدو" },
        "Bubista": { fr: "Bubista", en: "Bubista", ar: "بوبيستا" },
        "Chiquinho Conde": { fr: "Chiquinho Conde", en: "Chiquinho Conde", ar: "شيكينيو كوندي" },
        "Kaba Diawara": { fr: "Kaba Diawara", en: "Kaba Diawara", ar: "كابا دياوارا" },
        "Tom Saintfiet": { fr: "Tom Saintfiet", en: "Tom Saintfiet", ar: "توم سينتفيت" },
        "Brama Traoré": { fr: "Brama Traoré", en: "Brama Traoré", ar: "براما تراوري" },
        "Amir Abdou": { fr: "Amir Abdou", en: "Amir Abdou", ar: "أمير عبدو" },
        "Pedro Gonçalves": { fr: "Pedro Gonçalves", en: "Pedro Gonçalves", ar: "بيدرو غونسالفيس" },
        "Éric Chelle": { fr: "Éric Chelle", en: "Éric Chelle", ar: "إريك شيل" },
        "Hugo Broos": { fr: "Hugo Broos", en: "Hugo Broos", ar: "هوغو بروس" },
        "Collin Benjamin": { fr: "Collin Benjamin", en: "Collin Benjamin", ar: "كولين بنجامين" },
        "Juan Micha": { fr: "Juan Micha", en: "Juan Micha", ar: "خوان ميشا" },
        "Didier Gomes": { fr: "Didier Gomes", en: "Didier Gomes", ar: "ديدييه غوميز" },
        "Stefano Cusin": { fr: "Stefano Cusin", en: "Stefano Cusin", ar: "ستيفانو كوزين" },
        "M. Marinica": { fr: "M. Marinica", en: "M. Marinica", ar: "مارينيكا" },
        "Sami Trabelsi": { fr: "Sami Trabelsi", en: "Sami Trabelsi", ar: "سامي الطرابلسي" },
        "Paul Put": { fr: "Paul Put", en: "Paul Put", ar: "بول بوت" },
        "Pape Thiaw": { fr: "Pape Thiaw", en: "Pape Thiaw", ar: "باب تياو" },
        "Gernot Rohr": { fr: "Gernot Rohr", en: "Gernot Rohr", ar: "غيرنوت روهر" },
        "Kwesi Appiah": { fr: "Kwesi Appiah", en: "Kwesi Appiah", ar: "كويسي أبياه" },
        "T. Mouyouma": { fr: "T. Mouyouma", en: "T. Mouyouma", ar: "مويوما" },
        "Achraf Hakimi": { fr: "Achraf Hakimi", en: "Achraf Hakimi", ar: "أشرف حكيمي" },
        "Brahim Diaz": { fr: "Brahim Díaz", en: "Brahim Díaz", ar: "براهيم دياز" },
        "Yassine Bounou": { fr: "Yassine Bounou", en: "Yassine Bounou", ar: "ياسين بونو" },
        "Mohamed Salah": { fr: "Mohamed Salah", en: "Mohamed Salah", ar: "محمد صلاح" },
        "Sadio Mane": { fr: "Sadio Mané", en: "Sadio Mané", ar: "ساديو ماني" },
        "Victor Osimhen": { fr: "Victor Osimhen", en: "Victor Osimhen", ar: "فيكتور أوسيمين" },
        "Karim Benani": { fr: "Karim Benani", en: "Karim Benani", ar: "كريم بناني" },
        "Sara Idrissi": { fr: "Sara Idrissi", en: "Sara Idrissi", ar: "سارة الإدريسي" },
        "Grand Stade Hassan II": { fr: "Grand Stade Hassan II", en: "Grand Stade Hassan II", ar: "ملعب الحسن الثاني الكبير" },
        "Complexe Moulay Abdellah": { fr: "Complexe Moulay Abdellah", en: "Moulay Abdellah Complex", ar: "مجمع مولاي عبد الله" },
        "Ibn Batouta": { fr: "Ibn Batouta", en: "Ibn Batouta", ar: "ابن بطوطة" },
        "Grand Stade de Marrakech": { fr: "Grand Stade de Marrakech", en: "Grand Stade de Marrakech", ar: "ملعب مراكش الكبير" },
        "Stade Adrar": { fr: "Stade Adrar", en: "Adrar Stadium", ar: "ملعب أدرار" },
        "Stade de Fès": { fr: "Stade de Fès", en: "Fes Stadium", ar: "ملعب فاس" },
        "Grand Stade d'Agadir": { fr: "Grand Stade d'Agadir", en: "Agadir Stadium", ar: "ملعب أكادير الكبير" },
        "Stade Mohammed V": { fr: "Stade Mohammed V", en: "Mohammed V Stadium", ar: "ملعب محمد الخامس" },
        "Complexe Sportif de Fès": { fr: "Complexe Sportif de Fès", en: "Fes Sports Complex", ar: "المركب الرياضي بفاس" }
    };
    headersDictionary = { "Nom": { fr: "Nom", en: "Name", ar: "الإسم" }, "Ville": { fr: "Ville", en: "City", ar: "المدينة" }, "Capacité": { fr: "Capacité", en: "Capacity", ar: "السعة" }, "État": { fr: "État", en: "Status", ar: "الحالة" }, "Drapeau": { fr: "Drapeau", en: "Flag", ar: "العلم" }, "Pays": { fr: "Pays", en: "Country", ar: "الدولة" }, "Points": { fr: "Points", en: "Points", ar: "نقاط" }, "Coach": { fr: "Coach", en: "Coach", ar: "المدرب" }, "Poste": { fr: "Poste", en: "Pos.", ar: "مركز" }, "Buts": { fr: "Buts", en: "Goals", ar: "أهداف" }, "Prix": { fr: "Prix", en: "Price", ar: "سعر" }, "Date": { fr: "Date", en: "Date", ar: "تاريخ" }, "Stade": { fr: "Stade", en: "Venue", ar: "ملعب" }, "Match": { fr: "Match", en: "Match", ar: "مباراة" }, "Client": { fr: "Client", en: "Client", ar: "زبون" }, "Catégorie": { fr: "Catégorie", en: "Category", ar: "فئة" }, "Groupe": { fr: "Groupe", en: "Group", ar: "مجموعة" }, "Statut": { fr: "Statut", en: "Status", ar: "الحالة" }, "Téléphone": { fr: "Téléphone", en: "Phone", ar: "هاتف" }, "Action": { fr: "Action", en: "Action", ar: "إجراء" } };
    entityConfig = {
        stades: { headers: ['Nom', 'Ville', 'Capacité', 'État'], filters: ['ville', 'etat'], fields: [{ name: 'nom', label: 'Nom', type: 'text' }, { name: 'ville', label: 'Ville', type: 'select', options: ['Casablanca', 'Rabat', 'Tanger', 'Marrakech', 'Agadir', 'Fes'] }, { name: 'capacite', label: 'Capacité', type: 'number' }, { name: 'etat', label: 'État', type: 'select', options: ['Operationnel', 'En_construction', 'Renovation'] }] },
        equipes: { headers: ['Drapeau', 'Pays', 'Groupe', 'Points', 'Coach'], filters: ['groupe'], fields: [{ name: 'image', label: 'Drapeau', type: 'text' }, { name: 'pays', label: 'Pays', type: 'text' }, { name: 'groupe', label: 'Groupe', type: 'select', options: ['A', 'B', 'C', 'D', 'E', 'F'] }, { name: 'points', label: 'Points', type: 'number' }, { name: 'coach', label: 'Coach', type: 'text' }] },
        joueurs: { headers: ['Nom', 'Équipe', 'Poste', 'Buts'], filters: ['equipe', 'poste'], fields: [{ name: 'nom', label: 'Nom', type: 'text' }, { name: 'equipe', label: 'Équipe', type: 'text' }, { name: 'poste', label: 'Poste', type: 'select', options: ['Gardien', 'Defenseur', 'Attaquant'] }, { name: 'buts', label: 'Buts', type: 'number' }] },
        matchs: { headers: ['Date', 'Stade', 'Match', 'Prix'], filters: ['stade'], fields: [{ name: 'date', label: 'Date', type: 'date' }, { name: 'stade', label: 'Stade', type: 'select', options: ['Grand Stade Hassan II', 'Complexe Moulay Abdellah', 'Ibn Batouta', 'Grand Stade de Marrakech', 'Stade Adrar', 'Stade de Fès'] }, { name: 'equipeA', label: 'Équipe', type: 'text' }, { name: 'equipeB', label: 'Équipe', type: 'text' }, { name: 'prix', label: 'Prix', type: 'number' }, { name: 'score', label: 'Score', type: 'text' }] },
        billets: { headers: ['Match', 'Client', 'Téléphone', 'Catégorie', 'Prix', 'Statut'], filters: ['statut', 'categorie'], fields: [{ name: 'match', label: 'Match', type: 'text' }, { name: 'client', label: 'Client', type: 'text' }, { name: 'phone', label: 'Téléphone', type: 'text' }, { name: 'categorie', label: 'Catégorie', type: 'text' }, { name: 'prix', label: 'Prix', type: 'text' }, { name: 'statut', label: 'Statut', type: 'select', options: ['Vendu', 'Reserve'] }] }
    };
}
const app = new DashboardApp();
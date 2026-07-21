/**
 * ============================================================
 *  SmartQR — Configuration V5
 *  URL à modifier avec votre déploiement Apps Script
 * ============================================================
 */

// 🔴 REMPLACER PAR VOTRE URL APPS SCRIPT
const SMARTQR_API_URL = "https://script.google.com/macros/s/AKfycbwSH1wFILdtuqirmpeJKv9L5Qxl4i9v5dTOhyAtV2LrTRE8oeqfHA5XCkTZYHpIvlgw/exec";

// Récupérer le magasin depuis l'URL
function getMagasinId() {
    const params = new URLSearchParams(window.location.search);
    return params.get('magasin') || params.get('store') || 'default';
}

// Récupérer la table depuis l'URL
function getTableId() {
    const params = new URLSearchParams(window.location.search);
    return params.get('table') || 'T1';
}

const SmartQRApi = {
    magasinId: getMagasinId(),

    async get(action, params = {}) {
        try {
            const url = new URL(SMARTQR_API_URL);
            url.searchParams.set('action', action);
            url.searchParams.set('magasinId', this.magasinId);
            Object.entries(params).forEach(([k, v]) => {
                if (v !== null && v !== undefined) url.searchParams.set(k, v);
            });
            const res = await fetch(url.toString());
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const data = await res.json();
            if (data.error) throw new Error(data.error);
            return data;
        } catch (err) {
            console.error(`[GET ${action}] Error:`, err);
            throw err;
        }
    },

    async post(action, payload = {}) {
        try {
            const body = JSON.stringify(Object.assign({
                action,
                magasinId: this.magasinId
            }, payload));
            const res = await fetch(SMARTQR_API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'text/plain;charset=utf-8' },
                body: body
            });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const data = await res.json();
            if (data.error) throw new Error(data.error);
            return data;
        } catch (err) {
            console.error(`[POST ${action}] Error:`, err);
            throw err;
        }
    },

    setMagasin(magasinId) {
        this.magasinId = magasinId;
        localStorage.setItem('smartqr_magasin', magasinId);
    }
};

window.SmartQRApi = SmartQRApi;
window.getMagasinId = getMagasinId;
window.getTableId = getTableId;
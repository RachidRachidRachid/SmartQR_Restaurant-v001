/**
 * ============================================================
 *  SmartQR — Configuration Client V2.1
 *  Multi-Magasins Support
 * ============================================================
 */

// 🔴 REMPLACER PAR VOTRE URL APPS SCRIPT
const SMARTQR_API_URL = "https://script.google.com/macros/s/AKfycbySYNeiTcDTg_WWFb0eMqsMfupOSoDzVBLxE54ZRwOsmx3HJlijjbhMPAd99QDe2q86/exec";

// Détection du magasin depuis l'URL
function getMagasinId() {
  const params = new URLSearchParams(window.location.search);
  return params.get('magasin') || params.get('store') || 'default';
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
      const res = await fetch(SMARTQR_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(Object.assign({ 
          action, 
          magasinId: this.magasinId 
        }, payload))
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

  async ping() {
    try {
      const res = await this.get('ping');
      return res.ok === true;
    } catch {
      return false;
    }
  },

  cache: {
    menu: null,
    config: null,
    tables: null,
    timestamp: 0,
    
    async getMenu(forceRefresh = false) {
      if (!forceRefresh && this.menu && Date.now() - this.timestamp < 60000) {
        return this.menu;
      }
      this.menu = await SmartQRApi.get('getMenu');
      this.timestamp = Date.now();
      return this.menu;
    },
    
    async getConfig(forceRefresh = false) {
      if (!forceRefresh && this.config && Date.now() - this.timestamp < 60000) {
        return this.config;
      }
      this.config = await SmartQRApi.get('getConfig');
      this.timestamp = Date.now();
      return this.config;
    },
    
    async getTables(forceRefresh = false) {
      if (!forceRefresh && this.tables && Date.now() - this.timestamp < 60000) {
        return this.tables;
      }
      this.tables = await SmartQRApi.get('getTables');
      this.timestamp = Date.now();
      return this.tables;
    },
    
    clear() {
      this.menu = null;
      this.config = null;
      this.tables = null;
      this.timestamp = 0;
    }
  }
};

// Exposer pour les pages
window.SmartQRApi = SmartQRApi;
window.getMagasinId = getMagasinId;
/**
 * Mocking client-server processing 
 */
import _products from './data.json'
import _topProducts from './top_products.json'
import _banners from './banners'
import _category from './categories'
import _careers from './career'
import _mediarelease from './mediarelease'
import _mediapr from './mediapr'
import _buylead from './buylead'
import _units from './units'
import _lp from './lp'
import _tm from './tm'
import _brands from './brands';
import _currency_value from './currency_value';
import _countries from './cron_country'
// import _recommendedProduct from './recommended_product';
// import _recentSearch from './recent_search'
// import _wholesale_day from './Wholesale_day'

const TIMEOUT = 100;

export default {
    getProducts: (cb, timeout) => setTimeout(() => cb(_topProducts), timeout || TIMEOUT),
    getLP: (cb, timeout) => setTimeout(() => cb(_lp), timeout || TIMEOUT),
    getTM: (cb, timeout) => setTimeout(() => cb(_tm), timeout || TIMEOUT),
    getUnits: (cb, timeout) => setTimeout(() => cb(_units), timeout || TIMEOUT),
    getBanners: (cb, timeout) => setTimeout(() => cb(_banners), timeout || 0),
    getCareers: (cb, timeout) => setTimeout(() => cb(_careers), timeout || 0),
    getMediapr: (cb, timeout) => setTimeout(() => cb(_mediapr), timeout || 0),
    getMediaRelease: (cb, timeout) => setTimeout(() => cb(_mediarelease), timeout || 0),
    getBuyLead: (cb, timeout) => setTimeout(() => cb(_buylead), timeout || 0),
    // getSearchProducts: (cb, timeout) => setTimeout(() => cb(_topProducts), timeout || 0),
    getCategories: (cb, timeout) => setTimeout(() => cb(_category), timeout || TIMEOUT),
    getBrands:(cb,timeout) =>setTimeout(() => cb(_brands), timeout || TIMEOUT),
    buyProducts: (payload, cb, timeout) => setTimeout(() => cb(), timeout || TIMEOUT),
    getCurrencyValue: (cb, timeout) => setTimeout(() => cb(_currency_value), timeout || TIMEOUT),
    getCountries: (cb, timeout) => setTimeout(() => cb(_countries), timeout || TIMEOUT)
    // ,
    // getRecommendation: (cb, timeout) => setTimeout(() => cb(_recommendedProduct), timeout || TIMEOUT),
    // getRecentSearch: (cb, timeout) => setTimeout(() => cb(_recentSearch), timeout || TIMEOUT),
    // receiveWholesaleDay: (cb, timeout) => setTimeout(() => cb(_recentSearch), timeout || TIMEOUT)
    
    // getLangContent: (cb, timeout) => setTimeout(() => cb(_about_ar), timeout || TIMEOUT),
    // getLangContent: (cb, timeout) => setTimeout(() => cb(_about_hi), timeout || TIMEOUT)

}


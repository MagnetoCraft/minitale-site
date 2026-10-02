// Language Manager for Minitale Site
const LanguageManager = {
    // Supported languages
    supportedLanguages: ['fr', 'en'],
    
    // Default language
    defaultLanguage: 'en',
    
    // Current language
    currentLanguage: null,
    
    // Translations cache
    translations: {},
    
    // Initialize language manager
    init: function() {
        // Detect browser language
        const browserLang = this.detectBrowserLanguage();
        
        // Set current language
        this.currentLanguage = this.getStoredLanguage() || browserLang || this.defaultLanguage;
        
        // Load translations
        this.loadTranslation(this.currentLanguage);
        
        // Apply language to all elements
        this.applyLanguage();
        
        // Update language selector
        this.updateLanguageSelector();
    },
    
    // Detect browser language
    detectBrowserLanguage: function() {
        const userLang = navigator.language || navigator.userLanguage || navigator.browserLanguage || navigator.systemLanguage || '';
        const langCode = userLang.split('-')[0].toLowerCase();
        
        // Check if the detected language is supported
        if (this.supportedLanguages.includes(langCode)) {
            return langCode;
        }
        
        // Check if a similar language is supported (e.g., 'fr-CA' -> 'fr')
        for (const supportedLang of this.supportedLanguages) {
            if (langCode.startsWith(supportedLang)) {
                return supportedLang;
            }
        }
        
        return null;
    },
    
    // Get stored language from localStorage
    getStoredLanguage: function() {
        return localStorage.getItem('minitale-language');
    },
    
    // Set language in localStorage
    setStoredLanguage: function(lang) {
        localStorage.setItem('minitale-language', lang);
    },
    
    // Load translation file
    loadTranslation: function(lang) {
        const path = `js/translations/${lang}.json`;
        
        fetch(path)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to load translation file: ${path}`);
                }
                return response.json();
            })
            .then(data => {
                this.translations[lang] = data;
                if (this.currentLanguage === lang) {
                    this.applyLanguage();
                }
            })
            .catch(error => {
                console.error('Error loading translation:', error);
                // Fallback to default language
                if (lang !== this.defaultLanguage) {
                    this.loadTranslation(this.defaultLanguage);
                }
            });
    },
    
    // Change language
    changeLanguage: function(lang) {
        if (!this.supportedLanguages.includes(lang)) {
            console.error(`Language ${lang} is not supported`);
            return;
        }
        
        this.currentLanguage = lang;
        this.setStoredLanguage(lang);
        
        // Load translation if not already loaded
        if (!this.translations[lang]) {
            this.loadTranslation(lang);
        } else {
            this.applyLanguage();
        }
        
        // Update language selector
        this.updateLanguageSelector();
    },
    
    // Apply language to all elements
    applyLanguage: function() {
        if (!this.translations[this.currentLanguage]) {
            return;
        }
        
        const t = this.translations[this.currentLanguage];
        
        // Apply translations to all data-i18n elements
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            const keys = key.split('.');
            
            let value = t;
            for (const k of keys) {
                if (value && value.hasOwnProperty(k)) {
                    value = value[k];
                } else {
                    value = null;
                    break;
                }
            }
            
            if (value !== null && value !== undefined) {
                if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                    element.placeholder = value;
                } else if (element.hasAttribute('data-i18n-html')) {
                    element.innerHTML = value;
                } else {
                    element.textContent = value;
                }
            }
        });
        
        // Apply translations to title
        if (t.title) {
            document.title = t.title;
        }
        
        // Update active state in language selector
        this.updateLanguageSelector();
    },
    
    // Update language selector UI
    updateLanguageSelector: function() {
        const langSelector = document.getElementById('language-selector');
        if (!langSelector) return;
        
        // Update button text
        const currentLangName = this.translations[this.currentLanguage]?.language || this.currentLanguage;
        langSelector.querySelector('.language-button-text').textContent = currentLangName;
        
        // Update dropdown items
        const dropdown = langSelector.querySelector('.language-dropdown');
        if (dropdown) {
            dropdown.querySelectorAll('.language-option').forEach(option => {
                const lang = option.getAttribute('data-lang');
                if (lang === this.currentLanguage) {
                    option.classList.add('active');
                } else {
                    option.classList.remove('active');
                }
            });
        }
    },
    
    // Get current language
    getCurrentLanguage: function() {
        return this.currentLanguage;
    },
    
    // Get translation
    getTranslation: function(key) {
        if (!this.translations[this.currentLanguage]) {
            return key;
        }
        
        const keys = key.split('.');
        let value = this.translations[this.currentLanguage];
        
        for (const k of keys) {
            if (value && value.hasOwnProperty(k)) {
                value = value[k];
            } else {
                return key;
            }
        }
        
        return value || key;
    }
};

// Initialize language manager when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    LanguageManager.init();
    
    // Set up language selector event listeners
    const langSelector = document.getElementById('language-selector');
    if (langSelector) {
        const button = langSelector.querySelector('.language-button');
        const dropdown = langSelector.querySelector('.language-dropdown');
        
        if (button && dropdown) {
            button.addEventListener('click', function(e) {
                e.stopPropagation();
                dropdown.classList.toggle('show');
            });
            
            dropdown.querySelectorAll('.language-option').forEach(option => {
                option.addEventListener('click', function(e) {
                    e.stopPropagation();
                    const lang = this.getAttribute('data-lang');
                    LanguageManager.changeLanguage(lang);
                    dropdown.classList.remove('show');
                });
            });
        }
        
        // Close dropdown when clicking outside
        document.addEventListener('click', function() {
            if (dropdown) {
                dropdown.classList.remove('show');
            }
        });
    }
});

// Close dropdown when clicking outside
window.addEventListener('click', function(e) {
    const dropdowns = document.querySelectorAll('.language-dropdown');
    dropdowns.forEach(dropdown => {
        if (!dropdown.contains(e.target) && !dropdown.previousElementSibling.contains(e.target)) {
            dropdown.classList.remove('show');
        }
    });
});

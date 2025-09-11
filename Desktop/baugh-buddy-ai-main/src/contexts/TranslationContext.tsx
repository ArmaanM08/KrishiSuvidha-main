import React, { createContext, useContext, useState, useEffect } from 'react';

const TranslationContext = createContext({
    currentLanguage: 'en',
    setLanguage: (lang: string) => {},
    translate: async (text: string) => text,
    translateObject: async (obj: any) => obj,
});

export const TranslationProvider = ({ children }) => {
    const [currentLanguage, setCurrentLanguage] = useState('en');

    const translate = async (text: string) => {
        if (currentLanguage === 'en') return text;
        
        try {
            const response = await fetch('http://localhost:5000/api/translation/translate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    text,
                    targetLanguage: currentLanguage,
                }),
            });
            
            const data = await response.json();
            return data.translation;
        } catch (error) {
            console.error('Translation error:', error);
            return text;
        }
    };

    const translateObject = async (obj: any) => {
        if (currentLanguage === 'en') return obj;
        
        try {
            const response = await fetch('http://localhost:5000/api/translation/translate-object', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    data: obj,
                    targetLanguage: currentLanguage,
                }),
            });
            
            return await response.json();
        } catch (error) {
            console.error('Translation error:', error);
            return obj;
        }
    };

    const setLanguage = (lang: string) => {
        setCurrentLanguage(lang);
        localStorage.setItem('preferredLanguage', lang);
    };

    useEffect(() => {
        const savedLanguage = localStorage.getItem('preferredLanguage');
        if (savedLanguage) {
            setCurrentLanguage(savedLanguage);
        }
    }, []);

    return (
        <TranslationContext.Provider value={{
            currentLanguage,
            setLanguage,
            translate,
            translateObject,
        }}>
            {children}
        </TranslationContext.Provider>
    );
};

export const useTranslation = () => useContext(TranslationContext);

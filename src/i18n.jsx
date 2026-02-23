import React, { createContext, useContext, useState, useEffect } from 'react';

const translations = {
    en: {
        app_title: "Marathi Dukandaar",
        search_shops: "Search shops...",
        add_shop: "Add New Shop",
        map_view: "Map View",
        categories: "Top Categories",
        top_category: "Top Category",
        stats_shops: "Shops",
        stats_favorites: "Favorites",
        filters: "Filters",
        filters_title: "Show Filters",
        all_cat: "All",
        view_top: "View Top Contributors",
        bronze: "Bronze Starter",
        silver: "Silver Contributor",
        gold: "Gold Local Guide",
        diamond: "Diamond Legend",
        sahayak: "Sahayak (Helper)",
        mavla: "Mavla (Soldier)",
        sardar: "Sardar (Commander)",
        sarsenapati: "Sarsenapati (General)",
        peshwa: "Peshwa (Prime Minister)",
        food: "Food & Snacks",
        clothing: "Clothing",
        services: "Services",
        groceries: "Groceries (Kirana)",
        electronics: "Electronics",
        other: "Other",
        welcome: "Welcome to Marathi Dukandaar Map!",
        add_shop_subtitle: "Help grow the Marathi business community",
        shop_name: "Shop Name",
        owner_name: "Owner Name",
        description: "Description",
        phone: "Phone Number",
        hours: "Opening Hours",
        upload_images: "Shop Images (up to 5)",
        submit_shop: "Add Shop (+50 pts)",
        cancel: "Cancel",
        reviews: "Reviews",
        write_review: "Write a review...",
        post_review: "Post Review (+10 pts)",
        verify: "Verify",
        verified: "Community Verified",
        directions: "Directions",
        share: "Share",
        edit: "Edit",
        delete: "Delete",
        favorite: "Favorite",
        pts: "pts",
        next: "Next",
        leaderboard: "Leaderboard",
        admin: "Admin",
        logout: "Logout",
        login_prompt: "Log in to leave a review and earn points!"
    },
    mr: {
        app_title: "मराठी दुकानदार",
        search_shops: "दुकाने शोधा...",
        add_shop: "नवीन दुकान जोडा",
        map_view: "नकाशा रूप",
        categories: "मुख्य प्रकार",
        top_category: "लाेकप्रिय प्रकार",
        stats_shops: "दुकाने",
        stats_favorites: "आवडती",
        filters: "फिल्टर्स",
        filters_title: "फिल्टर्स दाखवा",
        all_cat: "सर्व",
        view_top: "शीर्ष योगदानकर्ते पहा",
        bronze: "कांस्य स्टार्टर",
        silver: "रौप्य योगदानकर्ता",
        gold: "सुवर्ण मार्गदर्शक",
        diamond: "हिरकणी आख्यायिका",
        sahayak: "सहाय्यक",
        mavla: "मावळा",
        sardar: "सरदार",
        sarsenapati: "सरसेनापती",
        peshwa: "पेशवे",
        food: "अन्न आणि स्नॅक्स",
        clothing: "कपडे",
        services: "सेवा",
        groceries: "किराणा",
        electronics: "इलेक्ट्रॉनिक्स",
        other: "इतर",
        welcome: "मराठी दुकानदार नकाशामध्ये आपले स्वागत आहे!",
        add_shop_subtitle: "मराठी व्यवसाय समुदायाला वाढण्यास मदत करा",
        shop_name: "दुकानाचे नाव",
        owner_name: "मालकाचे नाव",
        description: "वर्णन",
        phone: "फोन क्रमांक",
        hours: "उघडण्याची वेळ",
        upload_images: "दुकानाचे फोटो (५ पर्यंत)",
        submit_shop: "दुकान जोडा (+५० गुण)",
        cancel: "रद्द करा",
        reviews: "अभिप्राय",
        write_review: "अभिप्राय लिहा...",
        post_review: "पोस्ट करा (+१० गुण)",
        verify: "सत्यापित करा",
        verified: "समुदायाने प्रमाणित केले",
        directions: "रस्ता दाखवा",
        share: "वाटा",
        edit: "बदल",
        delete: "काढून टाका",
        favorite: "आवडते",
        pts: "गुण",
        next: "पुढील",
        leaderboard: "रँकिंग",
        admin: "प्रशासक",
        logout: "बाहेर पडा",
        login_prompt: "रिव्ह्यू देण्यासाठी आणि पॉइंट्स मिळवण्यासाठी लॉग इन करा!"
    }
};

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
    // Check localStorage for saved lang
    const [language, setLanguage] = useState(() => {
        return localStorage.getItem('app_lang') || 'en';
    });

    useEffect(() => {
        localStorage.setItem('app_lang', language);
    }, [language]);

    const toggleLanguage = () => {
        setLanguage(prev => prev === 'en' ? 'mr' : 'en');
    };

    const t = (key) => {
        return translations[language][key] || key;
    };

    return (
        <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useTranslation = () => useContext(LanguageContext);

import React, { useEffect, useState } from 'react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface Language {
    code: string;
    name: string;
}

const LanguageSelector = ({ currentLanguage, onLanguageChange }) => {
    const [languages, setLanguages] = useState<Language[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLanguages = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/translation/languages', {
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });
                const data = await response.json();
                setLanguages(data);
            } catch (error) {
                console.error('Error fetching languages:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchLanguages();
    }, []);
    return (
        <Select value={currentLanguage} onValueChange={onLanguageChange}>
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select Language" />
            </SelectTrigger>
            <SelectContent>
                {languages.map((lang) => (
                    <SelectItem key={lang.code} value={lang.code}>
                        {lang.name}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
};

export default LanguageSelector;

"use client";
import React, { useEffect, useState, useCallback } from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "./ui/select";
import { subjects } from "@/constants";
import { useRouter, useSearchParams } from "next/navigation";
import { formUrlQuery, removeKeysFromUrlQuery } from "@jsmastery/utils";

const SubjectFilter = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const query = searchParams.get("subject") || "";
    
    const [subject, setSubject] = useState(query);
    const [isInitialized, setIsInitialized] = useState(false);

    // Handle URL updates
    const handleUrlUpdate = useCallback(() => {
        if (!isInitialized) return;
        
        let newUrl = "";
        if (subject === "all" || !subject) {
            newUrl = removeKeysFromUrlQuery({
                params: searchParams.toString(),
                keysToRemove: ["subject"],
            });
        } else {
            newUrl = formUrlQuery({
                params: searchParams.toString(),
                key: "subject",
                value: subject,
            });
        }
        router.push(newUrl, { scroll: false });
    }, [subject, searchParams, router, isInitialized]);

    // Initialize state from URL
    useEffect(() => {
        setSubject(query);
        setIsInitialized(true);
    }, [query]);

    // Handle subject changes
    useEffect(() => {
        if (!isInitialized) return;
        handleUrlUpdate();
    }, [subject, isInitialized, handleUrlUpdate]);

    return (
        <Select 
            onValueChange={(value) => setSubject(value)} 
            value={subject}
        >
            <SelectTrigger className="input capitalize">
                <SelectValue placeholder="Subject" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="all">All subjects</SelectItem>
                {subjects.map((subj) => (
                    <SelectItem key={subj} value={subj} className="capitalize">
                        {subj}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
};

export default SubjectFilter;
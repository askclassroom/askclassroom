// "use client";

// import { zodResolver } from "@hookform/resolvers/zod";
// import { useForm } from "react-hook-form";
// import { z } from "zod";
// import { createCompanion } from "@/lib/actions/companion.actions";
// import {
//     Form,
//     FormControl,
//     FormDescription,
//     FormField,
//     FormItem,
//     FormLabel,
//     FormMessage,
// } from "@/components/ui/form"
// import {
//     Select,
//     SelectContent,
//     SelectItem,
//     SelectSeparator,
//     SelectTrigger,
//     SelectValue,
// } from "@/components/ui/select"
// import { Input } from "@/components/ui/input"
// import { Button } from "./ui/button";
// import { subjects } from "@/constants";
// import { Textarea } from "./ui/textarea";
// import { redirect } from "next/navigation";

// const formSchema = z.object({
//     name: z.string().min(1, 'Companion is required.'),
//     subject: z.string().min(1, 'Subject is required.'),
//     topic: z.string().min(1, { message: 'Topic is required.' }),
//     voice: z.string().min(1, { message: 'Voice is required.' }),
//     style: z.string().min(1, { message: 'Style is required.' }),
//     duration: z.coerce.number().min(1, { message: 'Duration is required.' }),
// });

// const CompanionForm = () => {

//     const form = useForm<z.infer<typeof formSchema>>({
//         resolver: zodResolver(formSchema),
//         defaultValues: {
//             name: '',
//             subject: '',
//             topic: '',
//             voice: '',
//             style: '',
//             duration: 15,
//         },
//     })

//     const onSubmit = async(values: z.infer<typeof formSchema>) => {
//         const companion=await createCompanion(values);
//         if(companion){
//             redirect(`/companions/${companion.id}`);
//         }else{
//             console.log("Failed to create a companion");
//             redirect('/')
//         }
//     }

//     return (
//         <Form {...form}>
//             <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
//                 <FormField
//                     control={form.control}
//                     name="name"
//                     render={({ field }) => (
//                         <FormItem>
//                             <FormLabel>Companion Name</FormLabel>
//                             <FormControl>
//                                 <Input placeholder="Enter th companion name" {...field} className="input" />
//                             </FormControl>
//                             <FormMessage />
//                         </FormItem>
//                     )}
//                 />
//                 <FormField
//                     control={form.control}
//                     name="subject"
//                     render={({ field }) => (
//                         <FormItem>
//                             <FormLabel>Subject</FormLabel>
//                             <FormControl>
//                                 <Select
//                                     onValueChange={field.onChange}
//                                     value={field.value}
//                                     defaultValue={field.value}
//                                 >
//                                     <SelectTrigger className="input capitalize">
//                                         <SelectValue placeholder="Select the subject" />
//                                     </SelectTrigger>
//                                     <SelectContent>
//                                         {subjects.map((subject) => (
//                                             <SelectItem
//                                                 key={subject}
//                                                 value={subject}
//                                                 className="capitalize"
//                                             >
//                                                 {subject}
//                                             </SelectItem>
//                                         ))}
//                                     </SelectContent>
//                                 </Select>
//                             </FormControl>
//                             <FormMessage />
//                         </FormItem>
//                     )}
//                 />
//                 <FormField
//                     control={form.control}
//                     name="topic"
//                     render={({ field }) => (
//                         <FormItem>
//                             <FormLabel>What should companion help with?</FormLabel>
//                             <FormControl>
//                                 <Textarea placeholder="Ex. Derivatives & Integrals" {...field} className="input" />
//                             </FormControl>
//                             <FormMessage />
//                         </FormItem>
//                     )}
//                 />
//                 <FormField
//                     control={form.control}
//                     name="voice"
//                     render={({ field }) => (
//                         <FormItem>
//                             <FormLabel>Voice</FormLabel>
//                             <FormControl>
//                                 <Select
//                                     onValueChange={field.onChange}
//                                     value={field.value}
//                                     defaultValue={field.value}
//                                 >
//                                     <SelectTrigger className="input capitalize">
//                                         <SelectValue placeholder="Select the voice" />
//                                     </SelectTrigger>
//                                     <SelectContent>
//                                         <SelectItem value="male">Male</SelectItem>
//                                         <SelectItem value="female">Female</SelectItem>
//                                     </SelectContent>
//                                 </Select>
//                             </FormControl>
//                             <FormMessage />
//                         </FormItem>
//                     )}
//                 />
//                 <FormField
//                     control={form.control}
//                     name="style"
//                     render={({ field }) => (
//                         <FormItem>
//                             <FormLabel>Style</FormLabel>
//                             <FormControl>
//                                 <Select
//                                     onValueChange={field.onChange}
//                                     value={field.value}
//                                     defaultValue={field.value}
//                                 >
//                                     <SelectTrigger className="input">
//                                         <SelectValue
//                                             placeholder="Select the style"
//                                         />
//                                     </SelectTrigger>
//                                     <SelectContent>
//                                         <SelectItem value="formal">
//                                             Formal
//                                         </SelectItem>
//                                         <SelectItem value="casual">
//                                             Casual
//                                         </SelectItem>
//                                     </SelectContent>
//                                 </Select>
//                             </FormControl>
//                             <FormMessage />
//                         </FormItem>
//                     )}
//                 />
//                 <FormField
//                     control={form.control}
//                     name="duration"
//                     render={({ field }) => (
//                         <FormItem>
//                             <FormLabel>Estimated session duration in minutes</FormLabel>
//                             <FormControl>
//                                 <Input
//                                     type="number"
//                                     placeholder="15"
//                                     {...field}
//                                     className="input"
//                                 />
//                             </FormControl>
//                             <FormMessage />
//                         </FormItem>
//                     )}
//                 />
//                 <Button type="submit" className="w-full cursor-pointer">Build Your Companion</Button>
//             </form>
//         </Form>
//     )
// }

// export default CompanionForm;

"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { createCompanion, getUserSubjectsForForm } from "@/lib/actions/companion.actions";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const formSchema = z.object({
    name: z.string().min(1, 'Companion name is required.'),
    subject_id: z.string().min(1, 'Subject is required.'),
    topic_description: z.string().min(1, { message: 'Topic description is required.' }),
    voice: z.string().min(1, { message: 'Voice is required.' }),
    style: z.string().min(1, { message: 'Style is required.' }),
    duration: z.coerce.number().min(1, { message: 'Duration is required.' }),
});

const CompanionForm = () => {
    const router = useRouter();
    const [subjects, setSubjects] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            subject_id: '',
            topic_description: '',
            voice: '',
            style: '',
            duration: 15,
        },
    });

    // Fetch user's subjects directly from database on mount
    useEffect(() => {
        async function fetchSubjects() {
            try {
                setLoading(true);
                setError(null);
                const userSubjects = await getUserSubjectsForForm();

                if (!userSubjects || userSubjects.length === 0) {
                    setError('No subjects found for your board and class. Please complete your profile first.');
                } else {
                    setSubjects(userSubjects);
                }
            } catch (error: any) {
                console.error("Failed to fetch subjects:", error);
                setError(error.message || 'Failed to load subjects');
            } finally {
                setLoading(false);
            }
        }
        fetchSubjects();
    }, []);

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const companion = await createCompanion(values);
            if (companion) {
                router.push(`/companions/${companion.id}`);
            }
        } catch (error: any) {
            console.error("Failed to create companion:", error);
            // You can add a toast notification here
            alert(error.message || 'Failed to create companion');
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
                <p className="text-sm text-gray-500">Loading your subjects...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
                <p className="text-red-600 mb-4">{error}</p>
                <Button
                    onClick={() => window.location.href = '/profile'}
                    className="bg-primary hover:opacity-90"
                >
                    Complete Your Profile
                </Button>
            </div>
        );
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Companion Name</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="e.g. Math Genius"
                                    {...field}
                                    className="input"
                                    autoComplete="off"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="subject_id"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Subject</FormLabel>
                            <FormControl>
                                <Select
                                    onValueChange={field.onChange}
                                    value={field.value}
                                >
                                    <SelectTrigger className="input capitalize">
                                        <SelectValue placeholder="Select a subject" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {subjects.map((subject) => (
                                            <SelectItem
                                                key={subject.id}
                                                value={subject.id}
                                                className="capitalize"
                                            >
                                                <div className="flex items-center gap-2">
                                                    <div
                                                        className="w-3 h-3 rounded-full"
                                                        style={{ backgroundColor: subject.color_hex || '#ccc' }}
                                                    />
                                                    {subject.name}
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="topic_description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>What should this companion help you with?</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="e.g. I want to learn about derivatives, specifically the chain rule and product rule with lots of practice problems"
                                    {...field}
                                    className="input min-h-[100px]"
                                />
                            </FormControl>
                            <p className="text-xs text-gray-500 mt-1">
                                Be specific about what you want to learn. This helps us match you with the right topic.
                            </p>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="voice"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Voice</FormLabel>
                                <FormControl>
                                    <Select
                                        onValueChange={field.onChange}
                                        value={field.value}
                                    >
                                        <SelectTrigger className="input capitalize">
                                            <SelectValue placeholder="Select voice" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="male">Male</SelectItem>
                                            <SelectItem value="female">Female</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="style"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Teaching Style</FormLabel>
                                <FormControl>
                                    <Select
                                        onValueChange={field.onChange}
                                        value={field.value}
                                    >
                                        <SelectTrigger className="input">
                                            <SelectValue placeholder="Select style" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="formal">Formal</SelectItem>
                                            <SelectItem value="casual">Casual</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="duration"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Session Duration (minutes)</FormLabel>
                            <FormControl>
                                <Input
                                    type="number"
                                    min="5"
                                    max="120"
                                    placeholder="15"
                                    {...field}
                                    className="input"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button
                    type="submit"
                    className="w-full cursor-pointer bg-primary hover:opacity-90"
                    disabled={form.formState.isSubmitting}
                >
                    {form.formState.isSubmitting ? (
                        <div className="flex items-center gap-2">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            <span>Creating...</span>
                        </div>
                    ) : (
                        'Create Companion'
                    )}
                </Button>
            </form>
        </Form>
    );
};

export default CompanionForm;
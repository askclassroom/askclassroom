import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import Markdown from 'markdown-to-jsx';
import { Button } from '@/components/ui/button';

interface RealTimeExamplesModalProps {
    isOpen: boolean;
    onClose: () => void;
    examples: string | null;
    isGenerating: boolean;
    companionName: string;
    subject: string;
}

export function RealTimeExamplesModal({
    isOpen,
    onClose,
    examples,
    isGenerating,
    companionName,
    subject
}: RealTimeExamplesModalProps) {
    return (
        <Dialog open={isOpen} onOpenChange={(open: boolean) => !open && onClose()}>
            <DialogContent className="sm:max-w-3xl w-[90vw] h-[85vh] max-h-[85vh] flex flex-col p-6">
                <DialogHeader className="shrink-0">
                    <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                        <span>💡 Real-world Examples</span>
                    </DialogTitle>
                    <DialogDescription>
                        Based on your session with {companionName} about {subject}
                    </DialogDescription>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto flex flex-col mt-4 min-h-0 border rounded-md bg-slate-50">
                    {isGenerating ? (
                        <div className="flex-1 flex flex-col items-center justify-center space-y-4 min-h-[300px]">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                            <p className="text-lg font-medium text-gray-600 animate-pulse">
                                Analyzing transcript and generating examples...
                            </p>
                        </div>
                    ) : examples ? (
                        <div className="p-6">
                            <article className="prose prose-sm md:prose-base prose-slate max-w-none 
                                prose-headings:text-primary prose-a:text-blue-600 
                                prose-strong:text-slate-900 prose-ul:list-disc prose-ol:list-decimal pb-6">
                                <Markdown>{examples}</Markdown>
                            </article>
                        </div>
                    ) : (
                        <div className="flex-1 flex items-center justify-center text-gray-500 min-h-[300px]">
                            No examples generated yet.
                        </div>
                    )}
                </div>

                <div className="flex justify-end pt-4 border-t shrink-0 mt-4">
                    <Button onClick={onClose} variant="default">
                        Close
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}

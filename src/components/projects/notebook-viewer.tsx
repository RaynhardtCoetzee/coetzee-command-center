'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { MarkdownPreview } from '@/components/ui/markdown-preview';
import { Edit2, Eye, X, Split } from 'lucide-react';

interface NotebookViewerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  roadmap?: string | null;
  buildPlan?: string | null;
  onSave?: (roadmap: string, buildPlan: string) => void;
  readOnly?: boolean;
}

export function NotebookViewer({
  open,
  onOpenChange,
  roadmap = '',
  buildPlan = '',
  onSave,
  readOnly = false,
}: NotebookViewerProps) {
  const [activeTab, setActiveTab] = useState<'roadmap' | 'buildPlan'>('roadmap');
  const [viewMode, setViewMode] = useState<'preview' | 'edit' | 'split'>('preview');
  const [editRoadmap, setEditRoadmap] = useState(roadmap || '');
  const [editBuildPlan, setEditBuildPlan] = useState(buildPlan || '');
  
  // Sync with props when they change
  useEffect(() => {
    setEditRoadmap(roadmap || '');
    setEditBuildPlan(buildPlan || '');
  }, [roadmap, buildPlan]);

  // Reset state when modal opens/closes
  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setViewMode('preview');
      setEditRoadmap(roadmap || '');
      setEditBuildPlan(buildPlan || '');
    }
    onOpenChange(newOpen);
  };

  const handleSave = () => {
    if (onSave) {
      onSave(editRoadmap, editBuildPlan);
    }
    setViewMode('preview');
  };

  const handleCancel = () => {
    setEditRoadmap(roadmap || '');
    setEditBuildPlan(buildPlan || '');
    setViewMode('preview');
  };

  const handleCheckboxToggle = (lineIndex: number, checked: boolean) => {
    if (activeTab === 'roadmap') {
      const lines = editRoadmap.split('\n');
      const line = lines[lineIndex];
      
      if (line && line.match(/^[\s]*[-*]\s+\[[ xX]\]/)) {
        // Replace checkbox in the line
        const newLine = checked 
          ? line.replace(/\[ \]/, '[x]').replace(/\[x\]/i, '[x]')
          : line.replace(/\[[xX]\]/, '[ ]');
        lines[lineIndex] = newLine;
        setEditRoadmap(lines.join('\n'));
      }
    } else {
      const lines = editBuildPlan.split('\n');
      const line = lines[lineIndex];
      
      if (line && line.match(/^[\s]*[-*]\s+\[[ xX]\]/)) {
        // Replace checkbox in the line
        const newLine = checked 
          ? line.replace(/\[ \]/, '[x]').replace(/\[x\]/i, '[x]')
          : line.replace(/\[[xX]\]/, '[ ]');
        lines[lineIndex] = newLine;
        setEditBuildPlan(lines.join('\n'));
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden flex flex-col p-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b flex-shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle>Project Notebook</DialogTitle>
              <DialogDescription>
                View and edit your project roadmap and build plan
              </DialogDescription>
            </div>
            <div className="flex items-center gap-2">
              {!readOnly && (
                <>
                  <div className="flex items-center gap-1 border rounded-md">
                    <Button
                      variant={viewMode === 'preview' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setViewMode('preview')}
                      className="rounded-r-none"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={viewMode === 'split' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setViewMode('split')}
                      className="rounded-none border-x"
                    >
                      <Split className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={viewMode === 'edit' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setViewMode('edit')}
                      className="rounded-l-none"
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                  </div>
                  {viewMode !== 'preview' && (
                    <>
                      <Button variant="outline" size="sm" onClick={handleCancel}>
                        Cancel
                      </Button>
                      <Button size="sm" onClick={handleSave}>
                        Save Changes
                      </Button>
                    </>
                  )}
                </>
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleOpenChange(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex flex-col">
          <Tabs
            value={activeTab}
            onValueChange={(value) => setActiveTab(value as 'roadmap' | 'buildPlan')}
            className="flex-1 flex flex-col overflow-hidden"
          >
            <TabsList className="mx-6 mt-4 flex-shrink-0">
              <TabsTrigger value="roadmap">Roadmap</TabsTrigger>
              <TabsTrigger value="buildPlan">Build Plan</TabsTrigger>
            </TabsList>

            <TabsContent
              value="roadmap"
              className="flex-1 overflow-hidden flex flex-col mt-4 data-[state=active]:flex"
            >
              <div className="flex-1 overflow-hidden flex flex-col px-6 pb-6">
                {viewMode === 'edit' ? (
                  <div className="flex-1 flex flex-col min-h-0">
                    <textarea
                      value={editRoadmap}
                      onChange={(e) => setEditRoadmap(e.target.value)}
                      placeholder="Enter your roadmap in Markdown format..."
                      className="flex-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-mono ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none"
                    />
                  </div>
                ) : viewMode === 'split' ? (
                  <div className="flex-1 flex gap-4 min-h-0">
                    <div className="flex-1 flex flex-col min-h-0">
                      <div className="text-xs font-medium text-muted-foreground mb-2">Editor</div>
                      <textarea
                        value={editRoadmap}
                        onChange={(e) => setEditRoadmap(e.target.value)}
                        placeholder="Enter your roadmap in Markdown format..."
                        className="flex-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-mono ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none"
                      />
                    </div>
                    <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
                      <div className="text-xs font-medium text-muted-foreground mb-2">Preview</div>
                      <div className="flex-1 overflow-y-auto bg-muted p-4 rounded-md">
                        <MarkdownPreview 
                          content={editRoadmap}
                          onCheckboxToggle={handleCheckboxToggle}
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 overflow-y-auto">
                    {editRoadmap ? (
                      <div className="bg-muted p-6 rounded-md">
                        <MarkdownPreview 
                          content={editRoadmap}
                          onCheckboxToggle={handleCheckboxToggle}
                          editable={!readOnly}
                        />
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-full text-muted-foreground">
                        <p>No roadmap content yet. Click Edit to add content.</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent
              value="buildPlan"
              className="flex-1 overflow-hidden flex flex-col mt-4 data-[state=active]:flex"
            >
              <div className="flex-1 overflow-hidden flex flex-col px-6 pb-6">
                {viewMode === 'edit' ? (
                  <div className="flex-1 flex flex-col min-h-0">
                    <textarea
                      value={editBuildPlan}
                      onChange={(e) => setEditBuildPlan(e.target.value)}
                      placeholder="Enter your build plan in Markdown format..."
                      className="flex-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-mono ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none"
                    />
                  </div>
                ) : viewMode === 'split' ? (
                  <div className="flex-1 flex gap-4 min-h-0">
                    <div className="flex-1 flex flex-col min-h-0">
                      <div className="text-xs font-medium text-muted-foreground mb-2">Editor</div>
                      <textarea
                        value={editBuildPlan}
                        onChange={(e) => setEditBuildPlan(e.target.value)}
                        placeholder="Enter your build plan in Markdown format..."
                        className="flex-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-mono ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none"
                      />
                    </div>
                    <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
                      <div className="text-xs font-medium text-muted-foreground mb-2">Preview</div>
                      <div className="flex-1 overflow-y-auto bg-muted p-4 rounded-md">
                        <MarkdownPreview 
                          content={editBuildPlan}
                          onCheckboxToggle={handleCheckboxToggle}
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 overflow-y-auto">
                    {editBuildPlan ? (
                      <div className="bg-muted p-6 rounded-md">
                        <MarkdownPreview 
                          content={editBuildPlan}
                          onCheckboxToggle={handleCheckboxToggle}
                          editable={!readOnly}
                        />
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-full text-muted-foreground">
                        <p>No build plan content yet. Click Edit to add content.</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}

"use client";

import { useState } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { generateInsights } from '@/ai/flows/generate-insights';

type Row = Record<string, string | number>;

interface InsightsPanelProps {
  headers: string[];
  data: Row[];
}

export default function InsightsPanel({ headers, data }: InsightsPanelProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [insights, setInsights] = useState<string[] | null>(null);
  const { toast } = useToast();

  const convertDataToCsv = (): string => {
    const csvHeaders = headers.join(',');
    const csvRows = data.map(row => 
      headers.map(header => {
        const value = row[header];
        return typeof value === 'string' && value.includes(',') ? `"${value}"` : value;
      }).join(',')
    );
    return [csvHeaders, ...csvRows].join('\n');
  };

  const handleGenerateInsights = async () => {
    setIsLoading(true);
    setInsights(null);
    try {
      const csvData = convertDataToCsv();
      const result = await generateInsights({ csvData });
      if (result && result.insights && result.insights.length > 0) {
        setInsights(result.insights);
      } else {
        throw new Error('No insights were returned from the AI model.');
      }
    } catch (error) {
      console.error("Error generating insights:", error);
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
      toast({
        variant: "destructive",
        title: "AI Error",
        description: `Failed to generate insights. ${errorMessage}`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="shadow-lg transition-all duration-300">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-primary" />
          Data Insights
        </CardTitle>
        <CardDescription>Generate AI-powered insights from your data.</CardDescription>
      </CardHeader>
      <CardContent>
        <Button onClick={handleGenerateInsights} disabled={isLoading} className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              Generate Insights
            </>
          )}
        </Button>

        <div className="mt-6 space-y-4">
          {isLoading && (
            <>
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
            </>
          )}
          {insights && insights.map((insight, index) => (
            <Card key={index} className="bg-secondary/50 border-primary/20 animate-in fade-in-50 duration-500">
              <CardContent className="p-4 text-sm text-foreground/80">
                {insight}
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

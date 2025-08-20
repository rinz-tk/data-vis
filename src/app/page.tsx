'use client';

import { useState } from 'react';
import type { ChangeEvent } from 'react';
import { Upload, FileText, Search, BarChart, Loader2, Sparkles } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import DataTable from '@/components/data-table';
import InsightsPanel from '@/components/insights-panel';

type Row = Record<string, string | number>;

export default function Home() {
  const [headers, setHeaders] = useState<string[]>([]);
  const [data, setData] = useState<Row[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== 'text/csv') {
        toast({
            variant: "destructive",
            title: "Invalid File Type",
            description: "Please upload a .csv file.",
        });
        return;
    }

    setIsLoading(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const lines = text.split(/\r\n|\n/);
        
        const fileHeaders = lines[0].split(',').map(h => h.trim());
        const fileData = lines.slice(1).map(line => {
          const values = line.split(',');
          return fileHeaders.reduce((obj, header, index) => {
            const value = values[index]?.trim() || '';
            const numValue = parseFloat(value);
            // Check if value is a number but not an empty string
            obj[header] = !isNaN(numValue) && value !== '' ? numValue : value;
            return obj;
          }, {} as Row);
        }).filter(row => Object.values(row).some(val => String(val).trim() !== ''));

        setHeaders(fileHeaders);
        setData(fileData);
      } catch (error) {
        toast({
            variant: "destructive",
            title: "Parsing Error",
            description: "Could not parse the CSV file. Please check its format.",
        });
      } finally {
        setIsLoading(false);
      }
    };
    reader.onerror = () => {
        toast({
            variant: "destructive",
            title: "File Read Error",
            description: "Could not read the file.",
        });
        setIsLoading(false);
    }
    reader.readAsText(file);
    event.target.value = '';
  };

  const hasData = data.length > 0;

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto p-4 md:p-8">
        <header className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <BarChart className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold font-headline tracking-tight">DataVis</h1>
          </div>
          <div className="flex w-full md:w-auto items-center gap-2">
            {hasData && (
              <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search table..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            )}
            <Button asChild className="cursor-pointer" variant="outline">
              <label htmlFor="csv-upload">
                <Upload className="mr-2 h-4 w-4" />
                {hasData ? 'Upload New' : 'Upload CSV'}
              </label>
            </Button>
            <Input id="csv-upload" type="file" accept=".csv" className="hidden" onChange={handleFileUpload} />
          </div>
        </header>

        {isLoading ? (
            <div className="flex flex-col items-center justify-center gap-4 text-lg text-muted-foreground py-16">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <p>Processing your data...</p>
            </div>
        ) : hasData ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2">
              <DataTable headers={headers} data={data} searchQuery={searchQuery} />
            </div>
            <div className="lg:col-span-1 sticky top-8">
              <InsightsPanel headers={headers} data={data} />
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center border-2 border-dashed border-border rounded-xl p-12 text-center h-[60vh] transition-all hover:border-primary/50 hover:bg-secondary/50">
            <div className="p-4 bg-primary/10 rounded-full mb-4">
              <FileText className="h-12 w-12 text-primary" />
            </div>
            <h2 className="text-2xl font-semibold mb-2 font-headline">Welcome to DataVis</h2>
            <p className="text-muted-foreground mb-6 max-w-md">
              Start by uploading a CSV file to visualize your data. You can then sort, search, and generate AI-powered insights.
            </p>
            <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 cursor-pointer">
              <label htmlFor="csv-upload-main">
                <Upload className="mr-2 h-4 w-4" />
                Upload CSV
              </label>
            </Button>
            <Input id="csv-upload-main" type="file" accept=".csv" className="hidden" onChange={handleFileUpload} />
          </div>
        )}
      </div>
    </main>
  );
}

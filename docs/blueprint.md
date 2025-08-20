# **App Name**: DataVis

## Core Features:

- CSV Upload: Allow users to upload a CSV file.
- Data Parsing & Rendering: Parse the CSV data and transform it into a tabular format, render inside a react-table.
- Sorting: Enable sorting columns in the table by clicking on the header. Initial order: by first column.
- Search: Include a search input box above the table, where users can filter the table's contents
- Data Insights: AI Tool: Allow users to generate insight cards and visualize important info about the data displayed in table, powered by a LLM.

## Style Guidelines:

- Primary color: Saturated purple (#9D2EC5) to reflect analysis and insight, and give the application a contemporary feel.
- Background color: Very light purple (#F4F0F9), to match the purple vibe while providing a light UI.
- Accent color: Blue (#2E9DC5), an analogous color, used sparingly to highlight CTAs.
- Body and headline font: 'Inter', a grotesque-style sans-serif font, should be used for all text.
- The data table should take up the majority of the screen, with a clean header area for title, search, and upload elements.
- Use subtle transitions when loading the data and when a user interacts with table (search/sort). Aim for animations that have short durations.
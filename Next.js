import { SpeedInsights } from '@vercel/speed-insights/next';
 import { inject } from '@vercel/speed-insights';
inject();
```[_{{{CITATION{{{_2{vercel/speed-insights: Vercel Speed Insights package - GitHub](https://github.com/vercel/speed-insights)


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <title>Next.js</title>
      </head>
      <body>
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
}

import queryString from "query-string";
import { Poppins } from "next/font/google";
import { z } from "zod";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "@fortawesome/fontawesome-svg-core/styles.css";

import "./globals.css";

import { Header } from "@/components/Header/Header";
import { Footer } from "@/components/Footer/Footer";

const geistSans = Poppins({
  variable: "--font-poppins-sans",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { data } = await fetchData();

  return (
    <html lang="en">
      <head>
        <title>{data?.site_name}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        {data?.site_favicon && (
          <link rel="icon" href={data.site_favicon} sizes="any" />
        )}
      </head>
      <body
        className={`${geistSans.variable} antialiased font-primary text-gray-700`}
      >
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}

const fetchData = async (): Promise<z.infer<typeof ApiResponseSchema>> => {
  const query = queryString.stringify(
    {
      fields: ["site_name", "site_logo", "site_favicon"],
    },
    { arrayFormat: "bracket" }
  );

  const response = await fetch(
    `${process.env.API_URL}/settings/general?${query}`,
    {
      next: {
        tags: ["global"],
      },
    }
  );

  if (!response.ok) {
    const errorMessage = `Failed to fetch: ${response.status} ${response.statusText}`;
    throw new Error(errorMessage);
  }

  const data = await response.json();

  try {
    return ApiResponseSchema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.log(error.errors);

      throw new Error("API Response validation failed: " + error.message);
    }
    throw error;
  }
};

const ApiResponseSchema = z.object({
  data: z
    .object({
      site_name: z.string().nullable().optional(),
      site_logo: z.string().nullable().optional(),
      site_favicon: z.string().nullable().optional(),
    })
    .nullable(),
});

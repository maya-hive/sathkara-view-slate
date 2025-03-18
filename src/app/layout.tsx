import queryString from "query-string";
import { Poppins } from "next/font/google";
import { Metadata } from "next";
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
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
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

export async function generateMetadata(): Promise<Metadata> {
  const { data } = await fetchData();

  if (!data) {
    return {};
  }

  return {
    icons: data.site_favicon,
  };
}

const fetchData = async (): Promise<z.infer<typeof ApiResponseSchema>> => {
  const query = queryString.stringify(
    {
      fields: ["site_favicon"],
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
      site_favicon: z.string().nullable().optional(),
    })
    .nullable(),
});

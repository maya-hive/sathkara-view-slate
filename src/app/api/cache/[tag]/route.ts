import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { z } from "zod";

const requestSchema = z.object({
  tags: z.array(z.string()).nonempty("Tags array cannot be empty"),
});

export async function POST(req: Request) {
  // Implement authentication via a bearer token.

  try {
    const body = await req.json();
    const parsedData = requestSchema.parse(body);

    parsedData.tags.forEach((tag) => revalidateTag(tag));

    return NextResponse.json(
      { message: `Cache invalidated for tags: ${parsedData.tags.join(", ")}` },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.log(error.errors);

      return NextResponse.json(
        { message: "Failed to invalidate cache", error: error.message },
        { status: 400 }
      );
    }

    throw error;
  }
}

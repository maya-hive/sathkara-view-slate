import { z } from "zod";

export function nullableList<Output, Def extends z.ZodTypeDef, Input>(
  schema: z.ZodType<Output, Def, Input>
): z.ZodType<Output[] | null, z.ZodTypeDef, (Input | null)[] | null> {
  return z
    .array(schema.nullable())
    .nullable()
    .transform((items): Output[] | null =>
      items ? items.filter((item): item is Output => item != null) : items
    );
}

export function requiredList<Output, Def extends z.ZodTypeDef, Input>(
  schema: z.ZodType<Output, Def, Input>
): z.ZodType<Output[], z.ZodTypeDef, (Input | null)[]> {
  return z
    .array(schema.nullable())
    .transform((items): Output[] =>
      items.filter((item): item is Output => item != null)
    );
}

export const nullableStringList = nullableList(z.string());

export const nullableGallery = z
  .union([nullableStringList, z.string().nullable()])
  .nullable()
  .optional();

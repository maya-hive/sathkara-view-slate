export type ApiResponse<Type> = {
  data: Type | null;
};

export type ApiJSONResponse = {
  errors: { [key: string]: string[] };
  message: string;
};

export type BaseResource = {
  id: number;
  status: number;
  slug: string;
};

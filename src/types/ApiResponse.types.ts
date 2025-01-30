export type ApiResponse<Type> = {
  data: Type | null;
};

export type LinkFrame = {
  id: string;
  order: string;
  children?: Link[] | null;
  value: Link;
};

export type Link = {
  type: string;
  title: string;
  link: string | null;
  target: string;
  value: string;
};

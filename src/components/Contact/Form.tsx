import { ContactFormClient as FormClient } from "./Form.client";

interface Props {
  content?: string | null;
}

export const ContactForm = async ({ content }: Props) => {
  return (
    <div
      className="rounded-xl bg-muted border border-secondary p-6"
      id="inquiry_form"
    >
      <div className="flex justify-between flex-col xl:flex-row gap-4 pt-2 pb-8">
        {content && (
          <div
            className="[&>h3]:text-3xl [&>h3]:font-semibold [&>p]:mt-2 [&>p]:text-md [&>p]:font-medium"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        )}
      </div>
      <FormClient />
    </div>
  );
};

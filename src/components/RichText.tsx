interface Props {
  content: string | null;
}

export const RichText = ({ content }: Props) => {
  if (!content) return null;

  return (
    <div className="prose" dangerouslySetInnerHTML={{ __html: content }} />
  );
};

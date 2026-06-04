import { Helmet } from "react-helmet-async";

interface SeoHeadProps {
  title: string;
  description: string;
  canonical?: string;
  ogImage?: string;
  schema?: object | object[];
  noIndex?: boolean;
}

const BASE_URL = "https://oneworldvanlines.net";
const DEFAULT_IMAGE = `${BASE_URL}/opengraph.jpg`;

export default function SeoHead({ title, description, canonical, ogImage, schema, noIndex }: SeoHeadProps) {
  const fullCanonical = canonical ? `${BASE_URL}${canonical}` : undefined;
  const image = ogImage ?? DEFAULT_IMAGE;
  const schemas = schema ? (Array.isArray(schema) ? schema : [schema]) : [];

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      {noIndex ? <meta name="robots" content="noindex, nofollow" /> : <meta name="robots" content="index, follow" />}
      {fullCanonical && <link rel="canonical" href={fullCanonical} />}

      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      {fullCanonical && <meta property="og:url" content={fullCanonical} />}
      <meta property="og:site_name" content="One World Van Lines" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {schemas.map((s, i) => (
        <script key={i} type="application/ld+json">{JSON.stringify(s)}</script>
      ))}
    </Helmet>
  );
}

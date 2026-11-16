import { TemplateProps } from '@/shared/types';
import { KumkumKankotriTemplate } from './KumkumKankotriTemplate';
import { PatolaIvoryTemplate } from './PatolaIvoryTemplate';

export function TemplateRenderer({ data, previewMode = false }: TemplateProps) {
  const templateId = data.theme?.templateId || 'kumkum-kankotri';

  switch (templateId) {
    case 'patola-ivory':
      return <PatolaIvoryTemplate data={data} previewMode={previewMode} />;
    case 'kumkum-kankotri':
    default:
      return <KumkumKankotriTemplate data={data} previewMode={previewMode} />;
  }
}

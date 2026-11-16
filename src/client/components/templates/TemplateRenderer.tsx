import { TemplateProps } from '@/shared/types';
import { TheSacredGardenTemplate } from './TheSacredGardenTemplate';
import { KumkumKankotriTemplate } from './KumkumKankotriTemplate';
import { PatolaIvoryTemplate } from './PatolaIvoryTemplate';

export function TemplateRenderer({ data, previewMode = false }: TemplateProps) {
  const templateId = data.theme?.templateId || 'the-sacred-garden';

  switch (templateId) {
    case 'the-sacred-garden':
      return <TheSacredGardenTemplate data={data} previewMode={previewMode} />;
    case 'patola-ivory':
      return <PatolaIvoryTemplate data={data} previewMode={previewMode} />;
    case 'kumkum-kankotri':
    default:
      return <KumkumKankotriTemplate data={data} previewMode={previewMode} />;
  }
}

import { TemplateProps } from '@/shared/types';
import { RoyalTemplate } from './RoyalTemplate';
import { BotanicalTemplate } from './BotanicalTemplate';

export function TemplateRenderer({ data, previewMode = false }: TemplateProps) {
  const templateId = data.theme?.templateId || 'royal';

  switch (templateId) {
    case 'botanical':
      return <BotanicalTemplate data={data} previewMode={previewMode} />;
    case 'royal':
    default:
      return <RoyalTemplate data={data} previewMode={previewMode} />;
  }
}

import { TemplateProps } from '@/shared/types';
import { OrchideeTemplate } from './OrchideeTemplate';
import { BotanicalTemplate } from './BotanicalTemplate';
import { MinimalistTemplate } from './MinimalistTemplate';
import { RoyalTemplate } from './RoyalTemplate';

export function TemplateRenderer({ data, previewMode = false }: TemplateProps) {
  const templateId = data.theme?.templateId || 'orchidee';

  switch (templateId) {
    case 'elysee':
    case 'royal':
      return <RoyalTemplate data={data} previewMode={previewMode} />;
    case 'minimal':
    case 'minimalist' as any:
      return <MinimalistTemplate data={data} previewMode={previewMode} />;
    case 'sage':
    case 'botanical' as any:
      return <BotanicalTemplate data={data} previewMode={previewMode} />;
    case 'orchidee':
    default:
      return <OrchideeTemplate data={data} previewMode={previewMode} />;
  }
}

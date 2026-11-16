import { TemplateProps } from '@/shared/types';
import { RoyalTemplate } from './RoyalTemplate';
import { BotanicalTemplate } from './BotanicalTemplate';
import { MinimalistTemplate } from './MinimalistTemplate';
import { CelestialTemplate } from './CelestialTemplate';

export function TemplateRenderer({ data, previewMode = false }: TemplateProps) {
  const templateId = data.theme?.templateId || 'royal';

  switch (templateId) {
    case 'botanical':
      return <BotanicalTemplate data={data} previewMode={previewMode} />;
    case 'minimalist':
      return <MinimalistTemplate data={data} previewMode={previewMode} />;
    case 'celestial':
      return <CelestialTemplate data={data} previewMode={previewMode} />;
    case 'royal':
    default:
      return <RoyalTemplate data={data} previewMode={previewMode} />;
  }
}

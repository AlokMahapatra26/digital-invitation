import { TemplateProps } from '@/shared/types';
import { AmberTemplate } from './AmberTemplate';
import { OpalRomanceTemplate } from './OpalRomanceTemplate';
import { MountainTemplate } from './MountainTemplate';
import { EverAfterBloomTemplate } from './EverAfterBloomTemplate';
import { RoyalGraceTemplate } from './RoyalGraceTemplate';
import { TheSacredGardenTemplate } from './TheSacredGardenTemplate';
import { RajwadiKankotriTemplate } from './RajwadiKankotriTemplate';
import { PatolaIvoryTemplate } from './PatolaIvoryTemplate';

export function TemplateRenderer({ data, previewMode = false }: TemplateProps) {
  const templateId = data.theme?.templateId || 'mountain';

  switch (templateId) {
    case 'opal-romance':
      return <OpalRomanceTemplate data={data} previewMode={previewMode} />;
    case 'amber':
      return <AmberTemplate data={data} previewMode={previewMode} />;
    case 'ever-after-bloom':
      return <EverAfterBloomTemplate data={data} previewMode={previewMode} />;
    case 'mountain':
      return <MountainTemplate data={data} previewMode={previewMode} />;
    case 'royal-grace':
      return <RoyalGraceTemplate data={data} previewMode={previewMode} />;
    case 'the-sacred-garden':
      return <TheSacredGardenTemplate data={data} previewMode={previewMode} />;
    case 'patola-ivory':
      return <PatolaIvoryTemplate data={data} previewMode={previewMode} />;
    case 'rajwadi-kankotri':
    case 'kanku-kankotri':
    case 'kumkum-kankotri':
    default:
      return <RajwadiKankotriTemplate data={data} previewMode={previewMode} />;
  }
}

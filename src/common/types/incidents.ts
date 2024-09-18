import { Document } from '@contentful/rich-text-types';
import { ContentfulCollection } from 'contentful';
import { ContentTypeSys } from 'contentful/dist/types/types/content-type';
import { IncidentImpact } from 'statuspage.io';

interface ContentType {
  sys: ContentTypeSys;
  fields: {
    content: Document;
    impact: IncidentImpact;
    showOnMainnet: boolean;
    showOnTestnet: boolean;
    networkUrlSubstring: string;
  };
}

export type IncidentContent = ContentfulCollection<ContentType>;

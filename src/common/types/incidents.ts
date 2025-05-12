import { Document } from '@contentful/rich-text-types';
import { ContentTypeSys, ContentfulCollection } from 'contentful';
import { IncidentImpact } from 'statuspage.io';

export interface ContentType {
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

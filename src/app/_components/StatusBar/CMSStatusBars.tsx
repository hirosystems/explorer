import { documentToReactComponents } from '@contentful/rich-text-react-renderer';

import { useGlobalContext } from '../../../common/context/useGlobalContext';
import { IncidentContent } from '../../../common/types/incidents';
import { getRichTextRenderOptions } from '../../../common/utils/getRichTextRenderOptions';
import { Flex } from '../../../ui/Flex';
import { useColorMode } from '../../../ui/hooks/useColorMode';
import { StatusBarBase } from './StatusBarBase';

export function CMSStatusBars({ statusBarContent }: { statusBarContent: IncidentContent | null }) {
  const isTestnet = useGlobalContext().activeNetwork.mode === 'testnet';
  const incidentsToShow = !statusBarContent
    ? []
    : statusBarContent?.items?.filter(
        alert =>
          (alert.fields.showOnTestnet && isTestnet) || (alert.fields.showOnMainnet && !isTestnet)
      );
  const colorMode = useColorMode().colorMode;
  return (
    <Flex
      direction={'column'}
      _empty={{
        display: 'none',
      }}
    >
      {incidentsToShow?.map((incident, i) => {
        return (
          <StatusBarBase
            key={incident?.sys?.id}
            impact={incident?.fields?.impact}
            content={
              <Flex direction={'column'} gap={2} flexGrow={1}>
                {documentToReactComponents(
                  incident?.fields?.content,
                  getRichTextRenderOptions(colorMode, incident?.fields?.impact)()
                )}
              </Flex>
            }
          />
        );
      })}
    </Flex>
  );
}

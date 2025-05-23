import { Flex, Stack } from '@chakra-ui/react';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';

import { useGlobalContext } from '../../../common/context/useGlobalContext';
import { IncidentContent } from '../../../common/types/incidents';
import { getRichTextRenderOptions } from '../../../common/utils/getRichTextRenderOptions';
import { StatusBarBase } from './StatusBarBase';
import { getIncidentImpactIcon } from './utils';

export function CMSStatusBars({ statusBarContent }: { statusBarContent: IncidentContent | null }) {
  const isTestnet = useGlobalContext().activeNetwork.mode === 'testnet';
  const networkUrl = useGlobalContext().activeNetworkKey;
  const incidentsToShow = !statusBarContent
    ? []
    : statusBarContent?.items?.filter(
        alert =>
          (alert.fields.showOnTestnet && isTestnet) ||
          (alert.fields.showOnMainnet && !isTestnet) ||
          networkUrl?.includes(alert.fields.networkUrlSubstring)
      );

  return (
    <Stack
      _empty={{
        display: 'none',
      }}
    >
      {incidentsToShow?.map((incident, i) => {
        const icon = getIncidentImpactIcon(incident?.fields?.impact);

        const content = (
          <Stack gap={2} flexGrow={1}>
            {documentToReactComponents(
              incident?.fields?.content,
              getRichTextRenderOptions(incident?.fields?.impact)()
            )}
          </Stack>
        );

        return (
          <StatusBarBase
            key={incident?.sys?.id}
            content={
              <Flex gap={1.5} alignItems="center">
                {icon}
                {content}
              </Flex>
            }
          />
        );
      })}
    </Stack>
  );
}

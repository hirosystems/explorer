'use client';

import { IS_BROWSER } from '@/common/constants';
import { Box, Flex, Icon, TextLink } from '@/ui/components';
import { Text } from '@/ui/typography';
import { css } from '@emotion/react';
import React, { FC, ReactNode, useEffect, useState } from 'react';
import { BsExclamationCircle, BsExclamationTriangle } from 'react-icons/bs';
import { RiCloseLine } from 'react-icons/ri';
import { Statuspage, Incident, IncidentImpact } from 'statuspage.io';

const backgroundStyle = css`
  width: 100%;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px 0;
`;

const wrapperStyle = css`
  width: 100%;
  max-width: 1280px;
  padding: 0 32px;
`;

export const getColor = (incidentImpact: IncidentImpact) =>
  incidentImpact === IncidentImpact.Critical ? '#C83532' : '#A96500';

const statuspage = new Statuspage('3111l89394q4');

const incidentImpactSeverity: Record<IncidentImpact, number> = {
  [IncidentImpact.None]: 0,
  [IncidentImpact.Minor]: 1,
  [IncidentImpact.Major]: 2,
  [IncidentImpact.Critical]: 3,
};

export const StatusBar: FC = () => {
  const [unresolvedIncidents, setUnresolvedIncidents] = useState<Incident[]>([]);
  useEffect(() => {
    async function fetchIncidents() {
      try {
        setUnresolvedIncidents((await statuspage.api.incidents.getUnresolved()).incidents);
      } catch (error) {
        console.error(error);
      }
    }
    void fetchIncidents();
  }, []);
  const allIncidents = unresolvedIncidents.map(({ name }) => name).join(' - ');
  const highestImpact = unresolvedIncidents.reduce(
    (acc, { impact }) =>
      incidentImpactSeverity[impact] > incidentImpactSeverity[acc] ? impact : acc,
    IncidentImpact.None
  );
  return (
    <StatusBarBase
      impact={highestImpact}
      content={
        <Flex>
          <Text
            color={getColor(highestImpact)}
            fontWeight={500}
            fontSize={'14px'}
            lineHeight={'1.5'}
          >
            {allIncidents}
            {allIncidents.endsWith('.') ? '' : '.'}
          </Text>
          &nbsp;
          <Text fontWeight={400} fontSize={'14px'} color={'#000000'} lineHeight={'1.5'}>
            More information on the{' '}
            <TextLink
              href="https://status.hiro.so/"
              target="_blank"
              css={css`
                display: inline;
                text-decoration: underline;
              `}
            >
              Hiro status page
            </TextLink>
            .
          </Text>
        </Flex>
      }
    />
  );
};

export const StatusBarBase: FC<{ impact: IncidentImpact; content: ReactNode }> = ({
  content,
  impact,
}) => {
  if (impact === IncidentImpact.None) return null;
  const icon =
    impact === IncidentImpact.Critical ? (
      <Icon as={BsExclamationCircle} color={getColor(impact)} />
    ) : (
      <Icon as={BsExclamationTriangle} color={getColor(impact)} />
    );
  return (
    <Box css={backgroundStyle}>
      <Flex css={wrapperStyle} alignItems={'center'} justifyContent={'center'} gap={'20px'}>
        {icon}
        {content}
      </Flex>
    </Box>
  );
};

export const AlertBarBase: FC<{
  impact: IncidentImpact;
  content: ReactNode;
  dismissLSKey?: string;
}> = ({ content, impact, dismissLSKey }) => {
  const [hideAlert, setHideAlert] = useState(false);
  const localStorage = IS_BROWSER && (window as any).localStorage;
  useEffect(() => {
    if (dismissLSKey) setHideAlert(localStorage?.getItem?.(dismissLSKey) === 'true' || false);
  }, [dismissLSKey, localStorage]);
  if (hideAlert || impact === IncidentImpact.None) return null;
  const icon =
    impact === IncidentImpact.Critical ? (
      <Icon as={BsExclamationCircle} color={getColor(impact)} />
    ) : (
      <Icon as={BsExclamationTriangle} color={getColor(impact)} />
    );
  return (
    <Flex
      backgroundColor={'#FDF1DD'}
      width={'100%'}
      alignItems={'center'}
      justifyContent={'center'}
      padding={'16px 0 19px 0'}
    >
      <Flex css={wrapperStyle} gap={'16px'}>
        {icon}
        {content}
        {!!dismissLSKey && (
          <Icon
            as={RiCloseLine}
            size={4}
            color={'textCaption'}
            style={{ cursor: 'pointer' }}
            onClick={() => {
              setHideAlert(true);
              localStorage.setItem(dismissLSKey, 'true');
            }}
          />
        )}
      </Flex>
    </Flex>
  );
};

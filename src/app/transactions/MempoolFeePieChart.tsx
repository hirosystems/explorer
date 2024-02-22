import { useColorModeValue, useTheme } from '@chakra-ui/react';
import { Cell, Pie, PieChart } from 'recharts';

const pieChartWidth = 215;
const pieChartHeight = 200;

const renderCustomizedLabel = ({
  percent,
  cx,
  cy,
  midAngle,
  outerRadius,
  color,
}: {
  percent: number;
  x: number;
  y: number;
  cx: number;
  cy: number;
  midAngle: number;
  outerRadius: number;
  color: string;
}) => {
  if (!percent) return null; // Don't show zeros
  const RADIAN = Math.PI / 180;
  const radius = outerRadius + 25; // Increase radius to move label further out
  const newX = cx + radius * Math.cos(-midAngle * RADIAN);
  const newY = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text
      x={newX}
      y={newY}
      fill={color}
      fontSize="var(--stacks-fontSizes-xs)"
      textAnchor="middle"
      dominantBaseline="central"
    >
      {percent * 100 < 1 ? '<1%' : `${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const renderCenterCustomizedLabel = ({
  label,
  cx,
  cy,
  color,
}: {
  label: string;
  cx: number;
  cy: number;
  color: string;
}) => {
  return (
    <text
      x={cx}
      y={cy}
      textAnchor="middle"
      dominantBaseline="central"
      style={{
        fill: color,
        fontSize: 'var(--stacks-fontSizes-xl)',
        fontWeight: 'var(--stacks-fontWeights-medium)',
      }}
    >
      {label}
    </text>
  );
};

export function getTxTypePieChartColor(txType: string) {
  switch (txType) {
    case 'token_transfer':
      return 'var(--stacks-colors-others-lilac)';
    case 'contract_call':
      return 'var(--stacks-colors-purple-850)';
    case 'smart_contract':
      return 'var(--stacks-colors-others-limeGreen)';
    default:
      return 'purple';
  }
}

export function MempoolFeePieChart({
  filteredTxTypeCounts,
  totalTxCount,
}: {
  filteredTxTypeCounts: {
    token_transfer: number;
    smart_contract: number;
    contract_call: number;
  };
  totalTxCount: number;
}) {
  const pieData = Object.entries(filteredTxTypeCounts)
    .filter(([_, count]) => count !== 0)
    .map(([txType, count]) => {
      return {
        name: txType,
        value: (count / totalTxCount) * 100,
      };
    });
  const textColor = useColorModeValue('black', 'white');
  const theme = useTheme();
  const secondaryTextColor = useColorModeValue(theme.colors.slate[700], theme.colors.slate[500]);
  return (
    <PieChart width={pieChartWidth} height={pieChartHeight}>
      <Pie
        paddingAngle={3}
        startAngle={0}
        data={pieData}
        dataKey="value"
        nameKey="name"
        cx="50%"
        cy="50%"
        labelLine={false}
        label={props => renderCustomizedLabel({ ...props, color: secondaryTextColor })}
        innerRadius={60}
        outerRadius={67}
      >
        {pieData.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={getTxTypePieChartColor(entry.name)} stroke="none" />
        ))}
      </Pie>
      {renderCenterCustomizedLabel({
        label: `${totalTxCount} tx`,
        cx: pieChartWidth / 2,
        cy: pieChartHeight / 2,
        color: textColor,
      })}
    </PieChart>
  );
}

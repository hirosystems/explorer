import { useColorModeValue } from '@chakra-ui/react';
import { Cell, Pie, PieChart } from 'recharts';

const pieChartWidth = 215;
const pieChartHeight = 200;

const renderCustomizedLabel = ({
  percent,
  cx,
  cy,
  midAngle,
  outerRadius,
}: {
  percent: number;
  x: number;
  y: number;
  cx: number;
  cy: number;
  midAngle: number;
  outerRadius: number;
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
      fill="#737680"
      fontSize="12px"
      textAnchor="middle"
      dominantBaseline="central"
    >
      {`${(percent * 100).toFixed(0)}%`}
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
        fontSize: '20px',
        fontStyle: 'normal',
        fontWeight: 500,
        lineHeight: '24px',
        letterSpacing: '-0.2px',
      }}
    >
      {label}
    </text>
  );
};

export function getTxTypePieChartColor(txType: string) {
  switch (txType) {
    case 'token_transfer':
      return '#9985FF';
    case 'contract_call':
      return '#2D2294';
    case 'smart_contract':
      return '#C1D21B';
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
  const pieData = Object.entries(filteredTxTypeCounts).map(([key, value]) => {
    return {
      name: key,
      value: Math.round((value / totalTxCount) * 100),
    };
  });
  const textColor = useColorModeValue('#1C2024', '#FCFCFD');
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
        label={renderCustomizedLabel}
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

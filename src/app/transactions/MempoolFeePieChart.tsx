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
      textAnchor="middle"
      dominantBaseline="central"
      style={{
        fill: 'var(--stacks-colors-text-subdued)',
        fontSize: 'var(--stacks-font-sizes-xs)',
      }}
    >
      {percent * 100 < 1 ? '<1%' : `${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const renderCenterCustomizedLabel = ({
  label,
  cx,
  cy,
}: {
  label: string;
  cx: number;
  cy: number;
}) => {
  return (
    <text
      x={cx}
      y={cy}
      textAnchor="middle"
      dominantBaseline="central"
      style={{
        fill: 'var(--stacks-colors-text)',
        fontSize: 'var(--stacks-font-sizes-xl)',
        fontWeight: 'var(--stacks-font-weights-medium)',
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
      return 'var(--stacks-colors-others-lime-green)';
    default:
      return 'purple';
  }
}

export function MempoolFeePieChart({
  filteredTxTypeCounts,
  totalTxCount,
}: {
  filteredTxTypeCounts: Record<string, number>;
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
        label={props =>
          renderCustomizedLabel({
            ...props,
          })
        }
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
      })}
    </PieChart>
  );
}

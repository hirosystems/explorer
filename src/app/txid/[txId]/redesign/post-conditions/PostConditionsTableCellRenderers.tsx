export interface AmountAssetCellRendererProps {
    amount: string;
    asset: string;
}

export function AmountAssetCellRenderer({ amount, asset }: AmountAssetCellRendererProps) {
    return (
        <Flex alignItems="center" justifyContent="flex-start">
            {amount} {asset}
        </Flex>
    );
}
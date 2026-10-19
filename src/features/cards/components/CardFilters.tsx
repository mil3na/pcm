import { Cross2Icon } from '@radix-ui/react-icons';
import { Button, Flex, Select, Text } from '@radix-ui/themes';

const ALL_VALUE = '__all__';

interface CardFiltersProps {
    type?: string;
    rarity?: string;
    types: string[];
    rarities: string[];
    typesDisabled: boolean;
    raritiesDisabled: boolean;
    onTypeChange: (type: string | undefined) => void;
    onRarityChange: (rarity: string | undefined) => void;
    onClear: () => void;
}

export function CardFilters({
    type,
    rarity,
    types,
    rarities,
    typesDisabled,
    raritiesDisabled,
    onTypeChange,
    onRarityChange,
    onClear,
}: CardFiltersProps) {
    return (
        <Flex align="end" gap="3" wrap="wrap" mb="5">
            <div className={`card-filter${typesDisabled ? ' card-filter-disabled' : ''}`}>
                <Text as="span" size="2" weight="medium">
                    Pokémon type
                </Text>
                <Select.Root
                    value={type ?? ALL_VALUE}
                    onValueChange={(value) => onTypeChange(value === ALL_VALUE ? undefined : value)}
                    disabled={typesDisabled}
                >
                    <Select.Trigger aria-label="Filter by Pokémon type" placeholder="All types" />
                    <Select.Content>
                        <Select.Item value={ALL_VALUE}>All types</Select.Item>
                        {types.map((option) => (
                            <Select.Item key={option} value={option}>
                                {option}
                            </Select.Item>
                        ))}
                    </Select.Content>
                </Select.Root>
            </div>
            <div className={`card-filter${raritiesDisabled ? ' card-filter-disabled' : ''}`}>
                <Text as="span" size="2" weight="medium">
                    Rarity
                </Text>
                <Select.Root
                    value={rarity ?? ALL_VALUE}
                    onValueChange={(value) =>
                        onRarityChange(value === ALL_VALUE ? undefined : value)
                    }
                    disabled={raritiesDisabled}
                >
                    <Select.Trigger aria-label="Filter by rarity" placeholder="All rarities" />
                    <Select.Content>
                        <Select.Item value={ALL_VALUE}>All rarities</Select.Item>
                        {rarities.map((option) => (
                            <Select.Item key={option} value={option}>
                                {option}
                            </Select.Item>
                        ))}
                    </Select.Content>
                </Select.Root>
            </div>
            {(type || rarity) && (
                <Button variant="soft" onClick={onClear}>
                    <Cross2Icon aria-hidden="true" />
                    Clear filters
                </Button>
            )}
        </Flex>
    );
}

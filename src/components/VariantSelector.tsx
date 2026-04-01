import type { Variant } from '../api/products.api';

interface Props {
  variants: Variant[];
  selected: Variant | null;
  onSelect: (variant: Variant) => void;
}

export default function VariantSelector({
  variants,
  selected,
  onSelect,
}: Props) {
  return (
    <div>
      <h3 className="text-base font-semibold mb-3">
        Select Variant
      </h3>

      <div className="flex flex-wrap gap-2">
        {variants.map((v) => {
          const outOfStock = v.stock === 0;
          const isSelected = selected?.id === v.id;

          return (
            <button
              key={v.id}
              disabled={outOfStock}
              onClick={() => onSelect(v)}
              title={
                outOfStock
                  ? 'Out of stock'
                  : `${v.stock} in stock`
              }
              className={`
                px-4 py-2 rounded-lg text-sm font-medium
                border transition
                ${isSelected
                  ? 'bg-gray-900 text-white border-gray-900'
                  : outOfStock
                  ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed line-through'
                  : 'bg-white text-gray-800 border-gray-300 hover:border-gray-900'
                }
              `}
            >
              {v.combinationKey}
              {outOfStock && ' (out of stock)'}
            </button>
          );
        })}
      </div>

      {selected && (
        <div className="mt-4 p-3 bg-gray-50 rounded-lg text-sm space-y-1">
          <p>
            <span className="font-medium">Selected:</span>{' '}
            {selected.combinationKey}
          </p>
          <p>
            <span className="font-medium">Stock:</span>{' '}
            {selected.stock}
          </p>
          {selected.priceOverride && (
            <p>
              <span className="font-medium">Price:</span>{' '}
              ${Number(selected.priceOverride).toFixed(2)}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
import { useMemo } from 'react';
import { useStore } from '../../../../store';
import type { ConstructionObject } from '../../../../types';

export function useObjectDetails(object: ConstructionObject | null) {
  const { objectWorkItems, objectMaterialItems } = useStore();

  return useMemo(() => {
    if (!object) return { workItems: [], materials: [] };

    return {
      workItems: objectWorkItems
        .filter((item) => item.object_id === object.id)
        .map((item) => ({
          id: item.id,
          name: item.name,
          quantity: item.quantity,
          unit: item.unit,
          pricePerUnit: item.price,
          total: item.quantity * item.price,
        })),
      materials: objectMaterialItems
        .filter((item) => item.object_id === object.id)
        .map((item) => ({
          id: item.id,
          name: item.name,
          quantity: item.quantity,
          unit: item.unit,
          price: item.purchase_price,
          markup: item.markup,
          date: item.created_at,
        })),
    };
  }, [object, objectMaterialItems, objectWorkItems]);
}

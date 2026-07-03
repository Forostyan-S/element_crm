-- Materials catalog
CREATE TABLE materials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category text NOT NULL,
  name text NOT NULL,
  article text,
  manufacturer text,
  unit text NOT NULL DEFAULT 'шт',
  current_stock numeric NOT NULL DEFAULT 0,
  min_stock numeric NOT NULL DEFAULT 0,
  purchase_price numeric NOT NULL DEFAULT 0,
  sale_price numeric NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Warehouse operations (receipts, write-offs, returns, adjustments)
CREATE TABLE warehouse_operations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  material_id uuid NOT NULL REFERENCES materials(id) ON DELETE CASCADE,
  operation_type text NOT NULL CHECK (operation_type IN ('receipt', 'writeoff', 'return', 'adjustment')),
  quantity numeric NOT NULL,
  object_id uuid,
  notes text,
  user_id text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Purchases / procurement
CREATE TABLE purchases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  supplier text NOT NULL,
  purchase_date date NOT NULL DEFAULT CURRENT_DATE,
  total_amount numeric NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'ordered', 'in_transit', 'received')),
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Purchase items
CREATE TABLE purchase_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  purchase_id uuid NOT NULL REFERENCES purchases(id) ON DELETE CASCADE,
  material_id uuid NOT NULL REFERENCES materials(id) ON DELETE CASCADE,
  quantity numeric NOT NULL,
  price numeric NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Object history (material write-offs and other actions)
CREATE TABLE object_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  object_id uuid NOT NULL,
  action_type text NOT NULL,
  description text NOT NULL,
  user_id text,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE warehouse_operations ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchase_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE object_history ENABLE ROW LEVEL SECURITY;

-- RLS Policies for materials
CREATE POLICY "select_own_materials" ON materials FOR SELECT TO authenticated USING (true);
CREATE POLICY "insert_own_materials" ON materials FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "update_own_materials" ON materials FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "delete_own_materials" ON materials FOR DELETE TO authenticated USING (true);

-- RLS Policies for warehouse_operations
CREATE POLICY "select_own_operations" ON warehouse_operations FOR SELECT TO authenticated USING (true);
CREATE POLICY "insert_own_operations" ON warehouse_operations FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "update_own_operations" ON warehouse_operations FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "delete_own_operations" ON warehouse_operations FOR DELETE TO authenticated USING (true);

-- RLS Policies for purchases
CREATE POLICY "select_own_purchases" ON purchases FOR SELECT TO authenticated USING (true);
CREATE POLICY "insert_own_purchases" ON purchases FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "update_own_purchases" ON purchases FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "delete_own_purchases" ON purchases FOR DELETE TO authenticated USING (true);

-- RLS Policies for purchase_items
CREATE POLICY "select_own_purchase_items" ON purchase_items FOR SELECT TO authenticated USING (true);
CREATE POLICY "insert_own_purchase_items" ON purchase_items FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "update_own_purchase_items" ON purchase_items FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "delete_own_purchase_items" ON purchase_items FOR DELETE TO authenticated USING (true);

-- RLS Policies for object_history
CREATE POLICY "select_own_object_history" ON object_history FOR SELECT TO authenticated USING (true);
CREATE POLICY "insert_own_object_history" ON object_history FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "update_own_object_history" ON object_history FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "delete_own_object_history" ON object_history FOR DELETE TO authenticated USING (true);

-- Indexes
CREATE INDEX idx_materials_category ON materials(category);
CREATE INDEX idx_warehouse_operations_material ON warehouse_operations(material_id);
CREATE INDEX idx_warehouse_operations_type ON warehouse_operations(operation_type);
CREATE INDEX idx_warehouse_operations_object ON warehouse_operations(object_id);
CREATE INDEX idx_purchases_status ON purchases(status);
CREATE INDEX idx_purchase_items_purchase ON purchase_items(purchase_id);
CREATE INDEX idx_object_history_object ON object_history(object_id);
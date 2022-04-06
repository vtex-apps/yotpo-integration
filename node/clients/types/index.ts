export interface YotpoProductsRetrieveData {
  products: Product[]
  pagination: Pagination
}

export interface Pagination {
  next_page_info: null
}

export interface Product {
  yotpo_id: number
  created_at: string
  updated_at: string
  external_id: string
  name: string
  description: null
  status: null
  url: string
  image_url: null | string
  price: number | null
  compare_at_price: null
  currency: null | string
  inventory_quantity: null
  is_discontinued: boolean
  group_name: null
  brand: null | string
  sku: null | string
  mpn: null
  handle: null
  custom_properties: CustomProperties | null
  external_created_at: null
  external_updated_at: null
  store_id: StoreID
  is_valid_url_format: boolean
  gtins: Gtin[] | null
}

export interface CustomProperties {
  is_blocklisted: boolean
  review_form_tag: string
}

export interface Gtin {
  declared_type: string
  value: string
  detected_type: null
}

export enum StoreID {
  BfkuaNEndakw0KcmHERabVpVcZCcv5ZcoRkeN7X1 = 'BfkuaNEndakw0KcmHERabVpVcZCcv5ZcoRkeN7x1',
}

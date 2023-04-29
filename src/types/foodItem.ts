// Generated by https://quicktype.io

export interface FoodItem {
  id: number;
  name: string;
  description: string | null;
  is_raw: boolean;
  image_url: string;
  kcal: number | null;
  water: number | null;
  protein: number | null;
  fat: number | null;
  carbohydrate: number | null;
  fiber: number | null;
  alcohol: number | null;
  created_at: string;
  updated_at: string;
  categories: Category[];
  food_regions: FoodRegion[];
  source: string;
  serving_size?: number;
}

export interface Category {
  id: number;
  name: CategoryName;
  description: string | null;
  created_at: string;
  updated_at: string;
  pivot: Pivot;
}

export enum CategoryName {
  Carrot = "Carrot",
  Citrus = "Citrus",
  Fruit = "Fruit",
  Vegetable = "Vegetable",
}

export interface Pivot {
  food_id: number;
  category_id: number;
}

export interface FoodRegion {
  id: number;
  country_region_id: number;
  food_id: number;
  local_name: string;
  grows_in_region: boolean;
  created_at: string | null;
  updated_at: string | null;
  seasons: Season[];
  region: Region;
}

export interface Region {
  id: number;
  name: string;
  local_name: string;
  country_code: CountryCode;
  is_entire_country: boolean;
  created_at: string;
  updated_at: string;
  country?: Country;
}

export interface Country {
  code: CountryCode;
  name: CountryCode;
  local_name: string | null;
}

export enum CountryCode {
  Fr = "fr",
  Pl = "pl",
}

export interface Season {
  id: number;
  start_date: string;
  month: number;
  month_name: MonthName;
  food_region_id: number;
  created_at: string;
  updated_at: string;
}

export enum MonthName {
  January = "January",
  February = "February",
  March = "March",
  April = "April",
  May = "May",
  June = "June",
  July = "July",
  August = "August",
  September = "September",
  October = "October",
  November = "November",
  December = "December",
}

// Generated for OpenFoodFacts API

export interface OpenFoodFactsFoodItem {
  _id: string;
  _keywords: string[];
  abbreviated_product_name: string;
  abbreviated_product_name_fr: string;
  abbreviated_product_name_fr_imported: string;
  added_countries_tags: any[];
  additives_debug_tags: string[];
  additives_n: number;
  additives_old_n: number;
  additives_old_tags: string[];
  additives_original_tags: string[];
  additives_prev_original_tags: string[];
  additives_tags: string[];
  allergens: string;
  allergens_from_ingredients: string;
  allergens_from_user: string;
  allergens_hierarchy: string[];
  allergens_imported: string;
  allergens_lc: string;
  allergens_tags: string[];
  amino_acids_prev_tags: any[];
  amino_acids_tags: any[];
  brands: string;
  brands_imported: string;
  brands_tags: string[];
  categories: string;
  categories_hierarchy: string[];
  categories_lc: string;
  categories_old: string;
  categories_properties: CategoriesProperties;
  categories_properties_tags: string[];
  categories_tags: string[];
  category_properties: CategoryProperties;
  checkers_tags: any[];
  ciqual_food_name_tags: string[];
  cities_tags: any[];
  code: string;
  codes_tags: string[];
  compared_to_category: string;
  complete: number;
  completeness: string;
  conservation_conditions: string;
  conservation_conditions_fr: string;
  conservation_conditions_fr_imported: string;
  correctors_tags: string[];
  countries: string;
  countries_beforescanbot: string;
  countries_hierarchy: string[];
  countries_imported: string;
  countries_lc: string;
  countries_tags: string[];
  created_t: number;
  creator: string;
  customer_service: string;
  customer_service_fr: string;
  customer_service_fr_imported: string;
  data_quality_bugs_tags: any[];
  data_quality_errors_tags: any[];
  data_quality_info_tags: string[];
  data_quality_tags: string[];
  data_quality_warnings_tags: string[];
  data_sources: string;
  data_sources_imported: string;
  data_sources_tags: string[];
  debug_param_sorted_langs: string[];
  ecoscore_data: EcoscoreData;
  ecoscore_grade: EcoscoreGrade;
  ecoscore_score: number;
  ecoscore_tags: EcoscoreGrade[];
  editors_tags: string[];
  emb_codes: string;
  emb_codes_orig: string;
  emb_codes_tags: any[];
  entry_dates_tags: string[];
  expiration_date: string;
  food_groups: string;
  food_groups_tags: string[];
  generic_name: string;
  generic_name_en: string;
  generic_name_es: string;
  generic_name_fr: string;
  generic_name_fr_imported: string;
  grades: Grades;
  id: string;
  image_front_small_url: string;
  image_front_thumb_url: string;
  image_front_url: string;
  image_ingredients_small_url: string;
  image_ingredients_thumb_url: string;
  image_ingredients_url: string;
  image_nutrition_small_url: string;
  image_nutrition_thumb_url: string;
  image_nutrition_url: string;
  image_small_url: string;
  image_thumb_url: string;
  image_url: string;
  images: Images;
  informers_tags: string[];
  ingredients: Ingredient[];
  ingredients_analysis: IngredientsAnalysis;
  ingredients_analysis_tags: string[];
  ingredients_debug: Array<null | string>;
  ingredients_from_or_that_may_be_from_palm_oil_n: number;
  ingredients_from_palm_oil_n: number;
  ingredients_from_palm_oil_tags: any[];
  ingredients_hierarchy: string[];
  ingredients_ids_debug: string[];
  ingredients_n: number;
  ingredients_n_tags: string[];
  ingredients_original_tags: string[];
  ingredients_percent_analysis: number;
  ingredients_tags: string[];
  ingredients_text: string;
  ingredients_text_debug: string;
  ingredients_text_en: string;
  ingredients_text_es: string;
  ingredients_text_fr: string;
  ingredients_text_fr_imported: string;
  ingredients_text_with_allergens: string;
  ingredients_text_with_allergens_en: string;
  ingredients_text_with_allergens_es: string;
  ingredients_text_with_allergens_fr: string;
  ingredients_that_may_be_from_palm_oil_n: number;
  ingredients_that_may_be_from_palm_oil_tags: string[];
  ingredients_with_specified_percent_n: number;
  ingredients_with_specified_percent_sum: number;
  ingredients_with_unspecified_percent_n: number;
  ingredients_with_unspecified_percent_sum: number;
  interface_version_created: string;
  interface_version_modified: string;
  known_ingredients_n: number;
  labels: string;
  labels_hierarchy: string[];
  labels_imported: string;
  labels_lc: string;
  labels_old: string;
  labels_tags: string[];
  lang: string;
  lang_imported: string;
  languages: Languages;
  languages_codes: LanguagesCodes;
  languages_hierarchy: string[];
  languages_tags: string[];
  last_edit_dates_tags: string[];
  last_editor: string;
  last_image_dates_tags: string[];
  last_image_t: number;
  last_modified_by: string;
  last_modified_t: number;
  lc: string;
  lc_imported: string;
  link: string;
  main_countries_tags: any[];
  manufacturing_places: string;
  manufacturing_places_tags: any[];
  max_imgid: string;
  minerals_prev_tags: any[];
  minerals_tags: any[];
  misc_tags: string[];
  no_nutrition_data: string;
  nova_group: number;
  nova_group_debug: string;
  nova_groups: string;
  nova_groups_markers: { [key: string]: Array<string[]> };
  nova_groups_tags: string[];
  nucleotides_prev_tags: any[];
  nucleotides_tags: any[];
  nutrient_levels: NutrientLevels;
  nutrient_levels_tags: string[];
  nutriments: Nutriments;
  nutriscore_data: NutriscoreData;
  nutriscore_grade: string;
  nutriscore_grade_producer: string;
  nutriscore_grade_producer_imported: string;
  nutriscore_score: number;
  nutriscore_score_opposite: number;
  nutrition_data: string;
  nutrition_data_per: string;
  nutrition_data_per_imported: string;
  nutrition_data_prepared: string;
  nutrition_data_prepared_per: string;
  nutrition_data_prepared_per_imported: string;
  nutrition_grade_fr: string;
  nutrition_grades: string;
  nutrition_grades_tags: string[];
  nutrition_score_beverage: number;
  nutrition_score_debug: string;
  nutrition_score_warning_fruits_vegetables_nuts_estimate_from_ingredients: number;
  nutrition_score_warning_fruits_vegetables_nuts_estimate_from_ingredients_value: number;
  obsolete_imported: string;
  origin_en: string;
  origin_es: string;
  origin_fr: string;
  origins: string;
  origins_hierarchy: any[];
  origins_lc: string;
  origins_old: string;
  origins_tags: any[];
  other_nutritional_substances_tags: any[];
  owner: string;
  owner_fields: { [key: string]: number };
  owner_imported: string;
  owners_tags: string;
  packaging: string;
  packaging_hierarchy: string[];
  packaging_imported: string;
  packaging_lc: string;
  packaging_materials_tags: any[];
  packaging_old: string;
  packaging_old_before_taxonomization: string;
  packaging_recycling_tags: any[];
  packaging_shapes_tags: string[];
  packaging_tags: string[];
  packaging_text_en: string;
  packaging_text_es: string;
  packaging_text_fr: string;
  packagings: OpenFoodFactsFoodItemPackaging[];
  photographers_tags: string[];
  pnns_groups_1: string;
  pnns_groups_1_tags: string[];
  pnns_groups_2: string;
  pnns_groups_2_tags: string[];
  popularity_key: string;
  popularity_tags: string[];
  preparation: string;
  preparation_fr: string;
  preparation_fr_imported: string;
  producer_version_id: string;
  producer_version_id_imported: string;
  product_name: string;
  product_name_en: string;
  product_name_es: string;
  product_name_fr: string;
  product_name_fr_imported: string;
  product_quantity: string;
  purchase_places: string;
  purchase_places_tags: string[];
  quantity: string;
  quantity_imported: string;
  removed_countries_tags: any[];
  rev: number;
  scans_n: number;
  scores: Grades;
  selected_images: SelectedImages;
  serving_quantity: string;
  serving_size: string;
  serving_size_imported: string;
  sortkey: number;
  sources: Source[];
  sources_fields: SourcesFields;
  states: string;
  states_hierarchy: string[];
  states_tags: string[];
  stores: string;
  stores_tags: any[];
  traces: string;
  traces_from_ingredients: string;
  traces_from_user: string;
  traces_hierarchy: any[];
  traces_lc: string;
  traces_tags: any[];
  unique_scans_n: number;
  unknown_ingredients_n: number;
  unknown_nutrients_tags: any[];
  update_key: string;
  url: string;
  vitamins_prev_tags: any[];
  vitamins_tags: any[];
  weighers_tags: any[];
}

export interface CategoriesProperties {
  "agribalyse_food_code:en": string;
  "ciqual_food_code:en": string;
}

export interface CategoryProperties {
  "ciqual_food_name:en": string;
  "ciqual_food_name:fr": string;
}

export interface EcoscoreData {
  adjustments: Adjustments;
  agribalyse: EcoscoreDataAgribalyse;
  grade: EcoscoreGrade;
  grades: { [key: string]: EcoscoreGrade };
  missing: Missing;
  missing_data_warning: number;
  previous_data: PreviousData;
  score: number;
  scores: { [key: string]: number };
  status: string;
}

export interface Adjustments {
  origins_of_ingredients: OriginsOfIngredients;
  packaging: AdjustmentsPackaging;
  production_system: ProductionSystem;
  threatened_species: ThreatenedSpecies;
}

export interface OriginsOfIngredients {
  aggregated_origins: AggregatedOrigin[];
  epi_score: number;
  epi_value: number;
  origins_from_origins_field: string[];
  transportation_score: number;
  transportation_scores: { [key: string]: number };
  transportation_value: number;
  transportation_values: { [key: string]: number };
  value: number;
  values: { [key: string]: number };
  warning: string;
}

export interface AggregatedOrigin {
  epi_score: number;
  origin: string;
  percent: number;
  transportation_score: null;
}

export interface AdjustmentsPackaging {
  non_recyclable_and_non_biodegradable_materials: number;
  packagings: PackagingPackaging[];
  score: number;
  value: number;
  warning: string;
}

export interface PackagingPackaging {
  ecoscore_material_score: number;
  ecoscore_shape_ratio: string;
  material: string;
  shape: string;
}

export interface ProductionSystem {
  labels: string[];
  value: number;
}

export interface ThreatenedSpecies {
  ingredient: string;
  value: number;
}

export interface EcoscoreDataAgribalyse {
  agribalyse_food_code: string;
  co2_agriculture: string;
  co2_consumption: number;
  co2_distribution: string;
  co2_packaging: string;
  co2_processing: string;
  co2_total: string;
  co2_transportation: string;
  code: string;
  dqr: string;
  ef_agriculture: string;
  ef_consumption: number;
  ef_distribution: string;
  ef_packaging: string;
  ef_processing: string;
  ef_total: string;
  ef_transportation: string;
  is_beverage: number;
  name_en: string;
  name_fr: string;
  score: number;
  version: string;
}

export enum EcoscoreGrade {
  C = "c",
}

export interface Missing {
  origins: number;
  packagings: number;
}

export interface PreviousData {
  agribalyse: PreviousDataAgribalyse;
  grade: null;
  score: null;
}

export interface PreviousDataAgribalyse {
  warning: string;
}

export interface Grades {
  "1": string;
}

export interface Images {
  "1": The1;
  "2": The1;
  "6": The10;
  "7": The10;
  "8": The10;
  "9": The10;
  "10": The10;
  "11": The10;
  "12": The10;
  "13": The10;
  "14": The10;
  "15": The10;
  front_en: FrontEn;
  front_fr: FrontEn;
  ingredients_en: FrontEn;
  ingredients_fr: IngredientsFr;
  nutrition_fr: FrontEn;
}

export interface The1 {
  sizes: Sizes;
  uploaded_t: string;
  uploader: string;
}

export interface Sizes {
  "100": The100;
  "400": The100;
  full: The100;
  "200"?: The100;
}

export interface The100 {
  h: number;
  w: number;
}

export interface The10 {
  sizes: Sizes;
  uploaded_t: number;
  uploader: string;
}

export interface FrontEn {
  angle: number;
  geometry: string;
  imgid: string;
  normalize: null | string;
  rev: string;
  sizes: Sizes;
  white_magic: null | string;
  x1: string;
  x2: string;
  y1: string;
  y2: string;
  coordinates_image_size?: string;
  ocr?: number;
  orientation?: string;
}

export interface IngredientsFr {
  angle: string;
  geometry: string;
  imgid: string;
  normalize: string;
  ocr: number;
  orientation: string;
  rev: string;
  sizes: Sizes;
  white_magic: string;
  x1: string;
  x2: string;
  y1: string;
  y2: string;
}

export interface Ingredient {
  id: string;
  percent_estimate: string;
  percent_max: number | string;
  percent_min: number | string;
  rank?: number;
  text: string;
  vegan?: FromPalmOil;
  vegetarian?: FromPalmOil;
  from_palm_oil?: FromPalmOil;
  has_sub_ingredients?: FromPalmOil;
}

export enum FromPalmOil {
  Maybe = "maybe",
  No = "no",
  Yes = "yes",
}

export interface IngredientsAnalysis {
  "en:non-vegan": string[];
  "en:palm-oil": string[];
  "en:vegan-status-unknown": string[];
  "en:vegetarian-status-unknown": string[];
}

export interface Languages {
  "en:english": number;
  "en:french": number;
  "en:spanish": number;
}

export interface LanguagesCodes {
  en: number;
  es: number;
  fr: number;
}

export interface NutrientLevels {
  fat: string;
  salt: string;
  "saturated-fat": string;
  sugars: string;
}

export interface Nutriments {
  carbohydrates: number;
  carbohydrates_100g: number | string;
  carbohydrates_serving: string;
  carbohydrates_unit: string;
  carbohydrates_value: number;
  energy: number;
  "energy-kcal": number;
  "energy-kcal_100g": number | string;
  "energy-kcal_serving": number;
  "energy-kcal_unit": string;
  "energy-kcal_value": number;
  "energy-kcal_value_computed": string;
  "energy-kj": number;
  "energy-kj_100g": number;
  "energy-kj_serving": number;
  "energy-kj_unit": string;
  "energy-kj_value": number;
  "energy-kj_value_computed": string;
  energy_100g: number;
  energy_serving: number;
  energy_unit: string;
  energy_value: number;
  fat: string;
  fat_100g: string;
  fat_serving: string;
  fat_unit: string;
  fat_value: string;
  fiber: string;
  fiber_100g: string;
  fiber_serving: string;
  fiber_unit: string;
  fiber_value: string;
  "fruits-vegetables-nuts-estimate-from-ingredients_100g": number;
  "fruits-vegetables-nuts-estimate-from-ingredients_serving": number;
  "nova-group": number;
  "nova-group_100g": number;
  "nova-group_serving": number;
  "nutrition-score-fr": number;
  "nutrition-score-fr_100g": number;
  proteins: string;
  proteins_100g: string;
  proteins_serving: string;
  proteins_unit: string;
  proteins_value: string;
  salt: string;
  salt_100g: string;
  salt_serving: string;
  salt_unit: string;
  salt_value: string;
  "saturated-fat": number;
  "saturated-fat_100g": number;
  "saturated-fat_serving": string;
  "saturated-fat_unit": string;
  "saturated-fat_value": number;
  sodium: string;
  sodium_100g: string;
  sodium_serving: string;
  sodium_unit: string;
  sodium_value: string;
  sugars: string;
  sugars_100g: string;
  sugars_serving: number;
  sugars_unit: string;
  sugars_value: string;
}

export interface NutriscoreData {
  energy: number;
  energy_points: number;
  energy_value: number;
  fiber: string;
  fiber_points: number;
  fiber_value: string;
  fruits_vegetables_nuts_colza_walnut_olive_oils: number;
  fruits_vegetables_nuts_colza_walnut_olive_oils_points: number;
  fruits_vegetables_nuts_colza_walnut_olive_oils_value: number;
  grade: string;
  is_beverage: number;
  is_cheese: number;
  is_fat: number;
  is_water: number;
  negative_points: number;
  positive_points: number;
  proteins: string;
  proteins_points: number;
  proteins_value: string;
  saturated_fat: number;
  saturated_fat_points: number;
  saturated_fat_ratio: string;
  saturated_fat_ratio_points: number;
  saturated_fat_ratio_value: number;
  saturated_fat_value: number;
  score: number;
  sodium: string;
  sodium_points: number;
  sodium_value: number;
  sugars: string;
  sugars_points: number;
  sugars_value: string;
}

export interface OpenFoodFactsFoodItemPackaging {
  shape: string;
}

export interface SelectedImages {
  front: Front;
  ingredients: Front;
  nutrition: Nutrition;
}

export interface Front {
  display: FrontDisplay;
  small: FrontDisplay;
  thumb: FrontDisplay;
}

export interface FrontDisplay {
  en: string;
  fr: string;
}

export interface Nutrition {
  display: NutritionDisplay;
  small: NutritionDisplay;
  thumb: NutritionDisplay;
}

export interface NutritionDisplay {
  fr: string;
}

export interface Source {
  fields: string[];
  id: string;
  images: any[];
  import_t: number;
  manufacturer: number;
  name: string;
  url: null;
}

export interface SourcesFields {
  "org-gs1": OrgGs1;
}

export interface OrgGs1 {
  gln: string;
  gpcCategoryCode: string;
  gpcCategoryName: string;
  isAllergenRelevantDataProvided: string;
  lastChangeDateTime: Date;
  partyName: string;
  productionVariantDescription: string;
  publicationDateTime: Date;
}

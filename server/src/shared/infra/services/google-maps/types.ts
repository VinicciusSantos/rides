export interface LatLngBoundsLiteral {
  east: number;
  north: number;
  south: number;
  west: number;
}
export interface LatLngLiteral {
  lat: number;
  lng: number;
}
export interface LatLng {
  lat: () => number;
  lng: () => number;
}

export interface AutocompletionRequest {
  input: string;
  bounds?: LatLngBoundsLiteral;
  componentRestrictions?: { country: string | string[] };
  location?: LatLngLiteral;
  radius?: number;
}

export interface AutocompletePrediction {
  description: string;
  place_id: string;
  reference: string;
  structured_formatting: {
    main_text: string;
    secondary_text: string;
    main_text_matched_substrings: [
      {
        offset: number;
        length: number;
      },
    ];
  };
  terms: { offset: number; value: string }[];
  types: string[];
}

export interface AutocompleteResponse {
  predictions: AutocompletePrediction[];
}

export interface FindPlaceFromQueryRequest {
  query: string;
  fields: string[];
}

export interface IAddressComponent {
  long_name: string;
  short_name: string;
  types: string[];
}

export interface PlaceResult {
  name?: string;
  place_id?: string;
  formatted_address?: string;
  address_components?: IAddressComponent[];
  geometry?: { location: { lat: number; lng: number } };
}

export interface GeocoderRequest {
  address?: string;
  bounds?: LatLngBoundsLiteral;
  componentRestrictions?: { country: string | string[] };
  location?: LatLngLiteral;
  placeId?: string;
  region?: string;
}

export interface GeocoderResponse {
  results: GeocoderResult[];
}

export interface GeocoderGeometry {
  location: LatLngLiteral;
}

export interface GeocoderAddressComponent {
  long_name: string;
  short_name: string;
  types: string[];
}

export interface GeocoderResult {
  address_components: GeocoderAddressComponent[];
  formatted_address: string;
  geometry: GeocoderGeometry;
  place_id: string;
  types: string[];
  partial_match?: boolean;
}

export interface PlaceDetailRequest {
  placeId: string;
}

type MigrationLatLng = unknown;

interface Place {
  location?: MigrationLatLng | null | LatLngLiteral;
  placeId?: string;
  query?: string;
}

export interface DirectionsRoute {
  distanceMeters: number;
  duration: string;
  polyline: {
    encodedPolyline: string;
  };
}

export enum TravelMode {
  DRIVE = 'DRIVE',
}

export interface DirectionsRequest {
  origin: string | MigrationLatLng | Place | LatLngLiteral;
  destination: string | MigrationLatLng | Place | LatLngLiteral;
  travelMode: TravelMode;
  computeAlternativeRoutes?: boolean;
}

export interface DirectionsResult {
  routes: DirectionsRoute[];
}

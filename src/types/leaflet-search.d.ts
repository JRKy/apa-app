import * as L from 'leaflet';

declare module 'leaflet' {
  namespace Control {
    interface SearchOptions {
      position?: string;
      layer?: L.LayerGroup;
      initial?: boolean;
      zoom?: number;
      marker?: {
        icon?: L.Icon;
        animate?: boolean;
      };
      autoType?: boolean;
      autoCollapse?: boolean;
      minLength?: number;
      textPlaceholder?: string;
      textErr?: string;
      textCancel?: string;
      textNoData?: string;
      sourceData?: (text: string, callResponse: Function) => void;
      formatData?: (data: any) => {
        title: string;
        location: [number, number];
        bounds: L.LatLngBounds | null;
      };
    }

    class Search extends L.Control {
      constructor(options?: SearchOptions);
    }
  }
} 
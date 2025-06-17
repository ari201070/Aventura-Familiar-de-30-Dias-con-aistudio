export interface City {
  name: string;
  description: string;
  images: string[];
  accommodation?: string;
  food?: string;
  attractions?: string;
  budget?: string;
  tips?: string;
}

export interface Activity {
  id: string;
  name: string;
  description: string;
}

export interface Event {
  id: string;
  summary: string;
  date: string;
}

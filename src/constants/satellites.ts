export interface Satellite {
  id: string;
  name: string;
  position: {
    latitude: number;
    longitude: number;
    altitude: number;
  };
  velocity: {
    x: number;
    y: number;
    z: number;
  };
}

export const SATELLITES: Satellite[] = [
  {
    id: 'muos-2',
    name: 'MUOS-2',
    position: {
      latitude: 0,
      longitude: -177,
      altitude: 35786
    },
    velocity: { x: 0, y: 0, z: 0 }
  },
  {
    id: 'muos-5',
    name: 'MUOS-5',
    position: {
      latitude: 0,
      longitude: -100,
      altitude: 35786
    },
    velocity: { x: 0, y: 0, z: 0 }
  },
  {
    id: 'muos-3',
    name: 'MUOS-3',
    position: {
      latitude: 0,
      longitude: -15.5,
      altitude: 35786
    },
    velocity: { x: 0, y: 0, z: 0 }
  },
  {
    id: 'muos-4',
    name: 'MUOS-4',
    position: {
      latitude: 0,
      longitude: 75,
      altitude: 35786
    },
    velocity: { x: 0, y: 0, z: 0 }
  },
  {
    id: 'alt-2',
    name: 'ALT-2',
    position: {
      latitude: 0,
      longitude: -127,
      altitude: 35786
    },
    velocity: { x: 0, y: 0, z: 0 }
  },
  {
    id: 'alt-3',
    name: 'ALT-3',
    position: {
      latitude: 0,
      longitude: -24,
      altitude: 35786
    },
    velocity: { x: 0, y: 0, z: 0 }
  },
  {
    id: 'alt-1',
    name: 'ALT-1',
    position: {
      latitude: 0,
      longitude: 110,
      altitude: 35786
    },
    velocity: { x: 0, y: 0, z: 0 }
  },
  {
    id: 'alt-4',
    name: 'ALT-4',
    position: {
      latitude: 0,
      longitude: 170,
      altitude: 35786
    },
    velocity: { x: 0, y: 0, z: 0 }
  }
]; 
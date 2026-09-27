export interface RawNeoObject {
  id: string;
  neo_reference_id: string;
  name: string;
  nasa_jpl_url: string;
  absolute_magnitude_h: number;
  is_potentially_hazardous_asteroid: boolean;
  is_sentry_object: boolean;
  estimated_diameter: {
    kilometers: { estimated_diameter_min: number; estimated_diameter_max: number };
    meters: { estimated_diameter_min: number; estimated_diameter_max: number };
    miles: { estimated_diameter_min: number; estimated_diameter_max: number };
    feet: { estimated_diameter_min: number; estimated_diameter_max: number };
  };
  close_approach_data: Array<{
    close_approach_date: string;
    close_approach_date_full: string;
    epoch_date_close_approach: number;
    relative_velocity: {
      kilometers_per_second: string;
      kilometers_per_hour: string;
      miles_per_hour: string;
    };
    miss_distance: {
      astronomical: string;
      lunar: string;
      kilometers: string;
      miles: string;
    };
    orbiting_body: string;
  }>;
}

export function generateMockNeoDataset(dateStr: string): RawNeoObject[] {
  const baseDate = dateStr || new Date().toISOString().split('T')[0];

  return [
    {
      id: '99942',
      neo_reference_id: '99942',
      name: '99942 Apophis (2004 MN4)',
      nasa_jpl_url: 'https://ssd.jpl.nasa.gov/tools/sbdb_lookup.html#/?sstr=99942',
      absolute_magnitude_h: 19.7,
      is_potentially_hazardous_asteroid: true,
      is_sentry_object: false,
      estimated_diameter: {
        kilometers: { estimated_diameter_min: 0.32, estimated_diameter_max: 0.37 },
        meters: { estimated_diameter_min: 320, estimated_diameter_max: 370 },
        miles: { estimated_diameter_min: 0.20, estimated_diameter_max: 0.23 },
        feet: { estimated_diameter_min: 1050, estimated_diameter_max: 1214 },
      },
      close_approach_data: [
        {
          close_approach_date: baseDate,
          close_approach_date_full: `${baseDate} 14:32`,
          epoch_date_close_approach: Date.now() + 3600000 * 2,
          relative_velocity: {
            kilometers_per_second: '30.728',
            kilometers_per_hour: '110620.8',
            miles_per_hour: '68736.6',
          },
          miss_distance: {
            astronomical: '0.00021',
            lunar: '0.082',
            kilometers: '31600',
            miles: '19635',
          },
          orbiting_body: 'Earth',
        },
      ],
    },
    {
      id: '2024YR4',
      neo_reference_id: '54492812',
      name: '(2024 YR4)',
      nasa_jpl_url: 'https://ssd.jpl.nasa.gov/tools/sbdb_lookup.html#/?sstr=2024YR4',
      absolute_magnitude_h: 24.1,
      is_potentially_hazardous_asteroid: true,
      is_sentry_object: true,
      estimated_diameter: {
        kilometers: { estimated_diameter_min: 0.045, estimated_diameter_max: 0.105 },
        meters: { estimated_diameter_min: 45, estimated_diameter_max: 105 },
        miles: { estimated_diameter_min: 0.028, estimated_diameter_max: 0.065 },
        feet: { estimated_diameter_min: 147, estimated_diameter_max: 344 },
      },
      close_approach_data: [
        {
          close_approach_date: baseDate,
          close_approach_date_full: `${baseDate} 08:15`,
          epoch_date_close_approach: Date.now() + 3600000 * 5,
          relative_velocity: {
            kilometers_per_second: '17.42',
            kilometers_per_hour: '62712.0',
            miles_per_hour: '38967.4',
          },
          miss_distance: {
            astronomical: '0.00072',
            lunar: '0.28',
            kilometers: '107700',
            miles: '66921',
          },
          orbiting_body: 'Earth',
        },
      ],
    },
    {
      id: '101955',
      neo_reference_id: '101955',
      name: '101955 Bennu (1999 RQ36)',
      nasa_jpl_url: 'https://ssd.jpl.nasa.gov/tools/sbdb_lookup.html#/?sstr=101955',
      absolute_magnitude_h: 20.6,
      is_potentially_hazardous_asteroid: true,
      is_sentry_object: true,
      estimated_diameter: {
        kilometers: { estimated_diameter_min: 0.48, estimated_diameter_max: 0.51 },
        meters: { estimated_diameter_min: 480, estimated_diameter_max: 510 },
        miles: { estimated_diameter_min: 0.30, estimated_diameter_max: 0.32 },
        feet: { estimated_diameter_min: 1575, estimated_diameter_max: 1673 },
      },
      close_approach_data: [
        {
          close_approach_date: baseDate,
          close_approach_date_full: `${baseDate} 21:04`,
          epoch_date_close_approach: Date.now() + 3600000 * 9,
          relative_velocity: {
            kilometers_per_second: '27.91',
            kilometers_per_hour: '100476.0',
            miles_per_hour: '62432.9',
          },
          miss_distance: {
            astronomical: '0.0051',
            lunar: '1.98',
            kilometers: '762930',
            miles: '474063',
          },
          orbiting_body: 'Earth',
        },
      ],
    },
    {
      id: '2026AB',
      neo_reference_id: '54419821',
      name: '(2026 AB)',
      nasa_jpl_url: 'https://ssd.jpl.nasa.gov/tools/sbdb_lookup.html#/?sstr=2026AB',
      absolute_magnitude_h: 22.8,
      is_potentially_hazardous_asteroid: true,
      is_sentry_object: false,
      estimated_diameter: {
        kilometers: { estimated_diameter_min: 0.18, estimated_diameter_max: 0.34 },
        meters: { estimated_diameter_min: 180, estimated_diameter_max: 340 },
        miles: { estimated_diameter_min: 0.11, estimated_diameter_max: 0.21 },
        feet: { estimated_diameter_min: 590, estimated_diameter_max: 1115 },
      },
      close_approach_data: [
        {
          close_approach_date: baseDate,
          close_approach_date_full: `${baseDate} 03:45`,
          epoch_date_close_approach: Date.now() - 3600000 * 3,
          relative_velocity: {
            kilometers_per_second: '18.42',
            kilometers_per_hour: '66312.0',
            miles_per_hour: '41204.4',
          },
          miss_distance: {
            astronomical: '0.016',
            lunar: '6.24',
            kilometers: '2393600',
            miles: '1487314',
          },
          orbiting_body: 'Earth',
        },
      ],
    },
    {
      id: '2023DW',
      neo_reference_id: '54345781',
      name: '(2023 DW)',
      nasa_jpl_url: 'https://ssd.jpl.nasa.gov/tools/sbdb_lookup.html#/?sstr=2023DW',
      absolute_magnitude_h: 24.8,
      is_potentially_hazardous_asteroid: false,
      is_sentry_object: false,
      estimated_diameter: {
        kilometers: { estimated_diameter_min: 0.038, estimated_diameter_max: 0.085 },
        meters: { estimated_diameter_min: 38, estimated_diameter_max: 85 },
        miles: { estimated_diameter_min: 0.024, estimated_diameter_max: 0.053 },
        feet: { estimated_diameter_min: 125, estimated_diameter_max: 279 },
      },
      close_approach_data: [
        {
          close_approach_date: baseDate,
          close_approach_date_full: `${baseDate} 11:20`,
          epoch_date_close_approach: Date.now() + 3600000 * 4,
          relative_velocity: {
            kilometers_per_second: '24.63',
            kilometers_per_hour: '88668.0',
            miles_per_hour: '55095.7',
          },
          miss_distance: {
            astronomical: '0.032',
            lunar: '12.48',
            kilometers: '4787000',
            miles: '2974503',
          },
          orbiting_body: 'Earth',
        },
      ],
    },
    {
      id: '354045',
      neo_reference_id: '354045',
      name: '354045 (2001 XA45)',
      nasa_jpl_url: 'https://ssd.jpl.nasa.gov/tools/sbdb_lookup.html#/?sstr=354045',
      absolute_magnitude_h: 18.2,
      is_potentially_hazardous_asteroid: false,
      is_sentry_object: false,
      estimated_diameter: {
        kilometers: { estimated_diameter_min: 0.61, estimated_diameter_max: 1.36 },
        meters: { estimated_diameter_min: 610, estimated_diameter_max: 1360 },
        miles: { estimated_diameter_min: 0.38, estimated_diameter_max: 0.85 },
        feet: { estimated_diameter_min: 2001, estimated_diameter_max: 4462 },
      },
      close_approach_data: [
        {
          close_approach_date: baseDate,
          close_approach_date_full: `${baseDate} 17:50`,
          epoch_date_close_approach: Date.now() + 3600000 * 8,
          relative_velocity: {
            kilometers_per_second: '11.85',
            kilometers_per_hour: '42660.0',
            miles_per_hour: '26507.7',
          },
          miss_distance: {
            astronomical: '0.071',
            lunar: '27.69',
            kilometers: '10621400',
            miles: '6600000',
          },
          orbiting_body: 'Earth',
        },
      ],
    },
    {
      id: '518432',
      neo_reference_id: '518432',
      name: '518432 (2016 BG)',
      nasa_jpl_url: 'https://ssd.jpl.nasa.gov/tools/sbdb_lookup.html#/?sstr=518432',
      absolute_magnitude_h: 21.4,
      is_potentially_hazardous_asteroid: false,
      is_sentry_object: false,
      estimated_diameter: {
        kilometers: { estimated_diameter_min: 0.14, estimated_diameter_max: 0.31 },
        meters: { estimated_diameter_min: 140, estimated_diameter_max: 310 },
        miles: { estimated_diameter_min: 0.087, estimated_diameter_max: 0.19 },
        feet: { estimated_diameter_min: 459, estimated_diameter_max: 1017 },
      },
      close_approach_data: [
        {
          close_approach_date: baseDate,
          close_approach_date_full: `${baseDate} 22:15`,
          epoch_date_close_approach: Date.now() + 3600000 * 12,
          relative_velocity: {
            kilometers_per_second: '14.20',
            kilometers_per_hour: '51120.0',
            miles_per_hour: '31764.5',
          },
          miss_distance: {
            astronomical: '0.048',
            lunar: '18.72',
            kilometers: '7180800',
            miles: '4461944',
          },
          orbiting_body: 'Earth',
        },
      ],
    },
    {
      id: '2026CX',
      neo_reference_id: '54429910',
      name: '(2026 CX)',
      nasa_jpl_url: 'https://ssd.jpl.nasa.gov/tools/sbdb_lookup.html#/?sstr=2026CX',
      absolute_magnitude_h: 26.5,
      is_potentially_hazardous_asteroid: false,
      is_sentry_object: false,
      estimated_diameter: {
        kilometers: { estimated_diameter_min: 0.013, estimated_diameter_max: 0.029 },
        meters: { estimated_diameter_min: 13, estimated_diameter_max: 29 },
        miles: { estimated_diameter_min: 0.008, estimated_diameter_max: 0.018 },
        feet: { estimated_diameter_min: 42, estimated_diameter_max: 95 },
      },
      close_approach_data: [
        {
          close_approach_date: baseDate,
          close_approach_date_full: `${baseDate} 01:10`,
          epoch_date_close_approach: Date.now() - 3600000 * 6,
          relative_velocity: {
            kilometers_per_second: '9.45',
            kilometers_per_hour: '34020.0',
            miles_per_hour: '21139.1',
          },
          miss_distance: {
            astronomical: '0.012',
            lunar: '4.68',
            kilometers: '1795200',
            miles: '1115485',
          },
          orbiting_body: 'Earth',
        },
      ],
    }
  ];
}

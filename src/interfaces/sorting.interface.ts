export interface Sorting {
  property: string;
  direction: 'DESC' | 'ASC';
  nulls?: 'NULLS FIRST' | 'NULLS LAST';
}

export type Counter = {
  id: string;
  name: string;
  dateCreated: string;
};

export type CounterLog = {
  id: string;
  counterId: string;
  date: string;
  value: number;
};

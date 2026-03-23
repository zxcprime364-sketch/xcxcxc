export type ServerStatus =
  | "queue"
  | "checking"
  | "connecting"
  | "available"
  | "failed"
  | "cancelled";

export type ServerTypes = {
  name: string;
  server: string;
  status: ServerStatus;
  desc: string;
};

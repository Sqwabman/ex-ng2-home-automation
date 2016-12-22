export interface HueResponse{
  error: {
    type: number,
    address: string,
    description: string,
  };
  success: {
    username: string;
  },
}
